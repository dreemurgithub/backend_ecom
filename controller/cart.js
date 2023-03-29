const express = require('express')
const cart_route = express()
const {Order_schema , Product_schema , User_schema} = require('../data/mongo')
const mongoose = require("mongoose");
const uri = 'insert_database/collection'
const fs = require('fs');const path = require('path')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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') //API của tutor quang
cart_route.post('/carts/add/:query',async (req,res)=>{
    
    const query = req.params.query
    const text_arr_new = query.split('&').map(el=>el.split('='))
    const query_obj = {}
    text_arr_new.forEach(el=>query_obj[el[0]] =el[1] )
    console.log(query_obj)
    const product = await Product_schema.findById(query_obj.idProduct )
    const user = await User_schema.findById(query_obj.idUser )
    const list_id = user.current_cart.map(el=>el.id)
    let index = list_id.indexOf(query_obj.idProduct)
    if (index>-1){  // check xem giỏ có sản phẩm chưa, có rồi thì cộng thêm. chưa thì thêm vào giỏ
        user.current_cart[index]['count'] +=parseInt(query_obj.count)
    } else user.current_cart.push({Product: product , count: parseInt(query_obj.count) ,id: query_obj.idProduct})


    await user.save()
    // sẽ group thành 1 sp trong cart sau, giờ cứ đặt 1 nơi để dễ read
    res.send('added')
})
cart_route.put('/carts/update/:query',async (req,res)=>{
    
    const query = req.params.query
    const text_arr_new = query.split('&').map(el=>el.split('='))
    const query_obj = {}
    text_arr_new.forEach(el=>query_obj[el[0]] =el[1] )
    console.log(query_obj)
    const product = await Product_schema.findById(query_obj.idProduct )
    const user = await User_schema.findById(query_obj.idUser )

    user.current_cart.forEach(el=>{
        if(el.id === query_obj.idProduct) el.count = query_obj.count
    })
    await user.save()

})
cart_route.delete('/carts/delete/:query',async (req,res)=>{
    
    const query = req.params.query
    const text_arr_new = query.split('&').map(el=>el.split('='))
    const query_obj = {}
    text_arr_new.forEach(el=>query_obj[el[0]] =el[1] )
    console.log(query_obj)
    const product = await Product_schema.findById(query_obj.idProduct )
    const user = await User_schema.findById(query_obj.idUser )

    console.log(req.params.query+' delete')
    let index = 0
    for (let i=0;i<user.current_cart.length;i++){
        if (user.current_cart[i].id=== query_obj.idProduct) index =i;
    }
    user.current_cart.splice(index,1)
    await user.save()
    // res.send('delete')

})
cart_route.get('/carts/:query',async (req,res)=>{  // send infor của user cart
    
    const query = req.params.query
    const text_arr_new = query.split('&').map(el=>el.split('='))
    const query_obj = {}
    text_arr_new.forEach(el=>query_obj[el[0]] =el[1] )
    console.log(query_obj)
    const user = await User_schema.findById(query_obj.idUser )
    const list = user.current_cart;

    const array_return = list.map(el=> {
        el.Product['count'] += el.count;
        return el.Product
    })
    console.log(array_return)
    res.send(array_return)

})
cart_route.post('/email/:query',async (req,res)=>{
    
    const query = req.params.query
    const text_arr_new = query.split('&').map(el=>el.split('='))
    const query_obj = {}
    text_arr_new.forEach(el=>query_obj[el[0]] =el[1] )
    console.log(query_obj)
    const user = await User_schema.findById(query_obj.idUser)

    const new_order = new Order_schema({
        email: query_obj.to,
        user_name : query_obj.fullname,
        address: query_obj.address,
        phone: query_obj.phone,
        idUser: query_obj.idUser,
        delivery: 'Waiting for progressing',
        status:'Waiting for pay',

    })
    const array_html = []  // html text
    new_order['list_product'] = user.current_cart
    let total = 0; for (let i=0;i<user.current_cart.length;i++){
        total += user.current_cart[i].Product.price *user.current_cart[i].count
        array_html.push({name: user.current_cart[i].Product.name ,
            img: user.current_cart[i].Product.img1 , price: user.current_cart[i].Product.price ,
            count: user.current_cart[i].count , to_vnd: user.current_cart[i].Product.price * user.current_cart[i].count
        })
    }
    const html_text_arr = array_html.map(el=>`<tr>
        <td style="border: 1px solid black; width: 15em">${el.name}</td>
        <td style="border: 1px solid black; width: 5.5em"><img style="width: 5em" src=${el.img}></td>
        <td style="border: 1px solid black; width: 10em">${el.price.toLocaleString()} VND</td>
        <td style="border: 1px solid black; width: 3em">${el.count}</td>
        <td style="border: 1px solid black; width: 10em">${el.to_vnd.toLocaleString()}</td>
         </tr>`)
    let sum_arr_text = '';for (let i=0;i<html_text_arr.length;i++) sum_arr_text+= html_text_arr[i]
    new_order['total'] = total
    user.current_cart =[];user.list_order.push(new_order)
    await user.save()
    await new_order.save()

    const msg = {
        to: query_obj.to , // Change to your recipient
        from: 'customer-support@dangminhquang.me', // Change to your verified sender
        subject: 'Hóa đơn',
        // text: 'and easy to do anywhere, even with Node.js',
            html: `
<h1>Xin chào ${query_obj.fullname}</h1>
<h2>Phone: ${query_obj.phone}</h2>
<h3>Address: ${query_obj.address}</h3>
<table>
    <tr>
                <th style="border: black 1px solid; width: 15em">Tên sản phẩm</th>
                <th style="border: black 1px solid; width: 5.5em"">Hình ảnh</th>
                <th style="border: black 1px solid; width: 10em">Giá</th>
                <th style="border: black 1px solid; width: 3em">Số lượng</th>
                <th style="border: black 1px solid; width: 10em">Thành tiền</th>
    </tr>
    ${sum_arr_text}
</table>
<h1>Tổng thanh toán: ${total.toLocaleString()} VND</h1><h2>Cám ơn bạn </h2>`
    }
    sgMail  // ở trên cùng đã đăng ký
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
    console.log(array_html)
    console.log(html_text_arr)
    res.send('order')
})

cart_route.get('/email',(req,res)=>{
    console.log( path.join('send_html','index.html') )
    // fs.readFile(__dirname + path.join('/send_html','index.html'),{encoding:'utf-8'},(err,data)=>{
    //     // console.log(data)
    // })

    const msg = {
        to: 'datltfx18467@funix.edu.vn', // Change to your recipient
        from: 'customer-support@dangminhquang.me', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        // html: data.toString()
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
        if(!err) res.send(data.toString())

    // res.sendFile(__dirname + path.join('/send_html','index.html'))

})

cart_route.get('/send_html',(req,res)=>{

})

module.exports = cart_route