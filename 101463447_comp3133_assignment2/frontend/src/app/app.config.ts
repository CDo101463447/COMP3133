import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';  // Ensure RouterModule is imported
import { routes } from './app.routes';  
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),  // Adding routing configuration
    RouterModule,  // Provide RouterModule explicitly
    provideHttpClient(),  // Providing the HTTP client
    provideApollo(() => {
      const httpLink = inject(HttpLink);  // Injecting HttpLink for Apollo Client
      return {
        link: httpLink.create({
          uri: '<%= endpoint %>',  // Replace with your Apollo GraphQL endpoint
        }),
        cache: new InMemoryCache(),
      };
    })
  ]
};
