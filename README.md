# Agribank Chi nhánh Hà Tĩnh II — Trang giới thiệu Cho vay thấu chi

Landing page giới thiệu sản phẩm **Cho vay thấu chi trên tài khoản thanh toán**
dành cho khách hàng nhận lương qua Agribank. Xây dựng bằng Node.js (Express + EJS).

## Tính năng

- Landing page 1 trang: giới thiệu sản phẩm, lý do lựa chọn, đăng ký tư vấn.
- Công cụ ước tính lãi thấu chi theo số tiền và số ngày sử dụng.
- Form đăng ký tư vấn — dữ liệu được ghi vào `data/registrations.json` (chỉ phục vụ demo/nội bộ, chưa kết nối hệ thống lõi ngân hàng).

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

## Ghi chú

- Lãi suất 7,5%/năm và hạn mức tối đa 12 tháng là số liệu minh hoạ truyền vào
  template từ `server.js` — cập nhật tại đó khi có thay đổi chính sách.
- Ảnh trụ sở (`public/images/tru-so-ha-tinh-ii.jpg`) có nguồn từ Báo Hà Tĩnh —
  cần xác nhận quyền sử dụng trước khi triển khai công khai chính thức.
- Form đăng ký hiện chỉ ghi log/JSON cục bộ, chưa gửi email hay tích hợp CRM.
