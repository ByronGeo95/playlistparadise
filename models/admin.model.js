//Created by: Byron Georgopoulos
//Created on: 07/11/2021
//Last Modified on: 25/01/2022
/*Description: Model (Schema) for the admin collection of the web app. All admins details must follow this format*/

//Require Mongoose
const mongoose = require('mongoose');

//Admin Schema
let AdminSchema = mongoose.Schema({
    userDetails: {
        type: Object
    }
});

//Export the Admin Schema
module.exports = mongoose.model('admin', AdminSchema);