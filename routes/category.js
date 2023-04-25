const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const error = require("../utils/error");

router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json(error.serverError);
    }
});