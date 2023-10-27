const express = require('express')
const app = express()
const { PORT, CLIENT_URL } = require('./constants')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const cors = require('cors')

// passport 
require('./middlewares/passport-middleware')

// middlewares 
app.use(express.json()) 
app.use(cookieParser())


app.use(cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'https://www.morrnaire.tech'],
    credentials: true,
  }));

app.use(passport.initialize()) 
// app.use((req, res, next) => { 
//     res.setHeader('Access-Control-Allow-Origin', 'https://www.morrnaire.tech');
//     res.setHeader('Access-Control-Allow-Origin', 'https://morrnaire.tech');
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); 
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization'); 
//     res.setHeader('Access-Control-Allow-Credentials', 'true'); 
//     next(); 
//   }); 

  app.get('/', (req, res) => {
    res.send({message: 'Welcome to the API'})}
)


// Routes  
const authRoutes = require('./routes/auth')
 
// initialize routes 
app.use('/api', authRoutes) 


const appStart = () => {
    try {
        app.listen(PORT, () => {
            console.log(`The app is running at http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log(`Error: ${error.message}`)
    }
}
 
appStart()