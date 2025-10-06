import os
from dotenv import load_dotenv

load_dotenv()
import requests
from typing import Dict, Any, List

class AIService:
    """Service to handle multiple AI model integrations via OpenRouter"""
    
    def __init__(self):
        self.api_key = os.getenv('OPENROUTER_API_KEY')
        print(f"Loaded API key: {self.api_key[:10]}..." if self.api_key else "No API key found")
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        
        # 4 Free models that work with OpenRouter
        self.available_models = [
            {
                "id": "meta-llama/llama-3.3-70b-instruct:free",
                "name": "LLaMA 3.3 30B Instruct",
                "provider": "Meta",
                "description": "Powerful 70B parameter model with advanced reasoning capabilities"
            },
            {
                "id": "deepseek/deepseek-chat-v3.1:free",
                "name": "DeepSeek V3.1",
                "provider": "DeepSeek",
                "description": "Advanced chat model with strong coding and reasoning abilities"
            },
            {
                "id": "google/gemma-3-27b-it:free",
                "name": "gemma-3-27b",
                "provider": "Google",
                "description": "Google's latest Gemma model with 27B parameters"
            },
            {
                "id": "mistralai/mistral-small-3.2-24b-instruct:free",
                "name": "mistral-small-3.2",
                "provider": "Mistral AI",
                "description": "Efficient 24B model with multilingual support and fast responses"
            }
        ]
    
    def get_available_models(self) -> List[Dict[str, str]]:
        """Get list of available models"""
        return self.available_models
    
    def get_response(self, model: str, message: str, language: str = 'en') -> str:
        try:
            if not self.api_key:
                return "Error: OPENROUTER_API_KEY not found. Please add it to your .env file"
            
            # Find the selected model
            selected_model = None
            for m in self.available_models:
                if m['id'] == model or m['name'] == model:
                    selected_model = m
                    break
            
            if not selected_model:
                return f"Error: Model '{model}' not found in available models"
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "AI Chatbot"
            }
            
            system_prompt = self._get_system_prompt(language)
            
            data = {
                "model": selected_model['id'],
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                "temperature": 0.7,
                "max_tokens": 1000  # Reduced to avoid credit issues
            }
            
            print(f"Sending request with model: {selected_model['id']}")
            response = requests.post(self.api_url, json=data, headers=headers, timeout=30)
            
            if response.status_code != 200:
                print(f"Error response: {response.text}")
                return f"Error: {response.status_code} - {response.text}"
            
            result = response.json()
            
            if 'choices' in result and len(result['choices']) > 0:
                return result['choices'][0]['message']['content']
            else:
                return f"Error: Unexpected response format - {result}"
            
        except requests.exceptions.Timeout:
            return "Error: Request timed out. Please try again."
        except requests.exceptions.RequestException as e:
            return f"Error: Network error - {str(e)}"
        except Exception as e:
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