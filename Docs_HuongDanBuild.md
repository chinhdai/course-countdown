# Hướng Dẫn Cơ Bản: Tạo Ứng Dụng iOS Với React Native & Expo

Tài liệu này được biên soạn dành riêng cho người mới bắt đầu học lập trình, ghi lại cách thức hoạt động của dự án "Tap Count" (Course Countdown) mà chúng ta vừa thực hiện.

## 1. Công Nghệ Đang Sử Dụng Là Gì?

Dự án này sử dụng công nghệ cốt lõi là **React Native** kết hợp với bộ công cụ **Expo**.
*   **React Native:** Là một framework (khung phần mềm) do Facebook (Meta) tạo ra. Nó cho phép bạn viết mã bằng ngôn ngữ **JavaScript** (cụ thể là React), nhưng ứng dụng tạo ra lại có thể chạy trên cả iPhone (iOS) và Android. Thay vì phải học 2 ngôn ngữ khác nhau (Swift cho iOS và Kotlin/Java cho Android), bạn chỉ cần học 1 ngôn ngữ là JavaScript.
*   **Expo:** Hãy tưởng tượng Expo như một người thợ xây phụ việc đắc lực cho React Native. Nó che giấu đi những phần cài đặt phức tạp nhất của iOS/Android, giúp bạn tập trung vào việc viết giao diện và logic bằng JavaScript.

## 2. Cấu Trúc File Cơ Bản Trong Dự Án

*   `package.json`: Chứa danh sách các thư viện (mô-đun) mà ứng dụng cần để chạy (như `react`, `react-native`, `@react-native-async-storage/async-storage`).
*   `app.json`: Nơi khai báo tên ứng dụng ("Tap Count"), phiên bản, đường dẫn hình ảnh icon, màn hình khởi động (splash screen).
*   `App.js`: Đây là **trái tim** của ứng dụng. Khi ứng dụng khởi động, hệ thống sẽ đọc và chạy code trong file này đầu tiên. Ở dự án này, nó kiểm tra bộ nhớ xem bạn đã tạo khóa học nào chưa để quyết định chuyển sang màn hình nào (`HomeScreen`, `SetupScreen` hay `DashboardScreen`).
*   `/src/screens/`: Thư mục này chứa giao diện của từng màn hình cụ thể (Ví dụ: màn hình tạo mới, màn hình bấm nhấp). Mỗi màn hình là một "Component" (Thành phần) độc lập.

## 3. Quá Trình "Biến" JavaScript Thành Ứng Dụng iOS (.ipa) Mới Đây Đã Diễn Ra Thế Nào?

Thực tế, iPhone không hiểu JavaScript trực tiếp để hiển thị giao diện Native. Khi bạn chạy lệnh tạo `.ipa` thông qua **GitHub Actions** (được tôi cấu hình ở file `.github/workflows/build-trollstore-ipa.yml`), các bước sau đã diễn ra ẩn bên dưới:

1.  **Chuyển đổi (Prebuild):** Lệnh `npx expo prebuild` sẽ đọc file `app.json` của bạn và tự động sinh ra một thư mục iOS gốc chứa toàn bộ code Objective-C/Swift do máy tự tạo ra.
2.  **Cài Thư Viện iOS (CocoaPods):** Các thư viện JavaScript bạn gọi (như `AsyncStorage` để lưu dữ liệu) thực chất có một phần mã ngầm viết bằng ngôn ngữ của Apple dưới dạng các "Pod". Lệnh `pod install` đảm bảo các mảnh code gốc này được ghép vào dự án.
3.  **Biên Dịch (XcodeBuild):** Máy ảo macOS dùng phần mềm Xcode của Apple dịch toàn bộ mớ code đó thành tập tin máy học. Các thẻ (Tags) giao diện trong JavaScript (như `<View>`, `<Text>`) lúc này đã được "hô biến" thành các thẻ giao diện gốc của Apple (`UIView`, `UILabel`).
4.  **Fake Sign (Cho TrollStore):** Bình thường, file `.ipa` phải có chứng chỉ kỹ thuật số (từ tài khoản Apple Developer trả phí) thì iPhone mới cho cài. Lệnh `CODE_SIGNING_ALLOWED=NO` đã ép Xcode tạo ra file chưa được ký (Fake sign). Do TrollStore có khả năng khai thác lỗ hổng hệ thống để tự "đóng dấu đỏ" hợp lệ, nó cho phép bạn cài cái file "chui" này một cách vĩnh viễn.

