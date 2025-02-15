const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, minlength: 4 },
  email: { 
    type: String, 
    required: true, 
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
  },
  address: {
    street: { type: String, required: true },
    suite: { type: String, required: true },
    city: { type: String, required: true, match: /^[a-zA-Z\s]+$/ },
    zipcode: { type: String, required: true, match: /^\d{5}-\d{4}$/ },
    geo: {
      lat: { type: String, required: true },
      lng: { type: String, required: true }
    }
  },
  phone: { type: String, required: true, match: /^1-\d{3}-\d{3}-\d{4}$/ },
  website: { type: String, required: true, match: /^(https?:\/\/)[^\s/$.?#].[^\s]*$/ },
  company: {
    name: { type: String, required: true },
    catchPhrase: { type: String, required: true },
    bs: { type: String, required: true }
  }
});

module.exports = mongoose.model("User", userSchema);
