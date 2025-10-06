import os
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger('api.ai_service')
import requests
from typing import Dict, Any, List

class AIService:
    """Service to handle multiple AI model integrations via OpenRouter"""
    
    def __init__(self):
        self.api_key = os.getenv('OPENROUTER_API_KEY')
        if self.api_key:
            logger.info("OpenRouter API key loaded from environment")
        else:
            logger.warning("OPENROUTER_API_KEY not found in environment")
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"

        # Hugging Face
        self.hf_api_key = os.getenv('HUGGINGFACE_API_KEY')
        if self.hf_api_key:
            logger.info("Hugging Face API key loaded from environment")
        else:
            logger.warning("HUGGINGFACE_API_KEY not found in environment")
        self.hf_api_url = "https://api-inference.huggingface.co/models/"
        
        # 4 Free models that work with OpenRouter (with approximate HF fallbacks)
        self.available_models = [
            {
                "id": "meta-llama/llama-3.3-70b-instruct:free",
                "name": "LLaMA 3.3 30B Instruct",
                "provider": "Meta",
                "description": "Powerful 70B parameter model with advanced reasoning capabilities",
                # Public closest HF alternative; adjust as needed
                "hf_repo": "meta-llama/Meta-Llama-3-8B-Instruct"
            },
            {
                "id": "deepseek/deepseek-chat-v3.1:free",
                "name": "DeepSeek V3.1",
                "provider": "DeepSeek",
                "description": "Advanced chat model with strong coding and reasoning abilities",
                # Use coder instruct as an alternative
                "hf_repo": "deepseek-ai/deepseek-coder-6.7b-instruct"
            },
            {
                "id": "google/gemma-3-27b-it:free",
                "name": "gemma-3-27b",
                "provider": "Google",
                "description": "Google's latest Gemma model with 27B parameters",
                "hf_repo": "google/gemma-2-9b-it"
            },
            {
                "id": "mistralai/mistral-small-3.2-24b-instruct:free",
                "name": "mistral-small-3.2",
                "provider": "Mistral AI",
                "description": "Efficient 24B model with multilingual support and fast responses",
                "hf_repo": "mistralai/Mistral-7B-Instruct-v0.3"
            }
        ]
    
    def get_available_models(self) -> List[Dict[str, str]]:
        """Get list of available models"""
        return self.available_models
    
    def get_response(self, model: str, message: str, language: str = 'en') -> str:
        """Try OpenRouter first; if unavailable or rate-limited, fallback to Hugging Face if configured."""
        # Resolve selected model metadata
        selected_model = None
        for m in self.available_models:
            if m['id'] == model or m['name'] == model:
                selected_model = m
                break
        if not selected_model:
            return f"Error: Model '{model}' not found in available models"

        system_prompt = self._get_system_prompt(language)

        # Attempt OpenRouter
        if self.api_key:
            try:
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "AI Chatbot"
                }
                data = {
                    "model": selected_model['id'],
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": message}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 1000
                }
                logger.info(f"Sending request with model: {selected_model['id']}")
                response = requests.post(self.api_url, json=data, headers=headers, timeout=30)
                if response.status_code == 200:
                    result = response.json()
                    if 'choices' in result and len(result['choices']) > 0:
                        return result['choices'][0]['message']['content']
                    return f"Error: Unexpected response format - {result}"
                else:
                    logger.error(f"OpenRouter error {response.status_code}: {response.text[:500]}")
                    # On rate limit or server error, try HF fallback
                    if response.status_code in (429, 500, 503):
                        logger.info("Falling back to Hugging Face due to OpenRouter unavailability")
                    else:
                        # Non-retriable
                        return f"Error: {response.status_code} - {response.text}"
            except requests.exceptions.Timeout:
                logger.exception("OpenRouter request timed out; falling back to Hugging Face")
            except requests.exceptions.RequestException:
                logger.exception("OpenRouter network error; falling back to Hugging Face")
            except Exception:
                logger.exception("Unexpected error in OpenRouter call; falling back to Hugging Face")

        # Hugging Face fallback
        if not self.hf_api_key:
            return "Error: Service temporarily unavailable and no Hugging Face key configured."
        hf_repo = selected_model.get('hf_repo')
        if not hf_repo:
            return "Error: No Hugging Face fallback available for the selected model."
        try:
            headers = {
                "Authorization": f"Bearer {self.hf_api_key}",
                "Content-Type": "application/json",
            }
            # Simple text-generation style payload
            payload = {
                "inputs": f"System: {system_prompt}\nUser: {message}\nAssistant:",
                "parameters": {
                    "max_new_tokens": 512,
                    "temperature": 0.7,
                    "return_full_text": False
                }
            }
            url = f"{self.hf_api_url}{hf_repo}"
            logger.info(f"Calling Hugging Face model: {hf_repo}")
            resp = requests.post(url, headers=headers, json=payload, timeout=60)
            if resp.status_code != 200:
                logger.error(f"Hugging Face error {resp.status_code}: {resp.text[:500]}")
                if resp.status_code in (429, 503):
                    return "Error: Service is rate-limited or busy. Please try again later."
                return f"Error: {resp.status_code} - {resp.text}"
            data = resp.json()
            # HF responses can be a list of dicts with 'generated_text'
            if isinstance(data, list) and data and 'generated_text' in data[0]:
                return data[0]['generated_text']
            # Or a dict with 'generated_text' or nested structure
            if isinstance(data, dict):
                if 'generated_text' in data:
                    return data['generated_text']
                # Some pipelines return list under 'choices' or similar; fall back to string
            return str(data)
        except requests.exceptions.Timeout:
            logger.exception("Hugging Face request timed out")
            return "Error: Request timed out. Please try again."
        except requests.exceptions.RequestException as e:
            logger.exception("Hugging Face network error")
            return f"Error: Network error - {str(e)}"
        except Exception as e:
            logger.exception("Unexpected error in Hugging Face call")
            return f"Error: {str(e)}"
    
    def generate_user_summary(self, chat_history: list, language: str = 'en') -> str:
        """Generate AI-powered user summary from chat history"""
        try:
            # Compile chat history (last 10 to avoid token limits)
            history_text = "\n".join([
                f"User: {chat['user_message']}\nAI: {chat['ai_response']}"
                for chat in chat_history[-10:]
            ])
            
            prompt = self._get_summary_prompt(history_text, language)
            
            # Use the first available model for summary
            if self.available_models:
                model_id = self.available_models[0]['id']
                return self.get_response(model_id, prompt, language)
            else:
                return "No models available for summary generation"
        except Exception as e:
            return f"Error generating summary: {str(e)}"
    
    def _get_system_prompt(self, language: str) -> str:
        """Get system prompt based on language"""
        if language == 'ar':
            return """أنت مساعد ذكاء اصطناعي مفيد وودود. 
            أجب على الأسئلة باللغة العربية بطريقة واضحة ومهذبة.
            استخدم لهجة رسمية واحترافية."""
        else:
            return """You are a helpful and friendly AI assistant.
            Answer questions clearly and politely in English.
            Be professional and accurate in your responses."""
    
    def _get_summary_prompt(self, history: str, language: str) -> str:
        """Generate prompt for user summary"""
        if language == 'ar':
            return f"""بناءً على سجل المحادثات التالي، اكتب ملخصاً قصيراً (2-3 جمل) عن اهتمامات المستخدم:
            
            {history}
            
            الملخص:"""
        else:
            return f"""Based on the following chat history, write a brief summary (2-3 sentences) about the user's interests:
            
            {history}
            
            Summary:"""


# Initialize service
ai_service = AIService()