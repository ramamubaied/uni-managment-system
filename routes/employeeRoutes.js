// routes.js

const express = require("express");
const router = express.Router();
//this contains the db connection pool
const connectionPool = require("../utils/db");
const bcrypt = require("bcrypt");
const saltRounds = 10; // Number of salt rounds for bcrypt
const crypto = require("crypto");
// const createAv = require("@dicebear/core");
// const avaatars = require("@dicebear/collection");
const fs = require("fs"); // To save the avatar image
const csv = require("csv-parser");
const multer = require("multer");
const path = require("path");
const {editProfileEmployee, changePasswordEmployee} = require("./../controllers/ProfileController")
const {requireSessionEmployee} = require("./../controllers/AuthController")
// Generate a random UID
function generateUID() {
  return crypto.randomBytes(16).toString("hex");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination directory for uploaded files
    const destinationDirectory = path.join(__dirname, "../assets/files");
    cb(null, destinationDirectory);
  },
  filename: function (req, file, cb) {
    // Define the file name for the uploaded file
    const filename = generateUID();
    cb(null, filename);
  },
});
const upload = multer({ storage });

// Define routes
router.get("/", (req, res) => {
  res.render("employee/index");
});

router.get("/edit-profile",requireSessionEmployee,  async (req, res)=>{
  const user_id = req.query.profile_id;
  try{
    const user = await connectionPool.query(`SELECT * FROM users WHERE employee_id = '${user_id}'`)
    return res.render("employee/edit-profile", {
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

router.post("/edit-profile",requireSessionEmployee, upload.single("profile_image"), editProfileEmployee)

router.post("/change-password",requireSessionEmployee,  changePasswordEmployee);

router.get("/dashboard",requireSessionEmployee, async (req, res) => {
  // if (!req.session.username || req.session.role != "team_member") {
  //   res.redirect("/employee/");
  //   return;
  // }
  // console.log(req.session.id)
  try{
    const tasks = await connectionPool.query(`SELECT tasks.id AS taskId, tasks.*, projects.name, projects.category FROM tasks JOIN projects ON projects.id = tasks.project_id WHERE assigned_to = '${req.session.userUniqueId}'`)
    console.log(req.session.userId)
    res.render("employee/dashboard", {
      username: req.session.username,
      role: "member",
      tasks: tasks[0],
      profileImage: req.session.profileImage,
      id: req.session.userId
    });
  }catch(err){
    console.log(err)
    // return res.redirect("/employee/error")
  }
});

router.post("/mark-complete",requireSessionEmployee, async (req, res)=>{
  if(req.session.userUniqueId){
    try{
      const {project_id, task_id} = req.query;
    const tasks = await connectionPool.query(`SELECT tasks.task_name, projects.name FROM tasks JOIN projects ON projects.id = tasks.project_id WHERE assigned_to = '${req.session.userUniqueId}' AND tasks.id = ${task_id}`)

    //update the status of the task 
    await connectionPool.query(`UPDATE tasks  SET status = '1' WHERE id = ${task_id} AND project_id = ${project_id} AND assigned_to = ${req.session.userUniqueId}`)
    //add the notification in the table such that the admin gets the notification about the task completion
    await connectionPool.query(`INSERT into notifications(username, projectname, taskname) VALUES ('${req.session.username}', '${tasks[0][0].name}', '${tasks[0][0].task_name}')`)
    //check if there is no task that is uncomplete for a specific project, if so then mark the project as complete
    const result = await connectionPool.query(`SELECT GROUP_CONCAT(status) AS status, COUNT(id) AS total_tasks FROM tasks WHERE project_id = ${project_id}`)
    const totalRows = result[0][0].total_tasks;
    var totalIncompleteTasks  = 0;
    result[0][0].status.split(",").forEach(stat => {
      if(stat === "Incomplete"){
        totalIncompleteTasks++;
      }
    })
    const completedTasks = Math.abs(result[0][0].total_tasks - totalIncompleteTasks);
    const percentage = (completedTasks / result[0][0].total_tasks) * 100;

    await connectionPool.query(`UPDATE projects SET percentage = '${percentage}' WHERE id = ${project_id}`)
    return res.redirect("/employee/dashboard")
    }catch(err){
      console.log(err)
      return res.redirect("/employee/error")
    }
  }else{
    return res.redirect("/employee/error")
  }
  
})

router.post("/login", async (req, res) => {
  //this will handle the post reques for login
  const { email, password } = req.body;
  console.log(password);
  try {
    // Query the user with the given email from the database
    const user = await connectionPool.query(
      `SELECT * FROM users WHERE email = '${email}'`
    );
    console.log(user);
    // Compare the hashed password with the provided password
    const passwordMatch = await bcrypt.compare(
      password,
      user[0][0].password_hash
    );

    if (passwordMatch) {
      // Store user information in the session
     
      req.session.userId = user[0][0].employee_id;
      req.session.userUniqueId = user[0][0].id

      req.session.profileImage = user[0][0].profile_image
      
      req.session.username = user[0][0]?.name;
      req.session.role = user[0][0].role;
      
      console.log(user[0][0].role);
      // Redirect to the dashboard route
      res.redirect("/employee/dashboard");
    } else {
      // Password does not match
      //   res.status(401).send("Incorrect email or password");
      res.redirect("/employee/error");
    }
  } catch (error) {
    console.error("Error during login:", error);
    // res.status(500).send("An error occurred during login");
    res.redirect("/employee/error");
  }
});

router.get("/error", async (req, res) => {
  //this will handle the post request for register
  res.render("error-500");
});
router.post('/send-response', async (req, res) => {
  try{
    const taskId = req.query?.task_id;
    const projectId = req.query?.project_id;
    const response = req.body?.response;
    await connectionPool.query(`UPDATE tasks SET response = '${response}' WHERE id = ${taskId} AND project_id = '${projectId}'`)
    return res.redirect("/employee/dashboard")
  }catch(err){
    console.log(err)
    return res.redirect("/employee/error")
  }
})
router.get("/logout", (req, res) => {
  //this will handle the post request for logout
  req.session.userId = -1;
  req.session.username = "";
  req.session.role = "";
  req.session.destroy((err) => {
    if (err) {
      res.redirect("/employee/error");
    } else {
      res.redirect("/employee/");
    }
  });
  
});

module.exports = router;
