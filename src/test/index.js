require('dotenv').config()
const mysql = require('./../mysql')
const { PORT_WEB_BASE_URL } = require('./../config')
const axios = require('axios')


const main = async () => {
  await mysql.connectDB()
  const query = `
    SELECT 1 AS val;
  `
  const res = await mysql.query(query)
  console.log('SELECT 1:', res[0].val)
  await mysql.closeDB()
  const resp = await axios.get(`${PORT_WEB_BASE_URL}/api/healthz`)
  console.log('api test:', resp.data)
}

main()
