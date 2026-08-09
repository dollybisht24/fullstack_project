const asyncHandler = require('express-async-handler');
const UserChat = require('../models/UserChat');
const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here' // Add your key in .env file
});

// System prompt for Meenakshi's personality
const SYSTEM_PROMPT = `You are Meenakshi, a professional makeup artist with 12+ years of experience running "Meenakshi_Makeover". You are warm, friendly, and passionate about beauty. Your expertise includes:
- Bridal makeup (traditional & contemporary)
- HD & Airbrush makeup
- Party & event makeup
- Skincare consultation
- Product recommendations

Your personality:
- Enthusiastic and encouraging
- Professional yet approachable
- Use emojis naturally (💄✨💖👰🎨)
- Give specific, helpful advice
- Mention your experience and certifications when relevant
- Encourage bookings and consultations

Your services:
- Basic party makeup: ₹3,500
- Bridal packages: ₹15,000-₹50,000
- Hair styling included in bridal packages
- Pre-wedding trials available
- Travel across India for destination weddings
- Based in Mumbai

Keep responses concise (2-4 sentences) unless asked for detailed information. Always be helpful and guide users toward booking consultations.`;

// AI Response using OpenAI (with fallback to rule-based)
const generateAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    // Try OpenAI API first
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 200,
      temperature: 0.8,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    // Fallback to rule-based responses
    return generateFallbackResponse(userMessage);
  }
};

// Fallback rule-based responses when OpenAI API fails
const generateFallbackResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // Meenakshi's personality responses
  const responses = {
    greeting: [
      "Hello gorgeous! 💄 I'm Meenakshi, your personal beauty consultant. How can I help you look and feel your best today?",
      "Hi there! ✨ I'm so excited to help you on your beauty journey. What can I do for you today?",
      "Welcome! 💖 I'm Meenakshi from Meenakshi_Makeover. Let's chat about all things beauty!"
    ],
    
    skincare: [
      "Great question about skincare! 🌸 For healthy, glowing skin, I always recommend starting with the basics: cleanse, tone, and moisturize. What's your skin type - oily, dry, combination, or sensitive?",
      "Skincare is the foundation of beauty! Let me help you build the perfect routine. First, tell me about your main skin concerns - is it acne, dryness, aging, or pigmentation?"
    ],
    
    makeup: [
      "Oh, I love talking makeup! 💄 Are you looking for everyday natural looks, glamorous evening makeup, or bridal artistry? I specialize in all three!",
      "Makeup is my passion! From HD techniques to airbrush artistry, I've got you covered. What type of look are you trying to achieve?"
    ],
    
    products: [
      "I can definitely help you find the perfect products! 🛍️ Are you looking for foundations, lipsticks, eyeshadows, or skincare? Let me recommend some from our curated collection.",
      "Product recommendations are my specialty! Tell me your budget, skin type, and what you're looking for, and I'll guide you to the best options."
    ],
    
    training: [
      "I trained at prestigious makeup academies and earned certifications in HD Makeup, Airbrush Techniques, and Bridal Artistry over 10+ years! 🎓 Are you interested in becoming a makeup artist too?",
      "My journey started with a passion for beauty and evolved through professional training. I've worked with 10,000+ clients! Want to know more about my journey?"
    ],
    
    bridal: [
      "Bridal makeup is one of my specialties! 👰✨ I've worked with hundreds of brides, ensuring they look absolutely stunning on their special day. Are you planning a wedding?",
      "I'd love to help with bridal makeup! Whether it's traditional, contemporary, or fusion looks, I can create the perfect bridal glow. When's the big day?"
    ],
    
    tips: [
      "Here's a pro tip: Always prep your skin with a good primer and moisturizer before makeup application! 💡 Want more personalized tips based on your skin type?",
      "Beauty tip from Meenakshi: Less is more! Focus on enhancing your natural features rather than covering them up. What specific technique would you like to learn?"
    ],
    
    motivation: [
      "Remember, beauty starts with confidence! 💪 You're already beautiful - makeup just enhances what's already there. Believe in yourself!",
      "Every face tells a story, and I'm here to help you write yours beautifully. Never doubt your natural beauty! ✨"
    ]
  };
  
  // Pattern matching for responses
  if (message.match(/hello|hi|hey|good morning|good evening/)) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  }
  
  if (message.match(/skin|skincare|routine|acne|dry|oily|pores/)) {
    return responses.skincare[Math.floor(Math.random() * responses.skincare.length)];
  }
  
  if (message.match(/makeup|foundation|lipstick|eyeshadow|mascara|look/)) {
    return responses.makeup[Math.floor(Math.random() * responses.makeup.length)];
  }
  
  if (message.match(/product|recommend|buy|purchase|shopping/)) {
    return responses.products[Math.floor(Math.random() * responses.products.length)];
  }
  
  if (message.match(/train|certif|learn|course|academy|journey|start|experience/)) {
    return responses.training[Math.floor(Math.random() * responses.training.length)];
  }
  
  if (message.match(/bridal|bride|wedding|marriage/)) {
    return responses.bridal[Math.floor(Math.random() * responses.bridal.length)];
  }
  
  if (message.match(/tip|advice|help|how to|tutorial/)) {
    return responses.tips[Math.floor(Math.random() * responses.tips.length)];
  }
  
  // Default response
  return `I appreciate your question! As a professional makeup artist with over 10 years of experience, I'm here to help with makeup, skincare, product recommendations, and beauty advice. Could you tell me more about what you're looking for? 💄✨`;
};

