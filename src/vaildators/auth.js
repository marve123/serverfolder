const { check } = require('express-validator')
const db = require('../db')
const { compare } = require('bcryptjs')
// const { ADMIN_EMAIL, ADMIN_PASSWORD } = require('../constants')

//password
const user_password = check('user_password')
  .isLength({ min: 6, max: 15 })
  .withMessage('Password has to be between 6 and 15 characters.')

//email
const email = check('email')
  .isEmail()
  .withMessage('Please provide a valid email.')

//check if email exists
const emailExists = check('email').custom(async (value) => {
  const { rows } = await db.query('SELECT * from users WHERE email = ?', [
    value,
  ])

  if (rows.length) {
    throw new Error('Email already exists.')
  }
})

//check if username exists
const userNameExists = check('user_name').custom(async (value) => {
  const { rows } = await db.query('SELECT * from users WHERE user_name = ?', [
    value,
  ])

  if (rows.length) {
    throw new Error('Username already exists.')
  }
})

// check if username has special characters 
const usernameContainsSpecialCharacters = check('user_name').custom((value) => {
  // Define a regular expression pattern to match special characters.
  const specialCharactersPattern = /[^a-zA-Z0-9_]/; // Change this pattern as needed.

  // Use the test() method to check if the username contains special characters.
  if (specialCharactersPattern.test(value)) {
    throw new Error('Username contains special characters.');
  }
});




//login validation
const loginFieldsCheck = check('email').custom(async (value, { req }) => {
  try {
    // if(req.body.email === ADMIN_EMAIL && req.body.user_password === ADMIN_PASSWORD) {
    //   req.is_admin = true;
    //   return; 
    // }

    const user = await db.query('SELECT * FROM users WHERE email = ?', [value]);

    if (!user.rows.length) {
      throw new Error('Email does not exist.');
    }


    const validPassword = await compare(req.body.user_password, user.rows[0].user_password);

    if (!validPassword) {
      throw new Error('Wrong password');
    }
    
    req.user = user.rows[0];
  } catch (error) {
    console.error('Login Validation Error:', error.message);
    throw error; // Rethrow the error to be handled by your error handling middleware.
  }
}); 

module.exports = {
  registerValidation: [email, emailExists, userNameExists, usernameContainsSpecialCharacters, user_password ],
  loginValidation: [loginFieldsCheck],
  updateValidation: [email, emailExists]
}

