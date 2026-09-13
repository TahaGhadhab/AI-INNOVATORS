/**
 * AI INNOVATORS · registration endpoint (Google Apps Script)
 *
 * Receives the form from register.html and appends one row per member
 * to the "Members" sheet of the spreadsheet this script is attached to.
 * Setup steps: see README.md → "Connect the Google Sheet".
 */

const SPREADSHEET_ID = '1O6SRWycF5f1MvzkLL1B9hsnmaaiIXRa0HhtjoIVNCYk';
const SHEET_NAME = 'Members';

// Column order in the sheet. [header, form field]
const COLUMNS = [
  ['Timestamp', null],
  ['Full name', 'fullName'],
  ['Email', 'email'],
  ['Phone', 'phone'],
  ['Student ID', 'studentId'],
  ['Department', 'department'],
  ['Year', 'year'],
  ['Projects', 'interests'],
  ['Roles', 'roles'],
  ['Experience', 'experience'],
  ['Motivation', 'motivation'],
  ['Heard via', 'source'],
  ['Consent', 'consent'],
  ['Language', 'lang']
];

// Turns the form's codes into readable labels in the sheet.
const LABELS = {
  department: { 'mechanical': 'Mechanical engineering', 'civil': 'Civil engineering', 'industrial': 'Industrial engineering' },
  year: { 'year-1': '1st year', 'year-2': '2nd year', 'year-3': '3rd year' },
  interests: {
    'nature-detective': 'AI Nature Detective', 'plant-doctor': 'Plant Doctor', 'beach-pollution': 'AI Beach Pollution Detector',
    'waste-classifier': 'AI Waste Classifier', 'green-city': 'AI Green City', 'certifications': 'AI certifications'
  },
  roles: {
    'frontend': 'Front-end', 'ai-integration': 'AI integration', 'ux-ui': 'UX / UI',
    'database': 'Database', 'research': 'Research', 'testing': 'Testing'
  },
  experience: { 'beginner': 'Beginner', 'intermediate': 'Intermediate', 'advanced': 'Advanced' },
  source: {
    'social-media': 'Social media', 'friend': 'A friend', 'poster': 'Poster on campus',
    'club-event': 'A club event', 'teacher': 'A teacher', 'other': 'Other'
  }
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // one write at a time

    const p = (e && e.parameter) || {};

    // Honeypot filled → bot. Answer "success" so it doesn't retry.
    if (p.website) return json({ result: 'success' });

    if (!p.fullName || !p.email) return json({ result: 'error', error: 'missing required fields' });

    const sheet = getSheet();
    const email = String(p.email).trim().toLowerCase();

    // Reject an email that is already registered (column 3).
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const emails = sheet.getRange(2, 3, lastRow - 1, 1).getValues()
        .map(function (r) { return String(r[0]).trim().toLowerCase(); });
      if (emails.indexOf(email) !== -1) return json({ result: 'duplicate' });
    }

    const row = COLUMNS.map(function (col) {
      const field = col[1];
      if (!field) return new Date();
      const raw = field === 'email' ? email : p[field];
      const labels = LABELS[field];
      // Multi-choice fields arrive as "a, b, c": translate each code.
      const mapped = labels
        ? String(raw || '').split(', ').map(function (v) { return labels[v] || v; }).join(', ')
        : raw;
      return clean(mapped);
    });
    sheet.appendRow(row);

    return json({ result: 'success' });
  } catch (err) {
    return json({ result: 'error', error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

// Lets you open the web app URL in a browser to check it's deployed.
function doGet() {
  return json({ result: 'ok', service: 'AI INNOVATORS registration' });
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(function (c) { return c[0]; }));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  }
  return sheet;
}

// Trims length and stops values like "=HYPERLINK(...)" from running as formulas.
function clean(value) {
  const v = String(value == null ? '' : value).trim().slice(0, 1000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
