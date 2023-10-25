const db = require('../db');

exports.getUser = async (req, res) => {
    const { user_id } = req.params;
    try {
        const selectUser = await db.query(
            `SELECT profile_image, first_name, last_name, email, user_name, tel, 
            account_num, account_name, bank_name, activity_points, referral_earnings, 
            total_earnings, total_withdrawn, referral_code, referrer_id, subacc_code, rank 
            FROM users WHERE user_id = $1`,
            [user_id]
        );
         
        // Check if a user was found in the database
        if (selectUser.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const user = selectUser.rows[0];
        res.status(200).json({
            success: true,
            user: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.response.data.message,
        });
    }
}
