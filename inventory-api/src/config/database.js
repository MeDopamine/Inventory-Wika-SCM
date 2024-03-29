const dotenv = require('dotenv')
dotenv.config()
module.exports=
{
  "development": {
    "username": process.env.db_username,
    "password": process.env.db_password,
    "database": process.env.db_name_dev,
    "host": process.env.db_host,
    "dialect": process.env.db_dialect
    // "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
