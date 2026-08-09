const mongoose = require('mongoose');
const Product = require('./models/Product');

// Connect to the same database the server uses (nykaa-clone)
mongoose.connect('mongodb://localhost:27017/nykaa-clone');

const newProducts = [
  {
    name: 'Glamorous Bridal Makeup Set',
    brand: 'Meenakshi Makeover',
    category: 'Bridal Makeup',
    images: ['https://i.pinimg.com/736x/9f/6b/9f/9f6b9f235e9c54e78da85afc502e7a57.jpg'],
    price: 2499,
    originalPrice: 3999,
    discount: 38,
    countInStock: 65,
    rating: 4.8,
    numReviews: 156,
    description: 'Complete bridal makeup set with premium quality products for your special day'
  },
  {
    name: 'Party Glam Makeup Collection',
    brand: 'Meenakshi Makeover',
    category: 'Party Makeup',
    images: ['https://i.pinimg.com/736x/78/2e/92/782e922e55c69985f3aacf01250dabce.jpg'],
    price: 1899,
    originalPrice: 2999,
    discount: 37,
    countInStock: 80,
    rating: 4.7,
    numReviews: 143,
    description: 'Stunning party makeup essentials for glamorous evening looks'
  },
  {
    name: 'Professional Eye Makeup Palette',
    brand: 'Meenakshi Makeover',
    category: 'Eye Makeup',
    images: ['https://i.pinimg.com/736x/df/e2/81/dfe281744cc82d7d86666670796a705b.jpg'],
    price: 1599,
    originalPrice: 2499,
    discount: 36,
    countInStock: 95,
    rating: 4.9,
    numReviews: 178,
    description: 'Professional eye makeup palette with vibrant and matte shades'
  },
  {
    name: 'HD Foundation & Concealer Kit',
    brand: 'Meenakshi Makeover',
    category: 'Face Makeup',
    images: ['https://i.pinimg.com/736x/08/66/10/08661015450561859151e2f46c591a67.jpg'],
    price: 1799,
    originalPrice: 2799,
    discount: 36,
    countInStock: 70,
    rating: 4.8,
    numReviews: 165,
    description: 'HD finish foundation and concealer for flawless complexion'
  },
  {
    name: 'Luxury Skincare Combo',
    brand: 'Meenakshi Makeover',
    category: 'Skin Care',
    images: ['https://i.pinimg.com/1200x/d9/ce/c9/d9cec9f07c39dd74720a976be436cdb9.jpg'],
    price: 2299,
    originalPrice: 3499,
    discount: 34,
    countInStock: 55,
    rating: 4.9,
    numReviews: 189,
    description: 'Premium skincare products for radiant and healthy skin'
  },
  {
    name: 'Bridal Glow Facial Kit',
    brand: 'Meenakshi Makeover',
    category: 'Facial Care',
    images: ['https://i.pinimg.com/736x/c6/62/09/c66209b5c1140b633027001bb8887f7f.jpg'],
    price: 1999,
    originalPrice: 3199,
    discount: 38,
    countInStock: 60,
    rating: 4.8,
    numReviews: 152,
    description: 'Complete facial kit for bridal glow and radiance'
  },
  {
    name: 'Pro Makeup Brush Set Premium',
    brand: 'Meenakshi Makeover',
    category: 'Makeup Tools',
    images: ['https://i.pinimg.com/1200x/a3/94/1e/a3941ed3b2b8e0e1de18de62a5caa2be.jpg'],
    price: 1699,
    originalPrice: 2699,
    discount: 37,
    countInStock: 85,
    rating: 4.7,
    numReviews: 198,
    description: 'Professional makeup brush set with soft synthetic bristles'
  },
  {
    name: 'Matte Lipstick Collection',
    brand: 'Meenakshi Makeover',
    category: 'Lip Makeup',
    images: ['https://i.pinimg.com/736x/4f/85/f3/4f85f300a21717ba6227c46b50d7dc40.jpg'],
    price: 899,
    originalPrice: 1499,
    discount: 40,
    countInStock: 110,
    rating: 4.6,
    numReviews: 225,
    description: 'Long-lasting matte lipstick collection in trending shades'
  },
  {
    name: 'Glitter & Highlighter Duo',
    brand: 'Meenakshi Makeover',
    category: 'Face Makeup',
    images: ['https://i.pinimg.com/1200x/31/ec/cc/31eccc60f19da84465b3a48ba91e150b.jpg'],
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    countInStock: 75,
    rating: 4.8,
    numReviews: 167,
    description: 'Shimmer and highlighter duo for radiant glow'
  },
  {
    name: 'Waterproof Eyeliner & Mascara Set',
    brand: 'Meenakshi Makeover',
    category: 'Eye Makeup',
    images: ['https://i.pinimg.com/1200x/38/94/19/38941980faba55bd7a9aa4c47d5d9fd9.jpg'],
    price: 1099,
    originalPrice: 1799,
    discount: 39,
    countInStock: 90,
    rating: 4.7,
    numReviews: 182,
    description: 'Waterproof eyeliner and mascara for all-day wear'
  },
  {
    name: 'Nail Art & Polish Collection',
    brand: 'Meenakshi Makeover',
    category: 'Nail Care',
    images: ['https://i.pinimg.com/1200x/c1/a3/24/c1a32446c361c34ca62344733108a9a1.jpg'],
    price: 799,
    originalPrice: 1299,
    discount: 38,
    countInStock: 100,
    rating: 4.6,
    numReviews: 145,
    description: 'Professional nail art and polish collection with vibrant colors'
  },
  {
    name: 'Contour & Blush Palette Pro',
    brand: 'Meenakshi Makeover',
    category: 'Face Makeup',
    images: ['https://i.pinimg.com/1200x/81/a2/23/81a223b30d9a23afc5c18b8eb0756b9b.jpg'],
    price: 1499,
    originalPrice: 2399,
    discount: 38,
    countInStock: 70,
    rating: 4.9,
    numReviews: 203,
    description: 'Professional contour and blush palette for sculpted look'
  },
  {
    name: 'Bridal Accessories & Beauty Tools',
    brand: 'Meenakshi Makeover',
    category: 'Beauty Essentials',
    images: ['https://i.pinimg.com/1200x/69/46/9c/69469ca87a9386cf92802b90bd0c3a01.jpg'],
    price: 1899,
    originalPrice: 2999,
    discount: 37,
    countInStock: 65,
    rating: 4.8,
    numReviews: 174,
    description: 'Complete bridal accessories and beauty tools collection'
  },
  {
    name: 'Premium Makeup Setting Spray',
    brand: 'Meenakshi Makeover',
    category: 'Professional Makeup',
    images: ['https://i.pinimg.com/736x/5c/66/4a/5c664a6e5e7e29a23b37993684cf5386.jpg'],
    price: 1199,
    originalPrice: 1899,
    discount: 37,
    countInStock: 80,
    rating: 4.7,
    numReviews: 158,
    description: 'Long-lasting makeup setting spray for all-day hold'
  }
];

async function addProducts() {
  try {
    console.log('🔄 Adding 14 new products to database...');
    
    for (const productData of newProducts) {
      const exists = await Product.findOne({ 
        name: productData.name,
        brand: productData.brand 
      });
      
      if (!exists) {
        await Product.create(productData);
        console.log(`✅ Added: ${productData.name} - ₹${productData.price}`);
      } else {
        console.log(`⚠️  Already exists: ${productData.name}`);
      }
    }
    
    console.log('\n🎉 Successfully added all products!');
    
    // Show total count
    const totalProducts = await Product.countDocuments({ brand: 'Meenakshi Makeover' });
    console.log(`📦 Total Meenakshi Makeover products: ${totalProducts}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  }
}

addProducts();
