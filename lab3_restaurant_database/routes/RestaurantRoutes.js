const express = require('express');
const Restaurant = require('../models/restaurant');

const router = express.Router();

// Get all restaurants
router.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).send('Error fetching restaurants');
  }
});

// Get restaurants by cuisine
router.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ cuisine: req.params.cuisine });
    res.json(restaurants);
  } catch (err) {
    res.status(500).send('Error fetching restaurants by cuisine');
  }
});

// Get all restaurants with selected columns and sort by restaurant_id
router.get('/restaurants', async (req, res) => {
    const sortOrder = req.query.sortBy === 'ASC' ? 1 : -1; // Sort order based on query parameter
    try {
      const restaurants = await Restaurant.find()
        .select('id cuisine name city restaurant_id') 
        .sort({ restaurant_id: sortOrder }); // Sort by restaurant_id in ascending or descending order
      res.json(restaurants);
    } catch (err) {
      res.status(500).send('Error fetching restaurants');
    }
  });

// Get restaurants where cuisine is Delicatessen and city is not Brooklyn
router.get('/restaurants/Delicatessen', async (req, res) => {
    try {
      const restaurants = await Restaurant.find({ 
          cuisine: 'Delicatessen', 
          city: { $ne: 'Brooklyn' } 
        })
        .select('cuisine name city -_id') // Exclude the id field
        .sort({ name: 1 }); // Sort by name in ascending order
  
      res.json(restaurants);
    } catch (err) {
      res.status(500).send('Error fetching filtered restaurants');
    }
  });

module.exports = router;
