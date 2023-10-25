const db = require('../db')

exports.getUsers = async(req, res) => {
    try {
        const rows = await db.query(`SELECT profile_image, first_name, last_name, email, user_name, tel, rank, activity_points,
         referral_earnings, referrals, is_admin, created_at FROM users`)
        return res.status(200).json({
            success: true,
            users: rows.rows,
            amount: rows.length 
        })
    } catch (error) {
        console.log(error.message);
    }
}
