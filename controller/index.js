const express = require('express')
const controller = express()
const product = require('./product');const user_route = require('./user'); const cart_route = require('./cart');const history_route = require('./history')
const mongoose = require("mongoose");
const {Product_schema} = require('../data/mongo')
controller.use(product);controller.use(user_route) ; controller.use(cart_route) ; controller.use(history_route)
controller.get('/',(req,res)=>{
    console.log(req.session)
    res.send('hello controller-here is a session cookie? ')
})
controller.get('/hello',(req,res)=>{
    // req.session.role = 'fucker'
    console.log(req.session)
    res.send('hello controller')
})
controller.post('/hello',(req,res)=>{
    console.log([req.session,req.body])
    res.send({id: req.sessionID})
})



module.exports = controller