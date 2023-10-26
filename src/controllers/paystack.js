const db = require('../db')
const {SECRET_KEY} = require('../constants')
const axios = require('axios');
 

exports.getRef = async (req, res) => {
    const { ref } = req.query;
    try {

        const response = await axios.get(`https://api.paystack.co/transaction/verify/${ref}`, {
            headers: {
                "Authorization": SECRET_KEY,
            }
        });
        
        const status = response.data.data.status;
        const gateway = response.data.data.gateway_response;
        const amount = response.data.data.amount;
        // console.log(status)
        // console.log(gateway)
        // console.log(amount)

        if (status !== "success" || gateway !== "Approved" || amount !== 500000) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Payment',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Payment Successful',
        });
    } catch (error) {
        console.error(error.response.data);
        return res.status(500).json({
            success: false,
            message: error.response.data,
        });
    }
};



exports.createSub = async (req, res) => {
   
    const {business_name, bank_code, account_number, percentage_charge} = req.body;
    const subDetails = {
        business_name: business_name,
        bank_code: bank_code,
        account_number: account_number,
        percentage_charge: percentage_charge
    }
    try {
        // console.log(subDetails)

        const response = await axios.post('https://api.paystack.co/subaccount', subDetails, {
            headers: {
                "Authorization": SECRET_KEY,
                'Content-Type': 'application/json'
            } 
        });

        // const status = response.data.status; 
        const subaccount_code = response.data.data.subaccount_code;

        return res.json({
            success: true,
            message: 'Payment Account created',
            subaccount_code: subaccount_code
        });
    } catch (error) {
        return res.status(500).json({
            error: error.response.data.message
        })
    }
}



exports.getHistory = async (req, res) => {
    const {id} = req.params;

    try {
        const subaccount = await db.query(
            'SELECT subacc_code FROM users WHERE user_id = $1',
            [id]
        );

        // if (subaccount.rows.length > 0) {
            const subaccount_code = subaccount.rows[0].subacc_code; 
        // }

        const response = await axios.get(`https://api.paystack.co/subaccount/${subaccount_code}`, {
            headers: {
                "Authorization": SECRET_KEY,
            }
        });
        const data = response.data.data.id;

        const settlements = await axios.get(`https://api.paystack.co/settlement/?subaccount=${data}`, {
            headers: {
                "Authorization": SECRET_KEY,
            }
        });
 
        return res.status(200).json({
            success: true,
            message: 'Payment History',
            data: settlements.data,
            sub: settlements.data.data[0].subaccount
        });
    } catch (error) {
        // console.error(error.message);
        return res.status(500).json({
            error: error.message
        })
    }
}