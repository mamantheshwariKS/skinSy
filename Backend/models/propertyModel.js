const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zipcode: {
      type: String,
    }
  },
  gMapEmbedLocation: {
    type: String
  },
  price: {
    type: String, 
    required: true
  },
  propertyType: {
    type: String,
    required: true
  },
  bedrooms: {
    type: Number,
  },
  bathrooms: {
    type: Number,
  },
  amenities: {
    type: [String], 
  },
  images: {
    type: [String], 
  },
  description: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
},
reviews: [{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, 
  rating: { type: Number, required: true, min: 1, max: 5 }, 
  comment: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now } 
}],
averageRating: {
  type: Number,
  default: 0
},
isSold: {
  type: Boolean, 
  default: false
}
}, {timestamps: true});

const Property = mongoose.model('Property', PropertySchema);

module.exports = Property;
