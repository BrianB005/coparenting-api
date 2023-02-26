const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "brianbett316@gmail.com",
      pass: "htswksxlgqscegwb",
    },
  });
  try {
    let info = await transporter.sendMail({
      from: "Coparenting brianbett316@gmail",
      to: req.params.recipient,
      subject: "Invitation to join coparenting app",
      html: `<h1>Greetings</h1><br><h2>It's an android app that helps separated parents communicate effectively and organize for the well-being of their children.</h2><br> <h2>Search coparenting on playstore then Use the code below while registering</h2><br><h1 style="color: blue;font-weight: bold; text-decoration:underline">${req.user.userId}</h1>`,
      // html:
    });

    console.log(info);
    res.status(200).json("Email sent successfully!");
  } catch (error) {
    console.log(error);
  }
};
module.exports = { sendMail };
