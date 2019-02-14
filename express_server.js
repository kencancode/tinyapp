var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var cookieParser = require('cookie-parser');


app.use(cookieParser('A random phrase in order to create random signed cookies'));
app.set("view engine", "ejs");

function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

// will return boolean
function doesEmailExist(email){
  for(var eachUser in users){
    if (email === eachUser.email){
      return true;
    } else {
      return false;
    }
  }
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});



app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);         //it means we in urls_index, we pass the templateVars value to be used and rendered
});

//    "/urls"          = show all URLs
app.post("/urls", (req, res) => {
  var randomURL = generateRandomString();
  console.log(req.body["longURL"]);
  urlDatabase[randomURL] = req.body["longURL"]
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

//     "/urls/313412" = go to each link
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,                  //data will be stored like this, {mock : what clients type}
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"],
  };
  res.render("urls_show", templateVars);
});

// //     "/urls/313412" = go to each link and can update*******
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
});


//delete when buttons are clicked
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});


//    "/u/b3232"      = go to that website
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

//login
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

//logout
app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

//   GET  "/register"
app.get("/register", (req, res) => {
  res.render("urls_register");
});

// POST /register
app.post("/register", (req, res) => {
  if(!req.body.email || !req.body.password){
    res.sendStatus(404);
  };

  if (doesEmailExist(req.body.email) === false){
    var randomUserID = "user" + generateRandomString();
    users[randomUserID] = {id: randomUserID, email: req.body.email, password: req.body.password};
    res.cookie('user_id', users[randomUserID].id);
    res.redirect('/urls');
  } else if (doesEmailExist(req.body.email) === true){
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

generateRandomString();
