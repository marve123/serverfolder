const db = require('../db')
const bcrypt = require("bcryptjs")



exports.updateFirstname = async(req, res) => {
    try {
        const { first_name, user_id } =  req.body;
        
        await db.query(
            "UPDATE users SET first_name = ? WHERE user_id = ?",
            [first_name, user_id]
        );

        return res.status(201).json({
            success: true,
            message: 'First name updated!'
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message
        })  
    }
} 
exports.updateLastname = async(req, res) => {
    try {
        const { last_name, user_id } =  req.body;
        
        await db.query(
            "UPDATE users SET last_name = ? WHERE user_id = ?",
            [last_name, user_id]
        );

        return res.status(201).json({
            success: true,
            message: 'Last name updated!'
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message
        })
    }
}

exports.updateEmail = async(req, res) => {
    try {
        const { email, user_id } =  req.body;
        
        await db.query(
            "UPDATE users SET email = ?, referral_code = ? WHERE user_id = ?",
            [email, email, user_id]
        );

        return res.status(201).json({
            success: true,
            message: 'Email updated!'
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message
        })
    }
}

exports.updateAccountInfo = async(req, res) => {
    try {
        const { account_num, account_name, bank_name, user_id } =  req.body;

        if (account_num.length < 10 || account_num.length > 11) {
            throw new Error('Invalid Account number');
        }
        
        await db.query(
            "UPDATE users SET account_num = ?, account_name = ?, bank_name = ? WHERE user_id = ?",
            [account_num, account_name, bank_name, user_id]
        );

        return res.status(201).json({
            success: true,
            message: 'Account Information Updated!'
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message
        })
    }
} 

exports.updateSubAccCode = async(req, res) => {
    try {
        const { subacc_code, user_id } =  req.body;
        
        await db.query(
            "UPDATE users SET subacc_code = ? WHERE user_id = ?",
            [subacc_code, user_id]
        );

        return res.status(201).json({
            success: true,
            message: 'SubAccount updated!'
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message
        })  
    }
} 
 
exports.updateTotal = async(req, res) => {
    try {
        const { totalSum, userId } =  req.body;
        // console.log(totalSum)
        
         await db.query(
            "UPDATE users SET total_withdrawn = ? WHERE user_id = ?",
            [totalSum, userId]   
        );

        const response = await db.query(
            "SELECT total_withdrawn FROM users WHERE user_id = ?",
            [userId]   
        );
  
        return res.status(201).json({
            success: true,
            total: response.rows[0].total_withdrawn,
        }) 
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message
        })  
    }
} 


exports.changePassword = async(req, res) => {
    try {
        const { user_password, new_password, user_id } =  req.body;
        const user = await db.query('SELECT * FROM users WHERE user_id = ?', [user_id]);

        const validPassword = await bcrypt.compare(user_password, user.rows[0].user_password);

        if (!validPassword) {
            throw new Error('Wrong password');
          }

          if (new_password.length < 6) {
            throw new Error('Create stronger password');
        }

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const password = await bcrypt.hash(new_password, salt);
        
        await db.query(
            "UPDATE users SET user_password = ? WHERE user_id = ?",
            [password, user_id]
        );
        return res.status(201).json({
            success: true,
            message: 'Password changed!'
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message
        })
    }
}


exports.updateProfile = async (req, res) => {
    try {
        const {profile_image, user_id} = req.body;

        await db.query(
            "UPDATE users SET profile_image = ? WHERE user_id = ?",
            [profile_image, user_id]
        );
 
        return res.status(201).json({
            success: true,
            message: 'Profile Picture Updated!'
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message
        });
    }
};


exports.updateActivity = async (req, res) => {
    try {     
        const { user_id, amount } = req.body;
 
        // Retrieve the current activity points from the database
        const result = await db.query("SELECT activity_points FROM users WHERE user_id = ?", 
        [user_id]);
        const currentActivityPoints = result.rows[0].activity_points;

        // Calculate the new activity points by adding 300
        const newActivityPoints = currentActivityPoints + amount;

        // Update the database with the new activity points 
        await db.query("UPDATE users SET activity_points = ? WHERE user_id = ?", 
        [newActivityPoints, user_id]);
        let message;
        if (amount === 300) {
            message = 'Daily Login reward Granted'
        } else if (amount === 500) {
            message = '+500 for reading sponsoredpost'
        }
        else if (amount === 30) {
            message = '+30 for commenting on post'
        }

        return res.status(201).json({
            success: true,
            message: message,
            newActivityPoints: newActivityPoints // Optionally return the new value 
        });
    } catch (error) {
        console.log(error.message); 
        return res.status(500).json({
            error: error.message
        });
    }
};


