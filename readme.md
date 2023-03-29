### Project sử dụng ExpressJs dành cho Ecommerce
## Dev enviroment, deploy(ENV), cách vận hành
### ENV: 
URI của mongodb, production="false"/"true" (string, không phải boolean), encKey là 32 bit string ngẫu nhiên và sigkey là 64 bit string ngẫu nhiên
### Dev enviroment
production="false"/"true" sẽ quyết định biến origin để cookie gửi qua http hay https, do Chrome và các Web browser hiện đại yêu cầu Session cookie gưi qua https khác với HTTP nên product="false" sẽ edit origin và cookie cho http(http có secure: 'auto' và sameSite:'lax') và production="true" sẽ edit cookie cho https(secure:true và sameSite:'none')
### Deploy
Sử dụng replit với coldstart, nên load sản phẩm trên Client lúc đầu sẽ mất tầm 30s, ENV lưu trên replit có production="true"
### Bài tập được thực hành với Code Frontend có sẵn, nhưng không chuẩn mực
Code Frontend sử dụng query string chứa user id, product id, nên bắt buộc phải sử dụng query string thay vì lệnh post fetch. App hoạt động ổn định nhưng code chưa chuẩn mực lắm. Nếu build sản phẩm mới từ đầu cần viết lệnh fetch chuẩn mực thay vì sử dụng query string để chống lộ thông tin user.
## Các chức năng
### User
Đăng nhập vào /user bằng query string chứa user ID và get request, schema của user trong data/mongo.js 
### Cart
Chỉ sử dụng được sau khi đăng nhập. lấy user hiện tại để hiển thị các sản phẩm trong giỏ hàng bằng lệnh fetch.
### History
Client get request tới histories/:query có query string chứa user_id, ta parse query ra và return danh sách order. histories/order/:id chúa toàn bộ thông tin của order
### Product
Schema của product, của order ở trong mongo.js và tất cả các lệnh của Client có sẵn đều là get request với query string chứa ID sản phẩm.
