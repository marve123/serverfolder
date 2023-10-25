const mysql = require('mysql');

const pool = mysql.createPool({
  user: 'postgres',
  host: '127.0.0.1', 
  database: 'morrnaira',
  password: 'Super_16.com',
  port: 3306, 
});


module.exports = {
  query: (text, params, callback) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        return callback(err);
      }

      connection.query(text, params, (error, results) => {
        connection.release(); // Release the connection to the pool.

        if (error) {
          console.error('Error executing MySQL query:', error);
          return callback(error);
        }

        callback(null, results);
      });
    });
  },
};