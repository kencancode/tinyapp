var express = require("express");
var app = express();
var PORT = 8080;
const bcrypt = require('bcrypt');
var cookieSession = require('cookie-session');

app.set("view engine", "ejs");

app.use(cookieSession({
  name: 'session',
  keys: ['A random string']
}));

function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}

var urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "aJ48lW"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "aJ48lW" },
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "1"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "b2xVn2": {
    id: "b2xVn2",
    email: "1@1.com",
    password: "1"
  }
};

function getUser(email){
  for(var id in users) {
    if (email === users[id].email){
      return users[id];
    }
  }
  return null;
};

function urlsForEachUser(user_id){
  let obj = {};
    for (var shortURL in urlDatabase){
      if (urlDatabase[shortURL].userID === user_id) {
        obj[shortURL] = urlDatabase[shortURL].longURL;
      }
    }
  return obj;
};


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  if(users[req.session.user_id]){
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});



app.get("/urls", (req, res) => {
  var userUrls = urlsForEachUser(req.session.user_id);
  let templateVars = { urls: userUrls, user_id: req.session.user_id, user: users[req.session.user_id] };

  if(users[req.session.user_id]){
    res.render("urls_index", templateVars);
  } else {
    res.send("<html><body>You must login first to view all urls! <a href='/login'>Log in</a></body></html>\n");
  }
});

app.post("/urls", (req, res) => {
  var randomURL = generateRandomString();
  console.log(req.body["longURL"]);
  urlDatabase[randomURL] =  {longURL: req.body["longURL"], userID: req.session.user_id}
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  let templateVars = { user: req.session.user_id, user: users[req.session.user_id] };

  if(users[req.session.user_id]){
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user_id: req.session.user_id,
    user: users[req.session.user_id]
  };

    if(users[req.session.user_id]){
    res.render("urls_show", templateVars);
  } else {
    res.send("<html><body>You must login first to view or edit this url! <a href='/login'>Log in</a></body></html>\n");
  }
});

app.post("/urls/:shortURL", (req, res) => {
  if(req.session.user_id === urlDatabase[req.params.shortURL].userID ) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID ){
    delete urlDatabase[req.params.shortURL]
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

app.get("/u/:shortURL", (req, res) => {
  var shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  res.render("urls_register");
});

app.post("/register", (req, res) => {
  if(!req.body.email || !req.body.password){
    res.send("Email and password must be provided");
  };

if (getUser(req.body.email)){
    res.send("User exists");
  } else if (getUser(req.body.email) === null){
    var randomUserID = "user" + generateRandomString();
    users[randomUserID] = {id: randomUserID,
     email: req.body.email,
     password:  bcrypt.hashSync(req.body.password, 10)};
    req.session.user_id = users[randomUserID].id;
    res.redirect('/urls');
  }
});

app.get("/login", (req, res) => {
  res.render("urls_login");
});

app.post("/login", (req, res) => {
  var user = getUser(req.body.email);

  if (user && bcrypt.compareSync(req.body.password, user.password)){
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else {
    res.send("Your password is correct or you haven't created an account yet");;
  }
});

app.post("/logout", (req, res) => {
  req.session = null
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

generateRandomString();


