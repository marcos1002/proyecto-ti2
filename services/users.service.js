const { models: { User } } = require('../helpers/db.helper');
const { filesAsJson } = require('../utils/file-upload.utils');

const find = async () => {
  const users = await User.find({}, { ine: 0, curp: 0, photo: 0, addressProof: 0 });
  return users;
};

const findFile = async (id, file) => {
  const user = await User.findById(id);
  return user[file];
};

const insert = async (user, files) => {
  const jsonFiles = filesAsJson(files);
  return await User.create({ ...user, ...jsonFiles });
};

module.exports = {
  find,
  findFile,
  insert
};