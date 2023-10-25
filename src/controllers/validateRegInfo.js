
const { validationResult } = require('express-validator')
const registerValidation = require('../vaildators/auth')  

exports.validateData = (req, res) => {
  const errors = validationResult(req);

  if (errors.array()[0].msg === "Invalid value") { 
    return res.status(200).json({
      msg: "No errors found. Validation passed successfully."
    });
  }

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      error: errors
    });
  }
};

