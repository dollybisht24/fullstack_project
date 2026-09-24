const crypto = require('crypto');
const Groq = require('groq-sdk');
const Product = require('../models/Product');

// UUID v4 generator using crypto
const uuidv4 = () => crypto.randomUUID();

// Initialize Groq if API key is provided
let groqClient = null;
if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('demo')) {
  try {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  } catch (err) {
    console.warn('Groq client init warning:', err.message);
  }
}

// In-memory storage for chat sessions
const chatSessions = new Map();

// Master System Prompt for Meenakshi AI
const MASTER_SYSTEM_PROMPT = `You are Meenakshi, a master celebrity makeup artist, licensed aesthetician, and beauty expert with 12+ years of experience running "Meenakshi Makeover". You are an encyclopedic authority on:
1. ALL SKIN TYPES (Face & Body):
   - Oily skin (sebum regulation, pore tightening, salicylic acid, niacinamide, oil-free matte foundations).
   - Dry skin (hyaluronic acid, ceramides, squalane, rich dewy foundations, cream blushes, no drying powders).
   - Combination skin (zone priming: mattifying T-zone + hydrating cheeks, balancing routines).
   - Sensitive & Rosacea-prone skin (fragrance-free, cica/centella, green color corrector, mineral SPF).
   - Acne-prone skin (non-comedogenic, green corrector, spot concealing, antibacterial brush hygiene).
   - Mature skin (peptides, light serum foundations, lifted blush technique, avoiding baking in fine lines).
   - Dehydrated skin (humectants on damp skin, water-gel formulas).
   - Body care: Keratosis Pilaris (strawberry skin - AHA/urea), body acne (bacne/chest), rough elbows/knees, and radiant body glow/shimmer.
2. MAKEUP ARTISTRY & SHADE MATCHING:
   - Undertone diagnosis (Cool: blue/purple veins, silver jewelry, berry/rosy shades; Warm: green veins, gold jewelry, peach/golden shades; Neutral: mix; Olive: greenish/ash undertone).
   - Dark circles correction (peach corrector for fair/medium, orange for deep; hydrating concealer + micro-baking).
   - Step-by-step skin prep before makeup: Cleanse -> Hydrating Toner -> Serum -> Moisturizer -> SPF 50 -> Primer.
   - High-definition (HD), Airbrush, and Bridal makeup techniques for cameras and hot weather.
3. PRODUCTS ON NYKAA:
   - Recommend top brands available on Nykaa (The Ordinary, Minimalist, Maybelline, L'Oreal, Benefit, Cetaphil, Nykaa Cosmetics, SUGAR, Lakme, Urban Decay).
4. TONE & STYLE:
   - Warm, welcoming, encouraging, and deeply knowledgeable.
   - Use beauty emojis naturally (💄✨💖🌸👰🎨🧴).
   - Provide structured, practical advice with clear steps and pro tips.`;

