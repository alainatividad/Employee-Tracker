// include third party modules that would be used in the app
const inquirer = require("inquirer");
const database = require("mysql2");
const cTable = require("console.table");

// include the base classes for Employee, Department, and Role
const Employee = require("./lib/employee");
const Department = require("./lib/department");
const Role = require("./lib/role");

function init() {
  console.log(`
 =======================================================================================================================================
|                                                                                                                                       |
|                                                                                                                                       |
|  d88888b .88b  d88. d8888b. db       .d88b.  db    db d88888b d88888b      d888888b d8888b.  .d8b.   .o88b. db   dD d88888b d8888b.   |
|  88'     88'YbdP\`88 88  \`8D 88      .8P  Y8. \`8b  d8' 88'     88'          \`~~88~~' 88  \`8D d8' \`8b d8P  Y8 88 ,8P' 88'     88  \`8D   |
|  88ooooo 88  88  88 88oodD' 88      88    88  \`8bd8'  88ooooo 88ooooo         88    88oobY' 88ooo88 8P      88,8P   88ooooo 88oobY'   |
|  88~~~~~ 88  88  88 88~~~   88      88    88    88    88~~~~~ 88~~~~~         88    88\`8b   88~~~88 8b      88\`8b   88~~~~~ 88\`8b     |
|  88.     88  88  88 88      88booo. \`8b  d8'    88    88.     88.             88    88 \`88. 88   88 Y8b  d8 88 \`88. 88.     88 \`88.   |
|  Y88888P YP  YP  YP 88      Y88888P  \`Y88P'     YP    Y88888P Y88888P         YP    88   YD YP   YP  \`Y88P' YP   YD Y88888P 88   YD   |
|                                                                                                                                       |
|                                                                                                                                       |
 =======================================================================================================================================`);
  mainSelect();
}

function mainSelect() {
  // prompt that would ask for more team members or to finish adding
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View Departments",
          "View Roles",
          "View Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employee Role",
          "Quit",
        ],
      },
    ])
    .then((val) => {
      // split actions into arrays
      const action = val.action.split(" ");

      if (action[0] === "View") {
        switch (action[1]) {
          case "Departments":
            break;
          case "Roles":
            break;

          case "Employees":
            break;
        }
      } else if (action[0] === "Add") {
        switch (action[1]) {
          case "Departments":
            break;
          case "Roles":
            break;

          case "Employees":
            break;
        }
      } else if (action[0] === "Update") {
      } else {
        quit();
      }
    });
}

function quit() {
  console.log("\nGoodbye!");
  process.exit(0);
}

init();
