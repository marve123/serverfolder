const {config} = require("dotenv")
config()

module.exports = {
    PORT: process.env.PORT,
    SECRET: process.env.SECRET,
    CLIENT_URL: process.env.CLIENT_URL,
    SERVER_URL: process.env.SERVER_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    SECRET_KEY: process.env.SECRET_KEY,
}