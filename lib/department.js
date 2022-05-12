class Department {
  constructor() {
    this.name;
  }

  getName(name) {
    if (!/[a-z ]/gi.test(name)) {
      return "Please enter a non-empty string";
    }

    this.name = name;
  }
}

module.exports = Department;
