const db = require('../db');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { ADMIN_EMAIL, ADMIN_PASSWORD } = require("../constants")

exports.register = async (req, res) => {


    try {
        let { first_name, last_name, email, user_name, tel, user_password, referral_code } = req.body;
        let is_admin = false 
        if(email === ADMIN_EMAIL && user_password === ADMIN_PASSWORD){
            is_admin = true
         }

        // Make a GET request to get the referrerId
        const getRefIdURL = 'https://morrnaira-server.onrender.com/api/getref-id'; 
        const response = await axios.get(getRefIdURL, { params: { referral_code } });
        let referrerId = response.data.referrerId;
        // const referrerId = "ADMIN";
        

            // Hash the user's password
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            const password = await bcrypt.hash(user_password, salt); 

            // Insert the new user into the database
            const newUser = await db.query(
                "INSERT INTO users (first_name, last_name, email, user_name, tel, user_password, referral_code, referrer_id, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
                [first_name, last_name, email, user_name, tel, password, user_name, referrerId, is_admin]
            );

            // Check the referrer's generation and insert into the referral table if needed
            const referrer = await db.query(
                "SELECT generation FROM referrals WHERE user_name = $1",
                [referrerId]
            );

            const referrerGeneration = referrer.rows.length > 0 ? referrer.rows[0].generation : 0;

            if (referrerGeneration <= 3) { // Change 3 to the desired generation limit
                await db.query(
                    "INSERT INTO referrals (user_name, referrer, generation) VALUES ($1, $2, $3) RETURNING *",
                    [user_name, referrerId, referrerGeneration + 1]
                );
            } else {
                // Handle the case where the generation limit is reached (e.g., display a message or log it)
                console.log('Generation limit reached.');
            }

           
              

             return res.status(201).json({
                success: true,
                message: 'Registration Successful!',
                newUser: newUser.rows[0],
                // auth_url: auth_url,
                // reference: reference
            });
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message,
        });
    }
};
