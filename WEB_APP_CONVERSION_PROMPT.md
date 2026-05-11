# PROMPT CHUYỂN ĐỔI DỰ ÁN "HỆ THỐNG PHẢN ÁNH CÔNG DÂN" SANG WEB APP

**Ngữ cảnh:** 
Dự án hiện tại là một ứng dụng Flutter phục vụ tiếp nhận và xử lý phản ánh của người dân với các tính năng cốt lõi:
- **Phân quyền (RBAC):** Admin (Quản trị), Officer (Cán bộ xử lý), Citizen (Công dân).
- **Tính năng Công dân:** Báo cáo sự cố (có đính kèm ảnh, định vị GPS), theo dõi tiến độ qua mã tra cứu ngẫu nhiên.
- **Tính năng Cán bộ/Admin:** Dashboard thống kê, bản đồ nhiệt (Heatmap) các vấn đề xã hội, quản lý người dùng, tra cứu CCCD, phân công công việc.
- **Backend:** Firebase (Authentication, Firestore, Storage, Cloud Functions).
- **Bảo mật:** Firestore/Storage Rules chặt chẽ.

**Mục tiêu:**
Chuyển đổi toàn bộ dự án từ Flutter (Web) sang một ứng dụng Web Native chuyên dụng. Mục đích là tối ưu hóa SEO (cho trang công cộng), tối đa hóa tốc độ tải trang (Performance), giảm dung lượng bundle, và mang lại trải nghiệm UX/UI mượt mà nhất trên trình duyệt web.

**Đề xuất Công nghệ (Tech Stack Mới):**
- **Framework:** Next.js 14+ (App Router) - Hỗ trợ Server-Side Rendering (SSR) và Static Site Generation (SSG) giúp load trang cực nhanh và SEO tốt.
- **Ngôn ngữ:** TypeScript (Thay thế Dart, giữ nguyên Type-safety).
- **Styling:** Tailwind CSS + Shadcn UI (Xây dựng UI đồng nhất, hiện đại, tái sử dụng cao).
- **State Management:** Zustand (Global State/Auth) & TanStack Query (React Query cho Data Fetching & Caching).
- **Backend/BaaS:** Giữ nguyên Firebase (sử dụng Firebase Web SDK v10 Modular).
- **Bản đồ & Biểu đồ:** `react-google-maps/api` (hoặc Mapbox) cho bản đồ nhiệt, và `recharts` cho biểu đồ thống kê.

---

## 🛠️ HƯỚNG DẪN PROMPT TỪNG BƯỚC CHO AI (HOẶC DEV)

*Sử dụng các prompt dưới đây theo thứ tự để xây dựng lại dự án một cách có hệ thống.*

