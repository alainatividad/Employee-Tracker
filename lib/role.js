class Role {
  constructor() {
    this.title;
    this.salary;
    this.deptId;
  }

  getTitle(title) {
    if (!/[a-z ]/gi.test(title)) {
      return "Please enter a non-empty string";
    }

    this.title = title;
  }

  getSalary(salary) {
    if (/[0]/gi.test(salary) || !/[0-9]/gi.test(salary)) {
      return "Please enter a non-zero number";
    }

    this.salary = salary;
  }
}

module.exports = Role;
