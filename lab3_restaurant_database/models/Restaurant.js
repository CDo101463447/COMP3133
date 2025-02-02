const mongoose = require('mongoose');

// Define the address schema as a subdocument
const addressSchema = new mongoose.Schema({
  building: { type: String, required: true },
  street: { type: String, required: true },
  zipcode: { type: String, required: true }
});

// Define the restaurant schema
const restaurantSchema = new mongoose.Schema({
  address: { type: addressSchema, required: true }, // Embedded address schema
  city: { type: String, required: true },
  cuisine: { type: String, required: true },
  name: { type: String, required: true },
  restaurant_id: { type: String, required: true },
});

// Create the Restaurant model
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
