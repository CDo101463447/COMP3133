import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;  // To display backend error messages

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) return;
  
    const { email, password } = this.loginForm.value;
  
    // Using a query for login (since your backend is set up for that)
    this.apollo.query({
      query: gql`
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
            user {
              username
              email
            }
          }
        }
      `,
      variables: { email, password },
      fetchPolicy: 'no-cache'  // Make sure it's using the fresh data
    }).subscribe({
      next: (res: any) => {
        if (res.data && res.data.login) {
          const { token } = res.data.login;
          this.authService.setToken(token);
          this.router.navigate(['/employee']);
        }
      },
      error: (err) => {
        console.error('Login Error:', err);
        this.errorMessage = err?.message || 'Login failed. Please check your credentials.';
      }
    });
  }
  

  // Form controls for validation feedback
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
