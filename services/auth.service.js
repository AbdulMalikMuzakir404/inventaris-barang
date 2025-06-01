const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.registerUser = async ({ nama, username, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({
    nama,
    username,
    email,
    password: hashedPassword,
  });
};

exports.findUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: ["id", "nama", "username", "email"],
  });
};

exports.findUserByUsername = async (username) => {
  return await User.findOne({ where: { username } });
};

exports.verifyPassword = async (inputPassword, storedPassword) => {
  return await bcrypt.compare(inputPassword, storedPassword);
};

exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      nama: user.nama,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

exports.updateProfile = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User tidak ditemukan");

  await user.update(data);
  return user;
};

exports.changePassword = async (id, oldPassword, newPassword) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User tidak ditemukan");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Password lama tidak cocok");

  const hashed = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashed });

  return true;
};
