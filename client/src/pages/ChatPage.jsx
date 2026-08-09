import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import axios from '../utils/axios';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    try {
      const { data } = await axios.get('/api/chat/session');
      setSessionId(data.sessionId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      // Add welcome message even if backend fails
      setMessages([{
        role: 'assistant',
        content: "Hello! 👋 I'm Meenakshi! Welcome to my beauty consultation space. How can I help you today? Whether it's about bridal makeup, skincare tips, or choosing the perfect look for your event, I'm here to guide you! 💄✨",
        timestamp: new Date()
      }]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const { data } = await axios.post('/api/chat/message', {
        sessionId,
        message: inputMessage
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Fallback response if backend fails
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I'm here to help! Feel free to ask me about makeup tips, bridal looks, skincare routines, or book a consultation with me. What would you like to know? 💖",
          timestamp: new Date()
        }]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl">
              <FaRobot />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black" style={{ fontFamily: "'Playfair Display', serif" }}>
                Chat with Meenakshi
              </h1>
              <p className="text-gray-600">AI-Powered Beauty Consultation 💄✨</p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 300px)' }}>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <FaRobot />
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-pink-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-black rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-pink-100' : 'text-gray-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <FaUser />
                  </div>
                )}
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 justify-start"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                  <FaRobot />
                </div>
                <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-pink-600 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me about makeup, beauty tips, or book a consultation..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-pink-600 text-black bg-white"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-full hover:from-pink-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
              >
                <span>Send</span>
                <FaPaperPlane />
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              💡 Try asking: "What's your bridal makeup package?" or "Tips for glowing skin"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
