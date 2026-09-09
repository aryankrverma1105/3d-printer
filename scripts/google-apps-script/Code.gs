/**
 * Sologix Energy - Google Apps Script Webhook
 *
 * Deployed as a Web App:
 * - Execute as: Me
 * - Who has access: Anyone (anonymous)
 */

// CONFIGURATION: Replace with your actual Drive Folder Name and Sheet Name
const DRIVE_FOLDER_NAME = "Sologix_CAD_Uploads";
const SHEET_NAME = "Quote_Submissions";

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
      
      let step = "1: init";
      try {
        step = "2: decode base64";
        const decodedBytes = Utilities.base64Decode(data.fileData);
        const blob = Utilities.newBlob(
          decodedBytes,
          data.fileMimeType || "application/octet-stream",
          `${Date.now()}_${fileName}`
        );
        
        step = "3: getFoldersByName";
        let targetFolder;
        const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
        if (folders.hasNext()) {
          targetFolder = folders.next();
        } else {
          step = "4: createFolder";
          targetFolder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
        }
        
        step = "5: createFile";
        const driveFile = targetFolder.createFile(blob);
        
        step = "6: getUrl";
        fileUrl = driveFile.getUrl();
      } catch (driveErr) {
        fileUrl = "Drive Error at step [" + step + "]: " + driveErr.message;
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
