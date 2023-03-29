const user_route = require('express')()
const mongoose = require('mongoose'); const uri = 'insert_database/collection'
const {User_schema} = require('../data/mongo')
user_route.post('/users/signup/:query',async (req,res)=>{
    
    const query = req.params.query
    const text_arr_new = query.split('&').map(el=>el.split('='))
    const query_obj = {}
    text_arr_new.forEach(el=>query_obj[el[0]] =el[1] )
    console.log(req.session)
    console.log(query_obj)
    const check = await User_schema.find({email:query_obj.email})
    if (check.length>0) return  // đã trùng email ko được đăng ký
    if (check.length===0) {         // nếu ko có email , res để redirect tự động front end
    const new_user = new User_schema({
        email:query_obj.email,
        fullname:query_obj.fullname,
        phone:query_obj.phone,
        password:query_obj.password,
        role:'user',
        list_order:[],
        current_cart: []
    })
    await new_user.save()
    res.send('new user')  // phải có res để chuyển qua signin
    }

    // res.redirect(req.get('origin') +'/signin')
})
user_route.get('/users',async (req,res)=>{  // đây là route mà front end sign in @@
     // frontend dùng code nào đó mà tìm hết cả cả toàn bộ trong dữ liệu
    const array = await User_schema.find()
    res.send(array)
})
user_route.get('/users/:id',async (req,res)=>{
    
    console.log(req.session)
    const result =await User_schema.findById(req.params.id)    // do front end của đề viết bậy nên làm như này, dùng cái này để set sesssion
    req.session.role = result.role
    console.log('call id '+ req.params.id)
    res.send(result.fullname)
})
user_route.get('/signout',(req,res)=>{
    req.session.destroy()
    res.clearCookie('connect.sid')
    res.send({message: 'signout'})
})

module.exports = user_route