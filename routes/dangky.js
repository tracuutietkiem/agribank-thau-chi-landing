const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '..', 'data', 'registrations.json');

const PHONE_RE = /^(0[35789])[0-9]{8}$/;

function readRegistrations() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeRegistrations(list) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

router.post('/dang-ky', (req, res) => {
  const hoTen = (req.body.hoTen || '').trim();
  const soDienThoai = (req.body.soDienThoai || '').trim();
  const diaDiem = (req.body.diaDiem || '').trim();
  const ghiChu = (req.body.ghiChu || '').trim();

  const errors = {};
  if (hoTen.length < 2) {
    errors.hoTen = 'Vui lòng nhập họ tên đầy đủ (tối thiểu 2 ký tự).';
  }
  if (!PHONE_RE.test(soDienThoai)) {
    errors.soDienThoai = 'Số điện thoại không hợp lệ (VD: 0966400364).';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  const entry = {
    hoTen,
    soDienThoai,
    diaDiem: diaDiem || null,
    ghiChu: ghiChu || null,
    thoiGian: new Date().toISOString(),
  };

  const list = readRegistrations();
  list.push(entry);
  writeRegistrations(list);

  console.log('[Đăng ký thấu chi mới]', entry);

  return res.json({ ok: true });
});

module.exports = router;
