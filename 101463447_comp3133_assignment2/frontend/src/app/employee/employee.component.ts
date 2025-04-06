import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  updateEmployeeForm!: FormGroup;
  searchForm!: FormGroup;  // New form for search
  employees: any[] = [];
  filteredEmployees: any[] = [];  // Holds filtered employees
  errorMessage: string | null = null;

  showAddEmployeeForm: boolean = false;
  showUpdateEmployeeForm = false;
  selectedEmployee: any = null;
  showModal = false;
  isLoggedIn = false;

  constructor(
    private apollo: Apollo,
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef  // Inject ChangeDetectorRef
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
        date_of_joining: ['', Validators.required],
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

      this.searchForm = this.fb.group({
        department: [''],
        designation: ['']
      });

      this.getEmployees(); // Fetch employees on init
    }
  }

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
          this.filteredEmployees = this.employees; // Initialize with all employees
        },
        error: (err) => {
          this.errorMessage = err?.message || 'An unknown error occurred!';
        }
      });
  }

  // Search for employees based on department and designation
  onSearch() {
    const { department, designation } = this.searchForm.value;

    // Filter employees based on search criteria
    this.filteredEmployees = this.employees.filter(employee => {
      return (
        (department ? employee.department.toLowerCase().includes(department.toLowerCase()) : true) &&
        (designation ? employee.designation.toLowerCase().includes(designation.toLowerCase()) : true)
      );
    });

    // Manually trigger change detection to update the UI
    this.cdRef.detectChanges();
  }

  toggleAddEmployeeForm() {
    this.showAddEmployeeForm = !this.showAddEmployeeForm;
    this.showUpdateEmployeeForm = false;
  }

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

    const formattedDate = this.formatDate(date_of_joining);

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
            date_of_joining: formattedDate,
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

  onEditEmployee(employee: any) {
    console.log('Edit clicked:', employee);

    this.selectedEmployee = { ...employee };

    let formattedDate = '';
    const date = new Date(parseInt(employee.date_of_joining, 10));

    if (!isNaN(date.getTime())) {
      formattedDate = date.toISOString().split('T')[0];
    } else {
      console.warn('Invalid date_of_joining:', employee.date_of_joining);
      formattedDate = '';
    }

    this.updateEmployeeForm.patchValue({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      gender: employee.gender,
      designation: employee.designation,
      salary: employee.salary,
      department: employee.department,
      employee_photo: employee.employee_photo,
      date_of_joining: formattedDate
    });

    this.showAddEmployeeForm = false;
    this.showUpdateEmployeeForm = true;
  }

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
          this.showModal = true;
        },
        error: (err) => {
          this.errorMessage = err?.message || 'An unknown error occurred!';
        }
      });
  }

  cancelEditEmployee() {
    this.selectedEmployee = null;
    this.updateEmployeeForm.reset();
    this.showUpdateEmployeeForm = false;
  }

  onViewEmployee(employee: any) {
    this.selectedEmployee = employee;
    this.showModal = true;
  }

  closeModal() {
    this.selectedEmployee = null;
    this.showModal = false;
  }

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
          refetchQueries: [{ query: gql`query { getEmployees { _id first_name last_name email gender designation salary date_of_joining department employee_photo } }` }]
        })
        .subscribe({
          next: (res: any) => {
            if (res.data.deleteEmployee.success) {
              this.getEmployees();
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

  onClearSearch() {
    this.searchForm.reset();
    this.getEmployees(); // Adjust this method to fetch the full list of employees without the search filters
  }

  onLogout(): void {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
