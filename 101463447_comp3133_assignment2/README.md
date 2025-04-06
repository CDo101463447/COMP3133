# Full-Stack Employee Management System

This project consists of a backend built with **Node.js** (Express) and a frontend developed using **React**. The system allows you to manage employee data, including adding, updating, and displaying employee details.

## Table of Contents
1. [Backend Setup](#backend-setup)
2. [Frontend Setup](#frontend-setup)
3. [Running the Application](#running-the-application)
4. [Technologies Used](#technologies-used)
5. [License](#license)

## Backend Setup

The backend is built using **Node.js** and **Express**. It handles the API requests for managing employee data.

### Prerequisites:
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Steps to run the backend:
1. Clone the repository:

   git clone http://github.com/CDo101463447/COMP3133/new/master/101463447_comp3133_assignment2
   cd employee-management/backend

2. Install dependencies:

  npm install

3. Create a .env file in the root of the backend directory with the following content (replace with your actual values):

  DATABASE_URL=your_database_url
  PORT=4000

4. Start the backend server:
  node server.js

  This will show you messenge
  🚀 Server running at http://localhost:4000/graphql
  ✅ MongoDB Atlas Connected
  
### Steps to run the frontend:

1. Navigate to the frontend directory:
   cd frontend

2. Install dependencies:
   npm install

3. Set up Apollo Client for Angular. Install the required Apollo packages for Angular:
   npm install apollo-angular apollo-angular-link-http graphql graphql-tag

4. In your Angular project, set up Apollo Client to interact with your GraphQL API by creating an Apollo module in app.congif.ts
  import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
  import { provideRouter, RouterModule } from '@angular/router';  // Ensure RouterModule is imported
  import { routes } from './app.routes';  // Your routes configuration
  import { provideHttpClient } from '@angular/common/http';
  import { provideApollo } from 'apollo-angular';
  import { HttpLink } from 'apollo-angular/http';
  import { InMemoryCache } from '@apollo/client/core';
  import { GraphQLModule } from './graphql.module';  // Import your GraphQL module
  
  export const appConfig: ApplicationConfig = {
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),  // Adding routing configuration
      RouterModule,  // Ensure RouterModule is provided
      provideHttpClient(),  // Providing the HTTP client
      provideApollo(() => {
        const httpLink = inject(HttpLink);  // Injecting HttpLink for Apollo Client
        return {
          link: httpLink.create({
            uri: 'http://localhost:4000/graphql',  // Your Apollo GraphQL endpoint
          }),
          cache: new InMemoryCache(),
        };
      }),
      GraphQLModule,
    ],
  };

5. Ensure that you inject Apollo into your Angular components and use GraphQL queries and mutations via Apollo Angular.

6. Start the frontend server:
   ng serve
   This will start the frontend on http://localhost:4200.

Running the Application
Backend: Open http://localhost:4000/graphql to access the GraphQL API playground or use tools like GraphiQL or Apollo Studio to test queries and mutations.

Frontend: Open http://localhost:4200 to interact with the Angular application.

Make sure both the backend and frontend are running simultaneously for the application to work properly.

Technologies Used
  Backend: Node.js, Express, GraphQL, Apollo Server, MongoDB
  Frontend: Angular, Apollo Client for Angular, GraphQL
  Styling: CSS (optional frameworks like Bootstrap or Tailwind CSS can be used)

License
This project is licensed under the MIT License


   


