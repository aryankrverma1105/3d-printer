/**
 * Sologix Energy - Google Apps Script Webhook (Production v3 with Email Forwarding)
 *
 * Deployed as a Web App:
 * - Execute as: Me
 * - Who has access: Anyone (anonymous)
 */

// ==========================================
// CONFIGURATION
// ==========================================
const DRIVE_FOLDER_NAME = "Sologix_CAD_Uploads";
const SHEET_NAME = "Quote_Submissions";

/**
 * 📧 NOTIFICATION EMAIL CONFIGURATION:
 * Enter the email address (or multiple comma-separated emails) where quote submissions will be forwarded.
 * Example: "quotes@sologixenergy.in" or "team@sologixenergy.in, founder@sologixenergy.in"
 */
const NOTIFICATION_EMAIL = "your-email@example.com";

/**
 * Optional: Send a confirmation copy email to the client who submitted the quote.
 * Set to true if you want the client to receive an automatic confirmation receipt.
 */
const SEND_CLIENT_CONFIRMATION = false;

// Maximum allowable binary payload in base64 (~50MB binary = ~68MB base64)
const MAX_BASE64_LENGTH = 50 * 1024 * 1024 * 1.37;

/**
 * ONE-TIME AUTHORIZATION TRIGGER:
 * Select "authorizePermissions" from the top dropdown in Apps Script and click "Run" (▶).
 */
function authorizePermissions() {
  Logger.log("Testing Spreadsheet access...");
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("✅ Spreadsheet accessible: " + ss.getName());

  Logger.log("Testing Drive access...");
  DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  Logger.log("✅ Drive accessible!");

  Logger.log("Testing MailApp permissions (Quota)...");
  const remainingQuota = MailApp.getRemainingDailyQuota();
  Logger.log("✅ MailApp accessible! Daily email quota remaining: " + remainingQuota);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({
        success: false,
        error: "Bad Request: Empty payload received"
      });
    }

    const data = JSON.parse(e.postData.contents);
    
    // Server-side validation
    const fullName = (data.fullName || "").trim();
    const phone = (data.phone || "").trim();
    const email = (data.email || "").trim();
    const address = (data.address || "").trim();
    const projectType = data.projectType || "General Quote";
    const material = data.material || "Standard";
    const notes = data.notes || "";

    if (!fullName || !phone || !email) {
      return createJsonResponse({
        success: false,
        error: "Validation failed: fullName, phone, and email are required fields."
      });
    }

    // Server-side fileData size cap (~50MB)
    if (data.fileData && data.fileData.length > MAX_BASE64_LENGTH) {
      return createJsonResponse({
        success: false,
        error: "Payload too large: Attached CAD file exceeds the 50MB limit."
      });
    }

    const timestamp = new Date().toISOString();
    let fileUrl = "No file attached";
    let fileName = data.fileName ? String(data.fileName).replace(/[^a-zA-Z0-9._-]/g, '_') : "None";
    let fileSize = data.fileSize || "0 KB";

    // 1. Handle File Upload to Google Drive
    if (data.fileData && data.fileName) {
      try {
        const decodedBytes = Utilities.base64Decode(data.fileData);
        const blob = Utilities.newBlob(
          decodedBytes,
          data.fileMimeType || "application/octet-stream",
          `${Date.now()}_${fileName}`
        );
        
        let targetFolder;
        const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
        if (folders.hasNext()) {
          targetFolder = folders.next();
        } else {
          targetFolder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
        }
        
        const driveFile = targetFolder.createFile(blob);
        fileUrl = driveFile.getUrl();
      } catch (driveErr) {
        fileUrl = "Drive Error: " + driveErr.message;
      }
    }

    // 2. Append row to Google Sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Phone Number",
        "Work Email",
        "Delivery Address",
        "Project Type",
        "Material Preference",
        "Drive File Link",
        "File Name",
        "File Size",
        "Notes"
      ]);
      sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#1A1A1E").setFontColor("#FF7A00");
    }

    sheet.appendRow([
      timestamp,
      fullName,
      phone,
      email,
      address,
      projectType,
      material,
      fileUrl,
      fileName,
      fileSize,
      notes
    ]);

    // 3. Forward Quote details via Email Notification
    if (NOTIFICATION_EMAIL && NOTIFICATION_EMAIL !== "your-email@example.com") {
      sendNotificationEmail({
        fullName,
        phone,
        email,
        address,
        projectType,
        material,
        fileName,
        fileSize,
        fileUrl,
        notes
      });
    }

    // 4. (Optional) Send Confirmation Email to Client
    if (SEND_CLIENT_CONFIRMATION && email) {
      sendClientConfirmationEmail({
        fullName,
        email,
        projectType,
        material,
        fileName
      });
    }

    return createJsonResponse({
      success: true,
      message: "Lead recorded and forwarded successfully",
      driveFileUrl: fileUrl
    });

  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.toString()
    });
  }
}

/**
 * Sends a rich HTML notification email to the administrator/sales email.
 */
