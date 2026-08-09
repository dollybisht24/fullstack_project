const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    images: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String },
    category: { type: String },
    description: { type: String },
    images: [{ type: String }],
    price: { type: Number, required: true, default: 0 },
    originalPrice: { type: Number },
    discount: { type: Number },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema],
    externalId: { type: String, unique: true, sparse: true },
    productType: { type: String },
    tagList: [{ type: String }],
    productColors: [{ type: Object }]
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
