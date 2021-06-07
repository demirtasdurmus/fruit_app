//requiring modules*******************************************************************************
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Product = require("./models/product");
const { findByIdAndDelete } = require("./models/product");

//connecting db with monggose****************************************************************
mongoose.connect("mongodb://localhost:27017/farmStand", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log("Oops a problem");
        console.log(err);
    });

//using and setting modules*****************************************************************************
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const categories = ["fruit", "vegetable", "dairy"];

//displaying all products************************************************************************
app.get("/products", async (req, res) => {
    const products = await Product.find({})
    res.render("products/index", { products });
});

//creating new product for db***********************************************************
app.get("/products/new", (req, res) => {
    res.render("products/new", {categories})
});

app.post("/products", async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect("/products")
});

//finding a product according to its id************************************************
app.get("/products/:id", async (req, res) => {
    const foundProduct = await Product.findById(req.params.id);
    res.render("products/details", { foundProduct })
});

//editing a product by id***********************************************************
app.get("/products/:id/edit", async (req, res) => {
    const productSelect = await Product.findById(req.params.id);
    res.render("products/edit", { productSelect, categories });
});

app.put("/products/:id", async (req, res) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new:true, useFindAndModify:false });
    res.redirect(`/products/${updatedProduct.id}`);
});

//deleting a product by id*********************************************************************************
app.delete("/products/:id", async (req,res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products");
});

//setting up the server************************************************************************
app.listen(3000, () => {
    console.log("Server is awake on port 3000");
});