function sendNotificationEmail(lead) {
  try {
    const subject = `🔔 New Quote Request: ${lead.fullName} (${lead.projectType})`;
    const formattedDate = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a");

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #1F2937; line-height: 1.6; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color: #0D1520; padding: 22px 24px; border-bottom: 3px solid #FF7A00;">
          <h2 style="color: #FFFFFF; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">
            SOLOGIX <span style="color: #FF7A00;">ENERGY</span>
          </h2>
          <p style="color: #9CA3AF; margin: 4px 0 0 0; font-size: 13px;">New Manufacturing & Quote Request Received</p>
        </div>
        
        <!-- Body Container -->
        <div style="padding: 24px; background-color: #FFFFFF;">
          
          <!-- Client Details -->
          <h3 style="color: #111827; margin: 0 0 12px 0; font-size: 15px; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
            👤 Client Contact Information
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #6B7280; width: 140px; font-weight: bold;">Full Name:</td>
              <td style="padding: 6px 0; color: #111827; font-weight: bold;">${lead.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-weight: bold;">Phone Number:</td>
              <td style="padding: 6px 0; color: #111827;">
                <a href="tel:${lead.phone}" style="color: #FF7A00; text-decoration: none; font-weight: bold;">${lead.phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-weight: bold;">Work Email:</td>
              <td style="padding: 6px 0; color: #111827;">
                <a href="mailto:${lead.email}" style="color: #2563EB; text-decoration: none; font-weight: bold;">${lead.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-weight: bold;">Delivery Location:</td>
              <td style="padding: 6px 0; color: #111827;">${lead.address || "Not provided"}</td>
            </tr>
          </table>

          <!-- Project Details -->
          <h3 style="color: #111827; margin: 0 0 12px 0; font-size: 15px; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
            ⚙️ Project Specifications
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #6B7280; width: 140px; font-weight: bold;">Project Type:</td>
              <td style="padding: 6px 0; color: #111827; font-weight: bold;">${lead.projectType}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-weight: bold;">Material Preference:</td>
              <td style="padding: 6px 0; color: #111827;">${lead.material}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-weight: bold;">Attached File:</td>
              <td style="padding: 6px 0; color: #111827;">
                ${lead.fileName !== "None" ? `<strong>${lead.fileName}</strong> (${lead.fileSize})` : "No file attached"}
              </td>
            </tr>
            ${lead.fileUrl && lead.fileUrl.startsWith("http") ? `
            <tr>
              <td style="padding: 10px 0 6px 0; color: #6B7280; font-weight: bold;">Drive File:</td>
              <td style="padding: 10px 0 6px 0;">
                <a href="${lead.fileUrl}" target="_blank" style="background-color: #FF7A00; color: #FFFFFF; padding: 7px 14px; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: bold; display: inline-block;">
                  📥 Download CAD File from Drive
                </a>
              </td>
            </tr>
            ` : ""}
          </table>

          <!-- Notes -->
          ${lead.notes ? `
          <h3 style="color: #111827; margin: 0 0 12px 0; font-size: 15px; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
            📝 Requirements & Notes
          </h3>
          <div style="background-color: #F8FAFC; border-left: 3px solid #FF7A00; padding: 12px 16px; margin-bottom: 22px; font-size: 13.5px; white-space: pre-wrap; color: #334155; border-radius: 0 4px 4px 0;">
            ${lead.notes}
          </div>
          ` : ""}

          <!-- Quick Action Reply Note -->
          <div style="background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; padding: 12px 16px; font-size: 13px; color: #1E40AF;">
            💡 <strong>Quick Reply:</strong> Simply click <strong>Reply</strong> in your email client to respond directly to <strong>${lead.fullName}</strong> (${lead.email}).
          </div>

          <!-- Footer -->
          <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #E5E7EB; font-size: 11.5px; color: #9CA3AF; text-align: center;">
            Sologix Energy Additive Manufacturing Platform • Received on ${formattedDate} (IST)
          </div>

        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      htmlBody: htmlBody,
      replyTo: lead.email // When you click "Reply", it replies directly to the customer!
    });

  } catch (err) {
    Logger.log("Notification email error: " + err.toString());
  }
}

/**
 * (Optional) Sends an automatic confirmation email to the customer.
 */
function sendClientConfirmationEmail(lead) {
  try {
    const subject = `Quote Request Received — Sologix Energy`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1F2937; line-height: 1.6; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0D1520; padding: 20px; border-bottom: 3px solid #FF7A00;">
          <h2 style="color: #FFFFFF; margin: 0; font-size: 18px;">
            SOLOGIX <span style="color: #FF7A00;">ENERGY</span>
          </h2>
          <p style="color: #9CA3AF; margin: 4px 0 0 0; font-size: 12.5px;">Precision Additive Manufacturing</p>
        </div>
        <div style="padding: 24px;">
          <p>Hi <strong>${lead.fullName}</strong>,</p>
          <p>Thank you for submitting your manufacturing quote request. Our engineering team has received your details and CAD geometry specifications.</p>
          
          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 14px; margin: 18px 0; font-size: 13.5px;">
            <p style="margin: 0 0 6px 0;"><strong>Project Type:</strong> ${lead.projectType}</p>
            <p style="margin: 0 0 6px 0;"><strong>Material Preference:</strong> ${lead.material}</p>
            <p style="margin: 0;"><strong>CAD File:</strong> ${lead.fileName !== "None" ? lead.fileName : "No file attached"}</p>
          </div>

          <p>Our DFM engineers will evaluate your part geometry and reply with a formal manufacturing quotation within <strong>1 to 2 business days</strong>.</p>
          <p>If you have any urgent queries or revisions, reply directly to this email or reach us at <a href="mailto:projects@sologixenergy.com" style="color: #FF7A00;">projects@sologixenergy.com</a>.</p>
          
          <p style="margin-top: 24px; color: #4B5563;">Best regards,<br><strong>Sologix Energy Engineering Team</strong></p>
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: lead.email,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log("Client confirmation email error: " + err.toString());
  }
}

/**
 * Returns a JSON output with MIME type application/json
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
