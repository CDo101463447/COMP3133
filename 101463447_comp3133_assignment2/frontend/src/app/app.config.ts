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
