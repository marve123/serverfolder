
exports.logout = async(req, res) => {
    try {
        return res
        .status(200)
        .clearCookie('token', { httpOnly: true })
        .json({
            success: true,
            message: 'Logged out Successfully',
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message
        })
    }
}