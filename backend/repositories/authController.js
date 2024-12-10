const db = require('../utils'); // Database utility
const bcrypt = require('bcrypt');


// Authentication logic to check user credentials
exports.checkAuth = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await db.query(`
            SELECT * FROM app_user WHERE email_address = $1;
        `, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = userResult.rows[0];
        const isHashedPassword = user.password.startsWith('$2');
        if (!isHashedPassword) {
            return res.status(500).json({ message: 'Server error: Unhashed password detected' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            return res.status(200).json({
                message: `${user.id}`,
                success: true,
                uuid: user.uuid  // Ensure this field is included in the response
            });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Error during authentication:", error);
        return res.status(500).json({ message: 'An error occurred while authenticating' });
    }
};
