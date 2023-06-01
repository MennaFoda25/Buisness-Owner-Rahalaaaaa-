const nodemailer = require('nodemailer');
const factory = require('../controlles/handlerFactroy');

// Create a transporter with your email service provider's configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mena.foda2000@gmail.com',
    pass: 'Menna2000/9',
  },
});

// Create a function to send the email
const sendEmailToAdmin = async (adminEmail, hotelDetails) => {
  try {
    const subject = 'New Hotel Creation Request - Pending Review';

    const html = `
      <h1>New Hotel Creation Request</h1>
      <p>A business owner has requested to create a new hotel. The request is currently pending review.</p>
      <p>Hotel details:</p>
      <ul>
        <li>Name: ${hotelDetails.name}</li>
        <li>Location: ${hotelDetails.location}</li>
        <li>Owner: ${hotelDetails.owner}</li>
      </ul>
      <p>Please take appropriate action to review and process the request.</p>
    `;

    const mailOptions = {
      from: 'owner@gmail.com',
      to: adminEmail,
      subject: subject,
      html: html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

exports.createHotel = async (req, res) => {
  try {
    // Logic to create a new hotel in the database

    // Send email notification to admin
    const adminEmail = 'mena.foda2000@gmail.com';
    const hotelDetails = {
      name: req.body.name,
      location: req.body.location,
      owner: req.user.name,
    };

    // Usage: Call the sendEmailToAdmin function after a business owner requests to create a hotel
    await sendEmailToAdmin(adminEmail, hotelDetails);

    res.status(201).json({
      status: 'success',
      message: 'Hotel creation request sent to the admin',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating the hotel',
    });
  }
};








// const nodemailer = require('nodemailer');


// const   sendEmail= async options => {
//     // 1 transporrter (the party that will send and recieve the email) 

//     const  transporter = nodemailer.createTransport({
//         host :  process.env.EMAIL_HOST,
//         port :  process.env.EMAIL_PORT  ,
//         auth: {
//             user: process.env.EMAIL_USERNAME , 
//             pass: process.env.EMAIL_PASSWORD , 
//         }
//     })


//     const mailOption = {
//         from : 'buizznzz name <>' ,
//         to : options.email ,
//         subject : options.subject ,
//         text : options.message 
//     }

//     await transporter.sendMail(mailOption) ;    

// }

// module.exports = sendEmail ;