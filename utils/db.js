const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "ramapro",
  password: "",
  database: "projectM",
});

module.exports = pool;
