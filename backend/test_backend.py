import requests
import json

# Your deployed backend URL
BASE_URL = "https://ai-chatbot-project-2-chyi.onrender.com/api"

def test_backend():
    print("🧪 Testing Backend Deployment...\n")
    
    # Test 1: Check if server is responding
    print("1️⃣ Testing server connection...")
    try:
        response = requests.get(f"{BASE_URL}/models/")
        print(f"   ✅ Server is responding! Status: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Server connection failed: {e}")
        return
    
    # Test 2: Register a new user
    print("\n2️⃣ Testing user registration...")
    import random
    random_id = random.randint(1000, 9999)
    test_user = {
        "username": f"testuser_{random_id}",
        "email": f"test{random_id}@example.com",
        "password": "TestPass123!"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/signup/", json=test_user)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        if response.status_code in [200, 201]:
            print("   ✅ Registration successful!")
        else:
            print("   ⚠️ Registration failed")
    except Exception as e:
        print(f"   ❌ Registration error: {e}")
        return
    
    # Test 3: Login
    print("\n3️⃣ Testing user login...")
    login_data = {
        "username": test_user["username"],
        "password": test_user["password"]
    }
    
    try:
        response = requests.post(f"{BASE_URL}/login/", json=login_data)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            tokens = response.json()
            print("   ✅ Login successful!")
            print(f"   Access token received: {tokens.get('access', 'N/A')[:50]}...")
            access_token = tokens.get('access')
        else:
            print(f"   ⚠️ Login failed: {response.json()}")
            return
    except Exception as e:
        print(f"   ❌ Login error: {e}")
        return
    
    # Test 4: Get available models
    print("\n4️⃣ Testing models endpoint...")
    try:
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(f"{BASE_URL}/models/", headers=headers)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            models = response.json()
            print(f"   ✅ Models retrieved: {models}")
        else:
            print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ❌ Models error: {e}")
    
    # Test 5: Send a chat message
    print("\n5️⃣ Testing chat endpoint...")
    chat_data = {
        "message": "Hello! This is a test message.",
        "model": "openai"
    }
    
    try:
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        response = requests.post(f"{BASE_URL}/chat/", json=chat_data, headers=headers)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            chat_response = response.json()
            print("   ✅ Chat successful!")
            print(f"   Response preview: {str(chat_response)[:200]}...")
        else:
            print(f"   ⚠️ Chat failed: {response.json()}")
    except Exception as e:
        print(f"   ❌ Chat error: {e}")
    
    # Test 6: Get chat history
    print("\n6️⃣ Testing chat history...")
    try:
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(f"{BASE_URL}/history/", headers=headers)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            history = response.json()
            print(f"   ✅ History retrieved: {len(history)} messages")
        else:
            print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ❌ History error: {e}")
    
    print("\n" + "="*50)
    print("🎉 Backend testing complete!")
    print("="*50)

if __name__ == "__main__":
    test_backend()
    