### Bước 1: Khởi tạo dự án & Thiết lập Kiến trúc (Project Setup)
**Prompt:**
> "Hãy khởi tạo một dự án Next.js 14 (App Router) với TypeScript và Tailwind CSS. 
> 1. Cài đặt và cấu hình Shadcn UI (khởi tạo các component cơ bản như Button, Input, Card, Dialog, Toast).
> 2. Khởi tạo cấu trúc thư mục chuẩn: `/app` (Routing), `/components` (UI dùng chung), `/lib` (Firebase config, Utils), `/hooks` (Custom hooks), `/types` (TypeScript interfaces - chuyển đổi từ các model Freezed/Dart cũ như AppUser, AppNotification, CitizenReport).
> 3. Tích hợp cấu hình màu sắc từ bản thiết kế cũ (Xanh Police: #1B5E20, Đỏ Quốc gia: #DA251D, Vàng: #FFD600) vào `tailwind.config.ts`.
> 4. Tạo layout chính bao gồm Header (có logo Bộ Công An) và Footer."

### Bước 2: Tích hợp Firebase & Quản lý Xác thực (Authentication & State)
**Prompt:**
> "Chuyển đổi `auth_service.dart` sang React/Next.js.
> 1. Thiết lập Firebase Web SDK v10 trong `/lib/firebase.ts` (Auth, Firestore, Storage).
> 2. Xây dựng một Authentication Provider hoặc sử dụng Zustand để lưu trữ Global State của `currentUser` (bao gồm uid, email, role, department).
> 3. Cài đặt hệ thống Phân quyền (RBAC). Tạo Next.js Middleware (`middleware.ts`) để bảo vệ các route: `/admin/*` chỉ dành cho Admin, `/officer/*` dành cho Officer, `/citizen/*` dành cho người dùng đã đăng nhập (hoặc công dân ẩn danh).
> 4. Xây dựng trang Đăng nhập và Đăng ký bằng Shadcn UI."

### Bước 3: Phát triển Module Công cộng & Công dân (Public & Citizen Features)
**Prompt:**
> "Phát triển trang chủ (Public Home) và Module Phản ánh (Citizen Report).
> 1. **Trang chủ:** Xây dựng trang đích (Landing page) giới thiệu cổng thông tin phản ánh (SEO friendly), ô tra cứu mã phản ánh, và danh sách các tin tức/phản ánh công khai.
> 2. **Form gửi phản ánh:** Tạo form đa bước (Multi-step form) sử dụng `react-hook-form` và `zod` để validate (chuyển đổi từ logic Dart cũ).
> 3. **GPS & Bản đồ:** Tích hợp Geolocation API của trình duyệt để lấy tọa độ hiện tại. Sử dụng `react-google-maps/api` để cho phép người dân chọn vị trí trên bản đồ.
> 4. **Upload ảnh:** Xây dựng component kéo-thả ảnh, cho phép preview trước khi gửi. Upload file lên Firebase Storage và lưu URL vào Firestore. Hàm tạo mã tra cứu (8 ký tự ngẫu nhiên) thực hiện tại client hoặc thông qua Firebase Function."

### Bước 4: Phát triển Module Cán bộ & Trưởng phòng (Officer & Department Head)
**Prompt:**
> "Xây dựng khu vực làm việc (Dashboard) cho Cán bộ và Trưởng phòng.
> 1. Xây dựng giao diện Layout dạng Sidebar Navigation (tương tự dạng NavigationRail/Drawer trong Flutter).
> 2. **Danh sách phản ánh:** Tạo bảng dữ liệu (Data Table) sử dụng `@tanstack/react-table` để hiển thị danh sách phản ánh. Hỗ trợ lọc (filter) theo trạng thái (Mới, Đang xử lý, Hoàn thành), phân trang (Pagination), và sắp xếp.
> 3. **Chi tiết phản ánh:** Trang xem chi tiết (SSR/CSR) gồm thông tin vị trí, hình ảnh đính kèm, lịch sử xử lý (Audit Log).
> 4. **Bản đồ nhiệt (Heatmap):** Tích hợp Google Maps Heatmap layer hiển thị mật độ sự cố dựa trên dữ liệu Firestore (lấy tọa độ từ các report)."

### Bước 5: Phát triển Module Quản trị viên (Admin Dashboard)
**Prompt:**
> "Xây dựng các chức năng phân tích và quản lý hệ thống cho Admin.
> 1. **Biểu đồ & Thống kê:** Chuyển đổi các biểu đồ từ `fl_chart` sang thư viện `recharts`. Xây dựng biểu đồ tròn (Pie chart) tỷ lệ trạng thái phản ánh, biểu đồ cột (Bar chart) thống kê hiệu suất cán bộ.
> 2. **Quản lý người dùng (User Management):** Xây dựng trang CRUD người dùng. Admin có thể thay đổi Role (Phân quyền), Phòng ban (Department), và kích hoạt/hủy kích hoạt tính năng của nhân viên.
> 3. **Ghi log hệ thống:** Xây dựng trang xem Nhật ký hoạt động (Audit Logs) dạng bảng có khả năng tìm kiếm nâng cao."

### Bước 6: Tối ưu hóa Hiệu suất & SEO (Performance & Optimization)
**Prompt:**
> "Thực hiện các bước tối ưu hóa sâu cho Web App:
> 1. **Tối ưu hình ảnh:** Thay thế toàn bộ thẻ `<img>` thường thành `next/image` để tự động nén, thay đổi kích thước và lazy load hình ảnh (đặc biệt là ảnh người dân upload).
> 2. **Caching & Fetching:** Áp dụng React Query cho các lệnh gọi Firestore. Cấu hình Stale Time và Cache Time hợp lý để giảm thiểu số lượng reads (đọc) từ Firebase (giảm chi phí billing).
> 3. **SEO Metadata:** Sử dụng Next.js Metadata API để thêm title, description, Open Graph tags động cho trang chủ và các trang chi tiết tin tức công khai.
> 4. **Code Splitting:** Áp dụng `next/dynamic` cho các thư viện nặng như Bản đồ (Google Maps) và Biểu đồ (Recharts) để giảm dung lượng bundle ban đầu."

### Bước 7: Cập nhật Firebase Rules & Triển khai (Deployment)
**Prompt:**
> "Kiểm tra và chuẩn bị triển khai:
> 1. Cập nhật CORS trong Firebase Storage để cho phép domain web mới gọi API upload ảnh (chỉnh sửa file `cors.json` và deploy bằng gsutil).
> 2. Rà soát lại `firestore.rules` và `storage.rules` đảm bảo tương thích hoàn toàn với web client.
> 3. Thiết lập CI/CD (ví dụ: GitHub Actions) để tự động build và deploy lên nền tảng hosting (Vercel hoặc Firebase Hosting - Web Frameworks). Cấu hình các biến môi trường `.env` an toàn."

---
*Bằng cách làm theo thứ tự các prompt trên, dự án sẽ được chuyển đổi sang nền tảng Web một cách vững chắc, hiện đại, sửa được các nhược điểm của Flutter Web (dung lượng lớn, khó SEO) và tận dụng tối đa sức mạnh của hệ sinh thái React/Next.js.*