const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const Employee = require('../models/Employee');

const resolvers = {
    Query: {
        // Login query to authenticate a user
        login: async (_, { email, password }) => {
            // Find the user by email
            const user = await User.findOne({ email });
            if (!user) throw new Error("User not found");

            // Compare the provided password with the stored hashed password
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) throw new Error("Invalid credentials");

            // Create a JWT token for the user
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return { token, user };
        },

        // Query to get all employees
        getEmployees: async () => await Employee.find(),

        // Query to search an employee by their ID
        searchEmployeeById: async (_, { eid }) => await Employee.findById(eid),

        // Query to search employees by designation or department
        searchEmployeesByDesignationOrDept: async (_, { designation, department }) => {
            let query = {};
            if (designation) query.designation = designation;
            if (department) query.department = department;
            return await Employee.find(query);
        }
    },

    Mutation: {
        // Mutation to sign up a new user
        signup: async (_, { username, email, password }) => {
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) throw new Error("User already exists");

            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user and save it to the database
            const user = new User({
                username,
                email,
                password: hashedPassword,
                created_at: Date.now(), // Automatically sets the created_at timestamp
                updated_at: Date.now()  // Automatically sets the updated_at timestamp
            });
            return await user.save();
        },

        // Mutation to add a new employee
        addEmployee: async (_, { input }) => {
            const employee = new Employee({
                ...input,
                created_at: Date.now(), // Automatically sets the created_at timestamp
                updated_at: Date.now()  // Automatically sets the updated_at timestamp
            });
            return await employee.save();
        },

        // Mutation to update an employee by ID
        updateEmployee: async (_, { eid, input }) => {
            const updatedEmployee = await Employee.findByIdAndUpdate(
                eid,
                { ...input, updated_at: Date.now() }, // Update updated_at timestamp
                { new: true } // Return the updated document
            );
            return updatedEmployee;
        },

        // Mutation to delete an employee by ID
        deleteEmployee: async (_, { eid }) => {
            const employee = await Employee.findByIdAndDelete(eid);
        
            if (!employee) {
                return {
                    message: "Employee not found",
                    success: false,
                };
            }
        
            return {
                message: "Employee deleted successfully",
                success: true,
            };
        }
        
    }
};

module.exports = resolvers;
