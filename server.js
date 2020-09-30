const express = require('express');
const app = express();
const PORT = 3001;
const logger = require('morgan');
const { movieDetails } = require('./movieDetails');
const database = require('./database');

app.use(express.static('public'));
app.use(logger('dev'));
app.use(express.json());
app.get('/api/allMovies', (req, res) => {
  res.json(movieDetails);
});
app.get('/api/movie/:id', (req, res) => {
  const details = movieDetails.find((movie) => movie.id === +req.params.id);
  res.json(details);
});

app.post('/api/addReview', (req, res) => {
  const { id, headline, content } = req.body;
  const details = movieDetails.find((movie) => movie.id === +id);
  details.reviews.unshift({ headline, content });
  res.json(details);
});

// app.post('/api/searchMovies', (req, res) => {
//   const { text } = req.body;
//   const details = movieDetails.filter((movie) => movie.title.includes(text));
//   res.json(details);
// });

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