// Comprehensive Fallback Knowledge Engine for Meenakshi
const generateExpertBeautyResponse = async (userMessage) => {
  const query = userMessage.toLowerCase().trim();

  // Try to find relevant products from the MongoDB database
  let dbProducts = [];
  try {
    let searchFilter = {};
    if (query.includes('skin') || query.includes('serum') || query.includes('face') || query.includes('cleanser')) {
      searchFilter = { category: 'Skin' };
    } else if (query.includes('eye') || query.includes('kajal') || query.includes('mascara')) {
      searchFilter = { category: 'Eyes' };
    } else if (query.includes('foundation') || query.includes('concealer') || query.includes('bronzer') || query.includes('powder')) {
      searchFilter = { category: 'Face' };
    } else if (query.includes('lip') || query.includes('lipstick')) {
      searchFilter = { category: 'Lips' };
    }
    dbProducts = await Product.find(searchFilter).limit(3).select('name brand price rating category');
  } catch (err) {
    // If DB is offline, continue without breaking
  }

  // Format relevant products snippet
  let productSuggestions = '';
  if (dbProducts && dbProducts.length > 0) {
    productSuggestions = `\n\n🛍️ **Top Recommendations from Nykaa Store:**\n` +
      dbProducts.map(p => `• **${p.name}** by ${p.brand || 'Nykaa'} — ₹${p.price} ⭐ ${p.rating || '4.8'}/5`).join('\n');
  }

  // 1. OILY SKIN & LARGE PORES
  if (query.includes('oily') || query.includes('oil') || query.includes('greasy') || query.includes('shine') || (query.includes('pore') && !query.includes('dry'))) {
    return `💖 **Expert Guide for Oily Skin & Pore Control** 💄✨

Oily skin produces excess sebum, leading to enlarged pores and makeup slipping. Here is your golden routine:

🧴 **Daily Skincare Routine:**
1. **Cleanse:** Use a gentle foaming cleanser with **Salicylic Acid (BHA)** twice daily to unclog deep pores.
2. **Treat:** Apply **Niacinamide (10%) + Zinc** serum every morning to regulate oil production and minimize pore size.
3. **Moisturize:** Never skip moisturizer! Use an **oil-free water gel** (Hyaluronic acid or Centella based).
4. **Sunscreen:** Matte-finish gel sunscreen (SPF 50+ PA++++).

🎨 **Flawless Makeup for Oily Skin:**
• **Primer:** Use a silicone or pore-blurring mattifying primer on your T-zone.
• **Foundation:** Choose an oil-free, transfer-resistant matte foundation (like *Maybelline Fit Me Matte* or *Estée Lauder Double Wear*).
• **Pro Secret:** Apply setting spray **before and after** your foundation, then lightly press translucent setting powder into your T-zone using a puff!${productSuggestions}

💡 **Meenakshi's Pro Tip:** Keep oil-blotting papers in your purse instead of layering powder all day to prevent caking! 💕`;
  }

  // 2. DRY SKIN, DEHYDRATION & FLAKINESS
  if (query.includes('dry') || query.includes('flaky') || query.includes('tight') || query.includes('dehydrat') || query.includes('patches')) {
    return `🌸 **Hydration & Glow Guide for Dry Skin** 💧✨

Dry skin lacks lipids and moisture, causing tightness, dullness, and makeup clinging to dry patches.

🧴 **Skincare Prep:**
1. **Cleanse:** Use a gentle, hydrating cream-to-lotion cleanser (like *Cetaphil Gentle Skin Cleanser*) without harsh sulfates.
2. **Hydrate:** Apply **Hyaluronic Acid serum** on *damp skin* immediately after washing to lock in water.
3. **Nourish:** Use a rich moisturizer with **Ceramides and Squalane** to repair your lipid barrier.
4. **Sunscreen:** Dewy, moisturizing chemical/hybrid sunscreen.

🎨 **Makeup Application for Dry Skin:**
• **Skin Prep is 80% of your makeup:** Let your moisturizer absorb for 5 minutes before touching foundation.
• **Primer:** Use a hydrating, illuminating primer (glycerin or hyaluronic based).
• **Foundation:** Opt for hydrating serum foundations or radiant finish liquids. Avoid heavy powders!
• **Blush & Bronzer:** Swap powders for cream/liquid blushes—they melt seamlessly into the skin!${productSuggestions}

💡 **Meenakshi's Pro Tip:** Spray your damp beauty sponge with a hydrating face mist before blending your foundation for a glass-skin finish! 💖`;
  }

  // 3. COMBINATION SKIN
  if (query.includes('combination') || query.includes('t-zone') || query.includes('t zone')) {
    return `✨ **Mastering Combination Skin (Oily T-Zone + Dry Cheeks)** 🎨💄

Combination skin requires **zone-specific care** to keep your forehead and nose matte while keeping your cheeks plump and hydrated.

🧴 **Balanced Skincare Routine:**
1. **Cleanse:** A balancing, pH-neutral gel cleanser.
2. **Serum:** Niacinamide serum (balances sebum on the T-zone while hydrating cheeks).
3. **Moisturizer:** Lightweight gel-cream for the whole face, adding an extra drop of facial oil only on dry cheek patches.

🎨 **Zone-Priming Makeup Strategy:**
• **Primer:** Apply a mattifying pore primer exclusively to the nose, forehead, and chin. Use a luminous, hydrating primer on the cheeks!
• **Foundation:** Medium coverage satin-finish foundation that adapts to all areas.
• **Setting:** Only powder the T-zone where oils break through; leave the cheekbones fresh and radiant!${productSuggestions}

💡 **Meenakshi's Pro Tip:** "Zone-powdering" with a small eyeshadow blending brush gives you pinpoint shine control without dulling your cheekbones! 🌟`;
  }

  // 4. SENSITIVE SKIN & REDNESS / ROSACEA
  if (query.includes('sensitive') || query.includes('redness') || query.includes('rosacea') || query.includes('irritat') || query.includes('sting')) {
    return `🌿 **Gentle Care for Sensitive & Redness-Prone Skin** 🌸💖

Sensitive skin has a delicate barrier that reacts quickly to heat, harsh fragrances, and friction.

🧴 **Calming Skincare Routine:**
1. **Cleanse:** Ultra-gentle, non-foaming soothing cleanser (fragrance-free, alcohol-free).
2. **Calm:** Serums with **Centella Asiatica (Cica), Aloe Vera, Green Tea, or Panthenol (Vitamin B5)** to soothe inflammation.
3. **Barrier Repair:** Ceramide-rich calming balm or moisturizer.
4. **Sunscreen:** 100% Mineral Zinc Oxide sunscreen (mineral filters reflect UV rays without generating heat on the skin).

🎨 **Makeup for Sensitive Skin:**
• **Color Correction:** Dab a sheer **Green color corrector** on red spots or cheeks to neutralize redness before foundation.
• **Formulas:** Mineral-based or hypoallergenic foundations free from essential oils and synthetic fragrances.
• **Tools:** Use soft, ultra-clean synthetic brushes or a clean damp sponge with gentle patting motions—avoid rubbing!${productSuggestions}

💡 **Meenakshi's Pro Tip:** Keep your sheet masks or aloe mist in the refrigerator for an instant cooling, de-puffing treat before makeup! ❄️✨`;
  }

  // 5. ACNE-PRONE SKIN & BLEMISHES
  if (query.includes('acne') || query.includes('pimple') || query.includes('breakout') || query.includes('blemish') || query.includes('comedone')) {
    return `🛡️ **Acne-Prone Skin & Flawless Concealing Guide** 💄✨

Handling breakouts requires treating active acne while achieving seamless, cake-free coverage.

🧴 **Targeted Skincare Routine:**
1. **Cleanse:** 2% Salicylic Acid cleanser to dissolve sebum deep inside pores.
2. **Treat:** Niacinamide 10% + Zinc 1% to calm inflammation and prevent post-acne dark marks.
3. **Moisturize:** Non-comedogenic, oil-free gel moisturizer (hydrated skin produces less breakout-causing oil!).
4. **Night:** Azelaic acid or gentle BHA exfoliant 3 nights a week.

🎨 **The "Pinpoint" Concealing Secret:**
• **Step 1:** Disinfect the skin and prep with a water-based primer.
• **Step 2:** Apply a tiny speck of **Green corrector** on red pimples.
• **Step 3:** Use a medium, breathable matte foundation all over the face (don't mask your whole face with heavy foundation!).
• **Step 4:** Take a small flat concealer brush and **pinpoint conceal** only the spots with a high-coverage matte concealer.
• **Step 5:** Press translucent powder directly onto each spot with a small brush and leave it untouched!${productSuggestions}

💡 **Meenakshi's Pro Tip:** Wash your makeup sponges and brushes after EVERY use to stop acne bacteria from spreading! 🧼`;
  }

  // 6. DARK CIRCLES, EYE BAGS & UNDER-EYES
  if (query.includes('dark circle') || query.includes('eye bag') || query.includes('under eye') || query.includes('puffiness') || query.includes('creasing')) {
    return `👁️ **Erase Dark Circles & Prevent Under-Eye Creasing** ✨💖

Dark circles are caused by thin under-eye skin, hyperpigmentation, or genetics. Here is how celebrity artists erase them completely:

🧴 **Under-Eye Prep:**
1. **Caffeine Serum or Peptides:** De-puffs swollen under-eyes and boosts microcirculation in the morning.
2. **Hydrating Eye Cream:** Apply a pea-sized amount with your ring finger and let it sink in for 3 minutes. Never apply foundation on dry under-eyes!

🎨 **The 3-Step Pro Concealing Method:**
1. **Color Correct:**
   • *Fair to Medium skin:* Peach / Salmon color corrector.
   • *Dusky / Deep Indian skin tone:* Orange or warm terracotta corrector.
   *(This cancels the bluish-grey darkness completely so your concealer never looks ashy!)*
2. **Conceal:** Apply a creamy, hydrating concealer (only 1 shade lighter than your skin) to the inner corner and outer lifted corner of the eye.
3. **Micro-Baking:** Look UP and gently tap out any creases with your finger, then immediately press a tiny dusting of fine translucent powder with a velvet puff!${productSuggestions}

💡 **Meenakshi's Pro Tip:** Do not drag your concealer! Always tap and press gently to build coverage without disturbing the corrector underneath! 🪄`;
  }

  // 7. BODY SKIN, BODY ACNE, STRAWBERRY LEGS & BODY GLOW
  if (query.includes('body') || query.includes('bacne') || query.includes('strawberry') || query.includes('keratosis') || query.includes('neck') || query.includes('hands') || query.includes('legs') || query.includes('back')) {
    return `✨ **Full Body Skincare, Body Glow & Treatment Guide** 🧴💖

Beauty doesn't stop at your jawline! Here is how to achieve flawless, baby-soft skin for your entire body:

🍓 **Strawberry Skin / Keratosis Pilaris (KP) on Arms & Legs:**
• **Cause:** Keratin buildup clogging hair follicles.
• **Solution:** Use a body wash or lotion containing **Lactic Acid (AHA)**, **Glycolic Acid**, or **10% Urea**.
• Exfoliate gently 2-3 times weekly with a loofah and follow with rich body butter while skin is still damp.

🛡️ **Body Acne (Bacne & Chest Breakouts):**
• Use a **2% Salicylic Acid or Benzoyl Peroxide** body cleanser.
• Shower immediately after workouts or sweating.
• Avoid heavy hair conditioners running down your back in the shower!

🌟 **Red Carpet Body Glow & Event Makeup:**
• **Collarbone & Shoulder Pop:** Mix 2 drops of liquid highlighter with your favorite body lotion and apply on collarbones, shoulders, and shins.
• **Event Coverage:** For scars or tattoos, use a water-resistant, transfer-proof body foundation (like *MAC Studio Radiance Body* or *Dior Backstage Face & Body*) set with setting spray!${productSuggestions}

💡 **Meenakshi's Pro Tip:** Dry brushing before a warm shower boosts blood circulation and gives your limbs an instant healthy sheen! 🪥✨`;
  }

  // 8. SHADE MATCHING & UNDERTONE FINDER
  if (query.includes('undertone') || query.includes('shade') || query.includes('foundation match') || query.includes('skin tone') || query.includes('match')) {
    return `🎨 **How to Find Your Exact Undertone & Foundation Match** 💄👑

Finding your true undertone is the secret to a foundation that looks like second skin instead of a mask!

🔍 **The 3 Undertone Tests:**
1. **The Vein Test (Inner Wrist under natural daylight):**
   • **Cool (Pink / Rosy / Blue):** Veins appear Blue or Purple. Silver jewelry flatters you best.
   • **Warm (Yellow / Golden / Peach):** Veins appear Green or Olive. Gold jewelry makes you glow!
   • **Neutral:** A mix of blue and green veins. Both gold and silver look stunning on you!
   • **Olive:** Greenish / greyish golden undertone (very common in Indian & Mediterranean skin tones).

2. **The White T-Shirt Test:**
   • Hold a pure white sheet of paper next to your bare face in daylight.
   • If your face looks pinkish/rosy ➔ **Cool**.
   • If your face looks yellowish/golden ➔ **Warm**.
   • If it looks grey/ashy/green ➔ **Olive**.

3. **How to Swatch Foundation Correctly:**
   • Never swatch on your wrist or hand! Swatch 3 candidate shades in vertical stripes along your **lower jawline down toward your neck**.
   • Step into natural daylight and wait 5 minutes for the shade to dry (oxidation check).
   • The shade that seamlessly disappears between your jaw and neck is your perfect match!${productSuggestions}

💡 **Meenakshi's Pro Tip:** If you have an olive undertone, avoid overly pink or orange foundations. Look for shades with 'G' (Golden) or 'NC' (Neutral Cool / Olive-friendly) labels! 🌟`;
  }

  // 9. BRIDAL & PARTY MAKEUP LOOKS
  if (query.includes('bridal') || query.includes('wedding') || query.includes('bride') || query.includes('party') || query.includes('event') || query.includes('heavy makeup')) {
    return `👰 **Meenakshi's Signature Bridal & Event Makeup Guide** 💍✨

With over 500+ brides styled across India, here is how we ensure your bridal makeup looks breathtaking in 4K cameras and lasts 18+ hours through tears, sweat, and rituals:

👑 **The Bridal Preparation Timeline:**
• **3 Months Before:** Hydrating facials, consistent SPF, chemical peels or laser treatments (if desired).
• **1 Week Before:** Brow shaping, facial dermaplaning/threading, deep hydration masks.
• **Wedding Morning:** Ice facial roller to depuff, hydrating lip scrub, and hyaluronic moisture surge.

💄 **The 18-Hour HD Makeup Technique:**
1. **Base:** Sweat-resistant HD foundation applied with a damp blender in micro-layers.
2. **Setting Sandwich:** Setting spray ➔ Translucent powder pressing ➔ Final waterproof seal.
3. **Eyes:** Waterproof smudge-proof kajal, custom lash clusters, and soft gold/champagne shimmer to pop under stage lighting.
4. **Lips:** Waterproof lip liner filling the entire lip, topped with transfer-proof matte liquid lipstick and a center touch of gloss.

📋 **Meenakshi Makeover Packages:**
• Party Glam: ₹3,500
• Engagement / Sangeet: ₹8,000 - ₹12,000
• Complete Bridal Luxury Package: ₹15,000 - ₹50,000 (includes pre-wedding trials, hair styling, draping, and destination travel).${productSuggestions}

💡 **Meenakshi's Pro Tip:** Always bring your wedding lehenga or outfit blouse to your trial so we can calibrate your blush and lipstick undertones to your fabric! 💖👰`;
  }

  // 10. SKINCARE ROUTINES & INGREDIENT ADVICE
  if (query.includes('routine') || query.includes('skincare') || query.includes('serum') || query.includes('cleanser') || query.includes('cream') || query.includes('sunscreen') || query.includes('spf')) {
    return `🧴 **The Ultimate Dermatologist-Approved Skincare Routine** 💧✨

A flawless makeup look begins with healthy, balanced skin underneath. Here is the universal step-by-step order:

☀️ **Morning (AM) Routine — Protect & Brighten:**
1. **Cleanse:** Gentle water rinse or mild foaming cleanser.
2. **Hydrate:** Hyaluronic Acid or Niacinamide serum on damp skin.
3. **Antioxidant:** **Vitamin C Serum (10-15%)** to fade dark spots and fight sun damage.
4. **Moisturize:** Lightweight day cream to lock in hydration.
5. **Protect:** **Broad Spectrum SPF 50+ PA++++** (apply two finger lengths!).

🌙 **Night (PM) Routine — Repair & Rejuvenate:**
1. **Double Cleanse:** Micellar water or cleansing balm to melt makeup/SPF, followed by a gentle cleanser.
2. **Exfoliate/Treat:** (Alternating nights)
   • Night A: **Salicylic Acid (BHA)** for pores or **Glycolic/Lactic Acid (AHA)** for glow.
   • Night B: **Retinol / Peptides** for collagen & anti-aging.
3. **Barrier Cream:** Rich ceramide moisturizer to restore the skin barrier while you sleep.${productSuggestions}

💡 **Meenakshi's Pro Tip:** Wait 60 seconds between each skincare layer so active ingredients absorb properly instead of pilling under your foundation! 💕`;
  }

  // 11. MATURE SKIN & ANTI-AGING
  if (query.includes('mature') || query.includes('wrinkle') || query.includes('aging') || query.includes('fine line') || query.includes('sagging')) {
    return `✨ **Ageless Beauty Guide for Mature Skin** 🌸💖

Mature skin requires light, hydrating, and luminous techniques that enhance your natural elegance without settling into expression lines.

🧴 **Skincare Focus:**
• Incorporate **Peptides, Hyaluronic Acid, and gentle Retinol** at night to boost elasticity.
• Deeply hydrate before applying any cosmetics.

🎨 **Makeup Artistry Tips for Mature Skin:**
• **Less is More:** Avoid thick, full-coverage matte foundations—they emphasize fine lines. Opt for a luminous tint or hydrating serum foundation.
• **Concealer:** Apply a creamy, lightweight concealer only in the hollow of the inner eye corner, not all the way across.
• **Blush Lift:** Apply cream blush higher on the cheekbones and blend upward toward the temples for an instant lifting effect!
• **Brows & Eyes:** Soft powder brow pencils and satin eyeshadows. Avoid frosty glitters on wrinkled eyelids—choose refined satin or matte neutral tones.${productSuggestions}

💡 **Meenakshi's Pro Tip:** Skip baking under the eyes! Instead, take a damp sponge with a touch of setting spray and tap gently to set the concealer with zero powder dryness! 🌟`;
  }

  // DEFAULT COMPREHENSIVE BEAUTY ASSISTANT RESPONSE
  return `Hello gorgeous! 💄✨ I'm Meenakshi, your professional makeup artist and beauty consultant!

I know everything about **face & body skin types**, makeup techniques, and product matchmaking. Here are things you can ask me:

🌸 **Skin Consultation:**
• *"I have oily/dry/combination skin, what routine should I follow?"*
• *"How do I fix dark circles and under-eye creasing?"*
• *"What should I do for body skin & strawberry legs?"*
• *"How do I calm sensitive skin or acne breakouts?"*

🎨 **Makeup & Shade Matching:**
• *"How do I find my foundation undertone (warm/cool/olive)?"*
• *"What is the best primer and foundation for my skin type?"*
• *"How to do a sweat-proof bridal or party makeup look?"*
• *"What lipstick and blush shades look best on my skin tone?"*${productSuggestions}

What would you like to know about your skin or makeup today? Tell me your skin type or concern! 💖👰✨`;
};

