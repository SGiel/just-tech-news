const express = require('express');
const routes = require('./routes');
// inporting the connection to sequilize
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server
// if force:true, it would drop and re-create all of the database tables on startup.
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening at https://localhost:${PORT}`));
});