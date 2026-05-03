const nodemailer = require("nodemailer");

// Create reusable transporter object
let transporter;

const initializeTransporter = () => {
  if (process.env.NODE_ENV === "development" || process.env.EMAIL_SERVICE === "console") {
    // Log emails in development
    return {
      sendMail: async ({ to, subject, text, html, from }) => {
        console.log("\n--- EMAIL (DEVELOPMENT MODE) ---");
        console.log("From:", from);
        console.log("To:", to);
        console.log("Subject:", subject);
        console.log("Text:", text || "");
        if (html) {
          console.log("HTML:", html);
        }
        console.log("--------------------------------\n");
        return { messageId: "dev-" + Date.now() };
      },
    };
  }

  // Production email service
  if (process.env.EMAIL_SERVICE === "mailtrap" || process.env.EMAIL_HOST === "smtp.mailtrap.io") {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
      port: parseInt(process.env.EMAIL_PORT) || 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Gmail or other services
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (!transporter) {
      transporter = initializeTransporter();
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@drivemanagement.com",
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    
    // In development, still return true so app doesn't break
    if (process.env.NODE_ENV === "development") {
      console.log("Email error ignored in development mode");
      return true;
    }
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;
