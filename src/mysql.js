require('dotenv').config()
const mysql = require('mysql')
const { DB_NAME } = require('./config')

let dbFinnomena;

const connectDB = () => new Promise((resolve, reject) => {
  dbFinnomena = mysql.createConnection({
    host: process.env.DB_HOST,
    database: DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    connectTimeout: 10000,
  })
  dbFinnomena.connect((err) => {
    if (err) {
      console.error('connect db fail', err.message)
      reject(err)
    } else {
      console.log('connected as id ' + dbFinnomena.threadId)
      resolve(true)
    }
  })
})

const closeDB = () => new Promise((resolve, reject) => {
  dbFinnomena.end((err) => {
    if (err) {
      console.error('close db fail', err.message)
      reject(err)
    } else {
      dbFinnomena = null
      console.log('closed db')
      resolve(true)
    }
  })
})

const query = (query, args) => new Promise((resolve, reject) => {
  dbFinnomena.query(query, args, (error, results) => {
    if (error) {
      reject(error)
    }
    resolve(results)
  })
})

module.exports = {
  dbFinnomena: () => dbFinnomena,
  connectDB,
  closeDB,
  query,
}
