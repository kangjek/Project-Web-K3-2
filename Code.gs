// ============================================================
// SafeMe – Google Apps Script (Code.gs)
// Paste this entire file into your Google Apps Script editor,
// deploy as Web App (Execute as: Me, Access: Anyone), then
// copy the deployment URL into all HTML files as SAFEME_API.
// ============================================================

const SHEET_NAME   = 'Reports';
const PHOTO_FOLDER = 'SafeMe_Photos';   // Folder name in your Drive

// ── Entry points ─────────────────────────────────────────────

function doGet(e) {
  const p      = e.parameter || {};
  const action = p.action    || '';
  const cb     = p.callback  || '';

  let result;
  try {
    if (action === 'getReports') {
      result = getReports();
    } else {
      result = { status: 'error', message: 'Unknown action' };
    }
  } catch (err) {
    result = { status: 'error', message: err.message };
  }

  const json = JSON.stringify(result);
  if (cb) {
    // JSONP fallback for environments that block CORS
    return ContentService
      .createTextOutput(`${cb}(${json})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOut({ status: 'error', message: 'Invalid JSON' });
  }

  const action = body.action || '';

  try {
    if (action === 'syncAll')      return jsonOut(syncAll(body.reports || []));
    if (action === 'deleteReport') return jsonOut(deleteReport(body.backendId));
    return jsonOut({ status: 'error', message: 'Unknown action' });
  } catch (err) {
    return jsonOut({ status: 'error', message: err.message });
  }
}

// ── Helpers ───────────────────────────────────────────────────

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      '__backendId','report_date','type','category','reporter_name',
      'department','location','status','priority','details',
      'description','box_type','items_status','admin_notes',
      'completed_date','photo_url'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 16).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
  }
  return sheet;
}

function getPhotoFolder() {
  const files   = DriveApp.getFoldersByName(PHOTO_FOLDER);
  if (files.hasNext()) return files.next();
  return DriveApp.createFolder(PHOTO_FOLDER);
}

// ── Core actions ──────────────────────────────────────────────

/**
 * syncAll – upsert every report from the client.
 * If a report contains photoData (base64), it is saved to Drive
 * and the resulting public URL is written to the sheet instead.
 */
function syncAll(reports) {
  if (!reports || !reports.length) return { status: 'success', synced: 0 };

  const sheet  = getSheet();
  const data   = sheet.getDataRange().getValues();
  const header = data[0];
  const idCol  = header.indexOf('__backendId');

  // Build index: backendId -> rowIndex (1-based, 1 = header)
  const rowMap = {};
  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol]) rowMap[data[i][idCol]] = i + 1;
  }

  reports.forEach(r => {
    let photoUrl = r.photoUrl || '';

    // If base64 photo data is present, persist to Drive
    if (r.photoData && r.photoData.startsWith('data:image')) {
      try {
        const match   = r.photoData.match(/^data:(image\/\w+);base64,(.+)$/);
        const mime    = match[1];
        const b64     = match[2];
        const bytes   = Utilities.base64Decode(b64);
        const blob    = Utilities.newBlob(bytes, mime, `${r.backendId || Date.now()}.jpg`);
        const folder  = getPhotoFolder();
        const file    = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        photoUrl = `https://drive.google.com/uc?id=${file.getId()}`;
      } catch (e) {
        photoUrl = 'photo_upload_failed';
      }
    }

    const row = [
      r.backendId        || '',
      r.date             || '',
      r.type             || '',
      r.category         || '',
      r.reporter         || '',
      r.department       || '',
      r.location         || '',
      r.status           || '',
      r.priority         || 'Normal',
      r.details          || '',
      r.description      || '',
      r.boxType          || '',
      r.itemsStatus      || '',
      r.adminNotes       || '',
      r.completedDate    || '',
      photoUrl
    ];

    if (rowMap[r.backendId]) {
      // Update existing row
      sheet.getRange(rowMap[r.backendId], 1, 1, row.length).setValues([row]);
    } else {
      // Append new row
      sheet.appendRow(row);
    }
  });

  return { status: 'success', synced: reports.length };
}

/** getReports – return all rows as an array of report objects */
function getReports() {
  const sheet = getSheet();
  const data  = sheet.getDataRange().getValues();
  if (data.length <= 1) return { status: 'success', reports: [] };

  const header  = data[0];
  const reports = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;   // skip blank rows

    const obj = {};
    header.forEach((key, j) => { obj[key] = row[j] !== undefined ? String(row[j]) : ''; });

    // Ensure __backendId is present
    if (!obj.__backendId) continue;

    reports.push(obj);
  }

  // Newest first
  reports.sort((a, b) => new Date(b.report_date || 0) - new Date(a.report_date || 0));

  return { status: 'success', reports };
}

/** deleteReport – remove the row matching backendId */
function deleteReport(backendId) {
  if (!backendId) return { status: 'error', message: 'No backendId' };

  const sheet  = getSheet();
  const data   = sheet.getDataRange().getValues();
  const header = data[0];
  const idCol  = header.indexOf('__backendId');

  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][idCol] === backendId) {
      sheet.deleteRow(i + 1);
      return { status: 'success', deleted: backendId };
    }
  }

  return { status: 'error', message: 'Report not found' };
}
