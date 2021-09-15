const Subcategory = require('../../models/subcategoryModel');
const Car = require('../../models/carModel');
const response = require('../../utils/response');
const fileupload = require('../../utils/fileupload');
const Joi = require('joi');
const fs = require('fs');
var mongodb = require("mongodb")

const createSubcategory = async (req, res) => {
    try {
        const schema = Joi.object({
            categoryId: Joi.string().required(),
            subcategoryName: Joi.string().required()
        })

        const { error } = await schema.validate(req.body);
        if (error) return response.responseHandlerWithMessage(res, 400, error.details[0].message);

        let subcategoryObj = new Subcategory({
            categoryId: req.body.categoryId,
            subcategoryName: req.body.subcategoryName,
            subcategoryStatus: 1
        })
        let saveData = await subcategoryObj.save();
        if(!saveData){
            return response.responseHandlerWithMessage(res, 201, "Some error found.");
        }
        return response.responseHandlerWithMessage(res, 200, "Sub-Category Added Successfully");
    } catch (error) {
        response.log("admin login error is=========>", error);
        return response.responseHandlerWithData(res, 500, "Internal Server Error");
    }
}

const categoryList = async (req, res) => {
    try {
        let result = await Car.find({categoryStatus:1})
        response.responseHandlerWithData(res, 200, "Thematic List", result);
    } catch (error) {
        response.log("error is ==========>", error)
        return response.responseHandlerWithData(res, 500, "Internal Server Error");
    }
}
const carList = async (req, res) => {
    try {
        let result = await Car.find({})
        response.responseHandlerWithData(res, 200, "Car List", result);
    } catch (error) {
        response.log("error is ==========>", error)
        return response.responseHandlerWithData(res, 500, "Internal Server Error");
    }
}
const editCategory = async (req, res) => {
    try {
        const schema = Joi.object({
            categoryId: Joi.string().required(),
            categoryName: Joi.string().min(3).max(30).required(),
        })
        const { error } = await schema.validate(req.body);
        if (error) return response.responseHandlerWithMessage(res, 400, error.details[0].message);

        let categoryObj = {
            categoryName: req.body.categoryName
        }
        var updateCategory = await Category.findByIdAndUpdate({ _id: req.body.categoryId }, categoryObj, { new: true });
        if (!updateCategory) {
            return response.responseHandlerWithMessage(res, 201, "Something went wrong.");
        }
        return response.responseHandlerWithMessage(res, 200, "Category Updated Successfully");
    } catch (error) {
        response.log("admin login error is=========>", error);
        return response.responseHandlerWithData(res, 500, "Internal Server Error");
    }
}

const uploadImage = async function (req, res) {

    // console.log('req.files.image', req.files.image);

    const image = await fileupload.imageUpload(req.files.image);
    //console.log('image', image)
    return response.responseHandlerWithData(res, 200, "Image Uploaded", image);
}


module.exports = {
    createSubcategory,
    categoryList,
carList,
    editCategory,
    uploadImage
}
