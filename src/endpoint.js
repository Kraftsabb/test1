const axios = require('axios')
const { PORT_WEB_BASE_URL } = require('./config')

axios.defaults.timeout = 10000

const refreshToken = async (token) => {
  try {
    const resp = await axios.get(
      `${PORT_WEB_BASE_URL}/auth/refresh`,
      {
        headers: {
          'cookie': `access_token=${token}`
        }
      }
    )
    if (resp.status === 200) {
      const newToken = resp.headers['set-cookie'][0].split(';')[0].trim().split('=')[1]
      return newToken
    } else {
      console.error('Error: refreshToken success but not 200')
    }
  } catch (err) {
    if (err.response) {
      console.error(`Error: refreshToken with status ${err.response.status}`)
      console.error(err.response.data)
    } else {
      console.error('Error: refreshToken', err)
    }
  }
  return undefined
}

const checkIn = async (token) => {
  try {
    const resp = await axios({
      method: 'post',
      url: `${PORT_WEB_BASE_URL}/api/fnds/fn3/private/api/v1/campaign/user-check-in`,
      headers: {
        Cookie: `access_token=${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        campaign_id: 1
      }
    })
    console.log(resp.data)
    return true
  } catch (err) {
    if (err.response) {
      console.error(`Error: checkIn with status ${err.response.status}`)
      console.error(err.response.data)
    } else {
      console.error('Error: checkIn', err)
    }
  }
  return false
}

module.exports = {
  refreshToken,
  checkIn
}
