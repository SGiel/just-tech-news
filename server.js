const path = require('path'); // added for front end
const express = require('express');
const routes = require('./controllers/');
// inporting the connection to sequilize
const sequelize = require('./config/connection');

const session = require('express-session');

// added for front end
const exphbs = require('express-handlebars'); 

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
}

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// bring in front end
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);


// turn on connection to db and server
// force:true, drops and re-creates all of the database tables and associations on startup.
// same as DROP TABLE IF EXISTS in sql
// necessary if have new table associations???
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening at https://localhost:${PORT}`));
});