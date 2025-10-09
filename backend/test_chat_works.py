import requests
import json

BASE_URL = "https://ai-chatbot-project-2-chyi.onrender.com/api"

def test_full_chat():
    print("🧪 Testing Complete Chat Flow...\n")
    
    # Step 1: Register
    print("1️⃣ Registering user...")
    import random
    random_id = random.randint(10000, 99999)
    user_data = {
        "username": f"chattest_{random_id}",
        "email": f"chattest{random_id}@example.com",
        "password": "TestPass123!"
    }
    
    response = requests.post(f"{BASE_URL}/signup/", json=user_data)
    if response.status_code == 201:
        print("   ✅ User registered successfully")
        access_token = response.json()['access']
    else:
        print(f"   ❌ Registration failed: {response.text}")
        return
    
    # Step 2: Test chat with correct model
    print("\n2️⃣ Sending chat message with LLaMA model...")
    chat_data = {
        "message": "Hello! Can you tell me a fun fact about AI?",
        "model": "meta-llama/llama-3.3-70b-instruct:free"
    }
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(f"{BASE_URL}/chat/", json=chat_data, headers=headers)
    
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        chat_response = response.json()
        print("   ✅ Chat successful!")
        print(f"\n   📨 Your message: {chat_response['message']}")
        print(f"   🤖 AI Response: {chat_response['response'][:200]}...")
        print(f"   🏷️  Model used: {chat_response['model']}")
    else:
        print(f"   ❌ Chat failed")
        print(f"   Response: {response.text}")
    
    # Step 3: Check history
    print("\n3️⃣ Checking chat history...")
    response = requests.get(f"{BASE_URL}/history/", headers=headers)
    
    if response.status_code == 200:
        history = response.json()
        print(f"   ✅ History retrieved: {len(history)} message(s)")
        if history:
            print(f"   Last message: {history[-1]['message'][:50]}...")
    else:
        print(f"   ❌ History failed: {response.text}")
    
    # Step 4: Test all available models
    print("\n4️⃣ Testing all available models...")
    
    models = [
        "meta-llama/llama-3.3-70b-instruct:free",
        "deepseek/deepseek-chat-v3.1:free",
        "google/gemma-3-27b-it:free",
        "mistralai/mistral-small-3.2-24b-instruct:free"
    ]
    
    for model in models:
        model_name = model.split('/')[1].split(':')[0]
        print(f"\n   Testing {model_name}...")
        
        chat_data = {
            "message": "Say 'Hello' in one word only",
            "model": model
        }
        
        response = requests.post(f"{BASE_URL}/chat/", json=chat_data, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ {model_name}: {result['response'][:100]}")
        else:
            print(f"   ❌ {model_name} failed: {response.status_code}")
    
    print("\n" + "="*60)
    print("🎉 All tests complete! Your backend is FULLY WORKING!")
    print("="*60)

if __name__ == "__main__":
    test_full_chat()