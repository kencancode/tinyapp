var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

app.set("view engine", "ejs");

function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//    "/urls"          = show all URLs
app.post("/urls", (req, res) => {
  var randomURL = generateRandomString();
  console.log(req.body["longURL"]);
  urlDatabase[randomURL] = req.body["longURL"]
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//     "/urls/313412" = go to each link
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,                  //data will be stored like this, {mock : what clients type}
    longURL: urlDatabase[req.params.shortURL]
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
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


//    "/u/b3232"      = go to that website
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

generateRandomString();
