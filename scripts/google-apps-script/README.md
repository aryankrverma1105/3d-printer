# Google Sheets & Google Drive Integration Guide

This guide walks you through linking the **Sologix Energy** "Request a Quote" form to a Google Sheet and Google Drive folder.

> [!WARNING]
> **Security Notice**: Rotate your Google Apps Script deployment URL if it was ever hardcoded, exposed publicly, or committed to a repository before — treat any previously exposed URL as compromised and generate a fresh deployment version.

---

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.new) in your browser.
2. Name your spreadsheet (e.g. `Sologix Energy - Quote Submissions`).

---

### Step 2: Open Google Apps Script
1. In the top menu of your Google Sheet, click **Extensions** > **Apps Script**.
2. Erase any default code in `Code.gs`.
3. Copy the entire contents of [`scripts/google-apps-script/Code.gs`](./Code.gs) and paste it into the script editor.
4. Press `Ctrl + S` to save.

---

### Step 3: Configure Manifest Scopes (`appsscript.json`)
1. Click **Project Settings** (gear icon ⚙️ on the left sidebar).
2. Check the box: **"Show 'appsscript.json' manifest file in editor"**.
3. Click the **Editor** (`< >`) icon on the left sidebar and select **`appsscript.json`**.
4. Paste the contents of [`scripts/google-apps-script/appsscript.json`](./appsscript.json):
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
       "https://www.googleapis.com/auth/drive"
     ]
   }
   ```
5. Press `Ctrl + S` to save.

---

### Step 4: Authorize Permissions (One-Time)
1. Select `Code.gs` in the file list.
2. In the top toolbar dropdown, select **`authorizePermissions`**.
3. Click **Run** (▶).
4. Google will pop up an authorization dialog: click **Review permissions** → select your Google Account → click **Advanced** → click **Go to (unsafe)** → click **Allow**.

---

### Step 5: Deploy as a Web App
1. At the top right, click **Deploy** > **Manage deployments** (or **New deployment**).
2. Configure deployment:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(Crucial: allows website visitors to submit quotes anonymously)*
   - Set Version to **New version**.
3. Click **Deploy** and copy the **Web app URL** (`https://script.google.com/macros/s/AKfycbx.../exec`).

---

### Step 6: Add URL to your `.env` File
In your project root, set the variable in `.env`:
```env
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbxYOUR_DEPLOYMENT_ID/exec
```
*(Never commit `.env` to version control; it is ignored via `.gitignore`)*.
