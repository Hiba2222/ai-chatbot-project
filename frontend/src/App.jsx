import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { LanguageProvider } from './components/language-section/LanguageProvider';
import { Toaster } from '@/components/ui/sonner';
import Navbar from './components/navbar/Navbar';
import LandingPage from './components/landing-page/LandingPage';
import Login from './components/login/Login';
import { SignUp } from './components/sign-up/SignUp';
import ChatBot from './components/chatbot/Chatbot';
import UserProfile from './components/user-profile/UserProfile';
import ChatHistory from './components/chat-history/ChatHistory';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Protected Routes */}
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatBot />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <ChatHistory />
                  </ProtectedRoute>
                }
              />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Toaster />
          </div>
        </BrowserRouter>
      </LanguageProvider>
      
    </ThemeProvider>
  );
}

export default App;