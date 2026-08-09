// Use crypto instead of uuid for CommonJS compatibility
const crypto = require('crypto');
const Groq = require('groq-sdk');

// UUID v4 generator using crypto
const uuidv4 = () => crypto.randomUUID();

// Initialize Groq (FREE alternative to OpenAI)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'gsk_demo_key_for_testing' // Free API
});

// In-memory storage for chat sessions (use Redis in production)
const chatSessions = new Map();

// System prompt for Meenakshi's personality
const SYSTEM_PROMPT = `You are Meenakshi, a professional makeup artist with 12+ years of experience running "Meenakshi_Makeover". 

Your personality:
- Warm, friendly, and enthusiastic about beauty
- Professional yet approachable
- Use emojis naturally (💄✨💖👰🎨)
- Give specific, helpful advice based on your experience

Your expertise:
- Bridal makeup (traditional & contemporary) - 500+ brides
- HD & Airbrush makeup techniques
- Party & event makeup
- Skincare consultation
- Product recommendations (MAC, Huda Beauty, Estée Lauder)

Your services:
- Basic party makeup: ₹3,500
- Bridal packages: ₹15,000-₹50,000 (includes hair styling, pre-wedding trials)
- Travel across India for destination weddings
- Based in Mumbai, Maharashtra

Keep responses concise (2-4 sentences) unless asked for detailed information. Always be encouraging and guide users toward booking consultations for personalized advice.`;

// Generate AI response using Groq (FREE AI)
const generateAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    // Prepare messages for AI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    console.log('Calling Groq AI API...');
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile', // Free, fast, and powerful
      messages: messages,
      max_tokens: 150,
      temperature: 0.8,
    });

    const response = completion.choices[0].message.content;
    console.log('AI response received:', response.substring(0, 50) + '...');
    return response;

  } catch (error) {
    console.error('AI API Error:', error.message);
    return generateFallbackResponse(userMessage);
  }
};

// Fallback responses when OpenAI is unavailable
const generateFallbackResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
    return "Hello gorgeous! 👋 I'm Meenakshi from Meenakshi_Makeover! How can I help you look and feel absolutely stunning today? Whether it's bridal makeup, skincare tips, or product recommendations, I'm here for you! 💄✨";
  }
  
  if (message.includes('how are you') || message.includes('how r u')) {
    return "I'm doing wonderful, thank you for asking! 💖 I'm so excited to chat with you about all things beauty! What brings you here today? Looking for makeup advice, skincare tips, or thinking about booking a consultation? 🎨";
  }
  
  if (message.includes('bridal') || message.includes('wedding') || message.includes('bride')) {
    return "✨ Bridal makeup is my absolute passion! I've worked with 500+ brides creating everything from traditional to contemporary looks. My bridal packages (₹15,000-₹50,000) include pre-wedding trials, hair styling, and touch-up services. Would you like to know more about my bridal services? 👰💕";
  }
  
  if (message.includes('price') || message.includes('cost') || message.includes('charge')) {
    return "💰 My services are customized to your needs! Basic party makeup starts at ₹3,500, while bridal packages range from ₹15,000-₹50,000. All bridal packages include hair styling and pre-wedding trials. I also offer special packages for destination weddings. Would you like a detailed quote? 📋";
  }
  
  if (message.includes('book') || message.includes('appointment') || message.includes('consultation')) {
    return "📅 I'd love to work with you! You can book a consultation by calling/WhatsApp at +91 98765 43210 or email contact@meenakshi.com. I'm based in Mumbai but travel across India. What date were you thinking? 💕";
  }
  
  if (message.includes('skin') || message.includes('skincare')) {
    return "🌟 Great skincare is the foundation of beautiful makeup! I recommend a consistent routine: cleanse, tone, moisturize, and SPF daily. For that gorgeous glow, hydrating facials work wonders! What's your skin type - oily, dry, combination, or sensitive? 💦";
  }
  
  if (message.includes('product') || message.includes('recommend')) {
    return "💄 I work with premium brands like MAC, Huda Beauty, Estée Lauder, and Bobbi Brown for long-lasting, camera-ready results. What are you looking for - foundation, lipstick, eyeshadow, or something else? I can recommend the perfect products for your skin tone! 🎨";
  }
  
  // Default response
  return "I'm here to help with all your beauty needs! 💄 You can ask me about:\n\n✨ Bridal & Party Makeup\n💆 Skincare Tips\n🎨 Product Recommendations\n💰 Pricing & Packages\n📅 Booking Consultations\n\nWhat would you like to know? 😊";
};

// Get or create chat session
exports.getChatSession = async (req, res) => {
  try {
    const sessionId = uuidv4();
    const session = {
      sessionId,
      messages: [{
        role: 'assistant',
        content: "Hello! 👋 I'm Meenakshi! Welcome to my beauty consultation space. How can I help you today? Whether it's about bridal makeup, skincare tips, or choosing the perfect look for your event, I'm here to guide you! 💄✨",
        timestamp: new Date()
      }],
      createdAt: new Date()
    };
    
    chatSessions.set(sessionId, session);
    console.log('Created new chat session:', sessionId);
    
    res.json(session);
  } catch (error) {
    console.error('Chat session error:', error);
    res.status(500).json({ message: 'Failed to create chat session', error: error.message });
  }
};

// Send message and get AI response
exports.sendMessage = async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    
    console.log('Received message:', message, 'for session:', sessionId);
    
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    // Get or create session
    let session = chatSessions.get(sessionId);
    if (!session) {
      session = {
        sessionId: sessionId || uuidv4(),
        messages: [],
        createdAt: new Date()
      };
      chatSessions.set(session.sessionId, session);
    }
    
    // Add user message
    session.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });
    
    // Generate AI response
    console.log('Generating AI response...');
    const aiResponse = await generateAIResponse(message, session.messages);
    
    // Add AI response
    session.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });
    
    // Update session
    chatSessions.set(session.sessionId, session);
    
    console.log('Sending response:', aiResponse.substring(0, 50) + '...');
    
    res.json({
      response: aiResponse,
      sessionId: session.sessionId
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};

// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = chatSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ message: 'Failed to get chat history', error: error.message });
  }
};

// Clear chat session (optional)
exports.clearChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    chatSessions.delete(sessionId);
    res.json({ message: 'Chat session cleared' });
  } catch (error) {
    console.error('Clear session error:', error);
    res.status(500).json({ message: 'Failed to clear session', error: error.message });
  }
};

// Get all user chat sessions (optional)
exports.getUserChatSessions = async (req, res) => {
  try {
    const sessions = Array.from(chatSessions.values());
    res.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Failed to get sessions', error: error.message });
  }
};
