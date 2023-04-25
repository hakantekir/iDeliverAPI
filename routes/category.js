const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const error = require("../utils/error");

router.get("/", async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        next(error.serverError);
    }
});

router.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    if (!id || id.length !== 24) {
        return next(error.invalidIdError);
    }
    try {
        const category = await Category.findById(id);
        if (!category) {
            return next(error.categoryNotFoundError);
        }
        res.status(200).json(category);
    } catch (err) {
        console.log(err);
        next(error.serverError);
    }
});

router.post("/", async (req, res, next) => {
    const { name } = req.body;

    const category = new Category({
        name
    });

    try {
        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (err) {
        next(error.serverError);
    }
});

router.put("/:id", async (req, res, next) => {
    const id = req.params.id;
    if (!id || id.length !== 24) {
        return next(error.invalidIdError);
    }
    const { name } = req.body;
    try {
        let category = await Category.findById(id);
        if (!category) {
            return next(error.categoryNotFoundError);
        }
        category.name = name;
        category = await category.save();
        res.status(200).json(category);
    } catch (err) {
        next(error.serverError);
    }
});

router.delete("/:id", async (req, res, next) => {
    const id = req.params.id;
    if (!id || id.length !== 24) {
        return next(error.invalidIdError);
    }
    try {
        const category = await Category.findById(id);
        if (!category) {
            return next(error.categoryNotFoundError);
        }
        await category.remove();
        res.status(204).end();
    } catch (err) {
        next(error.serverError);
    }

});

module.exports = router;