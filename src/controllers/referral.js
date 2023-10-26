const db = require('../db')
 
// exports.getRefLink = (req, res) => {
//     const user_name = req.params.user_name;
//     const referralLink = `https://morrnaira-server.onrender.com/register/${user_name}`;
//     res.json({ referralLink });
// };
 
exports.getRefId = async (req, res) => {
    const { referral_code } = req.query; // Use req.query to get the query parameter

    try {
        const referrer = await db.query(
            'SELECT user_id, subacc_code FROM users WHERE referral_code = $1',
            [referral_code]
        );
     
        // Check if a user with the referral code exists
        if (referrer.rows.length > 0) {
            const referrerId = referrer.rows[0].user_id; 
            const referrersub = referrer.rows[0].subacc_code; 
            res.json({ referrerId: referrerId, referrersub: referrersub });
        } else {
            // Handle the case where no user with the referral code was found
            // console.log('Default admin referral code used.');
            res.json({ referrerId: "095bd28f-65b2-48e4-bfd9-62790e1e14dc" });
        }
    } catch (error) {
        // Handle any database query errors
        return res.status(500).json({
            error: error.message,
          });
    }
    
}

exports.getReferrals = async (req, res) => {
    const {userId} = req.params

    try {
        const referrals = await db.query(
            `SELECT user_id, profile_image, user_name, first_name, last_name, rank, referrals, created_at 
            FROM users WHERE referrer_id = $1`,
            [userId])

            if(referrals.rows.length > 0) {
                res.status(200).json({
                     referrals: referrals.rows 
                });
            } else {
                // Handle the case where no user with the referral code was found
                res.status(200).json({ referrals: "You have not referred any one" });
            }
        
    } catch (error) {
        // console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
    }
}



exports.getTopReferrals = async (req, res) => {

    try {
        const referrals = await db.query(
            `SELECT user_id, profile_image, user_name, first_name, last_name, rank, referrals, created_at
            FROM users
            ORDER BY referrals DESC
            LIMIT 10`)

            if(referrals.rows.length > 0) {
                res.status(200).json({
                     referrals: referrals.rows 
                });
            } else {
                // Handle the case where no user with the referral code was found
                res.status(200).json({ referrals: "NO USERS YET" });
            }
        
    } catch (error) {
        // console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
    }
}



exports.getReferralsSize = async (req, res) => {
    const {userId} = req.params
    const silver = "Silver"
    const gold = "Gold"

    try {
        const referrals = await db.query(
            `SELECT * FROM users WHERE referrer_id = $1`,
            [userId]) 

            if(referrals.rows.length > 0) {
                const amount = referrals.rows.length
                const refEarnings = amount * 3800
                if(amount >= 200){
                    await db.query(
                        `UPDATE users SET rank = $1 WHERE user_id = $2`,
                        [silver, userId])
                }
                if(amount >= 500){
                    await db.query(
                        `UPDATE users SET rank = $1 WHERE user_id = $2`,
                        [gold, userId])
                }
                await db.query(
                    `UPDATE users SET referrals = $1 WHERE user_id = $2`,
                    [amount, userId])
                await db.query(
                    `UPDATE users SET referral_earnings = $1 WHERE user_id = $2`,
                    [refEarnings, userId])

                const points = await db.query( 
                    `SELECT activity_points FROM users WHERE user_id = $1`,
                    [userId])
                    let activityPoints;
                    if (points.rows.length > 0) {
                        activityPoints = points.rows[0].activity_points;
                      } else {
                        console.log('No user found with the given user ID.');
                      }
                    const total = activityPoints += refEarnings
                await db.query(
                    `UPDATE users SET total_earnings = $1 WHERE user_id = $2`,
                    [total, userId])
                res.status(200).json({
                     referrals: amount
                });
            } else {
                // Handle the case where no user with the referral code was found
                res.status(200).json({ referrals: "You have not referred any one" });
            }
        
    } catch (error) {
        // console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
    }
}