// Generate AI response using Groq or fallback engine
const generateAIResponse = async (userMessage, conversationHistory = []) => {
  // If Groq client is available, try modern models
  if (groqClient) {
    const modelsToTry = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
    for (const model of modelsToTry) {
      try {
        console.log(`Calling Groq AI API (${model})...`);
        const messages = [
          { role: 'system', content: MASTER_SYSTEM_PROMPT },
          ...conversationHistory.slice(-8).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: userMessage }
        ];

        const completion = await groqClient.chat.completions.create({
          model: model,
          messages: messages,
          max_tokens: 350,
          temperature: 0.7,
        });

        const response = completion.choices[0].message.content;
        if (response && response.trim()) {
          console.log(`Groq AI response received via ${model}`);
          return response;
        }
      } catch (err) {
        console.warn(`Groq ${model} failed:`, err.message);
      }
    }
  }

  // Use the comprehensive Expert Knowledge Engine
  return await generateExpertBeautyResponse(userMessage);
};

// Get or create chat session
exports.getChatSession = async (req, res) => {
  try {
    const sessionId = uuidv4();
    const session = {
      sessionId,
      messages: [{
        role: 'assistant',
        content: "Hello gorgeous! 💄✨ I'm Meenakshi, your personal makeup artist & skincare consultant. Whether you want to know your exact skin type, find the perfect foundation shade, cure dark circles, or learn bridal glam, ask me anything! What is your skin type or beauty question today? 🌸💖",
        timestamp: new Date()
      }],
      createdAt: new Date()
    };
    
    chatSessions.set(sessionId, session);
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
    const aiResponse = await generateAIResponse(message, session.messages);
    
    // Add AI response
    session.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });
    
    // Update session
    chatSessions.set(session.sessionId, session);
    
    // Return compatible payload for all frontend consumers
    res.json({
      message: aiResponse,
      response: aiResponse,
      sessionId: session.sessionId,
      data: {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }
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
    res.status(500).json({ message: 'Failed to get chat history', error: error.message });
  }
};

// Clear chat session
exports.clearChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    chatSessions.delete(sessionId);
    res.json({ message: 'Chat session cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear session', error: error.message });
  }
};

// Get all user chat sessions
exports.getUserChatSessions = async (req, res) => {
  try {
    const sessions = Array.from(chatSessions.values());
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get sessions', error: error.message });
  }
};
