const express = require('express');
const path = require('path');

const dangKyRouter = require('./routes/dangky');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {
    laiSuatNamPhanTram: 7.5,
    hanMucThoiHanThang: 12,
    hotline: '0966.400.364',
  });
});

app.use('/api', dangKyRouter);

app.use((req, res) => {
  res.status(404).render('index', {
    laiSuatNamPhanTram: 7.5,
    hanMucThoiHanThang: 12,
    hotline: '0966.400.364',
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Agribank Thấu Chi landing page đang chạy tại http://localhost:${PORT}`);
  });
}

module.exports = app;
