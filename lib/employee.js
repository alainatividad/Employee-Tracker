class Employee {
  constructor() {
    this.firstName;
    this.lastName;
    this.roleId;
    this.managerId;
  }

  getFirstName(fName) {
    if (!/[a-z ]/gi.test(fName)) {
      return "Please enter a non-empty string";
    }

    this.firstName = fName;
  }

  getLastName(lName) {
    if (!/[a-z ]/gi.test(lName)) {
      return "Please enter a non-empty string";
    }

    this.lastName = lName;
  }
}

module.exports = Employee;
