const User = require('../../models/userModel');
const Room = require('../../models/roomModel');
const config = require('../../config/config');
const response = require('../../utils/response');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
var mongodb = require("mongodb")
// const { ObjectId } = require('mongodb')


const checkUserMobileNo = async (req, res) => {
    try {
        const schema = Joi.object({
            countryCode: Joi.string().required(),
            mobileNo: Joi.string().min(3).max(30).required(),
        })
        const { error } = await schema.validate(req.body);
        if (error) return response.responseHandlerWithMessage(res, 400, error.details[0].message);

        let checkUsermobileNo = await User.findOne({ mobileNo: req.body.mobileNo, countryCode: req.body.countryCode })
        if (checkUsermobileNo) {
            response.log("userName does not exist");
            return response.responseHandlerWithMessage(res, 401, "This mobileNo is already exist.");
        }

        await Mobileverification.deleteMany({ mobileNo: req.body.mobileNo, countryCode: req.body.countryCode })

        // let checkmobileNo = await Mobileverification.findOne({ mobileNo: req.body.mobileNo, countryCode: req.body.countryCode })
        // if (checkmobileNo) {
        //     response.log("userName does not exist");
        //     return response.responseHandlerWithMessage(res, 401, "This mobileNo is already exist.");
        // }

        let sendData = {
            otp: Math.floor(1000 + Math.random() * 9000),
            countryCode: req.body.countryCode,
            mobileNo: req.body.mobileNo
        }

        let sendOtp = await sendingTwilioMessage(sendData);
        console.log('sendOtpsendOtpsendOtp', sendOtp)
        if (sendOtp) {
            return response.responseHandlerWithData(res, 200, "OTP sent on your registered mobile no.", sendOtp);
        } else {
            return response.responseHandlerWithData(res, 401, "OTP Error");
        }
    } catch (error) {
        response.log("admin login error is=========>", error);
        return response.responseHandlerWithData(res, 500, "Internal Server Error");
    }
}

const checkUserEmail = async (req, res) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
            userName: Joi.string().required(),
        })

        const { error } = await schema.validate(req.body);
        if (error) return response.responseHandlerWithMessage(res, 400, error.details[0].message);

        let checkUser = await User.findOne({ email: req.body.email })
        if (checkUser) {
            response.log("User does not exist");
            return response.responseHandlerWithMessage(res, 401, "This Email is already exist.");
        }

        let checkUserName = await User.findOne({ userName: req.body.userName })
        if (checkUserName) {
            response.log("userName does not exist");
            return response.responseHandlerWithMessage(res, 402, "This userName is already exist.");
        }
        return response.responseHandlerWithMessage(res, 200, "Okay");
    } catch (error) {
        response.log("admin login error is=========>", error);
        return response.responseHandlerWithData(res, 500, "Internal Server Error");
    }
}

const createUser = async (req, res) => {
    try {
            const schema = Joi.object({
                email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
                name: Joi.string().required(),
                mobileNo: Joi.string().min(3).max(30).required(),
                password: Joi.string().required(),
            })

            const { error } = await schema.validate(req.body);
            if (error) return response.responseHandlerWithMessage(res, 400, error.details[0].message);

            let checkUser = await User.findOne({ email: req.body.email })
            if (checkUser) {
                return response.responseHandlerWithMessage(res, 401, "This Email is already exist.");
            }

            let checkmobileNo = await User.findOne({ mobileNo: req.body.mobileNo })
            if (checkmobileNo) {
                return response.responseHandlerWithMessage(res, 401, "This mobileNo is already exist.");
            }

            req.body.email = (req.body.email).toLowerCase()
            let password = await bcrypt.hash(req.body.password, saltRounds);
            let Obj = new User({
                email: req.body.email,
                name: req.body.name,
                password: password,
                mobileNo: req.body.mobileNo,
                timezone: req.body.timezone,
            })
            // return response.responseHandlerWithData(res, 401, "Responce Data", Obj);
            let userData = await Obj.save();
            if(!userData){
                return response.responseHandlerWithMessage(res, 401, "Server error");
            }
            let jwtToken = jwt.sign({ "_id": userData._id }, config.jwtSecretKeyApp, { expiresIn: '15d' });
            let result2 = await User.findByIdAndUpdate({ _id: userData._id }, { $set: { jwtToken: jwtToken } }, { new: true })
            return response.responseHandlerWithData(res, 200, "User Added Successfully", result2);

    } catch (error) {
        response.log("admin login error is=========>", error);
        return response.responseHandlerWithData(res, 500, "Internal Server Error");
    }
}

