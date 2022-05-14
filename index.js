// include third party modules that would be used in the app
const inquirer = require("inquirer");
const [runQuery, getQuery] = require("./helper/sqlUtils");

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
          "View All Departments",
          "View All Roles",
          "View All Employees",
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

      switch (action[0]) {
        case "View":
          viewAction(action[2]);
          break;
        case "Add":
          addAction(action[1]);
          break;
        case "Update":
          updateAction();
          break;
        default:
          quit();
      }
    });
}

function quit() {
  console.log("\nGoodbye!");
  process.exit(0);
}

init();

function viewAction(table) {
  let query;
  switch (table) {
    case "Departments":
      query = "SELECT * from department";
      break;

    case "Roles":
      query =
        "SELECT role.id, role.title, department.name, role.salary from role join department on department.id = role.department_id order by role.id";
      break;

    case "Employees":
      query =
        "SELECT a.id, a.first_name, a.last_name, role.title, role.name as department, role.salary, concat(b.first_name,' ',b.last_name) as manager from employee a left join employee b on a.manager_id = b.id join (select role.id, role.title, role.salary, department.name from role join department on department.id = role.department_id) role on role.id = a.role_id;";
      break;
  }
  runQuery(query).then(() => mainSelect());
}

function addAction(table) {
  let query;
  let param;
  switch (table) {
    case "Department":
      inquirer
        .prompt([
          {
            type: "input",
            name: "deptName",
            message: "What is the name of the department?",
            validate(deptName) {
              if (!deptName) {
                return "Please enter a department name";
              }
              return true;
            },
          },
        ])
        .then((val) => {
          query = "INSERT INTO department (name) VALUES (?)";
          param = [val.deptName];
          runQuery(query, param).then(() => mainSelect());
        });
      break;

    case "Role":
      query = "SELECT name from department";
      getQuery(query).then((choices) => {
        inquirer
          .prompt([
            {
              type: "input",
              name: "roleName",
              message: "What is the name of the role?",
              validate(roleName) {
                if (!roleName) {
                  return "Please enter a role name";
                }
                return true;
              },
            },
            {
              type: "input",
              name: "roleSalary",
              message: "What is the salary of the role?",
              validate(roleSalary) {
                if (!roleSalary) {
                  return "Please enter a salary";
                }
                if (!/[0-9]/gi.test(roleSalary)) {
                  return "Please enter a non-zero number";
                }
                return true;
              },
            },
            {
              type: "list",
              name: "roleDept",
              message: "Which department does this role belong to?",
              choices: [...choices],
            },
          ])
          .then((val) => {
            query = `SELECT id as name FROM department WHERE name = '${val.roleDept}'`;
            getQuery(query).then((choices) => {
              query =
                "INSERT INTO role (title,salary,department_id) VALUES (?,?,?)";
              param = [val.roleName, parseInt(val.roleSalary), ...choices];
              console.log(param);
              runQuery(query, param).then(() => mainSelect());
            });
          });
      });
      break;
  }
}
