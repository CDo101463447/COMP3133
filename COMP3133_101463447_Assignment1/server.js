const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db'); // Import connection
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

require('dotenv').config(); // Load environment variables
const app = express();

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
