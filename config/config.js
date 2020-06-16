require('dotenv').config()

module.exports = {
  "dev": {
    "url": process.env.DEV_DATABASE_STRING,
    "dialect": "postgres"
  },
  "production": {
    "url": process.env.PROD_DATABASE_STRING,
    "dialect": "postgres"
  }
}