const userLogin = async (req, res) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
            password: Joi.string().required()
        })
        const { error } = await schema.validate(req.body);
        if (error) return response.responseHandlerWithMessage(res, 400, error.details[0].message);

        let checkUser = await User.findOne({ email: req.body.email })
        if (!checkUser) {
            response.log("Invalid credentials");
            return response.responseHandlerWithMessage(res, 401, "Invalid credentials");
        }
        if (checkUser.status == '0' || checkUser.status == 0) {
            return response.responseHandlerWithMessage(res, 401, "Please verify your account.");
        }
        var passVerify = await bcrypt.compareSync(req.body.password, checkUser.password);
        if (!passVerify) {
            response.log("Invalid credentials");
            return response.responseHandlerWithMessage(res, 401, "Invalid credentials");
        }
        req.body.password = checkUser.password
        var query = { $and: [{ _id: checkUser._id }, { password: req.body.password }] }
        let checkPassword = await User.findOne(query)
        if (!checkPassword) {
            response.log("Invalid credentials");
            return response.responseHandlerWithMessage(res, 400, "Invalid credentials");
        }

        let jwtToken = jwt.sign({ "_id": checkUser._id }, config.jwtSecretKeyApp, { expiresIn: '15d' });
        let result = await User.findByIdAndUpdate({ _id: checkUser._id }, { $set: { "jwtToken": jwtToken } }, { new: true })

        let getUser = await User.findById({ _id: checkUser._id }).select('email name mobileNo createdAt jwtToken')

        return response.responseHandlerWithData2(res, 200, "You have successfully logged in", getUser);

    } catch (error) {
        response.log("Login error is=========>", error);
        return response.responseHandlerWithData(res, 500, "Internal Server Error");
    }
}

const userList = async (req, res) => {
    try {
        
        let userList = await User.find({ status: 1 })
        return response.responseHandlerWithData2(res, 200, "User List", userList);

    } catch (error) {
        response.log("Login error is=========>", error);
        return response.responseHandlerWithData(res, 500, "Internal Server Error");
    }
}

const createRoom = async (req, res) => {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
        })
        const { error } = await schema.validate(req.body);
        if (error) return response.responseHandlerWithMessage(res, 400, error.details[0].message);

        let Obj = new Room({
            name: req.body.name,
        })
        // return response.responseHandlerWithData(res, 401, "Responce Data", Obj);
        let userData = await Obj.save();
        if(!userData){
            return response.responseHandlerWithMessage(res, 401, "Server error");
        }
        return response.responseHandlerWithData2(res, 200, "Room Created", userData);

    } catch (error) {
        response.log("Login error is=========>", error);
        return response.responseHandlerWithData(res, 500, "Internal Server Error");
    }
}

const roomList = async (req, res) => {
    try {
        
        let userList = await Room.find({})
        return response.responseHandlerWithData2(res, 200, "Room List", userList);

    } catch (error) {
        response.log("Login error is=========>", error);
        return response.responseHandlerWithData(res, 500, "Internal Server Error");
    }
}















const deleteUser = async (req, res) => {
    try {
        await Mobileverification.deleteMany({ mobileNo: req.params.mobile, countryCode: req.params.countryCode })
        await User.deleteMany({ mobileNo: req.params.mobile, countryCode: req.params.countryCode })
        return response.responseHandlerWithMessage(res, 200, "User deleted");

    } catch (error) {
        response.log("admin login error is=========>", error);
        return response.responseHandlerWithData(res, 500, "Internal Server Error");
    }
}




