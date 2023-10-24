const connectionPool = require("../utils/db");
const bcrypt = require("bcrypt");
const fs = require("fs"); // To save the avatar image
const {imageMimeTypes} = require("./../utils/helperFunctions")
const {saltRounds} = require("./../utils/constants")
const editProfile = async (req, res) => {
 //this will upload image and if there is any error, return to the page
if(req.file !== undefined){
 if(!req.file){
    fs.unlinkSync(req.file.path)
    return res.redirect("/admin/error")
  }
  const mimeType = req.file?.mimetype;
  if (!imageMimeTypes.includes(mimeType)){
    fs.unlinkSync(req.file.path)
    return res.redirect("/admin/")
  }
}
  //file uploaded successfully  
  const imagePath = req.file?.filename ? req.file?.filename : req.session.profileImage;

  //This will handle the post request for register
  const { name, username, city, gender, country, address } = req.body;

 

  try {
    await connectionPool.query(
      `UPDATE users SET name='${name}',username='${username}', profile_image='${imagePath}',city='${city}',gender='${gender}', country ='${country}',address='${address}' WHERE employee_id = '${req.session.userId}'`
    );
    req.session.username = name;
    req.session.profileImage = imagePath;
    return res.redirect(`/admin/edit-profile?profile_id=${req.session.userId}`); // Redirect to the index page if registration is successful
  } catch (error) {
    res.redirect("/admin/error"); // Redirect to the login page in case of an error
  }
}
const changePassword = async (req, res) => {
    const {password} = req.body;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    try{
        await connectionPool.query(`UPDATE users SET password_hash = '${passwordHash}' WHERE employee_id = '${req.session.userId}'`)
        return res.redirect(`/admin/edit-profile?profile_id=${req.session.userId}`); // 
    }catch(err){
        return res.redirect("/admin/error")
    }
}

const editProfileEmployee = async (req, res) => {
  //this will upload image and if there is any error, return to the page
 if(req.file !== undefined){
  if(!req.file){
     fs.unlinkSync(req.file.path)
     return res.redirect("/admin/error")
   }
   const mimeType = req.file?.mimetype;
   if (!imageMimeTypes.includes(mimeType)){
     fs.unlinkSync(req.file.path)
     return res.redirect("/admin/")
   }
 }
   //file uploaded successfully  
   const imagePath = req.file?.filename ? req.file?.filename : req.session.profileImage;
 
   //This will handle the post request for register
   const { name, username, city, gender, country, address } = req.body;
 
  
 
   try {
     await connectionPool.query(
       `UPDATE users SET name='${name}',username='${username}', profile_image='${imagePath}',city='${city}',gender='${gender}', country ='${country}',address='${address}' WHERE employee_id = '${req.session.userId}'`
     );
     req.session.username = name;
     req.session.profileImage = imagePath;
     return res.redirect(`/employee/edit-profile?profile_id=${req.session.userId}`); // Redirect to the index page if registration is successful
   } catch (error) {
     res.redirect("/employee/error"); // Redirect to the login page in case of an error
   }
 }
 const changePasswordEmployee = async (req, res) => {
     const {password} = req.body;
     const passwordHash = await bcrypt.hash(password, saltRounds);
     try{
         await connectionPool.query(`UPDATE users SET password_hash = '${passwordHash}' WHERE employee_id = '${req.session.userId}'`)
         return res.redirect(`/employee/edit-profile?profile_id=${req.session.userId}`); // 
     }catch(err){
         return res.redirect("/employee/error")
     }
 }
module.exports = {editProfile, changePassword,editProfileEmployee, changePasswordEmployee}