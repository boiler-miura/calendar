const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: false,
  })
)

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'ec_app',
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

// EJS設定
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// トップページ

app.get('/', function (req, res) {
  res.render('flcalendar', {});
});

app.get('/schedule_add', (req, res) => {
  res.render('schedule_add.ejs');
});

app.post('/schedule_add', (req, res) => {
  const usr_id = 1;
  const date = req.body.date;
  const title = req.body.title;
  const contents = req.body.contents;
  console.log(req.body.date);
  console.log(req.body.title);
  console.log(req.body.contents);

  connection.query(
    'INSERT INTO schedules (usr_id,date,title,contents) VALUES (?,?,?,?)',
    [usr_id, date, title, contents],
    (error, results) => {
      res.redirect('/schedule_add');
    }
  );
});

app.get('/login', (req, res) => {
  const usr_id = req.body.usr_id;

  connection.query(
    'SELECT * from schedules WHERE usr_id =  ?',
    [usr_id],
    (error, results) => {
      if (req.body.usr_id === results[0].usr_id) {
        console.log('認証に成功しました');
        res.redirect('/schedule');
      }
    }
  )

});

app.listen(3000);
