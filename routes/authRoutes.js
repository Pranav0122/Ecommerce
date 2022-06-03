const express=require('express');
const router=express.Router();
const User=require('../models/user');
const passport=require('passport');


router.get('/fakeuser',async(req,res)=>{
    const user=new User({
        username:'Abhi',
        email:'abhi@gmail.com',
    });
    const newUser=await User.register(user,'abhi12');
    res.send(newUser);
})

//Get the signUp form
router.get('/register',(req,res)=>{

    res.render('auth/signup');
})

//Register the new User in the database
router.post('/register',async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        
        const user=new User({
            username:username,
            email:email
        });

        await User.register(user,password);
        
        req.flash('success',`Welcome ${username},Please Login to continue`)
        
        res.redirect('/products')
    } 
    catch (e) {
        
        req.flash('error',e.message)
        
        res.redirect('/register')
    }
    // console.log(req.body);
    // res.send('POST REQUEST!!')
})


//Get the Login Page

router.get('/login',(req,res)=>{
    res.render('auth/login');
})


router.post('/login',
  passport.authenticate('local', { 
      failureRedirect: '/login', 
      failureFlash: true }),
      (req,res)=>{
        const {username}=req.user;
        req.flash('success',`Welcome ${username} Back Again!!`)
        res.redirect('/products')
  }
  );

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','Logout Successfully!!!');
    res.redirect('/login');
})


module.exports=router;