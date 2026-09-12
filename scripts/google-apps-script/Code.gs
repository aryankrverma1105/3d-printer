/**
 * Sologix Energy - Google Apps Script Webhook (Production v2)
 *
 * Deployed as a Web App:
 * - Execute as: Me
 * - Who has access: Anyone (anonymous)
 */

// CONFIGURATION: Replace with your actual Drive Folder Name and Sheet Name
const DRIVE_FOLDER_NAME = "Sologix_CAD_Uploads";
const SHEET_NAME = "Quote_Submissions";

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
  const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  Logger.log("✅ Drive accessible!");
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
    
    // Server-side abuse protection & validation
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

    // Handle File Upload to Google Drive
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

    // Append to Google Sheet
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

    return createJsonResponse({
      success: true,
      message: "Lead recorded successfully",
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
 * Returns a JSON output with MIME type application/json
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
