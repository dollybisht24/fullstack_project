const mongoose = require('mongoose');
const dotenv = require('dotenv');
const OwnerProfile = require('./models/OwnerProfile');
const connectDB = require('./config/db');

const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/nykaa-clone');

const profileData = {
  name: 'Meenakshi',
  brandName: 'Meenakshi_Makeover',
  tagline: 'Transforming Beauty, One Face at a Time ✨',
  profileImage: 'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=800',
  bannerImage: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=1200',
  
  bio: {
    journey: "My journey into the world of beauty began over a decade ago with a simple passion for making people feel confident and beautiful. What started as helping friends and family with their makeup evolved into a full-fledged career serving thousands of clients across bridal, celebrity, and fashion makeup. Each face I work on tells a unique story, and I'm honored to be part of their special moments.",
    
    training: "I've invested years in professional training, earning certifications from prestigious makeup academies including HD Makeup Artistry, Airbrush Techniques, Advanced Bridal Makeup, and Special Effects. My education didn't stop at certifications - I continuously update my skills through international workshops, masterclasses with industry legends, and staying current with global beauty trends.",
    
    experience: "With over 10 years of hands-on experience, I've had the privilege of working on 10,000+ faces for occasions ranging from intimate bridal ceremonies to grand fashion shows. My expertise spans traditional Indian bridal looks, contemporary celebrity glam, HD makeup for photoshoots, and everything in between. I've collaborated with photographers, fashion designers, and event planners to create memorable beauty experiences.",
    
    vision: "My vision for Meenakshi_Makeover goes beyond just applying makeup - it's about empowering every individual to discover their unique beauty and feel confident in their own skin. I believe that makeup is not a mask, but a tool to enhance your natural features and express your personality. Through personalized consultations, quality products, and expert techniques, I aim to make professional beauty services accessible to everyone while maintaining the highest standards of artistry and care."
  },
  
  statistics: {
    totalClients: 10000,
    averageRating: 4.9,
    totalReviews: 8500,
    yearsOfExperience: 12,
    certificationsCount: 15
  },
  
  skills: [
    {
      name: 'Bridal Makeup',
      level: 'master',
      category: 'Makeup Artistry',
      icon: '👰'
    },
    {
      name: 'HD Makeup',
      level: 'expert',
      category: 'Professional Techniques',
      icon: '📸'
    },
    {
      name: 'Airbrush Techniques',
      level: 'expert',
      category: 'Advanced Skills',
      icon: '🎨'
    },
    {
      name: 'Skin Preparation',
      level: 'master',
      category: 'Skincare',
      icon: '🌸'
    },
    {
      name: 'Color Theory',
      level: 'expert',
      category: 'Fundamentals',
      icon: '🎨'
    },
    {
      name: 'Contouring & Highlighting',
      level: 'master',
      category: 'Face Sculpting',
      icon: '✨'
    },
    {
      name: 'Eye Makeup Artistry',
      level: 'expert',
      category: 'Eye Techniques',
      icon: '👁️'
    },
    {
      name: 'Celebrity Styling',
      level: 'expert',
      category: 'Professional Services',
      icon: '⭐'
    },
    {
      name: 'Fashion Show Makeup',
      level: 'expert',
      category: 'Runway & Editorial',
      icon: '🎭'
    },
    {
      name: 'Prosthetic Application',
      level: 'intermediate',
      category: 'Special Effects',
      icon: '🎪'
    },
    {
      name: 'Makeup Product Knowledge',
      level: 'master',
      category: 'Product Expertise',
      icon: '💄'
    },
    {
      name: 'Client Consultation',
      level: 'master',
      category: 'Business Skills',
      icon: '💬'
    }
  ],
  
  achievements: [
    {
      title: 'Master Makeup Artist Certification',
      description: 'Completed advanced certification in professional makeup artistry covering all aspects of beauty and cosmetics',
      year: 2015,
      organization: 'International Makeup Academy',
      type: 'certificate',
      image: 'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'HD & Airbrush Specialist',
      description: 'Specialized training in high-definition and airbrush makeup techniques for photography and video',
      year: 2016,
      organization: 'Pro Makeup Academy',
      type: 'certificate',
      image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Best Bridal Makeup Artist Award',
      description: 'Recognized as the best bridal makeup artist in the regional beauty awards',
      year: 2018,
      organization: 'Beauty Excellence Awards',
      type: 'award',
      image: 'https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: '5000+ Bridal Makeovers',
      description: 'Successfully completed 5000+ bridal makeup sessions with exceptional client satisfaction',
      year: 2020,
      organization: 'Meenakshi_Makeover',
      type: 'milestone',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Celebrity Makeup Artist',
      description: 'Worked with numerous celebrities and influencers for fashion shows, events, and photoshoots',
      year: 2019,
      organization: 'Fashion & Entertainment Industry',
      type: 'achievement',
      image: 'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Advanced Skincare Certification',
      description: 'Completed comprehensive training in skincare analysis, treatments, and product formulation',
      year: 2017,
      organization: 'Dermatology & Skincare Institute',
      type: 'certificate',
      image: 'https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Fashion Week Backstage Artist',
      description: 'Official backstage makeup artist for major fashion weeks and runway shows',
      year: 2021,
      organization: 'Fashion Week Productions',
      type: 'achievement',
      image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: '10,000 Clients Milestone',
      description: 'Reached the incredible milestone of serving 10,000+ satisfied clients',
      year: 2023,
      organization: 'Meenakshi_Makeover',
      type: 'milestone',
      image: 'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Special Effects Makeup Certification',
      description: 'Trained in prosthetic application, body painting, and theatrical makeup effects',
      year: 2019,
      organization: 'Special Effects Makeup Academy',
      type: 'certificate',
      image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Beauty Influencer of the Year',
      description: 'Awarded for significant impact in beauty education and social media presence',
      year: 2022,
      organization: 'Digital Beauty Awards',
      type: 'award',
      image: 'https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ],
  
  timeline: [
    {
      year: 2013,
      title: 'The Beginning',
      description: 'Started my journey in makeup artistry with basic training and assisting senior artists',
      type: 'milestone',
      image: 'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      year: 2015,
      title: 'Professional Certification',
      description: 'Earned Master Makeup Artist certification from International Makeup Academy',
      type: 'certification',
      image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      year: 2016,
      title: 'HD & Airbrush Specialization',
      description: 'Completed advanced training in HD and Airbrush makeup techniques',
      type: 'certification',
      image: 'https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      year: 2017,
      title: 'Launched Meenakshi_Makeover',
      description: 'Officially launched my brand Meenakshi_Makeover and opened first studio',
      type: 'milestone',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      year: 2018,
      title: 'Best Bridal Makeup Artist',
      description: 'Won the prestigious Best Bridal Makeup Artist award at regional beauty awards',
      type: 'award',
      image: 'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      year: 2019,
      title: 'Celebrity Collaborations',
      description: 'Started working with celebrities and became official makeup artist for fashion events',
      type: 'collaboration',
      image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      year: 2020,
      title: '5000 Brides Milestone',
      description: 'Reached the milestone of beautifying 5000+ brides on their special day',
      type: 'milestone',
      image: 'https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      year: 2021,
      title: 'Fashion Week Backstage',
      description: 'Became official backstage makeup artist for major fashion weeks',
      type: 'event',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      year: 2022,
      title: 'Beauty Influencer Award',
      description: 'Recognized as Beauty Influencer of the Year for digital presence and education',
      type: 'award',
      image: 'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      year: 2023,
      title: '10,000 Clients Celebration',
      description: 'Celebrated serving 10,000+ happy clients with an exclusive beauty event',
      type: 'milestone',
      image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      year: 2024,
      title: 'E-Commerce Platform Launch',
      description: 'Launched online beauty store making professional products accessible to everyone',
      type: 'milestone',
      image: 'https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      year: 2025,
      title: 'AI Beauty Consultant',
      description: 'Introduced AI-powered virtual beauty consultation for personalized guidance',
      type: 'milestone',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ],
  
  socialLinks: {
    instagram: 'https://instagram.com/meenakshi_makeover',
    facebook: 'https://facebook.com/meenakshimakeover',
    youtube: 'https://youtube.com/@meenakshimakeover',
    twitter: 'https://twitter.com/meenakshi_mua',
    linkedin: 'https://linkedin.com/in/meenakshi-makeover'
  },
  
  contactInfo: {
    email: 'contact@meenakshimakeover.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra, India'
  },
  
  featured: true,
  isActive: true
};

const seedProfile = async () => {
  try {
    // Clear existing profiles
    await OwnerProfile.deleteMany({});
    console.log('🗑️  Cleared existing profiles');
    
    // Insert new profile
    const profile = await OwnerProfile.create(profileData);
    console.log('✅ Profile seeded successfully!');
    console.log(`📊 Created profile for: ${profile.brandName}`);
    console.log(`👤 Name: ${profile.name}`);
    console.log(`⭐ Rating: ${profile.statistics.averageRating}/5`);
    console.log(`📈 Total Clients: ${profile.statistics.totalClients.toLocaleString()}`);
    console.log(`🏆 Achievements: ${profile.achievements.length}`);
    console.log(`📅 Timeline Events: ${profile.timeline.length}`);
    console.log(`💼 Skills: ${profile.skills.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding profile:', error);
    process.exit(1);
  }
};

seedProfile();
