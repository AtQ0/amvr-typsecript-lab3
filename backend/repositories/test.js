const db = require('../utils');

const getTest = async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM app_user');
    return res.status(200).json(users.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error fetching data');
  }
};

module.exports = getTest;
