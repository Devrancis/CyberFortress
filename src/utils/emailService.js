import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendCyberShieldEmail = async (toEmail, type, ticketId = null) => {
  let subject = "";
  let html = "";

  switch (type) {
    case "WELCOME":
      subject = "Welcome to CyberShield SOC";
      html = `
        <div style="font-family: sans-serif; color: #1e293b;">
          <h2 style="color: #0284c7;">Welcome to CyberShield</h2>
          <p>Your enterprise security account is now active. You have full access to our Tier 1 AI Security Analyst and our Lead Consultant SOC team.</p>
          <p>If you experience any network anomalies, report them immediately in your Command Center.</p>
          <br/>
          <p>Stay Secure,<br/><strong>The CyberShield Team</strong></p>
        </div>
      `;
      break;

    case "AI_RESOLVED":
      subject = `Security Alert Resolved - Ticket #${ticketId.slice(-6)}`;
      html = `
        <div style="font-family: sans-serif; color: #1e293b;">
          <h2 style="color: #0284c7;">Threat Mitigated</h2>
          <p>Your recent security query (Ticket: ${ticketId.slice(-6)}) was analyzed and successfully resolved by our AI framework.</p>
          <p>No further action is required on your part. You can view the full telemetry log in your dashboard.</p>
          <br/>
          <p>Stay Secure,<br/><strong>The CyberShield Team</strong></p>
        </div>
      `;
      break;

    case "PENDING_REMINDER":
      subject = `🚨 ACTION REQUIRED: Schedule SOC Consultation (Ticket #${ticketId.slice(-6)})`;
      html = `
        <div style="font-family: sans-serif; color: #1e293b;">
          <h2 style="color: #ea580c;">Critical Threat Pending</h2>
          <p>Our AI has detected a high-severity anomaly requiring human escalation (Ticket: ${ticketId.slice(-6)}).</p>
          <p><strong>Please log into your CyberShield Command Center immediately and click "Schedule Call" to book an emergency slot with our Lead Consultant.</strong></p>
          <br/>
          <p>Time is of the essence.<br/><strong>The CyberShield Team</strong></p>
        </div>
      `;
      break;

    case "SCHEDULED":
      subject = `Consultation Confirmed - Ticket #${ticketId.slice(-6)}`;
      html = `
        <div style="font-family: sans-serif; color: #1e293b;">
          <h2 style="color: #9333ea;">Consultation Scheduled</h2>
          <p>You have successfully scheduled a secure consultation for Ticket: ${ticketId.slice(-6)}.</p>
          <p>Our Lead Consultant has been notified and will connect with you at the chosen time to mitigate the anomaly.</p>
          <br/>
          <p>Stay Secure,<br/><strong>The CyberShield Team</strong></p>
        </div>
      `;
      break;

    case "HUMAN_RESOLVED":
      subject = `Security Threat Closed - Ticket #${ticketId.slice(-6)}`;
      html = `
        <div style="font-family: sans-serif; color: #1e293b;">
          <h2 style="color: #16a34a;">Incident Resolved</h2>
          <p>Your Lead Security Consultant has successfully mitigated and closed your threat report (Ticket: ${ticketId.slice(-6)}).</p>
          <p>If you have any further questions regarding this incident, you can review the secure thread in your dashboard.</p>
          <br/>
          <p>Stay Secure,<br/><strong>The CyberShield Team</strong></p>
        </div>
      `;
      break;
  }

  try {
    await transporter.sendMail({
      from: `"CyberShield Security" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject,
      html,
    });
    console.log(`Email sent: ${type} to ${toEmail}`);
  } catch (error) {
    console.error("Email failed to send:", error);
  }
};