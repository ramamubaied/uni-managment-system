const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const transporter = require('./emailConfig');

const { differenceInDays,differenceInSeconds, differenceInMonths, differenceInHours, differenceInMinutes } = require('date-fns');


// Function to send an email
function sendEmail(subject, to, name, body) {
  const mailOptions = {
    from: 'NexoPlan',
    to: to,
    subject: subject,
    text: `Hello ${name},\n\n${body}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}



// Function to calculate the next scheduled date and time
function calculateNextScheduledDate(scheduledDate, frequency) {
  const now = new Date();
  switch (frequency) {
    case 'daily':
      scheduledDate.setDate(scheduledDate.getDate() + 1);
      break;
    case 'weekly':
      scheduledDate.setDate(scheduledDate.getDate() + 7);
      break;
    case 'monthly':
      scheduledDate.setMonth(scheduledDate.getMonth() + 1);
      break;
    case 'minute':
      scheduledDate.setMinutes(scheduledDate.getMinutes() + 1);
      break
    default:
      throw new Error(`Invalid frequency: ${frequency}`);
  }

  // Check if the scheduled time is in the past, if so, add 1 day
  if (scheduledDate <= now) {
    scheduledDate.setDate(scheduledDate.getDate() + 1);
  }

  return scheduledDate;
}

// Function to send email for a project
function sendEmailForProject(name, recipientEmail) {
  console.log("Email section")
  const mailOptions = {
    from: 'waleedmansson@gmail.com',
    to: recipientEmail,
    subject: `Selection for project: ${name}`,
    text: `You have been selected for doing the tasks for project "${name}". Please wait for the admin to assign tasks for you if you have no tasks yet. If you have then complete the tasks before due date.`,
  };
  console.log("Send email")
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email for ${name}:`, error);
    } else {
      console.log(`${name} email sent:`, info.response);
    }
  });
}

const imageMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/jpg',
  ];

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
      const filename = generateUID() + "." + file?.originalname?.split(".")[1];
      cb(null, filename);
    },
  });
  const upload = multer({ storage });
  function getDateDifference(startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    const timeDifference = endDate - startDate;

    // Calculate the difference in months
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();

    let monthsDifference = (endYear - startYear) * 12 + (endMonth - startMonth);

    // Calculate the difference in days
    const daysInMonth = 30.44; // Average days per month
    const daysDifference = Math.floor((timeDifference / (1000 * 60 * 60 * 24)) % daysInMonth);

    // Calculate the remaining time
    const remainingTime = timeDifference - monthsDifference * (1000 * 60 * 60 * 24 * daysInMonth) - daysDifference * (1000 * 60 * 60 * 24);

    // Calculate hours, minutes, and seconds
    const hoursDifference = Math.floor(remainingTime / (1000 * 60 * 60));
    const remainingTimeInHours = remainingTime - hoursDifference * (1000 * 60 * 60);

    const minutesDifference = Math.floor(remainingTimeInHours / (1000 * 60));
    const remainingTimeInMinutes = remainingTimeInHours - minutesDifference * (1000 * 60);

    const secondsDifference = Math.floor(remainingTimeInMinutes / 1000);

    return {
      months: monthsDifference,
      days: daysDifference,
      hours: hoursDifference,
      minutes: minutesDifference,
      seconds: secondsDifference,
    };
  }
  function formatDateToDayMonthYear(inputDate) {
    // Create a Date object from the input date string
    const date = new Date(inputDate);
  
    // Get the day, month, and year components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based, so add 1
    const year = date.getFullYear();
  
    // Format the components as two-digit strings
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');
  
    // Create the formatted date string in "day-month-year" format
    const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;
  
    return formattedDate;
  }
 
module.exports = {sendEmailForProject, calculateNextScheduledDate,  imageMimeTypes, generateUID, upload, sendEmail, getDateDifference, formatDateToDayMonthYear}