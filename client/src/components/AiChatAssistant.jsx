import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../utils/axios';

export default function AiChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat session
  useEffect(() => {
    const initChat = async () => {
      try {
        const { data } = await axios.get('/chat/session');
        setSessionId(data.sessionId);
        setMessages(data.messages || []);
      } catch (error) {
        console.error('Error initializing chat:', error);
        // Add fallback welcome message
        setMessages([{
          role: 'assistant',
          content: "Hello! 💄 I'm Meenakshi, your virtual beauty consultant. I'm here to share my expertise and help you discover your most beautiful self. What brings you here today?",
          timestamp: new Date()
        }]);
      }
    };
    
    if (isOpen && !sessionId) {
      initChat();
    }
  }, [isOpen, sessionId]);

  const sendMessage = async (customText) => {
    const textToSend = typeof customText === 'string' ? customText : inputMessage;
    if (!textToSend.trim()) return;

    const userMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const { data } = await axios.post('/chat/message', {
        sessionId,
        message: textToSend
      });

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      const replyContent = data.message || data.response || data.data?.content || '';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: replyContent,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Hello gorgeous! 💄 I'm here to help with all your beauty needs! Ask me about oily or dry skin routines, dark circles, finding your foundation undertone, body care, or bridal glam! 💕",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = async () => {
    if (sessionId) {
      try {
        await axios.delete(`/chat/session/${sessionId}`);
      } catch (error) {
        console.error('Error clearing chat:', error);
      }
    }
    setSessionId(null);
    setMessages([]);
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:shadow-pink-500/50 transition"
          >
            💬
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-2 bottom-2 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-auto sm:w-[420px] h-[85vh] sm:h-[620px] max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2 border-pink-200"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-xl shadow-inner">
                    💄
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-bold text-base flex items-center gap-1.5">
                    Meenakshi AI
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">Expert</span>
                  </h3>
                  <p className="text-xs text-pink-100">Beauty & Skincare Specialist</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition text-sm"
                  title="Clear Chat"
                >
                  🗑️
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition text-white font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="bg-pink-50/70 border-b border-pink-100 px-3 py-2 overflow-x-auto flex gap-2 whitespace-nowrap">
              {[
                { label: '🧴 Oily Skin', prompt: 'I have oily skin and large pores. What routine and foundation do you recommend?' },
                { label: '💧 Dry Skin', prompt: 'My skin is dry and flaky. What moisturizer and dewy makeup works best?' },
                { label: '👁️ Dark Circles', prompt: 'How do I conceal dark circles without creasing?' },
                { label: '🎨 Shade Match', prompt: 'How do I find my exact skin undertone and foundation shade?' },
                { label: '✨ Body Glow', prompt: 'How do I treat strawberry legs, body acne, and get a red carpet body glow?' },
                { label: '👰 Bridal Glam', prompt: 'What are your bridal makeup packages and tips for long-lasting makeup?' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(item.prompt)}
                  disabled={isTyping}
                  className="text-xs bg-white text-pink-700 hover:bg-pink-600 hover:text-white border border-pink-200 rounded-full px-3 py-1 transition-all shadow-sm font-medium disabled:opacity-50"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-pink-50/30 via-white to-purple-50/20">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-none shadow-sm'
                        : 'bg-white shadow text-gray-800 border border-pink-100 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap font-normal">
                      {message.content}
                    </p>
                    <p className={`text-[10px] mt-1 text-right ${message.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white shadow rounded-2xl px-4 py-2.5 border border-pink-100 flex items-center gap-2">
                    <span className="text-xs text-pink-500 font-medium">Meenakshi is typing</span>
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-pink-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about skin, body care, makeup..."
                  className="flex-1 border-2 border-pink-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                  disabled={isTyping}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-2.5 text-sm font-semibold rounded-full hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
