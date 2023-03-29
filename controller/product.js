require('dotenv').config()
const express = require('express')
const product = express()
const {Product_schema, User_schema} = require('../data/mongo')
const mongoose = require('mongoose')
// const {query} = require("express");
//const uri_mongo = process.env.uri
const uri_mongo = `${process.env.URI}/asm3`
product.get('/products/pagination/:query', async (req, res) => {

    const query = req.params.query
    const text_arr = query.split('&')
    const text_arr_new = text_arr.map(el => el.split('='))
    const query_obj = {}
    text_arr_new.forEach(el => query_obj[el[0]] = el[1])
    console.log(query_obj)

    // { $or: [ {long_desc: {$regex: query_obj.search}} , {short_desc:{$regex:query_obj.search}}]
    if (query_obj.category === 'all') {
        const array = await Product_schema.find().limit(parseInt(query_obj.count)).limit(parseInt(query_obj.count) ).skip(9*parseInt(query_obj.page)-9)
        res.send(array)
        return
    }
    if (query_obj.category !== 'all') {
        const array = await Product_schema.find({category: query_obj.category}).limit(parseInt(query_obj.count) ).skip(9*parseInt(query_obj.page)-9)
        res.send(array)
        return
    }
    // hình như đề ko đòi làm đoạn này

})
product.post('/products', async (req, res) => {
    // res.header("Access-Control-Allow-Origin", "*");


    const prod = new Product_schema({
        name: req.body.name,
        category: req.body.category,
        img1: req.body.img1,
        img2: req.body.img2,
        img3: req.body.img3,
        img4: req.body.img4,
        short_desc: req.body.short_desc,
        longDesc: req.body.longDesc,
        price: req.body.price,
        remaining: req.body.remaining
    })
    await prod.save()
    console.log(req.body)
    res.json('save')
})

product.get('/products', async (req, res) => {
    console.log(req.session)

    const array = await Product_schema.find({remaining: {$gt: 0}})
    res.send(array)
})
product.get('/products/:id', async (req, res) => {

    const id = req.params.id
    const product = await Product_schema.findById(id)
    res.send(product)
})

//TODO admin route

product.get('/admin/products', async (req, res) => {

    if (req.session.role === 'admin') {
        const array = await Product_schema.find()
        res.send(array)
        return
    }
    if (req.session.role!=='admin'){
        res.send(null)
        return
    }
    let aaaa = 0
})

product.post('/admin/signin', async (req, res) => {
    const user = await User_schema.findOne({email: req.body.email})
    if (user === null || user.role!=='admin') {
        res.send({admin: false})
        return
    }
    const admin = user.toObject()

    if (req.body.password === admin.password && user.role==='admin' ) {
        req.session.role = 'admin'
        res.send({admin: true})
    }
    if (req.body.password !== admin.password || user.role !=='admin' ) {
        res.send({admin: false})
    }
    let aaaa = 0
})

module.exports = product