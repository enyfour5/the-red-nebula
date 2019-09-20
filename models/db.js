require('dotenv').config()
var mysql = require('mysql');


module.exports = mysql.createPool({
  host: process.env.mysql_host,
  user: process.env.mysql_user,
  password: process.env.mysql_pwd,
  database: process.env.mysql_db,
});
