const history_route = require('express')()
const mongoose = require('mongoose'); const uri = 'insert_database/collection'
const {User_schema, Order_schema} = require('../data/mongo')

history_route.get('/histories/:query',async (req,res)=>{
    
    const query = req.params.query
    const text_arr_new = query.split('&').map(el=>el.split('='))
    const query_obj = {}
    text_arr_new.forEach(el=>query_obj[el[0]] =el[1] )
    console.log(query_obj)
    const user = await User_schema.findById(query_obj.idUser)
    const array = user.list_order
    res.send(array)
})
history_route.get('/histories/order/:id',async (req,res)=>{
    

    const order = await Order_schema.findById(req.params.id)
    // const array = order.list_order
    res.send(order)
})


module.exports = history_route