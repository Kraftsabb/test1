const mysql = require('./mysql')

const getAccessToken = async (userId) => {
  const query = `
    SELECT
      access_token
    FROM
      access_token
    WHERE
      user_id = ? AND is_deleted = ?
    LIMIT 1;
  `
  const res = await mysql.query(query, [userId, 0])
  return res[0].access_token
}

const addNewAccessToken = async (userId, accessToken) => {
  const updateQuery = `
    UPDATE
      access_token
    SET
      is_deleted = ?,
      updated_at = NOW()
    WHERE
      user_id = ? AND is_deleted = ?;
  `
  await mysql.query(updateQuery, [1, userId, 0])

  const insertQuery = `
    INSERT INTO access_token
      (user_id, access_token, created_at, updated_at)
    VALUES
      (?, ?, NOW(), NOW());
  `
  await mysql.query(insertQuery, [userId, accessToken])
}

module.exports = {
  getAccessToken,
  addNewAccessToken
}
