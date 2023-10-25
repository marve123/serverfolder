const { Pool } = require('pg')
const pool = new Pool({
  user: 'admin_user',
  host: 'dpg-cksincmnfb1c73c23q6g-a',
  database: 'morrnaira',
  password: '9AZffheLWmLZgHEwBWSYdXlLgIWcYvmF',
  port: 5432,
})

module.exports = {
  query: (text, params) => pool.query(text, params)
}
