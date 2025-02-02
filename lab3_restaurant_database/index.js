const express = require('express');
const mongoose = require('mongoose');
const restaurantRouter = require('./routes/RestaurantRoutes'); // Add the RestaurantRoutes

const app = express();
app.use(express.json());

// Replace with your MongoDB connection string
mongoose.connect('mongodb+srv://dbUser:Bungmap810@restaurants.an8fg.mongodb.net/Restaurants?retryWrites=true&w=majority&appName=Restaurants', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(success => {
    console.log('Success MongoDB connection');
  }).catch(err => {
    console.log('Error MongoDB connection', err);
  });
  

app.use(restaurantRouter); // Use restaurantRouter for all routes

app.listen(3000, () => { console.log('Server is running on http://localhost:3000') });
