import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';  // Assuming you have AuthService for token management

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  errorMessage: string | null = null; // To display backend error messages

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router,
    private authService: AuthService // AuthService to store the token if needed
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSignup() {
    if (this.signupForm.invalid) return;
  
    const { username, email, password } = this.signupForm.value;
  
    this.apollo.mutate({
      mutation: gql`
        mutation Signup($username: String!, $email: String!, $password: String!) {
          signup(username: $username, email: $email, password: $password) {
            username
            email
            created_at
            updated_at
          }
        }
      `,
      variables: { username, email, password }
    }).subscribe({
      next: (res: any) => {
        console.log('Signup successful', res); // Check the response
        const { username, email } = res.data.signup;
        alert(`Signup successful! Welcome, ${username}.`);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err?.message || 'An unknown error occurred!';
        console.error('Error during signup:', err);
      }
    });
  }
  

  // To get validation errors in the template
  get username() {
    return this.signupForm.get('username');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }
}
