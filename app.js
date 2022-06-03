const express=require('express');
const app=express();
const mongoose=require('mongoose')
const path=require('path');
const session =require('express-session')
const flash=require('connect-flash');
const passport=require('passport')
const localStrategy=require('passport-local')
const User=require('./models/user');
//const router = require('./routes/productsRoutes');
const productRoutes=require('./routes/productsRoutes');
const authRoutes=require('./routes/authRoutes')
const seedDb=require('./seed');
const methodOverride=require('method-override');

mongoose.connect('mongodb://localhost:27017/shop-db')
.then(()=> console.log('DB Connected'))
.catch((err)=>console.log(err));

// seedDb();
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))

const sessionConfig={
     secret:'Notagoodsecret',
        resave:false,
        saveUninitialized:true
}


app.use(session(sessionConfig));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());


passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    next();
})

app.get('/',(req,res)=>{
    res.send('Home Page');
})
app.get('/error',(req,res)=>{
    res.render('error');
})

app.use(productRoutes);
app.use(authRoutes);



app.listen(2323,(req,res)=>{
    console.log("Server running at port 2323");
})