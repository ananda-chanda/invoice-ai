const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  invoiceNumber: String,
  date: String,          // store ISO string or raw; normalize on save
  customerName: String,
  totalAmount: Number,
  currency: { type: String, default: 'INR' }
}, { _id: false });

const FileSchema = new mongoose.Schema({
  originalName: String,
  mimeType: String,
  size: Number,
  tempPath: String
}, { _id: false });

const InvoiceSchema = new mongoose.Schema({
  file: FileSchema,
  ocr: {
    rawText: String,
    rawJson: mongoose.Schema.Types.Mixed
  },
  fields: FieldSchema,
  summary: String,
  status: {
    type: String,
    enum: ['uploaded','extracted','confirmed','summarized'],
    default: 'uploaded'
  }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
