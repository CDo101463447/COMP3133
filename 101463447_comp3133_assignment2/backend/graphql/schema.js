const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        username: String!
        email: String!
        created_at: String
        updated_at: String
    }

    type Employee {
        _id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employee_photo: String
        created_at: String
        updated_at: String
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type EmployeeDeleteResponse {
        message: String!
        success: Boolean!
    }

    type Query {
        login(email: String!, password: String!): AuthPayload
        getEmployees: [Employee]
        searchEmployeeById(eid: ID!): Employee
        searchEmployeesByDesignationOrDept(designation: String, department: String): [Employee]
    }

    type Mutation {
        signup(username: String!, email: String!, password: String!): User
        addEmployee(input: EmployeeInput!): Employee
        updateEmployee(eid: ID!, input: EmployeeInput!): Employee
        deleteEmployee(eid: ID!): EmployeeDeleteResponse
    }

    input EmployeeInput {
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employee_photo: String
    }
`;

module.exports = typeDefs;
