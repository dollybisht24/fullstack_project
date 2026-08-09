import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, FaStar, FaUsers, FaAward, FaCertificate, 
  FaPaperPlane, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaInstagram, FaFacebook, FaYoutube, FaLinkedin,
  FaPaintBrush, FaMagic, FaGem, FaHeart, FaCrown
} from 'react-icons/fa';
import axios from '../utils/axios';

export default function ProfileModal({ isOpen, onClose, profile }) {
  const [activeTab, setActiveTab] = useState('about'); // about, chat
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const skillIcons = {
    'Bridal Makeup': <FaCrown className="text-2xl" />,
    'HD Makeup': <FaGem className="text-2xl" />,
    'Airbrush Makeup': <FaMagic className="text-2xl" />,
    'Fashion Makeup': <FaPaintBrush className="text-2xl" />,
    'Party Makeup': <FaHeart className="text-2xl" />,
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat' && !sessionId) {
      initializeChat();
    }
  }, [isOpen, activeTab]);

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

  if (!isOpen || !profile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[85%] lg:w-[900px] max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {/* Header */}
            <div className="bg-pink-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={profile.profileImage || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200'}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full border-4 border-white"
                />
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {profile.brandName || 'Meenakshi_Makeover'}
                  </h2>
                  <p className="text-white text-sm">{profile.tagline}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:text-pink-600 p-2 rounded-full transition-colors"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b flex">
              <button
                onClick={() => setActiveTab('about')}
                className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                  activeTab === 'about'
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-black hover:text-pink-600'
                }`}
              >
                About Profile
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                  activeTab === 'chat'
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-black hover:text-pink-600'
                }`}
              >
                💬 Chat with Meenakshi
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'about' ? (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex justify-center text-pink-600 mb-2">
                        <FaStar className="text-2xl" />
                      </div>
                      <div className="text-2xl font-bold text-black">{profile.statistics.averageRating}</div>
                      <div className="text-xs text-black">Rating</div>
                    </div>
                    <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex justify-center text-pink-600 mb-2">
                        <FaUsers className="text-2xl" />
                      </div>
                      <div className="text-2xl font-bold text-black">{profile.statistics.totalClients.toLocaleString()}+</div>
                      <div className="text-xs text-black">Clients</div>
                    </div>
                    <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex justify-center text-pink-600 mb-2">
                        <FaAward className="text-2xl" />
                      </div>
                      <div className="text-2xl font-bold text-black">{profile.statistics.yearsOfExperience}+</div>
                      <div className="text-xs text-black">Years</div>
                    </div>
                  </div>

                  {/* About */}
                  <div>
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-pink-600"></span>
                      About Me
                    </h3>
                    <p className="text-black leading-relaxed">{profile.bio.vision}</p>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-pink-600"></span>
                      Expertise
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {profile.skills.slice(0, 8).map((skill, index) => (
                        <div
                          key={index}
                          className="p-3 bg-white border border-gray-200 rounded-lg text-center hover:border-pink-600 transition-colors"
                        >
                          <div className="flex justify-center text-pink-600 mb-2">
                            {skillIcons[skill.name] || <FaPaintBrush className="text-2xl" />}
                          </div>
                          <div className="text-sm font-semibold text-black">{skill.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-pink-600"></span>
                      Recent Achievements
                    </h3>
                    <div className="space-y-3">
                      {profile.achievements.slice(0, 3).map((achievement, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                            <FaAward />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-pink-600 font-bold">{achievement.year}</div>
                            <div className="font-bold text-black">{achievement.title}</div>
                            <div className="text-sm text-black">{achievement.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-pink-600"></span>
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                        <FaPhone className="text-pink-600 text-xl" />
                        <span className="text-black">{profile.contactInfo?.phone || '+91 98765 43210'}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                        <FaEnvelope className="text-pink-600 text-xl" />
                        <span className="text-black">{profile.contactInfo?.email || 'contact@meenakshi.com'}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                        <FaMapMarkerAlt className="text-pink-600 text-xl" />
                        <span className="text-black">{profile.contactInfo?.address || 'Mumbai, India'}</span>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center gap-3 mt-4">
                      {profile.socialLinks?.instagram && (
                        <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                           className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
                          <FaInstagram />
                        </a>
                      )}
                      {profile.socialLinks?.facebook && (
                        <a href={profile.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                           className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
                          <FaFacebook />
                        </a>
                      )}
                      {profile.socialLinks?.youtube && (
                        <a href={profile.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                           className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
                          <FaYoutube />
                        </a>
                      )}
                      {profile.socialLinks?.linkedin && (
                        <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                           className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
                          <FaLinkedin />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Chat Interface */
                <div className="flex flex-col h-full">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${
                            message.role === 'user'
                              ? 'bg-pink-600 text-white'
                              : 'bg-white border border-gray-200 text-black'
                          }`}
                        >
                          <p className="leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white' : 'text-black'} opacity-70`}>
                            {new Date(message.timestamp).toLocaleTimeString()}
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
                        <div className="bg-white border border-gray-200 p-4 rounded-2xl">
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

                  {/* Chat Input */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me about makeup, beauty tips, or book a consultation..."
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-pink-600 text-black"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isTyping}
                      className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaPaperPlane />
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Footer */}
            {activeTab === 'about' && (
              <div className="bg-white border-t p-4 flex justify-center gap-3">
                <button className="bg-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition-colors">
                  Book Consultation
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="bg-white text-pink-600 border-2 border-pink-600 px-6 py-3 rounded-full font-semibold hover:bg-pink-50 transition-colors"
                >
                  Start Chat
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
