// routes.js

const express = require("express");
const router = express.Router();
const connectionPool = require("../utils/db");
const bcrypt = require("bcrypt");
const fs = require("fs"); // To save the avatar image
const csv = require("csv-parser");
const sizeOf = require("image-size")
const {generateUID, upload, imageMimeTypes, sendEmail, calculateNextScheduledDate, sendEmailForProject, getDateDifference} = require("./../utils/helperFunctions")
const {saltRounds} = require("./../utils/constants")
const {editProfile, changePassword} = require("./../controllers/ProfileController")
const {requireSession} = require("./../controllers/AuthController")
const cron = require('node-cron');
// Define routes
router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/register", (req, res) => {
  res.render("admin/registration");
});

router.get("/edit-profile",requireSession,  async (req, res)=>{
  const user_id = req.query.profile_id;
  try{
    const user = await connectionPool.query(`SELECT * FROM users WHERE employee_id = '${user_id}'`)
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

router.post("/edit-profile",requireSession, upload.single("profile_image"), editProfile)

router.post("/change-password",requireSession,  changePassword);

router.get("/dashboard",requireSession,  async (req, res) => {
  

  try {
    const employees = await connectionPool.query(
      "SELECT * FROM users where role = 1"
    );

    const notifications = await connectionPool.query(`SELECT notifications.* FROM notifications`)
    const projects = await connectionPool.query(`

    SELECT projects.*, GROUP_CONCAT(users.name) AS all_user_names
    FROM projects
    LEFT JOIN project_users ON project_users.project_id = projects.id
    LEFT JOIN users ON users.id = project_users.user_id
    GROUP BY projects.name;
    `)

    res.render("admin/dashboard", {
      id: req.session.userId,
      username: req.session.username,
      employees: employees[0],
      projects: projects[0],
      notifications: notifications[0],
      count: notifications.length,
      profileImage: req.session.profileImage,
      role: "admin",
      
    });
  } catch (err) {
    console.log(err)
    res.render("admin/error")
  }
});
router.get("/tasks",requireSession,  async (req, res)=>{

  try {
    const notifications = await connectionPool.query(`SELECT COUNT(id) AS total, notifications.* FROM notifications`)
    const projects = await connectionPool.query(`SELECT * FROM projects`)
    
    

    res.render("admin/task", {
      username: req.session.username,
      // employees: employees[0],
      id: req.session.userId, 
      projects: projects[0],
      notifications: notifications[0],
      count: notifications[0][0].total,
      profileImage: req.session.profileImage,
      role: "admin",
      differenceCal: getDateDifference,
    });
  } catch (err) {
    res.render("admin/error")
  }
})

router.get("/employees",requireSession,  async (req, res) => {
  if (!req.session.username) {
    res.redirect("/admin/");
    return;
  }
  try {
    const notifications = await connectionPool.query(`SELECT COUNT(id) AS total, notifications.* FROM notifications`)

    const employees = await connectionPool.query(
      "SELECT * FROM users where role = 1"
    );
   
    res.render("admin/employees", {
      id: req.session.userId, 
      username: req.session.username,
      employees: employees[0],
      notifications: notifications[0],
      count : notifications[0][0].total,
      profileImage: req.session.profileImage,
      role: "admin",
    });
  } catch (err) {
    res.render("admin/error")
  }
});

router.post("/login", async (req, res) => {
  //this will handle the post reques for login
  const { email, password } = req.body;
  try {
    // Query the user with the given email from the database
    const user = await connectionPool.query(
      `SELECT * FROM users WHERE email = '${email}' AND role = 2`
    );
    if(typeof user[0][0]?.password_hash === 'undefined'){
      return res.redirect("/admin/error");
    }
    const passwordMatch = await bcrypt.compare(
      password,
      user[0][0]?.password_hash
    );

    if (passwordMatch) {
      // Store user information in the session
      req.session.userId = user[0][0].employee_id;
      req.session.username = user[0][0].name;
      req.session.role = user[0][0].role;
      req.session.profileImage = user[0][0].profile_image
      // Redirect to the dashboard route
      res.redirect("/admin/dashboard");
    } else {
      // Password does not match
      res.redirect("/admin/error");
    }
  } catch (error) {
    // res.status(500).send("An error occurred during login");\
    console.log(error)
    res.redirect("/admin/error");
  }
});
router.post("/register", upload.single('profile_image'), async (req, res) => {
  //this will upload image and if there is any error, return to the page
  
  if(!req.file){
    fs.unlinkSync(req.file.path)
    return res.redirect("/admin/error")
  }

  
  
  const mimeType = req.file?.mimetype;
  console.log(imageMimeTypes.includes(mimeType))
  if (!imageMimeTypes.includes(mimeType)){
    fs.unlinkSync(req.file.path)
    return res.redirect("/admin/")
  }
  
  //file uploaded successfully  
  const imagePath = req.file?.filename;

  //This will handle the post request for register
  const { firstName, lastName, email, mobile_number, password, role } = req.body;

  const name = `${firstName} ${lastName}`;

  try {
    // Hash the password using bcrypt
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const uid = generateUID();

    await connectionPool.query(
      `INSERT INTO users (employee_id, name, email, mobile_number, password_hash, role, profile_image) VALUES ('${uid}', '${name}', '${email}', '${mobile_number}', '${passwordHash}', '${role}', '${imagePath}')`
    );

    res.redirect("/admin/dashboard"); // Redirect to the index page if registration is successful
  } catch (error) {
    console.error("Error registering user:", error);
    res.redirect("/admin/error"); // Redirect to the login page in case of an error
  }
});

router.post("/employee",requireSession,  async (req, res) => {
  //this will handle the post request for register
  const { name, email, mobile_number, role } = req.body;

  //   const name = `${firstName} ${lastName}`;

  if (role == "Role...") {
    res.redirect("/admin/error");
    return;
  }
  //give the default password if there is no password available
  const password = "tiger";

  try {
    // Hash the password using bcrypt
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const uid = generateUID();

    // Insert user data into the database
    const str = `INSERT INTO users (role, employee_id, name, email, mobile_number, password_hash) VALUES ('${role}', '${uid}', '${name}', '${email}', '${mobile_number}', '${passwordHash}')`;
   

    await connectionPool.query(str);

    res.redirect("/admin/employees"); // Redirect to the index page if registration is successful
  } catch (error) {
    console.error("Error registering user:", error);
    res.redirect("/admin/error"); // Redirect to the login page in case of an error
  }
});

router.post("/import",requireSession,  upload.single("csvFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Access the CSV data from req.file.buffer
  var csvData;

  csvData = req.file.path;
  try {
    let results = [];
    let error = false;
    fs.createReadStream(csvData)
      .pipe(csv())
      .on("data", (row) => {
        // Process each row of the CSV file
        results.push(row);
      })
      .on("end", () => {
        // All data has been processed
        results.forEach(async (employee) => {
          const password = "tiger";
          try {
            const passwordHash = await bcrypt.hash(password, saltRounds);
            const uid = generateUID();


            // Insert user data into the database
            const str = `INSERT INTO users (role, employee_id, name, email, mobile_number, password_hash) VALUES ('${employee.role}', '${uid}', '${employee.name}', '${employee.email}', '${employee.mobile_number}', '${passwordHash}')`;
            

            await connectionPool.query(str);

            //send password to each guy
            sendEmail("Account Creation Successfull", employee.email, employee.name, "You account was created by project manager, please change you password ASAP. Your Current password  is `tiger`. Use this to login to your account and change password.")


          } catch (err) {
        
            error = true;
          }
        });
      });
    if (!error) {
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/admin/error");
    }
  } catch (err) {
    res.redirect("/admin/error");
  }
});

router.get("/error", async (req, res) => {
  //this will handle the post request for register
  res.render("error-500");
});

router.post("/send-reply", async (req, res)=>{
  try{
    const projectId = req.query?.project_id;
    const taskId = req.query?.task_id;
    const feedback = req.body?.feedback;
    const assignedTo = req.query?.assigned_to;
    console.log(assignedTo)
    await connectionPool.query(`UPDATE tasks SET feedback = '${feedback}' WHERE project_id = '${projectId}' AND id = '${taskId}' AND assigned_to = '${assignedTo}'`)
    console.log(`UPDATE tasks SET feedback = '${feedback}' WHERE project_id = '${projectId}' AND id = '${taskId}' AND assigned_to = '${assignedTo}'`)
    return res.redirect("/admin/tasks")
  }catch(err){
    console.log(err)
    return res.redirect("/admin/error");
  }
})

router.post("/create-project",requireSession,  async (req, res)=>{
  const {projectName, type, due_date, start_date, end_date, members, priority, detail, frequency} = req.body;
  try {
     const result = await connectionPool.query(
       `INSERT INTO projects (name, due_date, start_date, end_date, category, priority, detail, frequency) VALUES ('${projectName}', '${due_date}', '${start_date}', '${end_date}', '${type}', '${priority}', '${detail}', '${frequency}')`
     );
     const insertedId = result[0].insertId;
     let m = [...members]
     console.log(m)
     m?.forEach(async (member) => {
       await connectionPool.query(
         `INSERT INTO project_users (project_id, user_id) VALUES ('${insertedId}', '${member}')`
      );

    const result = await connectionPool.query(`SELECT * FROM users WHERE id = '${member}'`)
    const email = result[0][0]?.email;
    if(frequency == ""){
      cron.schedule(
        `* * * * *`,
        () => {
          sendEmailForProject(projectName, email);
        }
      );
    }
    else if(frequency == "1"){
      //daily
      const nextScheduledDate = calculateNextScheduledDate(new Date(due_date), 'daily');
      cron.schedule(
        `0 ${nextScheduledDate.getHours()} ${nextScheduledDate.getDate()} ${nextScheduledDate.getMonth() + 1} *`,
        () => {
          sendEmailForProject(projectName, email);
        }
      );
    }
    else if(frequency == "2"){
      //weekly
      const nextScheduledDate = calculateNextScheduledDate(new Date(due_date), 'daily');
      cron.schedule(
        `0 ${nextScheduledDate.getHours()} * * 1`,
        () => {
          sendEmailForProject(projectName, email);
        }
      );
    }
    else if(frequency == "3"){
      //monthly
      const nextScheduledDate = calculateNextScheduledDate(new Date(due_date), 'daily');
      cron.schedule(
        `${nextScheduledDate.getMinutes()} ${nextScheduledDate.getHours()} ${nextScheduledDate.getDate()} ${nextScheduledDate.getMonth() + 1} *`,
        () => {
          sendEmailForProject(projectName, email);
        }
      );
    }
    })
    return res.redirect("/admin/dashboard")
  } catch (err) {
    console.log(err)
    res.redirect("/admin/error")
  }
})

router.get("/get-tasks",requireSession,  async (req, res)=>{
  try{
    const result = await connectionPool.query(
      `SELECT tasks.id AS task_id, tasks.*, users.* FROM tasks JOIN users ON tasks.assigned_to = users.id WHERE project_id = ${req.query.project_id}`
    );

    result[0].forEach(r => {
      console.log(r.due_date);
      const difference = getDateDifference(new Date(), r.due_date)
      r.diff = difference;
      console.log(r.diff);
    })

    
    return res.json(result[0])

  }catch(err){
    console.log(err)
  }
})
router.get("/get-employees",requireSession,  async (req, res)=>{
  try{

    const result = await connectionPool.query(
      `SELECT users.name, users.id FROM project_users JOIN users on users.id = project_users.user_id WHERE project_users.project_id = ${req.query.project_id}`
    );

   
    return res.json(result[0])
  }catch(err){

  }
})
router.post("/update-status",requireSession, async (req, res)=>{
  
  try{
    const taskId = req.query.task_id;

    const projectId = req.query.project_id;
    const status = req.body.status;
    await connectionPool.query(`UPDATE tasks SET status = '${status}' WHERE project_id = '${projectId}' AND id = '${taskId}'`)
    console.log(`UPDATE tasks SET status = '${status}' WHERE project_id = '${projectId}' AND id = '${taskId}'`)
    return res.redirect("/admin/tasks")
  }catch(err){
    console.log(err)
    return res.redirect("/admin/error")
  }
})
router.post("/create-task",requireSession,  async (req, res) => {
  
  try{
    const projectid = req.query.project_id;
    const {task_name, start_date, end_date, assigned_to, description, checklist, due_date} = req.body
    const result = await connectionPool.query(
      `INSERT INTO tasks (project_id, task_name, start_date, end_date, assigned_to, due_date, description,checklist) VALUES ('${projectid}', '${task_name}', '${start_date}', '${end_date}', '${assigned_to}', '${due_date}', '${description}', '${checklist}')`
    );
    const insertedId = result[0].insertId;
    checklist.split(',').forEach(async (singleChecklist) => {
      await connectionPool.query(
        `INSERT INTO checklist (task_id, checklist, project_id) VALUES ('${insertedId}', '${singleChecklist}', '${projectid}')`
      );
    })

    const r = await connectionPool.query(`SELECT email, name from users WHERE id = ${assigned_to}`)
    const email = r[0][0]?.email;
    const name = r[0][0]?.name
    //sendEmail("Task Assignment", email, name, "You have been given task, please login to see the task assigned.")
    return res.redirect('/admin/tasks')
  }catch(err){
    return res.redirect("/admin/error")
  }
})
router.get("/logout", (req, res) => {
  //this will handle the post request for logout
  req.session.userId = -1;
  req.session.username = "";
  req.session.role = "";
  req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      } else {
        console.log('Session destroyed.');
      }
    });
  res.redirect("/admin/");
});

module.exports = router;
