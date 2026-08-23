(function () {
  'use strict';

  var LAI_SUAT_NAM = 7.5; // %/năm — chỉ minh hoạ, đồng bộ với server.js

  var vndFormatter = new Intl.NumberFormat('vi-VN');

  function formatVnd(n) {
    return vndFormatter.format(Math.round(n)) + ' đ';
  }

  /* ---------------------------- Calculator ---------------------------- */
  var soTienInput = document.getElementById('soTien');
  var soNgayInput = document.getElementById('soNgay');
  var soTienValue = document.getElementById('soTienValue');
  var soNgayValue = document.getElementById('soNgayValue');
  var tienLaiValue = document.getElementById('tienLaiValue');

  function updateCalc() {
    if (!soTienInput || !soNgayInput) return;
    var soTien = Number(soTienInput.value);
    var soNgay = Number(soNgayInput.value);
    var tienLai = (soTien * (LAI_SUAT_NAM / 100) / 365) * soNgay;

    soTienValue.textContent = formatVnd(soTien);
    soNgayValue.textContent = soNgay + ' ngày';
    tienLaiValue.textContent = formatVnd(tienLai);
  }

  if (soTienInput && soNgayInput) {
    soTienInput.addEventListener('input', updateCalc);
    soNgayInput.addEventListener('input', updateCalc);
    updateCalc();
  }

  /* ---------------------------- Register form ---------------------------- */
  var form = document.getElementById('dangKyForm');
  var statusBox = document.getElementById('formStatus');
  var submitLabel = document.getElementById('submitLabel');

  var PHONE_RE = /^(0[35789])[0-9]{8}$/;

  function setFieldError(fieldId, message) {
    var input = document.getElementById(fieldId);
    var errorEl = document.getElementById(fieldId + '-error');
    if (!input || !errorEl) return;

    if (message) {
      input.setAttribute('aria-invalid', 'true');
      errorEl.textContent = message;
      errorEl.hidden = false;
    } else {
      input.setAttribute('aria-invalid', 'false');
      errorEl.hidden = true;
      errorEl.textContent = '';
    }
  }

  function validateForm(data) {
    var errors = {};
    if (!data.hoTen || data.hoTen.trim().length < 2) {
      errors.hoTen = 'Vui lòng nhập họ tên đầy đủ (tối thiểu 2 ký tự).';
    }
    if (!PHONE_RE.test((data.soDienThoai || '').trim())) {
      errors.soDienThoai = 'Số điện thoại không hợp lệ (VD: 0966400364).';
    }
    return errors;
  }

  function showStatus(type, message) {
    if (!statusBox) return;
    statusBox.hidden = false;
    statusBox.className = 'form-status form-status--' + type;
    statusBox.textContent = message;
  }

  if (form) {
    var hoTenInput = document.getElementById('hoTen');
    var soDienThoaiInput = document.getElementById('soDienThoai');

    [hoTenInput, soDienThoaiInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener('blur', function () {
        var errors = validateForm({
          hoTen: hoTenInput.value,
          soDienThoai: soDienThoaiInput.value,
        });
        setFieldError(input.id, errors[input.id]);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var payload = {
        hoTen: hoTenInput.value.trim(),
        soDienThoai: soDienThoaiInput.value.trim(),
        diaDiem: document.getElementById('diaDiem').value.trim(),
        ghiChu: document.getElementById('ghiChu').value.trim(),
      };

      var errors = validateForm(payload);
      setFieldError('hoTen', errors.hoTen);
      setFieldError('soDienThoai', errors.soDienThoai);

      if (Object.keys(errors).length > 0) {
        showStatus('error', 'Vui lòng kiểm tra lại thông tin bên dưới.');
        var firstInvalid = errors.hoTen ? hoTenInput : soDienThoaiInput;
        firstInvalid.focus();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitLabel.textContent = 'Đang gửi...';

      fetch('/api/dang-ky', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data.ok) {
            showStatus('success', 'Cảm ơn Quý khách! Agribank Chi nhánh Hà Tĩnh II sẽ liên hệ tư vấn trong thời gian sớm nhất.');
            form.reset();
          } else if (result.data.errors) {
            setFieldError('hoTen', result.data.errors.hoTen);
            setFieldError('soDienThoai', result.data.errors.soDienThoai);
            showStatus('error', 'Vui lòng kiểm tra lại thông tin bên dưới.');
          } else {
            showStatus('error', 'Có lỗi xảy ra, vui lòng thử lại hoặc gọi hotline 0966.400.364.');
          }
        })
        .catch(function () {
          showStatus('error', 'Không thể kết nối máy chủ. Vui lòng thử lại hoặc gọi hotline 0966.400.364.');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitLabel.textContent = 'Gửi đăng ký';
        });
    });
  }
})();
