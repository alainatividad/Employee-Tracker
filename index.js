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
  // prompt for all available actions
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
          // passes the third word from the options in the main selection
          viewAction(action[2]);
          break;
        case "Add":
          // passes the second word from the options in the main selection
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

function viewAction(table) {
  let query;
  // pass the query to be shown based on the parameter passed
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
  // run the query, show the results and then go back to the main selection
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
          // use the query and parameter to create a SQL statement then go back to the main selection
          runQuery(query, param).then(() => mainSelect());
        });
      break;

    case "Role":
      // we needed to get all the available departments for the list selection of the inquirer module
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
            // get the department id from the department chosen
            query = `SELECT id as name FROM department WHERE name = '${val.roleDept}'`;
            getQuery(query).then((choices) => {
              // include the department id to the values to be updated
              query =
                "INSERT INTO role (title,salary,department_id) VALUES (?,?,?)";
              param = [val.roleName, parseInt(val.roleSalary), ...choices];
              runQuery(query, param).then(() => mainSelect());
            });
          });
      });
      break;

    case "Employee":
      let title;
      let manager;
      // get the role titles for the list choices
      query = "SELECT title as name from role";
      getQuery(query).then((choices) => {
        title = [...choices];
      });
      // get the employee names for the manager choices
      query = "SELECT concat(first_name,' ',last_name) as name from employee";
      getQuery(query)
        .then((choices) => {
          // get all employee names and add NULL to manager array
          manager = ["None", ...choices];
        })
        .then(() => {
          inquirer
            .prompt([
              {
                type: "input",
                name: "firstName",
                message: "What is the first name of the employee?",
                validate(firstName) {
                  if (!firstName) {
                    return "Please enter the first name";
                  }
                  return true;
                },
              },
              {
                type: "input",
                name: "lastName",
                message: "What is the last name of the employee?",
                validate(lastName) {
                  if (!lastName) {
                    return "Please enter the last name";
                  }
                  return true;
                },
              },
              {
                type: "list",
                name: "role",
                message: "What is the role of the employee?",
                choices: [...title],
              },
              {
                type: "list",
                name: "manager",
                message: "Who is the manager of the employee?",
                choices: [...manager],
              },
            ])
            .then((val) => {
              let roleId;
              let managerId;

              // query would differ if there's no manager chosen, we should let the insert set manager_id to NULL if so
              if (manager !== "None") {
                // get roleId of the selected role and store to roleId
                query = `SELECT id as name FROM role WHERE title = '${val.role}'`;
                getQuery(query).then((choices) => {
                  [roleId] = choices;
                });

                // split manager name to firstName and lastName so we could use these to get the employee id for the manager
                const nameArr = val.manager.split(" ");
                const [firstName, lastName] = nameArr;

                // get employee id of the manager and store to managerId
                query = `SELECT id as name FROM employee WHERE first_name = '${firstName}' and last_name = '${lastName}'`;
                getQuery(query).then((choices) => {
                  [managerId] = choices;
                  // finally create the statement to insert new employee to table
                  query =
                    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
                  param = [val.firstName, val.lastName, roleId, managerId];
                  runQuery(query, param).then(() => mainSelect());
                });
              } else {
                // get roleId of the selected role and then create the insert statement to add the new employee
                query = `SELECT id as name FROM role WHERE title = '${val.role}'`;
                getQuery(query)
                  .then((choices) => {
                    [roleId] = choices;
                  })
                  .then(() => {
                    // create the statement to insert new employee to table
                    query =
                      "INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)";
                    param = [val.firstName, val.lastName, roleId];
                    runQuery(query, param).then(() => mainSelect());
                  });
              }
            });
        });
      break;
  }
}

function updateAction() {
  let title;

  // let's build the list for the roles and the employee names
  query = "SELECT title as name from role";
  getQuery(query).then((choices) => {
    title = [...choices];
  });
  query = "SELECT concat(first_name,' ',last_name) as name from employee";
  getQuery(query).then((choices) => {
    // ask the user which employee to update and what role to assign
    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Which employee's role do you want to update?",
          choices: [...choices],
        },
        {
          type: "list",
          name: "role",
          message: "Which role do you want to assign the selected employee?",
          choices: [...title],
        },
      ])
      .then((val) => {
        // split employee name to first and last name
        const nameArr = val.name.split(" ");
        const [firstName, lastName] = nameArr;

        // get role id of the the new role selected
        query = `SELECT id as name FROM role WHERE title = '${val.role}'`;
        getQuery(query)
          .then((choices) => {
            [roleId] = choices;
          })
          .then(() => {
            // use the selected first and last names to select the employee to be updated since the names came from a previous select and not user input (no user error expected)
            query = `UPDATE employee SET role_id = ? WHERE first_name = '${firstName}' and last_name = '${lastName}'`;
            param = [roleId];
            // run the update statement and go back to main select
            runQuery(query, param).then(() => mainSelect());
          });
      });
  });
}

// show header and main selections
init();
