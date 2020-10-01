const express = require('express');
const logger = require('morgan');
const session = require('cookie-session');

const {
  authenticate,
  getUserDetails,
  getMovie,
  getUser,
  addReview,
  getAllMovies,
  checkAuthentication,
  logout,
} = require('./handlers');

const app = express();
app.set('sessionMiddleware', session({ secret: 'SECRET_MSG' }));
app.use(logger('dev'));
app.use(express.json());
app.use((...args) => app.get('sessionMiddleware')(...args));
app.use(express.static('public'));

app.get('/api/allMovies', getAllMovies);
app.get('/api/movie/:id', getMovie);

app.get('/api/getUser', getUser);
app.get('/authenticate', authenticate);
app.get('/callback', getUserDetails);
app.use(checkAuthentication);

app.post('/api/addReview', addReview);
app.get('/logout', logout);

module.exports = { app };
