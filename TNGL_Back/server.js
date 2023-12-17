const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Use cors middleware to enable CORS for all routes

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vaibhav@123', // Replace with your MySQL password
    database: 'tngl_back', // Replace with your database name
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});


// API to create a new customer
app.post('/api/customers', (req, res) => {
    const { name, address, customer_number, meter_serial_number } = req.body;

    const sql = 'INSERT INTO customers (name, address, customer_number, meter_serial_number) VALUES (?, ?, ?, ?)';
    const values = [name, address, customer_number, meter_serial_number];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error creating customer: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Customer created successfully' });
    });
});

// API to update customer details
app.put('/api/customers/:customerId', (req, res) => {
    const customerId = req.params.customerId;
    const { name, address, customer_number, meter_serial_number } = req.body;

    const sql = 'UPDATE customers SET name=?, address=?, customer_number=?, meter_serial_number=? WHERE customer_id=?';
    const values = [name, address, customer_number, meter_serial_number, customerId];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating customer: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Customer updated successfully' });
    });
});

// API to delete a customer
app.delete('/api/customers/:customerId', (req, res) => {
    const customerId = req.params.customerId;

    const sql = 'DELETE FROM customers WHERE customer_id=?';
    const values = [customerId];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error deleting customer: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Customer deleted successfully' });
    });
});


// API to get all customers
app.get('/api/customers', (req, res) => {
    const sql = 'SELECT * FROM customers';

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching customers: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json(results);
    });
});


// API to get a specific customer by ID
app.get('/api/customers/:customerId', (req, res) => {
    const customerId = req.params.customerId;
    const sql = 'SELECT * FROM customers WHERE customer_id = ?';

    connection.query(sql, [customerId], (err, results) => {
        if (err) {
            console.error('Error fetching customer: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Customer not found' });
            return;
        }

        res.json(results[0]);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
