const sendEmail = async ({ to, subject, text, html }) => {
  // Pluggable sender: currently logs email payload for local development.
  console.log("\n--- EMAIL ---");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("Text:", text || "");
  if (html) {
    console.log("HTML:", html);
  }
  console.log("-------------\n");
  return true;
};

module.exports = sendEmail;
