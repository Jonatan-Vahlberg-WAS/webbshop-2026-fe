const express = require("express");
const mongoose = require("mongoose");
const mongoproducts = require("../models/mongoproducts.js");



const router = express.Router();


router.get('/', async (req, res) => {
    try {
       
        const products = await mongoproducts.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send({ message: "Något gick fel", error: error.message });
    }
});



router.post('/', async (req, res) => {
    try {
        const {name, price, description, stock, category} = req.body;

        const newProduct = new mongoproducts({
            name, 
            price, 
            description,
            stock,
            category
        });

        await newProduct.save();
        res.status(201).send({ message: "Produkt skapad", product: newProduct });


    } catch (error) {
        res.status(500).send({ message: "Något gick fel, produkt ej inlagd", error: error.message});
    }
})

module.exports = router;