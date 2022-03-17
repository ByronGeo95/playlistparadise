//Created by: Byron Georgopoulos
//Created on: 07/11/2021
//Last Modified on: 25/01/2022
/*Description: Controller containing all the functions that CRUD the admin collection on MongoDB*/

let Admin = require('../models/admin.model.js');

//Function to request a new admin
exports.requestAdmin = (req, res) => {
    let userDetails = req.body.userDetails;

    let newAdmin = new Admin({
        userDetails: userDetails,
    });

    newAdmin.save((err, data) => {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(data);
            res.send(data);
        }
    });

};

//Fucntion to check if a user is an admin or not
exports.checkAdminStatus = (req, res) => {
    let user_id = req.body._id;

    Admin.findOne({ 'userDetails._id': user_id }, (err, data) => {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(data);
            res.send(data);
        }
    });

};

//Function to fetch a list of all the users currently requesting to become admins
exports.fetchAdminReq = (req, res) => {
    Admin.find({  },(err, data) => {
        if (err)
        {
            console.log(err);
        }
        else
        {
            res.send(data);
        }
    });

};


//Function to remove a user from the list of admin requests (either approved or denied admin status)
exports.approveAdmin = (req, res) => {
    let _id = req.body._id;

    Admin.findOneAndDelete({ 'userDetails._id': _id }, (err, data) => {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(data);
        }
    });

};