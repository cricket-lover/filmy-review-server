const redis = require('redis');
const client = redis.createClient(
  process.env.REDIS_URL || 'redis://localhost:6379',
  { db: 1 }
);

const setMovies = (movies) => {
  return new Promise((resolve, reject) => {
    client.set('movies', JSON.stringify(movies), (err, res) => resolve(res));
  });
};

const getAllMovies = async () => {
  return new Promise((resolve, reject) => {
    client.get('movies', (err, movies) => resolve(JSON.parse(movies)));
  });
};

const addUser = ({ id, name, img }) => {
  return new Promise((resolve, reject) => {
    client.hmset(id, { id, name, img }, (err, res) => {
      resolve(true);
    });
  });
};

const getUser = (id) => {
  return new Promise((resolve, reject) => {
    client.hgetall(id, (err, res) => {
      if (err) resolve({});
      resolve(res);
    });
  });
};

module.exports = {
  addUser,
  getUser,
  setMovies,
  getAllMovies,
};
