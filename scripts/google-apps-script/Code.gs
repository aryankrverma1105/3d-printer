/**
 * Sologix Energy - Google Apps Script Webhook
 *
 * Deployed as a Web App:
 * - Execute as: Me
 * - Who has access: Anyone (anonymous)
 *
 * This script receives lead submissions from the Sologix Energy quote form,
 * uploads attached CAD/STL files to a designated Google Drive folder,
 * and records the row in a connected Google Spreadsheet.
 */

// CONFIGURATION: Replace with your actual Drive Folder ID and Sheet Name
const DRIVE_FOLDER_NAME = "Sologix_CAD_Uploads";
const SHEET_NAME = "Quote_Submissions";

/**
 * ONE-TIME AUTHORIZATION TRIGGER:
 * Select "authorizePermissions" from the top dropdown in Apps Script and click "Run" (▶).
 * This forces Google to prompt for one-time Drive and Spreadsheet authorization!
 */
function authorizePermissions() {
  try {
    const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log("✅ Drive and Spreadsheet permissions successfully authorized!");
  } catch (err) {
    Logger.log("Authorization prompt error: " + err.message);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    const timestamp = new Date().toISOString();
    const fullName = data.fullName || "Anonymous";
    const phone = data.phone || "Not Provided";
    const email = data.email || "Not Provided";
    const address = data.address || "Not Provided";
    const projectType = data.projectType || "General Quote";
    const material = data.material || "Standard";
    const notes = data.notes || "";
    
    let fileUrl = "No file attached";
    let fileName = "None";
    let fileSize = "0 KB";

    // Handle File Upload to Google Drive
    if (data.fileData && data.fileName) {
      fileName = data.fileName;
      fileSize = data.fileSize || "Unknown";
      
      try {
        // Locate or create the target Google Drive folder
        let folder;
        const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
        if (folders.hasNext()) {
          folder = folders.next();
        } else {
          folder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
        }
        
        // Decode binary content and create file
        const decodedBytes = Utilities.base64Decode(data.fileData);
        const blob = Utilities.newBlob(decodedBytes, data.fileMimeType || "application/octet-stream", `${Date.now()}_${fileName}`);
        const driveFile = folder.createFile(blob);
        
        // Set view access so engineering team can inspect CAD
        driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        fileUrl = driveFile.getUrl();
      } catch (driveErr) {
        fileUrl = "Drive Error (Authorize DriveApp): " + driveErr.message;
      }
    }

    // Append to Google Sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Header row
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

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Lead recorded successfully",
      driveFileUrl: fileUrl
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
