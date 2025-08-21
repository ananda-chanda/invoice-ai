const axios = require('axios');
const fs = require('fs');

async function ocrSpaceParse(localFilePath) {
  const form = new (require('form-data'))();
  form.append('file', fs.createReadStream(localFilePath));
  form.append('language', 'eng');
  form.append('isTable', 'true');
  form.append('OCREngine', 2);

  const { data } = await axios.post('https://api.ocr.space/parse/image',
    form, {
      headers: { apikey: process.env.OCR_SPACE_API_KEY, ...form.getHeaders() },
      maxBodyLength: Infinity
    });

  return data; // contains ParsedResults, OCRExitCode, etc.
}

module.exports = { ocrSpaceParse };
