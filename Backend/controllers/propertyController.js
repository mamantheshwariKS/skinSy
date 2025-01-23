const Property = require('../models/propertyModel');
const asyncHandler = require('../utils/asyncHandler');
const BaseError = require('../utils/baseError');
const { response, caseInsensitive } = require('../utils/commonUtils');

const createProperty = asyncHandler(async (req, res) => {
    // const requiredFields = ['title', 'location', 'price', 'propertyType', 'bedrooms', 'bathrooms', 'amenities', 'images', 'description'];
    const requiredFields = ['title', 'price', 'propertyType', 'description'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        throw new BaseError(0, `Missing required fields: ${missingFields.join(', ')}`, 400);
    }

     const imageUrls = req.fileUrls || [];

     const property = new Property({
         ...req.body,
         images: imageUrls
     });

    const newProperty = await property.save();
    response(res, 1, 201, "Property created successfully", newProperty);
});

const fetchSingleProperty = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const property = await Property.findOne({_id: req.params.id, active: true}).populate({path: 'reviews.user', select: 'firstName lastName' }).lean();
    if (!property) {
        throw new BaseError(0, "Property not found", 404);
    }
    response(res, 1, 200, "Property fetched successfully", property);
});

const fetchAllProperties = asyncHandler(async (req, res) => {
    const { propertyType } = req.query;

    let filter = {};
    if (propertyType) {
        filter.propertyType = caseInsensitive(propertyType);
    }

    filter.active = true;

    const properties = await Property.find(filter).populate({path: 'reviews.user', select: 'firstName lastName' }).lean();

    if (!properties.length) {
        return response(res, 0, 200, "No properties found", properties);
    }

    response(res, 1, 200, "All properties fetched successfully", properties);
});

const updateProperty = asyncHandler(async (req, res) => {
    const propertyId = req.params.id;

    const property = await Property.findOne({ _id: propertyId, active: true }).lean();
    if (!property) {
        throw new BaseError(0, "Property not found", 404);
    }

    const updateData = { ...req.body };

    const newImages = req.fileUrls || [];
    if (newImages.length > 0) {
        updateData.images = [...property.images, ...newImages];
    }

    const updatedProperty = await Property.findOneAndUpdate(
        { _id: propertyId, active: true },
        updateData,
        { new: true }
    ).lean();

    if (!updatedProperty) {
        throw new BaseError(0, "Error updating property", 500);
    }

    response(res, 1, 200, "Property updated successfully", updatedProperty);
});

const deleteProperty = asyncHandler(async (req, res) => {
    const property = await Property.findOneAndUpdate(
        { _id: req.params.id, active: true },
        { active: false },
        { new: false }
    ).lean();
    if (!property) {
        throw new BaseError(0, "Property not found", 404);
    }
    response(res, 1, 200, "Property deleted successfully", {});
});

const globalSearchProperties = asyncHandler(async (req, res) => {
    const { query } = req.query; 

    if (!query) {
        return response(res, 0, 400, "No search query provided");
    }

    const searchRegex = new RegExp(`^${query}`, 'i');

    const properties = await Property.find({
        active: true,
        $or: [
            { title: searchRegex },
            { 'location.city': searchRegex },
            { 'location.address': searchRegex },
            { 'location.state': searchRegex },
            { 'location.zipcode': searchRegex },
            { propertyType: searchRegex }
        ]
    }).lean();

    if (!properties.length) {
        return response(res, 0, 200, "No properties found", []);
    }

    response(res, 1, 200, "Properties fetched successfully", properties);
});

const addReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
        throw new BaseError(0, "Rating and comment are required", 400);
    }

    if (rating < 1 || rating > 5) {
        throw new BaseError(0, "Rating must be between 1 and 5", 400);
    }

    const property = await Property.findById(req.params.propertyId);
    
    if (!property) {
        throw new BaseError(0, "Property not found", 404);
    }

    const alreadyReviewed = property.reviews.find(r => r.user.toString() === req.user.id.toString());
    
    if (alreadyReviewed) {
        throw new BaseError(0, "You have already reviewed this property", 400);
    }

    const review = {
        user: req.user.id,
        rating,
        comment,
    };

    property.reviews.push(review);

    property.averageRating = property.reviews.reduce((acc, item) => item.rating + acc, 0) / property.reviews.length;

    await property.save();

    response(res, 1, 201, "Review added successfully", {
        reviews: property.reviews,
        averageRating: property.averageRating
    });
});

const removeImg = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { image } = req.body;
  
    try {
      const property = await Property.findById(id);
      property.images = property.images.filter(img => img !== image);
  
      await property.save();
      response(res, 0, 200, "Image removed successfully");
    } catch (error) {
      response(res, 0, 500, "Error removing image");
    }
  })

module.exports = {
    createProperty,
    fetchSingleProperty,
    fetchAllProperties,
    updateProperty,
    deleteProperty,
    globalSearchProperties,
    addReview,
    removeImg
};