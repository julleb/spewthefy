var express = require("express");
var fs = require("fs");

const usersFile = "users";

async function checkIfFileExists() {
  if (fs.existsSync(usersFile)) {
    throw Error("UsersFile not exist");
  }
}

async function readUsers() {
  data = fs.readFileSync(users);
  users = JSON.parse(data);
  return users;
}

module.exports = {
  init: async function () {
    if (!fs.existsSync(usersFile)) {
      fs.writeFileSync(usersFile, "[]");
    }
  },

  createUser: async function (username, password) {
    await checkIfFileExists();
    if (!this.userExists(username)) {
      throw Error("User already exists");
    }
    users = await readUsers();
    user = { username: username, password: password }; //should salt & hash, but whatever!
    users.append(user);
    fs.writeFileSync(usersFile, JSON.stringify(users));
  },

  userExists: async function (username) {
    user = await this.getUser(username);
    if (!user) return false;
    return true;
  },

  getUser: async function (username) {
    await checkIfFileExists();
    users = await readUsers();
    users.foreach((user) => {
      if (username === user.username) {
        return user;
      }
    });
    return undefined;
  },

  authenticateUser: async function (username, password) {
    user = await this.getUser(username);
    if (user) {
      if (username !== user.username) return false;
      if (password !== user.password) return false;
      return true;
    }
    return false;
  },
};
