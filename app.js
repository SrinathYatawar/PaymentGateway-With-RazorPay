const express = require("express");

const bodyParser = require("body-parser");

const Razorpay = require("razorpay");

const app = express();
require('dotenv').config()

const razorpay = new Razorpay({
  key_id:process.env.RAZORPAY_ID,
  key_secret:process.env.RAZORPAY_SECRET
})

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));


app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/order",function(req,res){
    var options = {
        amount: 100,  // amount in the smallest currency unit
        currency: "INR",
      };

      razorpay.orders.create(options, function(err, order) {
        res.json(order)
      });
})

app.post("/completing-order",function(req,res){
  razorpay.payments.fetch(req.body.razorpay_payment_id).then(function(paymentDocument){
    
    if(paymentDocument.status ==="captured"){
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.redirect("/");
    }

  })

})

app.listen(process.env.PORT || 4000);
