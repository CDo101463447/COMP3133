import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { gql } from 'graphql-tag';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  standalone: true
})

export class EmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  updateEmployeeForm!: FormGroup; // New form for updating employee
  employees: any[] = [];
  errorMessage: string | null = null;

  showAddEmployeeForm = false;
  showUpdateEmployeeForm = false; // Flag to control update form visibility
  selectedEmployee: any = null;
  showModal = false;
  isLoggedIn = false;

  constructor(
    private apollo: Apollo,
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();

    if (!this.isLoggedIn) {
      this.activatedRoute.queryParams.subscribe(params => {
        this.errorMessage = params['message'] || 'You need to log in first!';
      });
      this.router.navigate(['/login']);
    } else {
      // Initialize form groups
      this.employeeForm = this.fb.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
        designation: ['', Validators.required],
        salary: ['', [Validators.required, Validators.min(0)]],
        date_of_joining: ['', Validators.required], // New field for date of joining
        department: ['', Validators.required],
        employee_photo: ['']
      });

      this.updateEmployeeForm = this.fb.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
        designation: ['', Validators.required],
        salary: ['', [Validators.required, Validators.min(0)]],
        date_of_joining: ['', Validators.required],
        department: ['', Validators.required],
        employee_photo: ['']
      });
      

      this.getEmployees();
    }
  }

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
              date_of_joining
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
        }
      });
  }

  // Toggle Add Employee Form
  toggleAddEmployeeForm() {
    this.showAddEmployeeForm = !this.showAddEmployeeForm;
    this.showUpdateEmployeeForm = false; // Hide update form when showing add form
  }

  // Add new employee
  onAddEmployee() {
    if (this.employeeForm.invalid) return;

    const { first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo } = this.employeeForm.value;

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
            date_of_joining,  // Include date_of_joining in mutation
            department,
            employee_photo
          }
        }
      })
      .subscribe({
        next: (res: any) => {
          this.getEmployees();
          this.showAddEmployeeForm = false;
        },
        error: (err) => {
          this.errorMessage = err?.message || 'An unknown error occurred!';
        }
      });
  }

  // Edit employee details, show update form
  onEditEmployee(employee: any) {
    this.selectedEmployee = { ...employee };  // Store the employee's data to `selectedEmployee`
    // Patch the form with the employee data
    this.updateEmployeeForm.patchValue({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      gender: employee.gender,
      designation: employee.designation,
      salary: employee.salary,
      department: employee.department,
      employee_photo: employee.employee_photo,
      date_of_joining: employee.date_of_joining
    });
  
    // Show the update form and hide the add form
    this.showAddEmployeeForm = false;
    this.showUpdateEmployeeForm = true;
  }
  

  // Update employee details
  onUpdateEmployee() {
    if (this.updateEmployeeForm.invalid) return;
  
    const {
      updated_first_name,
      updated_last_name,
      updated_email,
      updated_gender,
      updated_designation,
      updated_salary,
      updated_date_of_joining,
      updated_department,
      updated_employee_photo,
    } = this.updateEmployeeForm.value;
  
    this.apollo
      .mutate({
        mutation: gql`
          mutation UpdateEmployee($eid: ID!, $input: EmployeeInput!) {
            updateEmployee(eid: $eid, input: $input) {
              _id
              first_name
              last_name
              email
              gender
              designation
              salary
              date_of_joining
              department
              employee_photo
              updated_at
            }
          }
        `,
        variables: {
          eid: this.selectedEmployee._id,
          input: {
            first_name: updated_first_name,
            last_name: updated_last_name,
            email: updated_email,
            gender: updated_gender,
            designation: updated_designation,
            salary: updated_salary,
            date_of_joining: updated_date_of_joining,
            department: updated_department,
            employee_photo: updated_employee_photo,
          }
        }
      })
      .subscribe({
        next: (res: any) => {
          this.getEmployees(); // Refresh the employee list
          this.showUpdateEmployeeForm = false; // Hide the form
          this.selectedEmployee = null; // Deselect the employee
        },
        error: (err) => {
          this.errorMessage = err?.message || 'An unknown error occurred!';
        }
      });
  }
  

  // Cancel editing and hide the update form
  cancelEditEmployee() {
    this.selectedEmployee = null;
    this.updateEmployeeForm.reset();
    this.showUpdateEmployeeForm = false; // Hide update form
  }

  // View employee details
  onViewEmployee(employee: any) {
    this.selectedEmployee = employee;
    this.showModal = true;
  }

  // Close modal
  closeModal() {
    this.selectedEmployee = null;
    this.showModal = false;
  }

  // Delete employee
  onDeleteEmployee(employeeId: string) {
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
          variables: { eid: employeeId }
        })
        .subscribe({
          next: (res: any) => {
            if (res.data.deleteEmployee.success) {
              this.getEmployees(); // Refresh the list
            } else {
              this.errorMessage = res.data.deleteEmployee.message;
            }
          },
          error: (err) => {
            this.errorMessage = err?.message || 'An unknown error occurred!';
          }
        });
    }
  }
  

  // Logout method
  onLogout(): void {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
