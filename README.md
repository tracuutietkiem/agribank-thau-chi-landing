# Agribank Chi nhánh Hà Tĩnh II — Trang giới thiệu Cho vay thấu chi

Landing page giới thiệu sản phẩm **Cho vay thấu chi trên tài khoản thanh toán**
dành cho khách hàng nhận lương qua Agribank. Xây dựng bằng Node.js (Express + EJS).

## Tính năng

- Landing page 1 trang: giới thiệu sản phẩm, lý do lựa chọn, đăng ký tư vấn.
- Công cụ ước tính lãi thấu chi theo số tiền và số ngày sử dụng.
- Form đăng ký tư vấn — dữ liệu được ghi vào `data/registrations.json` (local) và
  gửi email thông báo ngay khi có khách đăng ký (xem mục **Cấu hình email** bên dưới).

## Chạy dự án

```bash
npm install
npm start
```

Mặc định chạy tại http://localhost:3000 (đổi cổng bằng biến môi trường `PORT`).

Chế độ phát triển (tự khởi động lại khi sửa file):

```bash
npm run dev
```

## Cấu trúc thư mục

```
agribank-thau-chi/
├── server.js              # Express app + route trang chủ
├── routes/dangky.js        # API POST /api/dang-ky (lưu đăng ký)
├── views/                  # Template EJS (index + partials header/footer)
├── public/css/style.css    # Toàn bộ style, thiết kế theo bộ nhận diện Agribank
├── public/js/main.js       # Công cụ tính lãi + xử lý form phía client
├── public/images/          # Logo & ảnh trụ sở
└── data/                   # registrations.json (gitignored)
```

## Cấu hình email thông báo đăng ký mới

Mỗi khi có khách gửi form đăng ký, hệ thống gửi email tới **hoanglam1209@gmail.com**
(đổi được qua biến `EMAIL_TO`). Cần một tài khoản Gmail dùng để **gửi** email đi:

1. Bật xác minh 2 bước cho tài khoản Gmail dùng để gửi (Google Account > Security).
2. Tạo **App Password** tại https://myaccount.google.com/apppasswords — chọn app
   "Mail", lấy mã 16 ký tự (không phải mật khẩu Gmail thường).
3. Khai báo biến môi trường:
   - **Local**: copy `.env.example` thành `.env`, điền `EMAIL_USER` (Gmail dùng để gửi)
     và `EMAIL_PASS` (App Password vừa tạo).
   - **Vercel**: vào Project > Settings > Environment Variables, thêm `EMAIL_USER`,
     `EMAIL_PASS`, (tuỳ chọn) `EMAIL_TO` — rồi redeploy.

Nếu chưa khai báo `EMAIL_USER`/`EMAIL_PASS`, hệ thống bỏ qua bước gửi email
(chỉ log ra console) — form đăng ký vẫn hoạt động bình thường, không lỗi.

**Không commit file `.env` hay App Password vào Git** — `.env` đã có trong `.gitignore`.

## Deploy lên Vercel

Repo đã có sẵn `vercel.json` (deploy Express như một serverless function,
kèm `views/` và `public/` để EJS render và phục vụ file tĩnh đúng).

1. Vào https://vercel.com/new, chọn **Import Git Repository** và trỏ tới repo GitHub này.
2. Framework Preset để **Other** — không cần Build Command (không có bước build).
3. Nhấn **Deploy**.

Lưu ý: trên Vercel, filesystem chỉ đọc nên form đăng ký **không ghi được**
`data/registrations.json` — bản ghi bền vững trên production là **email thông báo**
(xem mục Cấu hình email ở trên) cộng với tab **Logs** của deployment. Muốn có thêm
một nơi tra cứu dạng bảng/dashboard, cần nối thêm database (Vercel Postgres,
Supabase...).

## Ghi chú

- Lãi suất 7,5%/năm và hạn mức tối đa 12 tháng là số liệu minh hoạ truyền vào
  template từ `server.js` — cập nhật tại đó khi có thay đổi chính sách.
- Ảnh trụ sở (`public/images/tru-so-ha-tinh-ii.jpg`) có nguồn từ Báo Hà Tĩnh —
  cần xác nhận quyền sử dụng trước khi triển khai công khai chính thức.
- Form đăng ký chưa tích hợp CRM — hiện ghi log/JSON cục bộ và gửi email thông báo.
