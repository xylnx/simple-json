const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res.status(400).json({
      status: 'fail',
      message: 'Username and password are required.',
    });
  }
  // Find the user in the DB/json file
  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) return res.sendStatus(401); // Unauthorized

  // Evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // create JWT tokens
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '300s' } // usually you would set this to 5 - 15 Minutes
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // Save the refreshToken with the currentUser
    // create an array of users which are not logged in
    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    // create an object with the current user, including their refresh token
    const currentUser = { ...foundUser, refreshToken };
    // put otherUsers objs + currentUser obj in one array
    usersDB.setUsers([...otherUsers, currentUser]);

    // write that array to the users.json file
    await fsPromises.writeFile(
      path.join(process.cwd(), 'model', 'users.json'),
      JSON.stringify(usersDB.users)
    );

    // refreshToken is send as in a cookie with httpOnly
    // => ensure the cookie is not accessible to JS and harden against xss
    // maxAge is in millisconds => one day is what we have here (24 * 60 * 60 * 1000)
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      status: 'succcess',
      accessToken: accessToken,
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  handleLogin,
};
