function requireSession(req, res, next) {
    // Check if req.session is defined (assuming you're using a library like Express Session)
    if (!req.session || !req.session.userId || !req.session.username) {
      // If not, redirect the user to the login page
      return res.redirect('/admin/'); // Replace '/login' with the actual login route
    }
  
    // If req.session is defined, proceed to the next middleware or route handler
    next();
  }

function requireSessionEmployee(req, res, next) {
    // Check if req.session is defined (assuming you're using a library like Express Session)
    if (!req.session) {
      // If not, redirect the user to the login page
      console.log("Session not created")
      return res.redirect('/employee/'); // Replace '/login' with the actual login route
    }
  
    // If req.session is defined, proceed to the next middleware or route handler
    next();
}
  module.exports = {requireSession, requireSessionEmployee};