const mysql = require("mysql2");
const cTable = require("console.table");

let choices = [];
// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "abc123!",
    database: "company_db",
  },
  console.log(`Connected to the company_db database.`)
);

const runQuery = async (query, param) => {
  const [rows] = await db.promise().query(query, param);
  if (query.includes("SELECT")) {
    // console.log(rows);
    if (rows.length > 0) {
      // console.log("\n");
      console.table(rows);
    } else {
      console.log(
        "\nThere are no records to show. Please add entries to the table.\n"
      );
    }
  } else {
    if (rows.affectedRows > 0) {
      console.log(`${param[0]} added to the database.`);
    }
  }

  // return db
  // .promise()
  // .query(query, param)
  // .then(([rows]) => {
  //   if (query.includes("SELECT")) {
  //     // console.log(rows);
  //     if (rows.length > 0) {
  //       // console.log("\n");
  //       console.table(rows);
  //     } else {
  //       console.log(
  //         "\nThere are no records to show. Please add entries to the table.\n"
  //       );
  //     }
  //   } else {
  //     if (rows.affectedRows > 0) {
  //       console.log(`${param[0]} added to the database.`);
  //     }
  //   }
  // });
};

const getQuery = async (query) => {
  const [rows] = await db.promise().query(query);
  choices = [];
  rows.forEach((val) => {
    choices.push(val.name);
  });
  return choices;
};

module.exports = [runQuery, getQuery];
