const userRepository = require("../repositories/user.repository");
const bcrypt = require("bcrypt");

async function createUser(data) {
  const { name, email, password } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
  });
  return user;
}

async function getAllUsers() {
  const allUsers = await userRepository.getAllUsers({});
  return allUsers;
}

async function getUserById(id) {
  const userById = await userRepository.getUserById(id)

  return userById
}

async function updateUser(id, data) {
  const updatedUser = await userRepository.updateUser(id, data)

  return updatedUser
}

async function deleteUser(id) {
  const deletedUser = await userRepository.deleteUser(id)

  return deletedUser
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
