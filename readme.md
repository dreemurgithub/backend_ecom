### Project sử dụng ExpressJs dành cho Ecommerce
## Dev enviroment và deploy(ENV)
### ENV: 
URI của mongodb, production="false"/"true" (string, không phải boolean), encKey là 32 bit string ngẫu nhiên và sigkey là 64 bit string ngẫu nhiên
### Dev enviroment
production="false"/"true" sẽ quyết định biến origin để cookie gửi qua http hay https, do Chrome và các Web browser hiện đại yêu cầu Session cookie gưi qua https khác với HTTP nên product="false" sẽ edit origin và cookie cho http(http có secure: 'auto' và sameSite:'lax') và production="true" sẽ edit cookie cho https(secure:true và sameSite:'none')
### Deploy
Sử dụng replit với coldstart, nên load sản phẩm trên Client lúc đầu sẽ mất tầm 30s, ENV lưu trên replit có production="true"
## Các chức năng
### Cart
### History
### User
ssss
## Frontend chưa chuẩn mực
