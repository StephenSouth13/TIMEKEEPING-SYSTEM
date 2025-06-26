# 🕒 HỆ THỐNG CHẤM CÔNG – TIMEKEEPING SYSTEM

> Giao diện frontend hiện đại, chuyên nghiệp cho hệ thống chấm công, phân quyền rõ ràng, giao diện đẹp mượt, sẵn sàng demo doanh nghiệp.  
> Phát triển bởi **StephenSouth13**, thuộc đội lập trình **The Next Generation** – tổ chức VSM.
> Link demo on: https://timekeeping-system-1.onrender.com/
> ![image](https://github.com/user-attachments/assets/4ec7aa5c-d0e3-4e7e-b0aa-22bb8e1de6c7)
> ![image](https://github.com/user-attachments/assets/053b102d-5590-46d6-a0b9-ad86e8d35b6b)
> ![image](https://github.com/user-attachments/assets/c8a3047d-ebfc-4f5d-b7fa-8d038fff4c4e)


---

## 🚀 Giới thiệu

**HỆ THỐNG CHẤM CÔNG** là hệ thống chấm công giả lập (frontend-only) mô phỏng quy trình làm việc thực tế của doanh nghiệp:

- Chấm công Check-in / Check-out
- Ghi nhận đi trễ, lý do
- Phân quyền Manager / Staff
- Tính lương cơ bản từ công
- Dashboard biểu đồ trực quan
- Giao diện chuyên nghiệp – chuẩn SaaS UI

---

## 🧑‍💼 Tài khoản thử nghiệm

| Vai trò   | Tài khoản | Mật khẩu |
|-----------|-----------|----------|
| Manager   | Admin     | long123  |
| Staff     | Staff     | long123  |

---

## 🧩 Chức năng chính

- ✅ **Trang đăng nhập** phân quyền theo vai trò
- ✅ **Dashboard**: số ngày công, trễ, nghỉ (theo vai trò)
- ✅ **Chấm công**: Check-in/Check-out trong khung giờ:
  - 08:00–08:30: đúng giờ
  - 08:30–09:30: ghi nhận trễ + lý do
  - 16:30–17:00: Check-out
- ✅ **Bảng công** tháng hiện tại
- ✅ **Tính lương** từ số ngày làm + trễ + nghỉ (Manager)
- ✅ **Quản lý nhân viên** (Manager – giới hạn tối đa 10 nhân viên)
- ✅ **Xuất CSV** bảng lương
- ✅ **Dark mode** toàn hệ thống
- ✅ **Responsive** đầy đủ
> ![image](https://github.com/user-attachments/assets/21185ca3-e74c-4272-8501-42b61903282f)
>


---

## 🎨 Giao diện

- Màu chủ đạo: **Xanh nước biển (#0077b6)** + **Đen (#000000)**
- Font hiện đại: *Inter*, *Plus Jakarta Sans*
- Thiết kế `shadow-md`, `rounded-xl`, `transition`, `soft card`
- Có logo placeholder của **The Next Generation – VSM**

---

## 🛠️ Công nghệ sử dụng

- ✅ `Next.js 14+` + App Router
- ✅ `Tailwind CSS`
- ✅ `Shadcn/UI` hoặc tương đương
- ✅ `Framer Motion` (animation mượt)
- ✅ `Recharts` / `ApexCharts` (biểu đồ)
- ✅ Không sử dụng backend – tất cả dữ liệu mock bằng `useState`, `useEffect`

---

## 📦 Cài đặt & chạy demo

```bash
git clone https://github.com/StephenSouth13/TIMEKEEPING-SYSTEM.git
cd TIMEKEEPING-SYSTEM
npm install
npm run dev
Truy cập http://localhost:3000 để bắt đầu trải nghiệm.

🏷️ Giới thiệu đội phát triển
The Next Generation là đội lập trình thuộc tổ chức VSM, định hướng phát triển các sản phẩm ứng dụng công nghệ hiện đại, UX/UI chuẩn doanh nghiệp, tối ưu quy trình quản trị nội bộ.

📄 Giấy phép
MIT License – Tự do sử dụng và phát triển thêm cho mục đích cá nhân hoặc tổ chức.

📬 Liên hệ
💻 GitHub: StephenSouth13