## 4. Giải Đáp Câu Hỏi Của Bạn: Dùng Swift So Với JavaScript(React Native)

**Câu hỏi của bạn:** *"Code này đang viết bằng Javascript, vậy dùng Swift có tạo ứng dụng phản hồi nhanh hơn không?"*

**Trả Lời Ngắn Gọn:** **CÓ, Swift LUÔN LUÔN nhanh hơn và phản hồi tốt hơn.**

**Giải thích chi tiết:**
*   **Swift** là ngôn ngữ mẹ đẻ (Native) do chính Apple tạo ra. Khi bạn viết ứng dụng bằng Swift, code sẽ giao tiếp trực tiếp với bộ xử lý (CPU) và bộ nhớ của iPhone mà không cần qua trung gian. Do đó, các hiệu ứng hình ảnh (như bóng bay nổi lên), tốc độ khởi động, hay tốc độ lưu dữ liệu sẽ mượt mà, phản hồi ngay lập tức đến từng mili-giây. Bạn kiểm soát được 100% phần cứng.
*   **React Native (JavaScript)** lúc trước hoạt động qua một lớp trung gian (gọi là *JavaScript Bridge*). Khi bạn bấm nút (đây là sự kiện bên hệ điều hành iOS), tín hiệu phải "chạy qua cầu" gửi sang bên JavaScript để tính toán, JavaScript tính xong lại đẩy lệnh "vẽ màn hình" qua cầu ngược về cho iOS. Sự "chạy qua chạy lại" này đôi khi (nếu viết code không khéo) sẽ gây ra độ trễ.

> **Cập nhật 2025+:** Từ React Native 0.74 trở đi, "JavaScript Bridge" đã được thay bằng kiến trúc mới (**New Architecture** với JSI - JavaScript Interface). JavaScript có thể gọi trực tiếp các hàm Native qua con trỏ bộ nhớ chung, không cần serialize/deserialize qua cầu nữa. Tốc độ phản hồi đã được cải thiện rất nhiều. Dự án này (Expo SDK 54 / RN 0.81) đang sử dụng New Architecture mặc định.

**Tuy nhiên, thực tế hiện nay (Kỳ Lọng):**
1.  **Khoảng cách đã được thu hẹp:** Với kiến trúc mới của React Native (New Architecture) và các thư viện hiện đại, tốc độ của React Native hiện nay được đánh giá là đủ tốt (khoảng 80-90% sức mạnh của ứng dụng Native). Chỗ bạn thấy bị đơ là do lỗi *thiết kế tối ưu thuật toán* (Tôi để AsyncStorage chặn việc vẽ màn hình) chứ không hẳn do giới hạn gốc của React Native. 
2.  **Tiết kiệm thời gian:** Ưu điểm lớn nhất của React Native là bạn chỉ cần viết code 1 lần là có luôn phiên bản cho Android mà không cần phải mướn 2 nhóm lập trình viên khác nhau (1 nhóm viết Swift cho iOS, 1 nhóm viết Kotlin cho Android).

**Lời Khuyên:** Nếu bạn chỉ muốn tìm hiểu lập trình ứng dụng cho cá nhân mình dùng trên iPhone thì học Swift căn bản rất dễ hiểu và tối ưu nhất! Tuy nhiên, nếu bạn muốn phát triển sản phẩm ra thị trường cho người dùng đa nền tảng thì con đường học JavaScript/React Native như hiện tại vẫn được nhiều công ty lựa chọn.
