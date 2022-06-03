const express=require('express');
const router=express.Router();
const Product=require("../models/product")
const Review=require("../models/review")

//Get all the products from database
router.get('/products',async(req,res)=>{
    try{
        const products=await Product.find();
        res.render('products/index',{products});
    }
    catch(e){
        req.flash('error','oops, something went wrong')
        res.redirect('/error')
    }
})

//Get the new form to create new product 
router.get('/products/new',(req,res)=>{
    res.status(200).render('products/new');
})

//Create a new product with the given payload(data)
router.post('/products', async (req, res) => {
    
    try{
        const newProduct = {
            ...req.body
        }
    
        await Product.create(newProduct);
    
        req.flash('success','Product created successfully')
        res.redirect('/products');
    }
    catch(e){
        req.flash('error','oops, something went wrong')
        res.redirect('/error')
    }
});
//Show a particular Product
router.get('/products/:id',async (req,res)=>{
    try{
        const { id }=req.params;
        //Inflating the foundproduct with the reviews using populate method
           const product= await Product.findById(id).populate('reviews');
        //    console.log(product);
        
           res.render('products/show',{ product });
    }catch(e){
        req.flash('error','oops, something went wrong')
        res.redirect('/error')
    }
});
//Getting the edit form prefilled from database
router.get('/products/:id/edit',async(req,res)=>{
    try{
        const {id}=req.params;
        const product=await Product.findById(id);
        res.render('products/edit',{product})
    }
    catch(e){
        req.flash('error','oops, something went wrong')
        res.redirect('/error')
    }
})


//Updated the product with the given payload
router.patch('/products/:id',async(req,res)=>{
    try{
        const updatedProduct=req.body;
        const{ id }=req.params;
        await Product.findByIdAndUpdate(id, updatedProduct);
        res.redirect('/products')
    }
    catch(e){
        req.flash('error','oops, something went wrong')
        res.redirect('/error')
    }
})


router.delete('/products/:id',async(req,res)=>{
    try{
        const{id}= req.params;
        await Product.findByIdAndDelete(id);
        res.redirect('/products');
    }
    catch(e){
        req.flash('error','oops, something went wrong')
        res.redirect('/error')
    }
})

router.post('/products/:id/review',async(req,res)=>{
    try{
        const {id}=req.params;
        const product=await Product.findById(id);
        const {rating,comment}=req.body;
        const review=new Review({rating,comment})
        product.reviews.push(review);
        await product.save();
        await review.save();
    
        req.flash('success','Successfully created your review!!')
    
        res.redirect(`/products/${id}`);
    }
    catch(e){
        req.flash('error','oops, something went wrong')
        res.redirect('/error')
    }
})


module.exports=router;