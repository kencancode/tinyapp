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
}

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
}


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
  var userUrls = urlsForEachUser(req.cookies['user_id']);
  let templateVars = { urls: userUrls, user_id: req.cookies["user_id"], user: users[req.cookies["user_id"]] };

  if(users[req.cookies["user_id"]]){
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});

//    "/urls"          = show all URLs
app.post("/urls", (req, res) => {
  var randomURL = generateRandomString();
  console.log(req.body["longURL"]);
  urlDatabase[randomURL] =  {longURL: req.body["longURL"], userID: req.cookies["user_id"]}
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  let templateVars = { user: req.cookies["user_id"], user: users[req.cookies["user_id"]] };
  if(users[req.cookies["user_id"]]){
  res.render("urls_new", templateVars);
  } else {
  res.redirect("/login");
  }
});

//     "/urls/313412" = go to each link
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,                  //data will be stored like this, {mock : what clients type}
    longURL: urlDatabase[req.params.shortURL].longURL,
    user_id: req.cookies["user_id"],
    user: users[req.cookies["user_id"]]
  };
    if(users[req.cookies["user_id"]]){
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/login");
  }
});

//    "/urls/313412" = go to each link and can update*******
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect('/urls');
});


//delete when buttons are clicked
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  let templateVars = { urls: urlDatabase, user_id: req.cookies["user_id"], user: users[req.cookies["user_id"]] };
  res.render("urls_index", templateVars);
});


//    "/u/b3232"      = go to that website
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

//   GET  "/register"
app.get("/register", (req, res) => {
  res.render("urls_register");
});

// POST /register
app.post("/register", (req, res) => {
  if(!req.body.email || !req.body.password){
    res.send("Email and password must be provided");
  };5

if (getUser(req.body.email)){
    res.send("User exists");
  } else if (getUser(req.body.email) === null){
    var randomUserID = "user" + generateRandomString();
    users[randomUserID] = {id: randomUserID, email: req.body.email, password: req.body.password};
    res.cookie('user_id', users[randomUserID].id);
    res.redirect('/urls');
  }
});

// login
app.get("/login", (req, res) => {
  res.render("urls_login");
});

//login
app.post("/login", (req, res) => {
   var user = getUser(req.body.email);
   if (user && user.password === req.body.password){
    res.cookie('user_id', user.id);
    res.redirect("/urls");
  } else {
    res.send("Your password is correct or you haven't created an account yet");;
  }
});

//logout
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

generateRandomString();
