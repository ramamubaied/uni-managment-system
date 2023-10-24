const express = require("express");
const app = express();
const port = 3000; // You can change this port number
//This handles the admin routes.
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const session = require("express-session");
const multer = require("multer");
const connectionPool = require("./utils/db");
const {generateUID, upload, imageMimeTypes} = require("./utils/helperFunctions")
const {saltRounds} = require("./utils/constants")
const {editProfile, changePassword} = require("./controllers/ProfileController")
const {requireSession} = require("./controllers/AuthController")

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Serve static files from the "assets" directory
app.use(express.static(__dirname + "/assets"));

//set the session
app.use(
  session({
    secret: "your-secret-key", // Replace with a strong and secret key for session management
    resave: false,
    saveUninitialized: true,
  })
);

// Define a simple route that renders an EJS template
app.get("/edit-profile",requireSession,  async (req, res)=>{
  const user_id = req.query.profile_id;
  try{
    const user = await connectionPool.query(`SELECT * FROM users WHERE employee_id = '${user_id}'`)
    console.log(user[0][0])
    return res.render("admin/edit-profile", {
      id: req.session.userId,
      details: user[0][0],
      username: req.session.username,
      profileImage: user[0][0]?.profile_image,
      role: "admin",
      count: 0,
      notifications: [],
    })
  }catch(err){
    console.log(err)
  }
})
app.get("/logout", (req, res) => {
  //this will handle the post request for logout
  req.session.userId = -1;
  req.session.username = "";
  req.session.role = "";

  res.redirect("/admin/dashboard");
});

app.use("/admin", adminRoutes);
app.use("/employee", employeeRoutes);
app.get("/", (req, res) => {
  res.render("admin/index");
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
