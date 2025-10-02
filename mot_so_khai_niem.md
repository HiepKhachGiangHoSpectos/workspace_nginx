📡 KHÁI NIỆM CƠ BẢN VỀ MẠNG VÀ GIAO TIẾP GIỮA CÁC THIẾT BỊ

Trong đời sống, để giao tiếp, ta cần biết “ai đang nói với ai” – tức là cần biết tên hoặc địa chỉ. Trong mạng máy tính cũng vậy: mỗi thiết bị cần một địa chỉ riêng để gửi và nhận dữ liệu.

Địa chỉ đó được gọi là **IP (Internet Protocol)**. Nhưng IP chỉ là điểm khởi đầu. Để dữ liệu đi đúng hướng, tránh rò rỉ thông tin, và vượt qua các rào cản vật lý, ta cần thêm các thành phần trung gian và quy tắc khác như: **routing, NAT, proxy, firewall, v.v.**


1️⃣ IP – ĐỊA CHỈ CỦA THIẾT BỊ

IP là địa chỉ logic để xác định nơi đi và nơi đến của gói dữ liệu.

📌 Hai loại IP:

- **Private IP**: Dùng trong mạng nội bộ (LAN), ví dụ:
  `192.168.x.x`, `10.x.x.x`, `172.16.x.x` → không thể truy cập trực tiếp từ Internet.

- **Public IP**: Được cấp bởi nhà mạng (ISP), dùng để giao tiếp với Internet toàn cầu.

🧠 Ví dụ:
- Máy tính A trong nhà có IP nội bộ: `192.168.1.10`
- Router của bạn có IP công cộng: `203.0.113.5`

→ Khi máy A truy cập Internet, router sẽ **thay mặt** A gửi dữ liệu ra ngoài bằng IP công cộng.

📌 Cách kiểm tra IP: Dùng lệnh `ifconfig` hoặc `ip a`

Ví dụ kết quả `ifconfig`:
enp3s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST> mtu 1500
inet 172.16.0.28 netmask 255.255.254.0 broadcast 172.16.1.255

lo: flags=73<UP,LOOPBACK,RUNNING> mtu 65536
inet 127.0.0.1 netmask 255.0.0.0

wlp2s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST> mtu 1500
inet 192.168.68.77 netmask 255.255.252.0 broadcast 192.168.71.255


📌 Giải thích:
- `enp3s0`, `lo`, `wlp2s0`: tên của các **network interface**
  + `enp3s0`: Ethernet (mạng dây)
  + `lo`: loopback (localhost - 127.0.0.1)
  + `wlp2s0`: Wi-Fi (wireless)

- `flags=4163` là trạng thái giao diện mạng → chuyển sang nhị phân để phân tích:
  + `4163` → `0001 0000 0100 0011` → tương ứng với các cờ:
    `UP`, `BROADCAST`, `RUNNING`, `MULTICAST`

📋 Bảng flag phổ biến:

| Flag          | Ý nghĩa                                |
|---------------|----------------------------------------|
| IFF_UP        | Interface đang bật                    |
| IFF_RUNNING   | Đang hoạt động tốt                    |
| IFF_BROADCAST | Hỗ trợ broadcast                      |
| IFF_MULTICAST | Hỗ trợ multicast                      |
| IFF_LOOPBACK  | Đây là giao diện loopback (localhost) |
...


2️⃣ ROUTER & DEFAULT GATEWAY – NGƯỜI GIAO THƯ

- **Router**: thiết bị trung gian, định tuyến gói tin giữa các mạng khác nhau.
- Mỗi máy tính có một **default gateway** → thường chính là địa chỉ IP của router.

📦 Router giữ **bảng định tuyến (routing table)** → biết gói tin cần gửi tiếp theo tới đâu để đến đích nhanh và hợp lý nhất.

→ Router giống như bưu cục, biết đường đi của thư từ người gửi đến người nhận.


3️⃣ DNS – TRAO ĐỔI TÊN VỚI IP

Con người nhớ tên tốt hơn là số. Vì vậy, thay vì gõ `142.250.191.206`, ta chỉ cần gõ `google.com`.

📌 **DNS (Domain Name System)** là hệ thống ánh xạ tên miền → IP tương ứng.


4️⃣ PROXY – ĐẠI DIỆN TRUNG GIAN

Có hai loại chính:

- **Forward Proxy**: đại diện cho client (người dùng)
  + Ẩn danh, lọc truy cập, vượt tường lửa,...
  + Server bên ngoài chỉ thấy IP của proxy, không thấy IP thật của client.

- **Reverse Proxy**: đại diện cho server (máy chủ)
  + Phân phối, cân bằng tải, ẩn thông tin nội bộ server backend.
  + Client không biết server backend thật là gì.

📌 Tóm lại:
- Forward proxy bảo vệ / kiểm soát **client**.
- Reverse proxy điều phối / ẩn danh **server**.


5️⃣ LOAD BALANCER – CHIA CÔNG VIỆC

- Dùng để **phân phối lưu lượng truy cập** đến nhiều server phía sau → tránh quá tải.

📌 Các thuật toán phân phối:
- Round robin (xoay vòng)
- Least connections (ít kết nối nhất)
- Weighted round robin (có trọng số)


6️⃣ API GATEWAY – CỬA NGÕ GIAO TIẾP CHO MICROSERVICE

Trong hệ thống nhiều **microservices**:
- Mỗi service có địa chỉ, port, giao thức riêng.
- Nếu client phải gọi trực tiếp từng service sẽ rất phức tạp và không an toàn.

📌 API Gateway:
- Là điểm vào duy nhất cho client.
- Ẩn chi tiết nội bộ, xử lý xác thực, phân quyền, rate limiting, logging,...

→ Giúp quản lý microservice hiệu quả và bảo mật hơn.


📌 TỔNG KẾT

| Thành phần        | Vai trò chính                                                    |
|-------------------|-------------------------------------------------------------------|
| IP                | Định danh thiết bị trong mạng                                     |
| Router            | Định tuyến gói tin giữa các mạng                                 |
| Gateway           | Cửa ngõ mặc định để gửi dữ liệu ra ngoài                         |
| DNS               | Biến tên miền thành địa chỉ IP                                   |
| Proxy             | Trung gian đại diện cho client (forward) hoặc server (reverse)   |
| Load balancer     | Cân bằng tải giữa nhiều server                                   |
| API Gateway       | Quản lý giao tiếp giữa client và hệ thống nhiều service backend  |

