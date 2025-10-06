import os
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

api_key = os.getenv('OPENROUTER_API_KEY')

print(f"API Key found: {api_key[:20]}..." if api_key else "No API key found!")

if not api_key:
    print("\nERROR: OPENROUTER_API_KEY not found in .env file")
    print("Please make sure your .env file contains:")
    print("OPENROUTER_API_KEY=your_actual_key_here")
    exit(1)

# Test the API key with a simple request
url = "https://openrouter.ai/api/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "AI Chatbot Test"
}

# Test with a free model
data = {
    "model": "meta-llama/llama-3.2-3b-instruct:free",
    "messages": [
        {"role": "user", "content": "Say hello in one word"}
    ],
    "max_tokens": 10
}

print("\nTesting OpenRouter API...")
print(f"Using model: {data['model']}")

try:
    response = requests.post(url, json=data, headers=headers, timeout=30)
    
    print(f"\nStatus Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        if 'choices' in result:
            print("SUCCESS! API is working correctly")
            print(f"Response: {result['choices'][0]['message']['content']}")
        else:
            print("Unexpected response format:")
            print(result)
    else:
        print(f"ERROR: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Common error explanations
        if response.status_code == 401:
            print("\nThis means your API key is invalid or expired")
        elif response.status_code == 402:
            print("\nThis means you've run out of credits")
        elif response.status_code == 429:
            print("\nThis means you've hit the rate limit")
            
except requests.exceptions.Timeout:
    print("Request timed out")
except Exception as e:
    print(f"Error: {str(e)}")
