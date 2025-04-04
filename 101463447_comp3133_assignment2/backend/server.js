const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db'); // Import connection
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const cors = require('cors'); // Import CORS middleware

require('dotenv').config(); // Load environment variables

const app = express();

// Enable CORS for your frontend URL (e.g., Angular running on localhost:4200)
app.use(cors({
  origin: 'http://localhost:4200', // Adjust to your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

connectDB(); // Connect to MongoDB Atlas

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`🚀 Server running at http://localhost:4000/graphql`);
  });
}

startServer();