const resetPassword = async (req, res) => {
    try {
        const schema = Joi.object({
            password: Joi.string().required(),
            userId: Joi.string().required()
        })
        const { error } = await schema.validate(req.body);
        if (error) return response.responseHandlerWithMessage(res, 400, error.details[0].message);

        let checkIdIsTrue = mongodb.ObjectID.isValid(req.body.userId);
        if (!checkIdIsTrue) response.responseHandlerWithMessage(res, 203, "Invalid id");

        let checkUser = await User.findOne({ _id: req.body.userId })
        if (!checkUser) {
            response.log("Invalid User Id");
            return response.responseHandlerWithMessage(res, 501, "Invalid User");
        }

        if (checkUser.status == '0' || checkUser.status == 0) {
            return response.responseHandlerWithMessage(res, 401, "Please verify your account.");
        }

        req.body.password = await bcrypt.hashSync(req.body.password, saltRounds);
        await User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { password: req.body.password } }, { new: true })
        response.log("Password reset successfully")
        return response.responseHandlerWithMessage(res, 200, "Password reset successfully");
    } catch (error) {
        response.log("Login error is=========>", error);
        return response.responseHandlerWithData(res, 500, "Internal Server Error");
    }
}
const changePassword = async (req, res) => {
    try {
        const schema = Joi.object({
            userId: Joi.string().required(),
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().required(),
        })
        const { error } = await schema.validate(req.body);
        if (error) return response.responseHandlerWithMessage(res, 400, error.details[0].message);

        let checkIdIsTrue = mongodb.ObjectID.isValid(req.body.userId);
        if (!checkIdIsTrue) response.responseHandlerWithMessage(res, 203, "Invalid id");

        let checkUser = await User.findOne({ _id: req.body.userId })
        if (!checkUser) {
            response.log("Invalid User Id");
            return response.responseHandlerWithMessage(res, 501, "Invalid User");
        }

        var passVerify = await bcrypt.compareSync(req.body.oldPassword, checkUser.password);
        if (!passVerify) {
            response.log("Invalid Old Password");
            return response.responseHandlerWithMessage(res, 401, "Invalid Old Password");
        }

        req.body.password = await bcrypt.hashSync(req.body.newPassword, saltRounds);
        await User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { password: req.body.password } }, { new: true })

        return response.responseHandlerWithMessage(res, 200, "Password changed successfully");

    } catch (error) {
        response.log("Login error is=========>", error);
        return response.responseHandlerWithData(res, 500, "Internal Server Error");
    }
}

const createOtp = async (req, res) => {
    try {
        const schema = Joi.object({
            countryCode: Joi.string().required(),
            mobileNo: Joi.string().required()
        })
        const { error } = await schema.validate(req.body);
        if (error) return response.responseHandlerWithMessage(res, 400, error.details[0].message);




        let checkmobileNo = await User.findOne({ mobileNo: req.body.mobileNo, countryCode: req.body.countryCode })
        if (!checkmobileNo) {
            return response.responseHandlerWithMessage(res, 401, "This mobileNo is not exist.");
        }
        let generateOtp = Math.floor(1000 + Math.random() * 9000);
        let sendData = {
            otp: generateOtp,
            countryCode: req.body.countryCode,
            mobileNo: req.body.mobileNo
        }

        let sendOtp = true
        console.log('sendOtpsendOtpsendOtp', sendOtp)
        if (sendOtp) {
            let getUser = await User.findOne({ mobileNo: req.body.mobileNo, countryCode: req.body.countryCode }).select('status countryCode mobileNo createdAt updatedAt')
            if (!getUser) {
                return response.responseHandlerWithMessage(res, 401, "Mobile no not exist");
            }
            getUser.otp = generateOtp;

            let resultArr = {
                _id: getUser['_id'],
                status: getUser['status'],
                countryCode: getUser['countryCode'],
                mobileNo: getUser['mobileNo'],
                createdAt: getUser['createdAt'],
                updatedAt: getUser['updatedAt'],
                otp: generateOtp,
            }

            return response.responseHandlerWithData(res, 200, "OTP sent on your registered mobile no.", resultArr);
        } else {
            return response.responseHandlerWithData(res, 401, "OTP Error");
        }




    } catch (error) {
        response.log("Login error is=========>", error);
        return response.responseHandlerWithData(res, 500, "Internal Server Error");
    }
}

const verifyOtp = async (req, res) => {
    try {
        const schema = Joi.object({
            otp: Joi.string().required(),
            countryCode: Joi.string().required(),
            mobileNo: Joi.string().required()
        })
        const { error } = await schema.validate(req.body);
        if (error) return response.responseHandlerWithMessage(res, 400, error.details[0].message);

        let getUser = await Mobileverification.findOne({ mobileNo: req.body.mobileNo, countryCode: req.body.countryCode }).select('_id mobileNo otp countryCode  createdAt')
        if (!getUser) {
            return response.responseHandlerWithMessage(res, 400, "Mobile is not registered");
        }
        console.log(getUser.otp, '==', req.body.otp);
        if (getUser.otp == req.body.otp) {
            return response.responseHandlerWithMessage(res, 200, "Account Verified");
        } else {
            return response.responseHandlerWithMessage(res, 400, "Invalid OTP");
        }
    } catch (error) {
        response.log("Login error is=========>", error);
        return response.responseHandlerWithData(res, 500, "Internal Server Error");
    }
}


module.exports = {
    checkUserEmail,
    checkUserMobileNo,
    createUser,
    userLogin,
    userList,
    createRoom,
    roomList,
    deleteUser,
    resetPassword,
    createOtp,
    verifyOtp,
    changePassword,
}
