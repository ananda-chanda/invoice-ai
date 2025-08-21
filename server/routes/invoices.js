const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { uploadAndExtract, confirmAndSave, getOne, summarize } = require('../controllers/invoices.controller');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post('/upload', upload.single('file'), uploadAndExtract);
router.post('/', confirmAndSave);
router.get('/:id', getOne);
router.post('/:id/summary', summarize);

module.exports = router;
