const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@nykaa.com',
    password: 'admin123',
    isAdmin: true,
    isVerified: true,
    phone: '+91 9876543210',
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    isVerified: true,
    phone: '+91 9876543211',
  },
  {
    name: 'Ananya Gupta',
    email: 'ananya@example.com',
    password: 'password123',
    isVerified: true,
    phone: '+91 9876543212',
  },
];

const products = [
  // LIPSTICKS
  {
    name: 'Maybelline SuperStay Matte Ink Liquid Lipstick',
    brand: 'Maybelline',
    category: 'Lips',
    description: 'Up to 16HR wear liquid matte lipstick. Intense color with a lightweight feel. Smudge-proof and transfer-proof formula.',
    images: [
      'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    price: 599,
    originalPrice: 799,
    discount: 25,
    countInStock: 50,
    rating: 4.5,
    numReviews: 234,
    reviews: [],
  },
  {
    name: 'MAC Retro Matte Lipstick - Ruby Woo',
    brand: 'MAC',
    category: 'Lips',
    description: 'Iconic red matte lipstick with intense color payoff. Long-lasting formula that stays vibrant all day.',
    images: [
      'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    price: 1800,
    originalPrice: 2100,
    discount: 15,
    countInStock: 30,
    rating: 4.8,
    numReviews: 567,
    reviews: [],
  },
  {
    name: 'Lakme 9 to 5 Primer + Matte Lip Color',
    brand: 'Lakme',
    category: 'Lips',
    description: 'Matte lip color with built-in primer. Lightweight, non-drying formula with rich color payoff.',
    images: [
      'https://images.pexels.com/photos/5240658/pexels-photo-5240658.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    price: 475,
    originalPrice: 595,
    discount: 20,
    countInStock: 100,
    rating: 4.3,
    numReviews: 189,
    reviews: [],
  },
  {
    name: 'Nykaa So Matte! Lipstick',
    brand: 'Nykaa',
    category: 'Lips',
    description: 'Ultra-matte finish lipstick with vitamin E. Glides on smoothly and stays put for hours.',
    images: [
      'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/5240658/pexels-photo-5240658.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    price: 349,
    originalPrice: 449,
    discount: 22,
    countInStock: 80,
    rating: 4.4,
    numReviews: 312,
    reviews: [],
  },
  {
    name: 'Charlotte Tilbury Matte Revolution Lipstick',
    brand: 'Charlotte Tilbury',
    category: 'Lips',
    description: 'Luxurious matte lipstick with cashmere finish. Enriched with orchid extract for hydration.',
    images: [
      'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    price: 2850,
    originalPrice: 3200,
    discount: 11,
    countInStock: 20,
    rating: 4.9,
    numReviews: 456,
    reviews: [],
  },
  // FOUNDATIONS
  {
    name: 'Maybelline Fit Me Matte + Poreless Foundation',
    brand: 'Maybelline',
    category: 'Face',
    description: 'Oil-free foundation that refines pores and controls shine. Natural matte finish for up to 12 hours.',
    images: [
      'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/3762876/pexels-photo-3762876.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/5240662/pexels-photo-5240662.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    price: 499,
    originalPrice: 599,
    discount: 17,
    countInStock: 60,
    rating: 4.6,
    numReviews: 445,
    reviews: [],
  },
  {
    name: 'Estee Lauder Double Wear Stay-in-Place Foundation',
    brand: 'Estee Lauder',
    category: 'Face',
    description: 'Flawless all day foundation with 24-hour wear. Medium to full coverage, transfer-resistant formula.',
    images: [
      'https://images.pexels.com/photos/3762876/pexels-photo-3762876.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/5240662/pexels-photo-5240662.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    price: 3950,
    originalPrice: 4500,
    discount: 12,
    countInStock: 25,
    rating: 4.9,
    numReviews: 823,
    reviews: [],
  },
  {
    name: 'Lakme Absolute Skin Natural Mousse Foundation',
    brand: 'Lakme',
    category: 'Face',
    description: 'Lightweight mousse foundation with buildable coverage. SPF 8 protection with a natural finish.',
    images: [
      'https://images.pexels.com/photos/5240662/pexels-photo-5240662.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/3762876/pexels-photo-3762876.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    price: 650,
    originalPrice: 850,
    discount: 24,
    countInStock: 45,
    rating: 4.2,
    numReviews: 267,
    reviews: [],
  },
  {
    name: 'SUGAR Cosmetics Ace of Face Foundation Stick',
    brand: 'SUGAR',
    category: 'Face',
    description: 'Creamy foundation stick with full coverage. Easy to blend with a long-lasting matte finish.',
    images: [
      'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/5240662/pexels-photo-5240662.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/3762876/pexels-photo-3762876.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    price: 899,
    originalPrice: 1199,
    discount: 25,
    countInStock: 70,
    rating: 4.5,
    numReviews: 198,
    reviews: [],
  },
  {
    name: 'Fenty Beauty Pro Filt\'r Soft Matte Foundation',
    brand: 'Fenty Beauty',
    category: 'Face',
    description: 'Soft matte foundation with medium buildable coverage. Climate-adaptive technology keeps skin comfortable.',
    images: [
      'https://images.pexels.com/photos/5240662/pexels-photo-5240662.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/3762876/pexels-photo-3762876.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    price: 2950,
    originalPrice: 3400,
    discount: 13,
    countInStock: 35,
    rating: 4.8,
    numReviews: 612,
    reviews: [],
  },
  // EYELINERS
  {
    name: 'Maybelline Colossal Kajal',
    brand: 'Maybelline',
    category: 'Eyes',
    description: 'Intense black kajal with smudge-proof formula. Lasts up to 12 hours without fading.',
    images: [
      'https://images.pexels.com/photos/3373730/pexels-photo-3373730.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/3865579/pexels-photo-3865579.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/5240651/pexels-photo-5240651.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    price: 199,
    originalPrice: 249,
    discount: 20,
    countInStock: 150,
    rating: 4.7,
    numReviews: 678,
    reviews: [],
  },
  {
    name: 'Lakme Eyeconic Kajal',
    brand: 'Lakme',
    category: 'Eyes',
    description: '22 HR smudge-proof kajal. Intense color with a smooth glide formula.',
    images: [
      'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=500',
      'https://images.unsplash.com/photo-1583241800698-fa7843bc1899?w=500',
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500'
    ],
    price: 225,
    originalPrice: 295,
    discount: 24,
    countInStock: 120,
    rating: 4.4,
    numReviews: 534,
    reviews: [],
  },
  {
    name: 'SUGAR Stroke Of Genius Heavy Duty Kohl',
    brand: 'SUGAR',
    category: 'Eyes',
    description: 'Waterproof kohl pencil with intense black color. Long-lasting and smudge-resistant.',
    images: [
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500',
      'https://images.unsplash.com/photo-1583241800698-fa7843bc1899?w=500',
      'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=500'
    ],
    price: 299,
    originalPrice: 399,
    discount: 25,
    countInStock: 90,
    rating: 4.6,
    numReviews: 423,
    reviews: [],
  },
  {
    name: 'Urban Decay 24/7 Glide-On Eye Pencil',
    brand: 'Urban Decay',
    category: 'Eyes',
    description: 'Creamy, long-lasting eye pencil with intense color. Waterproof and smudge-proof formula.',
    images: [
      'https://images.unsplash.com/photo-1583241800698-fa7843bc1899?w=500',
      'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=500'
    ],
    price: 1650,
    originalPrice: 1950,
    discount: 15,
    countInStock: 40,
    rating: 4.7,
    numReviews: 389,
    reviews: [],
  },
  // MASCARAS
  {
    name: 'Maybelline Lash Sensational Mascara',
    brand: 'Maybelline',
    category: 'Eyes',
    description: 'Volumizing and lengthening mascara with exclusive fan brush. Creates full lashes with no clumps.',
    images: [
      'https://images.pexels.com/photos/3865579/pexels-photo-3865579.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/3373730/pexels-photo-3373730.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/5240651/pexels-photo-5240651.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    price: 599,
    originalPrice: 699,
    discount: 14,
    countInStock: 85,
    rating: 4.6,
    numReviews: 521,
    reviews: [],
  },
  {
    name: 'L\'Oreal Paris Voluminous Lash Paradise Mascara',
    brand: 'L\'Oreal Paris',
    category: 'Eyes',
    description: 'Volumizing and lengthening mascara with soft wavy brush. Intense color and volume.',
    images: [
      'https://images.unsplash.com/photo-1583241800698-fa7843bc1899?w=500',
      'https://images.unsplash.com/photo-1631730486084-313c1b50d3a5?w=500'
    ],
    price: 749,
    originalPrice: 899,
    discount: 17,
    countInStock: 65,
    rating: 4.5,
    numReviews: 445,
    reviews: [],
  },
  // SKINCARE & MORE
  {
    name: 'The Ordinary Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    category: 'Skin',
    description: 'High-strength vitamin and mineral serum. Reduces appearance of skin blemishes and congestion.',
    images: [
      'https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/4620869/pexels-photo-4620869.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    price: 899,
    originalPrice: 1099,
    discount: 18,
    countInStock: 40,
    rating: 4.8,
    numReviews: 734,
    reviews: [],
  },
  {
    name: 'Minimalist Vitamin C 10% Face Serum',
    brand: 'Minimalist',
    category: 'Skin',
    description: 'Brightening serum with pure L-Ascorbic Acid. Reduces dark spots and improves skin texture.',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500'
    ],
    price: 699,
    originalPrice: 849,
    discount: 18,
    countInStock: 60,
    rating: 4.6,
    numReviews: 456,
    reviews: [],
  },
  {
    name: 'Cetaphil Gentle Skin Cleanser',
    brand: 'Cetaphil',
    category: 'Skin',
    description: 'Gentle, soap-free cleanser for all skin types. Removes dirt and makeup without stripping moisture.',
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500'
    ],
    price: 575,
    originalPrice: 695,
    discount: 17,
    countInStock: 85,
    rating: 4.7,
    numReviews: 891,
    reviews: [],
  },
  {
    name: 'Nykaa Salon Shine Nail Enamel',
    brand: 'Nykaa',
    category: 'Nails',
    description: 'High-shine nail polish with chip-resistant formula. Long-lasting color with gel-like finish.',
    images: [
      'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=500',
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500',
      'https://images.unsplash.com/photo-1610992015762-45dca7c44c10?w=500'
    ],
    price: 149,
    originalPrice: 199,
    discount: 25,
    countInStock: 200,
    rating: 4.2,
    numReviews: 289,
    reviews: [],
  },
  {
    name: 'Maybelline Fit Me Concealer',
    brand: 'Maybelline',
    category: 'Face',
    description: 'Natural coverage concealer that hides imperfections. Lightweight formula that doesnt crease.',
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500'
    ],
    price: 399,
    originalPrice: 499,
    discount: 20,
    countInStock: 110,
    rating: 4.5,
    numReviews: 445,
    reviews: [],
  },
  {
    name: 'Benefit Cosmetics Hoola Matte Bronzer',
    brand: 'Benefit',
    category: 'Face',
    description: 'Natural-looking matte bronzer. Buildable formula for a sun-kissed glow.',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500',
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500'
    ],
    price: 2450,
    originalPrice: 2850,
    discount: 14,
    countInStock: 30,
    rating: 4.9,
    numReviews: 567,
    reviews: [],
  },
  {
    name: 'Colorbar Stunning Blush',
    brand: 'Colorbar',
    category: 'Face',
    description: 'Silky smooth blush with buildable color. Long-lasting formula with natural finish.',
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500'
    ],
    price: 549,
    originalPrice: 699,
    discount: 21,
    countInStock: 75,
    rating: 4.3,
    numReviews: 234,
    reviews: [],
  },
];

const importData = async () => {
  try {
    await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/nykaa-clone');
    await User.deleteMany();
    await Product.deleteMany();
    const createdUsers = await User.insertMany(users);
    console.log('✅ Users imported successfully');
    await Product.insertMany(products);
    console.log('✅ Products imported successfully');
    console.log('🎉 Data Import Success!');
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/nykaa-clone');
    await User.deleteMany();
    await Product.deleteMany();
    console.log('🗑️  Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error('❌ Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
