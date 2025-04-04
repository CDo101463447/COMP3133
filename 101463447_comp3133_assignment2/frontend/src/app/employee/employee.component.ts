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

  showAddEmployeeForm: boolean = false;
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
      
      this.getEmployees(); // Fetch employees on init
    }
  }

    // Add the formatDate method here
    formatDate(dateString: string): string {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
      }
      return ''; // Return empty string if the date is invalid
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
// Add new employee
onAddEmployee() {
  if (this.employeeForm.invalid) return;

  const {
    first_name,
    last_name,
    email,
    gender,
    designation,
    salary,
    date_of_joining,
    department,
    employee_photo
  } = this.employeeForm.value;

  const formattedDate = this.formatDate(date_of_joining); // Ensure the date is properly formatted

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
          date_of_joining: formattedDate,  // Use formatted date
          department,
          employee_photo
        }
      },
      refetchQueries: [{ query: gql`query { getEmployees { _id first_name last_name email gender designation salary date_of_joining department employee_photo } }` }]
    })
    .subscribe({
      next: (res: any) => {
        this.showAddEmployeeForm = false;
      },
      error: (err) => {
        this.errorMessage = err?.message || 'An unknown error occurred!';
      }
    });
}
  // Edit employee details, show update form
  onEditEmployee(employee: any) {
    console.log('Edit clicked:', employee);

    // Clone the employee object to prevent modifying the original data
    this.selectedEmployee = { ...employee };

    // Convert the timestamp to a Date object if it's a valid number
    let formattedDate = '';
    const date = new Date(parseInt(employee.date_of_joining, 10));  // Ensure it's a number

    // Check if the date is valid
    if (!isNaN(date.getTime())) {
      formattedDate = date.toISOString().split('T')[0];  // Format the date as yyyy-mm-dd
    } else {
      console.warn('Invalid date_of_joining:', employee.date_of_joining);
      formattedDate = '';  // Set to empty string if invalid
    }


    // Patch the form with employee details, including the correctly formatted date
    this.updateEmployeeForm.patchValue({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      gender: employee.gender,
      designation: employee.designation,
      salary: employee.salary,
      department: employee.department,
      employee_photo: employee.employee_photo,
      date_of_joining: formattedDate  // Will be empty string if invalid
    });

    // Show update form and hide add form
    this.showAddEmployeeForm = false;
    this.showUpdateEmployeeForm = true;
  }
  // Update employee details
  onUpdateEmployee() {
    if (this.updateEmployeeForm.invalid) return;
  
    const {
      first_name,
      last_name,
      email,
      gender,
      designation,
      salary,
      date_of_joining,
      department,
      employee_photo
    } = this.updateEmployeeForm.value;
  
    const formattedDate = this.formatDate(date_of_joining);
  
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
            first_name,
            last_name,
            email,
            gender,
            designation,
            salary,
            date_of_joining: formattedDate,
            department,
            employee_photo
          }
        },
        refetchQueries: [{
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
        }]
      })
      .subscribe({
        next: (res: any) => {
          this.selectedEmployee = res.data.updateEmployee;
          this.updateEmployeeForm.reset();
          this.showUpdateEmployeeForm = false;
          this.showModal = true; // to show updated employee in view
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
        variables: { eid: employeeId },
        refetchQueries: [{ query: gql`query { getEmployees { _id first_name last_name email gender designation salary date_of_joining department employee_photo } }` }] // Refetch employee data after deletion
      })
      .subscribe({
        next: (res: any) => {
          if (res.data.deleteEmployee.success) {
            // Optionally, you can display a success message or show a notification
            this.getEmployees(); // Refresh the list of employees
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
