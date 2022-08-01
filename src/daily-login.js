require('dotenv').config()
const CronJob = require('cron').CronJob;
const mysql = require('./mysql')
const database = require('./database')
const endpoint = require('./endpoint')

const USER_ID = process.env.USER_ID

const getDatetime = () => new Date().toLocaleString(
  'th-TH',
  {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }
)

const main = async () => {
  console.log('... Starting jobs ...');
  try {
    // random delay before start
    await new Promise((resolve) => {
      const delay = Math.floor(Math.random() * 900000)
      setTimeout(() => {
        resolve(true)
      }, delay)
    })

    console.log('started jobs at', getDatetime())
    await mysql.connectDB()

    const accessToken = await database.getAccessToken(USER_ID)
    const newAccessToken = await endpoint.refreshToken(accessToken)
    await database.addNewAccessToken(USER_ID, newAccessToken)
    await endpoint.checkIn(newAccessToken)

    await mysql.closeDB()
    console.log('Finished jobs at', getDatetime())
  }
  catch (error) {
    console.error('Error: job broken', error)
    try {
      if (mysql.dbFinnomena()) {
        await mysql.closeDB()
      }
    }
    catch (errorDB) {
      console.error('Error: can not close database after job broken', errorDB)
    }
    job.stop()
    job.start()
  }
}

// Cron Ranges
// Seconds: 0-59
// Minutes: 0-59
// Hours: 0-23
// Day of Month: 1-31
// Months: 0-11 (Jan-Dec)
// Day of Week: 0-6 (Sun-Sat)

const job = new CronJob(
  '0 0 8 * * *',
  main,
  () => {
    console.log('CronJob terminated');
  },
  true,
  'Asia/Bangkok',
);
job.start();
console.log('CronJob scheduled');
