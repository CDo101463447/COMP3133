import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { gql } from 'graphql-tag';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-employee',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  standalone: true
})

export class EmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  employees: any[] = [];
  errorMessage: string | null = null;

  showAddEmployeeForm = false;
  selectedEmployee: any = null;
  showModal = false;
  isLoggedIn = false;  // Flag to check if user is logged in

  constructor(
    private apollo: Apollo,
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService // Change from private to public
  ) {}

  ngOnInit(): void {
    // Check if user is authenticated
    this.isLoggedIn = this.authService.isAuthenticated(); 
    
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);  // Redirect to login page if not logged in
    } else {
      // Initialize form and fetch employees if authenticated
      this.employeeForm = this.fb.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
        designation: ['', Validators.required],
        salary: ['', [Validators.required, Validators.min(0)]],
        department: ['', Validators.required],
        employee_photo: ['']
      });

      this.getEmployees(); // Fetch employees after authentication check
    }
  }

  // Fetch employees
  getEmployees() {
    this.apollo
      .watchQuery({
        query: gql`
          query {
            getEmployees {
              _id
              first_name
              last_name
              email
              gender
              designation
              salary
              department
              employee_photo
            }
          }
        `
      })
      .valueChanges.subscribe({
        next: (result: any) => {
          this.employees = result.data.getEmployees;
        },
        error: (err) => {
          this.errorMessage = err?.message || 'An unknown error occurred!';
          console.error('Error fetching employees:', err);
        }
      });
  }

  // Add new employee
  onAddEmployee() {
    if (this.employeeForm.invalid) return;

    const { first_name, last_name, email, gender, designation, salary, department, employee_photo } = this.employeeForm.value;

    this.apollo
      .mutate({
        mutation: gql`
          mutation AddEmployee($input: EmployeeInput!) {
            addEmployee(input: $input) {
              first_name
              last_name
              email
              gender
              designation
              salary
              date_of_joining
              department
              employee_photo
              created_at
              updated_at
            }
          }
        `,
        variables: {
          input: {
            first_name,
            last_name,
            email,
            gender,
            designation,
            salary,
            department,
            employee_photo
          }
        }
      })
      .subscribe({
        next: (res: any) => {
          console.log('Employee added successfully', res);
          this.getEmployees(); // Refresh the list of employees
          this.showAddEmployeeForm = false; // Hide the form after successful add
        },
        error: (err) => {
          this.errorMessage = err?.message || 'An unknown error occurred!';
          console.error('Error during employee addition:', err);
        }
      });
  }

  // Edit employee details
  onEditEmployee(employee: any) {
    this.selectedEmployee = { ...employee };
    this.showModal = true;
  }

  // Delete employee
  onDeleteEmployee(eid: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.apollo
        .mutate({
          mutation: gql`
            mutation DeleteEmployee($eid: ID!) {
              deleteEmployee(eid: $eid) {
                message
                success
              }
            }
          `,
          variables: { eid }
        })
        .subscribe({
          next: (res: any) => {
            console.log(res.data.deleteEmployee.message);
            this.getEmployees(); // Refresh employees list
          },
          error: (err) => {
            this.errorMessage = err?.message || 'An unknown error occurred!';
            console.error('Error during employee deletion:', err);
          }
        });
    }
  }

  // View employee details
  onViewEmployee(employee: any) {
    this.selectedEmployee = employee;
    this.showModal = true;
  }

  // Close modal
  closeModal() {
    this.showModal = false;
    this.selectedEmployee = null;
  }

  // Toggle add employee form
  toggleAddEmployeeForm() {
    this.showAddEmployeeForm = !this.showAddEmployeeForm;
  }
}

