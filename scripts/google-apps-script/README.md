# Google Sheets & Google Drive Integration Guide

This guide walks you through linking the **Sologix Energy** "Request a Quote" form to a Google Sheet and Google Drive folder.

---

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.new) in your browser.
2. Name your spreadsheet (e.g. `Sologix Energy - Quote Submissions`).

---

### Step 2: Open Google Apps Script
1. In the top menu of your Google Sheet, click **Extensions** > **Apps Script**.
2. Erase any default code in `Code.gs`.
3. Copy the entire contents of [`scripts/google-apps-script/Code.gs`](./Code.gs) and paste it into the script editor.
4. Click the **Save** (disk) icon or press `Ctrl + S`.

---

### Step 3: Deploy as a Web App
1. At the top right of the Apps Script editor, click **Deploy** > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure the deployment settings:
   - **Description**: `Sologix Quote Webhook`
   - **Execute as**: `Me (your_email@gmail.com)`
   - **Who has access**: `Anyone` *(Crucial: allows anonymous form submissions without requiring users to log in)*
4. Click **Deploy**.

---

### Step 4: Authorize Permissions
1. Google will display an **"Authorization required"** modal. Click **Authorize access**.
2. Choose your Google account.
3. If you see "Google hasn't verified this app", click **Advanced** (bottom left), then click **Go to Untitled project (unsafe)**.
4. Click **Allow** to grant permission to write to your Sheet and save files to your Google Drive.
5. Copy the generated **Web app URL** (it will look like `https://script.google.com/macros/s/AKfycbx.../exec`).

---

### Step 5: Add URL to your `.env` File
1. In your project root, create a file named `.env` (or duplicate `.env.example`):
   ```env
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbxYOUR_SCRIPT_ID/exec
   ```
2. Restart your development server (`npm run dev`) or re-build (`npm run build`).

---

### How It Works Automatically:
* Whenever a client submits a quote:
  1. The form sends the payload via `POST` with `mode: no-cors`.
  2. The Google Apps Script decodes the CAD file (.stl, .step, .obj, .3mf) and saves it into a Google Drive folder named **`Sologix_CAD_Uploads`**.
  3. The script sets file permissions to "Anyone with the link can view".
  4. The script appends a formatted row to the sheet **`Quote_Submissions`** with timestamp, client contact details, material, and the clickable Google Drive file URL.
