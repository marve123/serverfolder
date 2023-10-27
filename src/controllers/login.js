const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants");
 

exports.login = async (req, res) => {
  let user = req.user;
  let payload = {
    id: user.user_id, 
    email: user.email,
  }; 

  try {
    // Check if it's an admin login based on the req.isAdmin flag
    // if (req.isAdmin) {
    //   // Handle admin login here, e.g., set up admin-specific behavior
    //   // For example, you can redirect to an admin dashboard or perform admin-related tasks
    //   return res.status(200).json({
    //     success: true,
    //     message: "Admin logged in Successfully",
    //     info: user,
    //     isAdmin: true,
    //   });
    // }

    let is_admin = false;
    if (user.is_admin === true) {
      is_admin = true;
    }

    // For regular user login 
    const token = await sign(payload, SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'Strict',
      secure: true
    });

    return res.status(200).json({
      success: true,
      message: "Daily Login reward Granted!",
      user: user.user_id,
      isAdmin: is_admin,
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
