const db = require('../utils');

// Existing functions are kept intact, with the new function added below.

exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.query(
      `
      SELECT
        app_user.id,
        app_user.role,
        app_user.first_name,
        app_user.last_name,
        app_user.email_address,
        app_user.date_of_birth
        FROM app_user
        WHERE app_user.id = $1
      `,
      [id]
    );
    return res.status(200).json(user.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error fetching data');
  }
};

exports.getUserAddress = async (req, res) => {
  const { id } = req.params;
  try {
    const address = await db.query(
      `SELECT app_user.id as uid, address.country, address.city, address.street,
              address.street_number, address.postal_code FROM app_user
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

exports.modifyUser = async (req, res) => {
  const { id } = req.params;
  const { role, firstName, lastName, emailAddress, dateOfBirth } = req.body;
  try {
    const text = `
      UPDATE app_user
        SET
        role = $1,
        first_name = $2,
        last_name = $3,
        email_address = $4,
        date_of_birth = $5
          WHERE
        app_user.id = $6
        `;
    const values = [role, firstName, lastName, emailAddress, dateOfBirth, id];
    const result = await db.query(text, values);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error fetching data');
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE from app_user WHERE app_user.id = $1',
      [id]
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error fetching data');
  }
};

const getUsersWithCursor = async (limit, lastCreatedAt = null) => {
  let text;
  let values;
  if (lastCreatedAt) {
    text = `
  SELECT app_user.id, app_user.role, app_user.first_name, app_user.last_name,
       app_user.email_address, app_user.password, app_user.date_of_birth,
       app_user.address, app_user.created_at
  FROM app_user LEFT JOIN address ON app_user.address = address.id
  WHERE app_user.created_at < $1
  ORDER BY app_user.created_at DESC
  LIMIT $2;
  `;
    values = [lastCreatedAt, limit];
  } else {
    text = `
  SELECT app_user.id, app_user.role, app_user.first_name, app_user.last_name,
       app_user.email_address, app_user.password, app_user.date_of_birth,
       app_user.address, app_user.created_at
  FROM app_user LEFT JOIN address ON app_user.address = address.id
  ORDER BY app_user.created_at DESC LIMIT $1 OFFSET 0;
  `;
    values = [limit];
  }
  const result = await db.query(text, values);
  return result.rows;
};

exports.getUsers = async (req, res) => {
  const { createdAt } = req.query;
  const cursorCreatedAt = createdAt ? createdAt : null;

  const users = await getUsersWithCursor(5, cursorCreatedAt);

  let nextCursorCreatedAt = null;
  if (users.length > 0) {
    nextCursorCreatedAt = users[users.length - 1].created_at;
  }

  res.json([
    {
      users,
      nextCursor: { createdAt: nextCursorCreatedAt },
    },
  ]);
};

// New function to fetch a user by email
exports.getUserByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const result = await db.query('SELECT * FROM app_user WHERE email_address = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(result.rows[0]); // Return the user object
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
};