// @desc    Get or create chat session
// @route   GET /api/chat/session
// @access  Public
const getChatSession = asyncHandler(async (req, res) => {
  const { sessionId, userId } = req.query;
  
  let chat;
  
  if (sessionId) {
    chat = await UserChat.findOne({ sessionId, isActive: true });
  } else if (userId) {
    chat = await UserChat.findOne({ userId, isActive: true }).sort({ lastActive: -1 });
  }
  
  if (!chat) {
    // Create new session
    const newSessionId = uuidv4();
    chat = await UserChat.create({
      sessionId: newSessionId,
      userId: userId || null,
      guestId: userId ? null : uuidv4(),
      messages: [
        {
          role: 'assistant',
          content: "Hello! 💄 I'm Meenakshi, your virtual beauty consultant. I'm here to share my 10+ years of makeup expertise, recommend products, and help you discover your most beautiful self. What brings you here today?"
        }
      ]
    });
  }
  
  res.json(chat);
});

// @desc    Send message and get AI response
// @route   POST /api/chat/message
// @access  Public
const sendMessage = asyncHandler(async (req, res) => {
  const { sessionId, message, context } = req.body;
  
  if (!sessionId || !message) {
    res.status(400);
    throw new Error('Session ID and message are required');
  }
  
  const chat = await UserChat.findOne({ sessionId, isActive: true });
  
  if (!chat) {
    res.status(404);
    throw new Error('Chat session not found');
  }
  
  // Add user message
  chat.messages.push({
    role: 'user',
    content: message
  });
  
  // Update context if provided
  if (context) {
    chat.context = { ...chat.context, ...context };
  }
  
  // Generate AI response (now async with OpenAI)
  const conversationHistory = chat.messages.slice(-10); // Last 10 messages for context
  const aiResponse = await generateAIResponse(message, conversationHistory);
  
  // Add AI response
  chat.messages.push({
    role: 'assistant',
    content: aiResponse
  });
  
  await chat.save();
  
  res.json({
    sessionId: chat.sessionId,
    message: {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    }
  });
});

// @desc    Get chat history
// @route   GET /api/chat/history/:sessionId
// @access  Public
const getChatHistory = asyncHandler(async (req, res) => {
  const chat = await UserChat.findOne({ 
    sessionId: req.params.sessionId,
    isActive: true 
  }).select('messages context');
  
  if (!chat) {
    res.status(404);
    throw new Error('Chat session not found');
  }
  
  res.json(chat);
});

// @desc    Clear chat history
// @route   DELETE /api/chat/session/:sessionId
// @access  Public
const clearChatSession = asyncHandler(async (req, res) => {
  const chat = await UserChat.findOne({ sessionId: req.params.sessionId });
  
  if (!chat) {
    res.status(404);
    throw new Error('Chat session not found');
  }
  
  chat.isActive = false;
  await chat.save();
  
  res.json({ message: 'Chat session cleared successfully' });
});

// @desc    Get user's chat sessions
// @route   GET /api/chat/sessions/:userId
// @access  Private
const getUserChatSessions = asyncHandler(async (req, res) => {
  const sessions = await UserChat.find({ 
    userId: req.params.userId,
    isActive: true 
  })
  .select('sessionId lastActive messages')
  .sort({ lastActive: -1 })
  .limit(10);
  
  // Return session summaries
  const summaries = sessions.map(session => ({
    sessionId: session.sessionId,
    lastActive: session.lastActive,
    messageCount: session.messages.length,
    lastMessage: session.messages[session.messages.length - 1]
  }));
  
  res.json(summaries);
});

module.exports = {
  getChatSession,
  sendMessage,
  getChatHistory,
  clearChatSession,
  getUserChatSessions
};
