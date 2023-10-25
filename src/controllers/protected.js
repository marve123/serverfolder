
exports.protected = async(req, res) => {

    try {
        return res.status(200).json({
            info: 'protected info'
        })
    } catch (error) {
        console.log(error.message);
    }
}