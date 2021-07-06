//jshint esversion:6
require('dotenv').config();//encryption put it at the top
const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');
const encrypt = require('mongoose-encryption');

const app=express();
// View Engine Setup
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema=new mongoose.Schema ({
  email: String,
  password: String
});
//const secret ="Thisisourownlittlesecret.";//this is put inside the .env file for encrytion
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields:["password"]});

const User=new mongoose.model("User",userSchema);

app.get('/',function(req,res){
  res.render("home");
});
app.get('/login',function(req,res){
  res.render("login");
});
app.get('/register',function(req,res){
  res.render("register");
});

app.post('/register',function(req,res){
  const inputEmail= req.body.username;
  User.findOne({email: inputEmail},function(err, foundUser){
    if(!foundUser){
      const newUser= new User({
        email: req.body.username,
        password: req.body.passwordDal
      });
      newUser.save(function(err){
        if(err){
          console.log(err);
        }else{
          res.render("secrets");
        }
      });
    }
    else{
      res.send("already registered please try to login");
    }
  });
});
app.post('/login', function(req,res){
  const inputEmail= req.body.username;
  const password=req.body.password;
  User.findOne({email: inputEmail}, function(err, foundUser){
    if(!foundUser){
      res.send("Not registered yet!")
    }else{
      if(foundUser.password === password){
        res.render("secrets");
      }else {
        res.send("Wrong password!");
      }
    }
  });
});




app.listen(3000, function(){
  console.log("App is up and running at port 3000");
});
