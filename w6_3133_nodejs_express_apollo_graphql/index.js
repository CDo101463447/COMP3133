const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//import ApolloServer
const { ApolloServer, gql } = require('apollo-server-express');


//Store sensitive information to env variables
const dotenv = require('dotenv');
dotenv.config();

const typeDefs = require('./schema');  // Import schema
const resolvers = require('./resolvers');  // Import resolvers

//mongoDB Atlas Connection String
const mongodb_atlas_url = process.env.MONGODB_URL;

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
      await mongoose.connect(mongodb_atlas_url);
      console.log('✅ Success: MongoDB connected');
  } catch (error) {
      console.error('❌ Error: MongoDB connection failed:', error.message);
      process.exit(1);  // Exit process if connection fails
  }
};


//Define Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

//Define Express Server
const app = express();
app.use(express.json());
app.use('*', cors());

//Add Express app as middleware to Apollo Server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  //Start listen 
  app.listen({ port: process.env.PORT }, async () => {
      console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
      await connectDB();
  });
}

startServer();


