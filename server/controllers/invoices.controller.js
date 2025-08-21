const fs = require('fs');
const path = require('path');
const Invoice = require('../models/Invoice');
const { ocrSpaceParse } = require('../services/ocrSpace');
const { extractFields } = require('../utils/extractFields');
const cohere = require('../services/cohere');

exports.uploadAndExtract = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File required' });

    const ocrJson = await ocrSpaceParse(req.file.path);
    const fields = extractFields(ocrJson);

    const doc = await Invoice.create({
      file: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        tempPath: req.file.path
      },
      ocr: { rawText: fields.rawText, rawJson: ocrJson },
      fields: {
        invoiceNumber: fields.invoiceNumber || '',
        date: fields.date || '',
        customerName: fields.customerName || '',
        totalAmount: fields.totalAmount ?? null,
        currency: fields.currency || 'INR'
      },
      status: 'extracted'
    });

    res.json({ id: doc._id, fields: doc.fields, ocrQuality: !!fields.rawText });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'OCR failed. Try another file.' });
  }
};

exports.confirmAndSave = async (req, res) => {
  try {
    const { id, fields } = req.body; // {invoiceNumber,date,customerName,totalAmount,currency}
    if (!id || !fields) return res.status(400).json({ error: 'Missing id or fields' });

    const doc = await Invoice.findByIdAndUpdate(
      id,
      { fields, status: 'confirmed' },
      { new: true }
    );

    res.json({ ok: true, invoice: doc });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Save failed' });
  }
};

exports.getOne = async (req, res) => {
  const doc = await Invoice.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
};

exports.summarize = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Invoice.findById(id);
    if (!doc) return res.status(404).json({ error: 'Not found' });

    const f = doc.fields;
    const prompt = `Write one concise sentence: "Invoice ${f.invoiceNumber || 'N/A'} dated ${f.date || 'N/A'} for ${f.customerName || 'N/A'} totals ₹${f.totalAmount ?? 'N/A'}." Only output the sentence.`;

    const sentence = await cohere.oneSentence(prompt);

    doc.summary = sentence;
    doc.status = 'summarized';
    await doc.save();

    res.json({ summary: sentence });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Summary failed' });
  }
};
