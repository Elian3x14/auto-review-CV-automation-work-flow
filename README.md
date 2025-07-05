# Quy trình đánh giá CV tự động với Google Apps Script

> Đây là một project mình tự làm để học về tự động hóa xử lý dữ liệu ứng viên bằng Google Workspace, API và AI.

---

## Mô tả dự án

Dự án này xây dựng một workflow trong Google Apps Script để:
- Tự động xử lý dữ liệu từ Google Form
- Trích xuất nội dung CV PDF bằng OCR.space
- Gửi nội dung cho mô hình AI DeepSeek để đánh giá mức độ phù hợp
- Ghi kết quả đánh giá vào một Sheet riêng

---

## Sơ đồ quy trình hoạt động

```mermaid
flowchart TD
    A[Ứng viên hoàn tất và gửi biểu mẫu ứng tuyển] --> B[Dữ liệu được ghi vào Google Sheet]
    B --> C[Trích xuất thông tin ứng viên và liên kết CV]
    C --> D[Dùng OCR.space để chuyển CV từ PDF sang văn bản thuần]
    D --> E[Phân tích nội dung CV bằng mô hình DeepSeek]
    E --> F[Ghi kết quả đánh giá vào Sheet kết quả]
````

---

## Các thành phần chính

| Thành phần    | Mô tả                                           |
| ------------- | ----------------------------------------------- |
| Google Form   | Cho ứng viên nhập thông tin và đính kèm file CV |
| Google Sheet  | Nhận dữ liệu form + sheet lưu kết quả           |
| Apps Script   | Xử lý toàn bộ quy trình automation              |
| OCR.space API | Trích xuất text từ file PDF                     |
| DeepSeek API  | Đánh giá nội dung CV dựa theo yêu cầu công việc |

---

## Kết quả đầu ra

Kết quả sau khi xử lý sẽ được ghi vào sheet `Đánh giá` dưới dạng:

| Họ tên ứng viên | Email                             | Đánh giá mức độ phù hợp |
| --------------- | --------------------------------- | ----------------------- |
| Nguyễn Văn A    | [a@gmail.com](mailto:a@gmail.com) | Cao                     |
| Trần Thị B      | [b@gmail.com](mailto:b@gmail.com) | Trung bình              |

---

## Hướng dẫn cài đặt

### 1. Tạo Google Form

* Các trường cần có:

  * Họ và tên
  * Email
  * Tải lên file CV (PDF)
* Liên kết Google Form với Google Sheet

Hình ảnh minh họa form mẫu:
![image](https://github.com/user-attachments/assets/2a2c9744-ed82-4be5-b905-ad28ed28bf6f)


---

### 2. Liên kết sheet với form

![image](https://github.com/user-attachments/assets/dfa70231-245c-4647-a0f2-e8eb9ec587b4)

### 3. Tạo app scripts cho sheet
Vào Tiện ích > Apps script
![image](https://github.com/user-attachments/assets/26919612-f5a9-45a0-a435-11f5c21c7d2a)

---
### 4. Cài đặt mã nguồn Apps Script

dán code Code.gs vào code trên google app scripts
![image](https://github.com/user-attachments/assets/aacc28c2-cfa7-48bc-939a-56075a4345b4)

---

### 5. Thiết lập `config.gs`

Tạo file mới tên là `config.gs` trong dự án của bạn, và thiết lập các API key theo mẫu sau:

```js
const CONFIG = {
  OCR_API_KEY: "YOUR_OCR_SPACE_KEY_HERE",
  DEEPSEEK_API_KEY: "YOUR_DEEPSEEK_API_KEY_HERE"
};
```

> Ghi chú: Đây là nơi lưu **API key riêng tư**, bạn **không nên commit file này lên GitHub** công khai. Đã có `.gitignore` để hỗ trợ bỏ qua file này.

---

#### Cách lấy `OCR_API_KEY`

1. Truy cập trang: [https://ocr.space/ocrapi](https://ocr.space/ocrapi)
2. Cuộn xuống phần **Get Your Free API Key**
3. Nhập email và đăng ký tài khoản miễn phí
4. Sau khi xác nhận email, bạn sẽ nhận được **API key** trong email hoặc trong dashboard tại:
   [https://ocr.space/ocrapi#account](https://ocr.space/ocrapi#account)

> Gói miễn phí cho phép xử lý tới **1.000 tệp mỗi tháng**, phù hợp với các dự án nhỏ, học tập và thử nghiệm.

#### Cách lấy `DEEPSEEK_API_KEY`

1. Truy cập trang: [https://openrouter.ai](https://openrouter.ai)
2. Đăng nhập bằng Google, Discord hoặc email
3. Vào trang quản lý API key tại:
   [https://openrouter.ai/keys](https://openrouter.ai/keys)
4. Nhấn nút **“Create Key”** để tạo key mới
5. Sao chép chuỗi key có dạng:

```
sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

6. Dán vào trường `DEEPSEEK_API_KEY` trong file `config.gs`.

---

> **Lưu ý quan trọng**:
>
> * Nếu bạn dùng mô hình `deepseek/deepseek-coder:free` hoặc `deepseek/deepseek-r1:free`, hãy đảm bảo bạn có đủ quota miễn phí trên OpenRouter.
> * Một số mô hình chỉ có giới hạn số lượng request mỗi ngày.

---

## Demo hoạt động

![image](https://github.com/user-attachments/assets/e761da61-c5a8-4679-b340-ae1d4886b886)

---

## Bảo mật

* Không commit file `config.gs` nếu bạn đẩy lên GitHub công khai
* Đã có `.gitignore` để bỏ qua các file chứa key

---

## Công nghệ sử dụng

| Công nghệ                     | Mục đích                    |
| ----------------------------- | --------------------------- |
| Google Apps Script            | Tự động hóa quy trình xử lý |
| OCR.space API                 | Chuyển PDF thành text       |
| DeepSeek API (qua OpenRouter) | Phân tích nội dung CV       |
| Google Sheets                 | Lưu dữ liệu và kết quả      |
| Google Forms                  | Thu thập thông tin ứng viên |

---

## Gợi ý mở rộng

* Tự động gửi email thông báo cho ứng viên
* Phân loại ứng viên theo ngành nghề
* Dashboard quản lý ứng viên theo thời gian

---

## Liên hệ

Bạn có thể dùng project này để học hoặc chỉnh sửa theo ý bạn.
Mọi góp ý hoặc đóng góp, hãy tạo issue hoặc pull request.
