import os
import requests
from typing import Dict, Any, List
from openai import OpenAI
import anthropic

class AIService:
    """Service to handle multiple AI model integrations via OpenRouter"""
    
    def __init__(self):
        self.api_key = os.getenv('OPENROUTER_API_KEY')
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        self.models_url = "https://openrouter.ai/api/v1/models"
        self.available_models = []
        self._load_models()
        
    def _load_models(self):
        """Load available models from OpenRouter API"""
        try:
            if not self.api_key:
                print("Warning: OPENROUTER_API_KEY not found. Using default models.")
                self.available_models = [
                    {"id": "grok-beta", "name": "Grok AI", "provider": "x-ai"},
                    {"id": "deepseek/deepseek-chat", "name": "DeepSeek Chat", "provider": "deepseek"},
                    {"id": "meta-llama/llama-3.1-8b-instruct", "name": "LLaMA 3.1 8B", "provider": "meta"}
                ]
                return
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(self.models_url, headers=headers)
            response.raise_for_status()
            
            models_data = response.json()
            self.available_models = []
            
            # Filter and format popular models
            popular_models = [
                "grok-beta",
                "deepseek/deepseek-chat", 
                "meta-llama/llama-3.1-8b-instruct",
                "meta-llama/llama-3.1-70b-instruct",
                "openai/gpt-4o",
                "openai/gpt-4o-mini",
                "anthropic/claude-3.5-sonnet",
                "anthropic/claude-3-haiku",
                "google/gemini-pro-1.5",
                "mistralai/mistral-7b-instruct"
            ]
            
            for model in models_data.get('data', []):
                if model['id'] in popular_models:
                    self.available_models.append({
                        "id": model['id'],
                        "name": model.get('name', model['id']),
                        "provider": model.get('context_length', 'Unknown'),
                        "description": model.get('description', '')
                    })
            
            # If no models loaded, use defaults
            if not self.available_models:
                self.available_models = [
                    {"id": "grok-beta", "name": "Grok AI", "provider": "x-ai"},
                    {"id": "deepseek/deepseek-chat", "name": "DeepSeek Chat", "provider": "deepseek"},
                    {"id": "meta-llama/llama-3.1-8b-instruct", "name": "LLaMA 3.1 8B", "provider": "meta"}
                ]
                
        except Exception as e:
            print(f"Error loading models from OpenRouter: {str(e)}")
            # Fallback to default models
            self.available_models = [
                {"id": "grok-beta", "name": "Grok AI", "provider": "x-ai"},
                {"id": "deepseek/deepseek-chat", "name": "DeepSeek Chat", "provider": "deepseek"},
                {"id": "meta-llama/llama-3.1-8b-instruct", "name": "LLaMA 3.1 8B", "provider": "meta"}
            ]
    
    def get_available_models(self) -> List[Dict[str, str]]:
        """Get list of available models"""
        return self.available_models
    
    def get_response(self, model: str, message: str, language: str = 'en') -> str:
        """Get response from selected model via OpenRouter or fallback"""
        try:
            # If no OpenRouter API key, use fallback responses
            if not self.api_key:
                return self._get_fallback_response(model, message, language)
            
            # Find the model in available models
            selected_model = None
            for m in self.available_models:
                if m['id'] == model or m['name'].lower() == model.lower():
                    selected_model = m
                    break
            
            if not selected_model:
                return f"Error: Model '{model}' not found in available models"
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",  # Your frontend URL
                "X-Title": "AI Chatbot"  # Your app name
            }
            
            system_prompt = self._get_system_prompt(language)
            
            data = {
                "model": selected_model['id'],
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                "temperature": 0.7,
                "max_tokens": 2000
            }
            
            response = requests.post(self.api_url, json=data, headers=headers)
            response.raise_for_status()
            
            result = response.json()
            return result['choices'][0]['message']['content']
            
        except Exception as e:
            return self._get_fallback_response(model, message, language)
    
    def _get_fallback_response(self, model: str, message: str, language: str) -> str:
        """Fallback response when OpenRouter is not available"""
        if language == 'ar':
            return f"أهلاً! أنا نموذج {model}. رسالتك: '{message}'. (هذا رد تجريبي - يرجى إعداد مفتاح OpenRouter للحصول على ردود حقيقية)"
        else:
            return f"Hello! I'm the {model} model. Your message: '{message}'. (This is a demo response - please set up your OpenRouter API key for real responses)"
    
    def generate_user_summary(self, chat_history: list, language: str = 'en') -> str:
        """Generate AI-powered user summary from chat history"""
        try:
            # Compile chat history
            history_text = "\n".join([
                f"User: {chat['user_message']}\nAI: {chat['ai_response']}"
                for chat in chat_history[-20:]  # Last 20 conversations
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
            return f"""بناءً على سجل المحادثات التالي، اكتب ملخصاً قصيراً (3-5 جمل) عن:
            - الاهتمامات الرئيسية للمستخدم
            - المواضيع الشائعة في استفساراته
            - نمط استخدامه للشات بوت
            
            سجل المحادثات:
            {history}
            
            الملخص:"""
        else:
            return f"""Based on the following chat history, write a brief summary (3-5 sentences) about:
            - The user's main interests
            - Common topics in their queries
            - Their chatbot usage patterns
            
            Chat History:
            {history}
            
            Summary:"""


# Initialize service
ai_service = AIService()