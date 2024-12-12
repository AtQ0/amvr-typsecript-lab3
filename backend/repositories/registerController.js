const bcrypt = require('bcrypt');
const db = require('../utils');  // Database utility for querying

// Function to create a new user with email and password
exports.createNewUser = async (req, res) => {
    const { email_address, password } = req.body;

    if (!email_address || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
    }

    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds set to 10

        // Insert the new user into the app_user table
        const result = await db.query(`
            INSERT INTO app_user (email_address, password, created_at, modified_at, gdpr)
            VALUES ($1, $2, NOW(), NOW(), false)
            RETURNING id, email_address, created_at, modified_at, gdpr;
        `, [email_address, hashedPassword]);

        // Return the newly created user
        return res.status(201).json({
            message: 'User successfully created',
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating new user' });
    }
};

// Function to get a user by ID (used for verification)
exports.getUserById = async (req, res) => {
    const { id } = req.params; // Extract user ID from the route parameter

    try {
        const result = await db.query(`
            SELECT id, email_address, created_at, modified_at
            FROM app_user
            WHERE id = $1;
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'User found',
            user: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching user' });
    }
};
