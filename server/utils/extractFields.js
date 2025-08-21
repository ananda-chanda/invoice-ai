const { parse } = require('date-fns');

function getTextFromOcr(ocrJson) {
  try {
    const pr = ocrJson?.ParsedResults?.[0];
    return pr?.ParsedText || '';
  } catch {
    return '';
  }
}

function findInvoiceNumber(text) {
  // looks for patterns like INV-2025, Invoice # 12345, etc.
  const patterns = [
    /invoice\s*(?:no\.?|number|#)\s*[:\-]?\s*([A-Z0-9\-\/]{4,})/i,
    /\b([A-Z]{2,5}-\d{3,8})\b/
  ];
  for (const rx of patterns) {
    const m = text.match(rx);
    if (m?.[1]) return m[1].trim();
  }
  return '';
}

function findDate(text) {
  // try multiple common formats, return as dd MMM yyyy if possible
  const rx = /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{1,2}\s+[A-Za-z]{3,9}\s+\d{2,4})\b/;
  const m = text.match(rx);
  if (!m) return '';
  const raw = m[1];
  const candidates = [
    'dd/MM/yyyy','d/M/yyyy','dd-MM-yyyy','d-M-yyyy','dd.MM.yyyy','d.M.yyyy','dd MMM yyyy','d MMM yyyy','dd MMMM yyyy','d MMMM yyyy','MM/dd/yyyy','M/d/yyyy'
  ];
  for (const fmt of candidates) {
    const dt = parse(raw, fmt, new Date());
    if (!isNaN(dt)) return dt.toISOString().slice(0,10); // yyyy-mm-dd
  }
  return raw; // fallback: raw string
}

function findCustomerName(text) {
  // heuristic: line after "Bill To" / "Billed To" / "Customer"
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const idx = lines.findIndex(l => /bill(ed)?\s*to|customer|sold\s*to/i.test(l));
  if (idx >= 0 && lines[idx+1]) {
    // avoid labels like address lines starting with "Address"/"GST"
    const next = lines[idx+1].replace(/^[:\-]/,'').trim();
    if (!/address|gst|tax|no\.|#|invoice/i.test(next)) return next;
  }
  // fallback: first non-header line that looks like a name
  const candidate = lines.find(l => /^[A-Za-z][A-Za-z\s\.\-&]{3,}$/.test(l) && !/invoice|total|amount|tax|gst|qty|price/i.test(l));
  return candidate || '';
}

function findTotal(text) {
  // try to capture a currency and amount near "Total" or "Amount Due"
  const rx = /(grand\s*total|amount\s*(due)?|total)\s*[:\-]?\s*(₹|INR|Rs\.?)?\s*([0-9][0-9,]*\.?\d{0,2})/i;
  const m = text.match(rx);
  if (m?.[4]) {
    const num = Number(m[4].replace(/,/g,''));
    const currency = m[3] ? 'INR' : 'INR'; // tweak if you detect $, €, etc.
    return { amount: isNaN(num) ? undefined : num, currency };
  }
  return { amount: undefined, currency: 'INR' };
}

function extractFields(ocrJson) {
  const text = getTextFromOcr(ocrJson);
  const invoiceNumber = findInvoiceNumber(text);
  const date = findDate(text);
  const customerName = findCustomerName(text);
  const { amount: totalAmount, currency } = findTotal(text);

  return { invoiceNumber, date, customerName, totalAmount, currency, rawText: text };
}

module.exports = { extractFields };
