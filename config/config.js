require('dotenv').config()

module.exports = {
  "dev": {
    "url": process.env.DATABASE_URL,
    "dialect": "postgres"
  },
  "production": {
    "url": process.env.DATABASE_URL,
    "dialect": "postgres"
  }
}
