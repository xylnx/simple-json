const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res.status(400).json({
      status: 'fail',
      message: 'Username and password are required.',
    });

  // Check for duplicate user names in the DB
  const duplicate = usersDB.users.find((person) => person.username === user);
  if (duplicate) return res.sendStatus(409); // conflict
  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // store then new user
    const newUser = { username: user, password: hashedPwd };

    // create a new array from the userDB + add the new user
    usersDB.setUsers([...usersDB.users, newUser]);
    // override existing file
    await fsPromises.writeFile(
      path.join(process.cwd(), '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users)
    );
    console.log(usersDB.users);
    res.status(201).json({
      status: 'success',
      message: `New user ${user} created`,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

module.exports = {
  handleNewUser,
};
