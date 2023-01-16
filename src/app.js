import express from "express";
import path from "path";
import hbs from "hbs";
import dotenv from "dotenv";
import { geocode } from "./utils/geocode.js";
import { forecast } from "./utils/forecast.js";
const app = express();
dotenv.config();
const port = process.env.PORT || 3000; //in case it is deployed to heroku, process.env.PORT will be the port on their OS where our application will be running to be accessed
//nodemon only restarts on js file save, to restart nodemon on hbs file save, use command => nodemon app.js -e js,hbs
//****************************************Defining paths for express config*****************************
const __dirname = path.resolve();
// console.log(path.join(__dirname, "pubilc")); //C:\Users\DELL\Desktop\node-andrew\web-server\pubilc
const publicDirectoryPath = path.join(__dirname, "public");
const viewsPath = path.join(__dirname, "templates/views");
const partialsPath = path.join(__dirname, "templates/partials");
console.log(publicDirectoryPath);
console.log(partialsPath);
console.log(viewsPath);
//****************************************Setupt 'handlebars view engine' and 'views' location*****************************
app.set("view engine", "hbs"); //allows us to put dynamic values in out static content , hbs=>handlebars packages is installed
//By default, express looks for views folders when using app.render(). If we rename the views folder to something
//else like templates, then express would not know where to find the app.render()'s first argument and the application
//would break, to have a work around we have to provide a custom path to express by setting things as follows
app.set("views", viewsPath);
//Now the folder name must be templates/views where our hbs's reside. otherwise things will break again
hbs.registerPartials(partialsPath);

//****************************************Setup static directory to serve*****************************
app.use(express.static(publicDirectoryPath));
// Sets the root of our webserver at public directory.
// Now any one from the browser can access the files inside the public directory.//in out html files
// we would set the content and accesst through link like localhost:3000/index.html or localhost:3000/about.html
//But this will only return the static content to the client, for dynamic content, we need to use the hbs.

//Random from now
//app.com =>this would be the root/base url, the followings will be the other routes based on the root url
//app.com/help
//app.com/about
//app.get()=> this lets us configure what the server do when someone tries to get resource at a specific url.
//app.get()  has two parameters, first is the string type url, second is the callback function, that would give the
//response when a specific url is hit. The callabck function has two important args as well, req and res

//IMPORTANT: if we provide an object of key-value pair to res.send(), express is gonna stringify automatically for us
// app.get("", (req, res) => {
//   res.send("<h1>Hello from Express</h1>");
// });
// app.get("/help", (req, res) => {
//   res.send();
// });
// app.get("/about", (req, res) => {
//   //console.log(req);
//   res.send("<h1>About page</h1>");
// });

// hbs is used for templating and filling in the data dynamically and rendering +sending back to the cient
//when a request for a specific url arrives. express looks in static folder first for a match. if not, the it searches
//specific urls in app.get() methods, when it goes to the wildcard *, it gets into it. it for anything, thats why is
//is kept at the end in out express app

//The following app.get actually renders the index.hbs present in the template/views directory, and it
//is passsing an object containing the data to be rendered in the index.hbs before rendering. Note: file
//extension must be omitted. The partials, as the name suggests, are the partial html pages. Like if we want
//to add headings or what not, in an html page dynamically, we use the partials. Partials are helpful specifucally
//when its comes to header and footers, because these things are same on every page. So we define these in the
//partials and render them into the views using {{>}} syntax.
//The data object passed in the followinf example is typically the dynamic data that can rendered inside views and
//partials. So when the home page root will be hit, title will be set to "Weather App Home page" and anme to "Ali Raza"
//Now, in the partials and views title will be set to this title, and name to this name and rendered
//One request handler can send atmost one response. i.e one res.send() can be used
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App Home page",
    name: "Ali Raza",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "Weather App About Page",
    name: "Ali Raza",
  });
});
app.get("/help", (req, res) => {
  res.render("help", {
    title: "Weather App Help Page",
    helpTxt: "This is some sample help text",
    name: "Ali Raza",
  });
});

//if we do not pass the address above, the result returned from geocode will be an error. tat is pretty good,
//bet we are trying to destructure the respnse field object, and we know that if the error fieled is set to
//some value, response field (the one that is destructured) is set to undefined. So if we do not pass
//the address, error will be set, response will be undefined, and destructuring the undefined will throw an error. To
//tackle that error, we will pass a default argument to the function that is an empty object. So when response wiill
//be set to be undefined, the geocode will use the default value i.e empty object, and destructuring an empty object
//will now throw any error. because, it will find the destructured parameters in the empty object, if not found,
//these will be set to undefined
app.get("/weather", (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.send({ error: "You must provide a Address term" });
  }
  geocode(address, (err, { latitude, longitude, location } = {}) => {
    if (err) {
      return res.send({ error: err });
    }
    forecast(latitude, longitude, (error, foreCastData) => {
      if (error) {
        return res.send({ error: error });
      }
      console.log(foreCastData);
      return res.send({
        location: location,
        forecast: foreCastData,
        address: req.query.address,
      });
      // console.log(location);
      // console.log(foreCastData);
    });
  });
  // console.log(req.query);
  // res.send({ forecast: "Rain", location: req.query.address });
});
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMsg: "Help Article not Found",
    name: "Ali Raza",
  });
});
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMsg: "Page not found!",
    name: "Ali Raza",
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
