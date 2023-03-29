require('dotenv').config()
const mongoose = require('mongoose');
const uri = `${process.env.URI}/asm3`
const encrypt = require('mongoose-encryption')
const [encKey, sigKey] =[process.env.encKey,process.env.sigKey] // api tutor quang
// encKey là 32 byte base 64 string, sigKey là 64 byte base 64 sttring
mongoose.connect(uri)
const Product_schema = new mongoose.Schema({
    name: String,
    category:String,
    img1:String,
    img2:String,
    img3:String,
    img4:String,
    long_desc:String,
    price:Number,
    short_desc:String,
    remaining:Number,
    count:Number
});
const Order_schema = new mongoose.Schema({
    email: String,
    idUser:String,
    user_name: String,
    address: String,
    delivery:String,
    status: String,
    phone:String,
    total: Number,
    list_product:[{Product: Product_schema , count:Number  }]

});
const User_schema = new mongoose.Schema({
    email:String,
    phone: String,
    fullname: String,
    password:String,
    role:String,
    list_order:[Order_schema],
    current_cart: [{Product: Product_schema , count:Number, id:String }]  // dùng props tên count là đúng
}) // bắt buộc có props fullname chính xác, nếu dùng infor khác front end sẽ hỗn loạn
// id:String check xem giỏ có sản phẩm chưa, có rồi thì cộng thêm. chưa thì thêm vào giỏ

User_schema.plugin(encrypt ,{encryptionKey: encKey, signingKey: sigKey ,excludeFromEncryption: ['email','phone','fullname','role','list_order','current_cart'] })



module.exports = {Product_schema: mongoose.model('products', Product_schema) ,
    Order_schema: mongoose.model('orders', Order_schema) ,
    User_schema: mongoose.model('users', User_schema)
}
