const database = require('./database');
const { request } = require('./lib');
const { movieDetails } = require('../movieDetails');
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL } = require('../config');

const getDetailsOptions = (token) => ({
  host: 'api.github.com',
  path: '/user',
  method: 'GET',
  headers: {
    'User-Agent': 'curl/7.64.1',
    Authorization: `token ${token}`,
  },
});

const getTokenOptions = (query) => ({
  host: 'github.com',
  path: `/login/oauth/access_token?${query}`,
  method: 'POST',
  headers: {
    Accept: 'application/json',
  },
});

const requestUserDetails = (req, res, token) => {
  const detailsOptions = getDetailsOptions(token);
  const error = 'No user found';
  request(detailsOptions)
    .then(({ id, login, avatar_url }) => {
      req.session.id = id;
      req.session.username = login;
      req.session.avatar_url = avatar_url;
      database
        .addUser({ id, name: login, img: avatar_url })
        .then(() => res.redirect(REDIRECT_URL));
    })
    .catch(() => res.status(404).json({ error }));
};

const getUserDetails = (req, res) => {
  const { code } = req.query;
  const error = 'Code not found';
  const clientId = `client_id=${CLIENT_ID}`;
  const clientSecret = `client_secret=${CLIENT_SECRET}`;
  const query = `${clientId}&${clientSecret}&code=${code}`;
  const tokenOptions = getTokenOptions(query);
  request(tokenOptions)
    .then(({ access_token }) => requestUserDetails(req, res, access_token))
    .catch(() => res.status(404).json({ error }));
};

const authenticate = (req, res) =>
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`
  );

const checkAuthentication = (req, res, next) => {
  if (req.session.isNew) {
    return res.redirect(REDIRECT_URL);
  }
  next();
};

const getAllMovies = async (req, res) => {
  let details = await database.getAllMovies();
  if (!details) {
    await database.setMovies(movieDetails);
    details = await database.getAllMovies();
  }
  res.json(details);
};

const getMovie = async (req, res) => {
  const movieDetails = await database.getAllMovies();
  const details = movieDetails.find((movie) => movie.id === +req.params.id);
  res.json(details);
};

const addReview = async (req, res) => {
  const { id, headline, content } = req.body;
  const movieDetails = await database.getAllMovies();
  const details = movieDetails.find((movie) => movie.id === +id);
  details.reviews.unshift({ headline, content });
  await database.setMovies(movieDetails);
  res.json(details);
};

const getUser = (req, res) => {
  database.getUser(req.session.id).then((data) => {
    res.json(data);
  });
};

const logout = (req, res) => {
  req.session = null;
  res.json({ status: true });
};

module.exports = {
  authenticate,
  getUser,
  getUserDetails,
  getMovie,
  addReview,
  getAllMovies,
  checkAuthentication,
  logout,
};
