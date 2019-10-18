const path = require('path');
const express = require('express')
const app = express()
const port = 3500;
const cors = require('cors');

const BASE_PATH = path.join(__dirname, './src');

app.use(express.static(BASE_PATH));
app.use(cors());

//small section for error handling
//404 error to handle incorrect routes. Executes next method and passes the error with it
app.use((req, res, next) => {
  const err = new Error('Page not found');
  error.status = 404;
  next(error);
})

// handles errors in the app
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
})

//handles requests
app.get('/', (req, res) =>
  res.sendFile(path.join(BASE_PATH, "./index.html"))
);

app.get('/', (req, res) =>
  res.sendFile(path.join(BASE_PATH, "./src/api/api.js"))
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))