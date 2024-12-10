const bcrypt = require('bcrypt');
const db = require('../utils');  // Database utility for querying

// Create a new user with email and password
exports.createNewUser = async (req, res) => {
    const { email_address, password } = req.body;

    // Simple validation to ensure required fields are provided
    if (!email_address || !password) {
        return res.status(400).json({ message: 'Missing email or password' }); // Return JSON error
    }

    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds set to 10

        // Insert the new user into the app_user table with the hashed password
        const result = await db.query(`
            INSERT INTO app_user (email_address, password, created_at, modified_at, gdpr)
            VALUES ($1, $2, NOW(), NOW(), false)
            RETURNING id, email_address, created_at, modified_at, gdpr;
        `, [email_address, hashedPassword]);

        // Return the newly created user (excluding the password)
        return res.status(201).json({
            message: 'User successfully created',
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating new user' }); // Return JSON error
    }
};
