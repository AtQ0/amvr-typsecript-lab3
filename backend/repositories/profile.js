const db = require('../utils');

exports.getProfile = async (req, res) => {
  const { id } = req.query;
  try {
    const users = await db.query('SELECT * FROM app_user WHERE id = $1', [id]);
    console.log(users.rows);
    return res.status(200).json(users.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error fetching data');
  }
};

exports.editProfile = async (req, res) => {
  const {
    role,
    firstName,
    lastName,
    emailAddress,
    password,
    dateOfBirth,
    address,
    id,
    gdpr,
  } = req.body;

  // Optional: Hash password if it's provided
  let hashedPassword = password;
  if (password) {
    const bcrypt = require('bcrypt');
    hashedPassword = await bcrypt.hash(password, 10);
  }

  try {
    const text = `
      UPDATE app_user AS au
      SET
        role = $1,
        first_name = $2,
        last_name = $3,
        email_address = $4,
        password = $5,
        date_of_birth = $6,
        address = $7,
        gdpr = $8
      WHERE
        au.id = $9
    `;
    const values = [
      role,
      firstName,
      lastName,
      emailAddress,
      hashedPassword,
      dateOfBirth,
      address,
      gdpr,
      id,
    ];
    const result = await db.query(text, values);
    console.log('Profile updated:', result);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).send('Error updating data');
  }
};

// Delete a user
exports.deleteProfile = async (req, res) => {
  const { id } = req.body; // Receiving ID in the request body
  try {
    const result = await db.query(
      'DELETE from app_user WHERE app_user.id = $1',
      [id]
    );
    console.log('User deleted:', id);
    return res
      .status(200)
      .json({ message: `User ${id} deleted successfully.` });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error deleting data');
  }
};

// Get User Address
exports.getUserAddress = async (req, res) => {
  const { id } = req.params;
  try {
    const address = await db.query(
      `SELECT app_user.id as uid, address.country, address.city, address.street,address.street_number, address.postal_code FROM app_user
              INNER JOIN address ON app_user.address = address.id
        WHERE app_user.id = $1`,
      [id]
    );
    return res.status(200).json(address.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error fetching data');
  }
};

exports.addUserAddress = async (req, res) => {
  const { id } = req.params;
  const { country, city, street, streetNumber, postalCode } = req.body;

  try {
    // Insert the new address into the address table
    const addressResult = await db.query(
      `INSERT INTO address (country, city, street, street_number, postal_code)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [country, city, street, streetNumber, postalCode]
    );

    const addressId = addressResult.rows[0].id;

    // Update the user record with the new address ID
    await db.query(`UPDATE app_user SET address = $1 WHERE id = $2`, [
      addressId,
      id,
    ]);

    // Fetch and return the updated user address information
    const updatedAddress = await db.query(
      `SELECT app_user.id as uid, address.country, address.city, address.street, address.street_number, address.postal_code
       FROM app_user
       INNER JOIN address ON app_user.address = address.id
       WHERE app_user.id = $1`,
      [id]
    );

    return res.status(200).json(updatedAddress.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error adding address');
  }
};
