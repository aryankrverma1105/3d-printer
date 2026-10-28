# Google Sheets, Drive & Email Notification Setup Guide

This guide walks you through linking the **Sologix Energy** "Request a Quote" form to:
1. **Google Sheets** (to store all lead data in rows).
2. **Google Drive** (to save customer CAD / STL file uploads).
3. **Email Forwarding** (to instantly forward every quote with customer contact info & download links to your designated email account).

---

### Step 1: Open Google Apps Script
1. Open your Google Sheet that receives the quote submissions (or create a new one at [sheets.new](https://sheets.new)).
2. In the top menu, click **Extensions** > **Apps Script**.

---

### Step 2: Paste the Updated `Code.gs` & Configure Your Email
1. Erase any existing code in `Code.gs`.
2. Copy the entire contents of [`scripts/google-apps-script/Code.gs`](./Code.gs) and paste it into the editor.
3. At the top of `Code.gs` (around line 17), set your destination email address:
   ```javascript
   const NOTIFICATION_EMAIL = "arpit@sologixenergy.in";
   ```
   *(You can enter a single email or multiple comma-separated emails, e.g. `"sales@sologixenergy.in, arpit@..."`)*.
4. (Optional) Set `SEND_CLIENT_CONFIRMATION = true;` if you also want the customer to receive an automatic acknowledgment email.
5. Press `Ctrl + S` to save.

---

### Step 3: Update Manifest Permissions (`appsscript.json`)
1. Click **Project Settings** (gear icon ⚙️ on the left sidebar).
2. Check the box: **"Show 'appsscript.json' manifest file in editor"**.
3. Click the **Editor** (`< >`) icon on the left sidebar and click on **`appsscript.json`**.
4. Replace its content with [`scripts/google-apps-script/appsscript.json`](./appsscript.json):
   ```json
   {
     "timeZone": "Asia/Kolkata",
     "dependencies": {},
     "exceptionLogging": "STACKDRIVER",
     "runtimeVersion": "V8",
     "webapp": {
       "executeAs": "USER_DEPLOYING",
       "access": "ANYONE"
     },
     "oauthScopes": [
       "https://www.googleapis.com/auth/spreadsheets",
       "https://www.googleapis.com/auth/drive",
       "https://www.googleapis.com/auth/script.send_mail"
     ]
   }
   ```
5. Press `Ctrl + S` to save.

---

### Step 4: Authorize Permissions (One-Time)
1. Switch back to `Code.gs` in the file list.
2. In the top toolbar dropdown (next to *Debug*), select **`authorizePermissions`**.
3. Click **Run** (▶).
4. Google will show an authorization prompt:
   - Click **Review permissions**.
   - Select your Google Workspace account.
   - Click **Advanced** > **Go to (unsafe)**.
   - Click **Allow**.
5. The Execution log at the bottom will display:
   ```
   ✅ Spreadsheet accessible
   ✅ Drive accessible
   ✅ MailApp accessible! Daily email quota remaining: 1500
   ```

---

### Step 5: Deploy as a New Web App Version (Crucial!)
> [!IMPORTANT]
> Google Apps Script Web Apps **only** run code from the active deployment version. If you edit code without deploying a **New Version**, Google will continue running the old code!

1. At the top right, click **Deploy** > **Manage deployments**.
2. Click the **Edit (pencil icon ✏️)** next to your active Web App deployment.
3. Under **Version**, click the dropdown and choose **New version**.
4. Leave settings as:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
5. Click **Deploy**.
6. If the URL remains the same, your website will immediately start forwarding emails! If a new URL is generated, update `VITE_GOOGLE_APPS_SCRIPT_URL` in your `.env` file and rebuild (`npm run build`).
