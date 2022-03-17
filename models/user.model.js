//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 25/01/2022
/*Description: Model (Schema) for the user collection of the web app. All users created must follow this format*/

//Require Mongoose
const mongoose = require('mongoose');

//User Schema
let UserSchema = mongoose.Schema({
    admin: {
        type: Boolean,
        default: false
    },
    accType: {
        type: String,
        default: 'default'
    },
    email: {
        type: String
    },
    name: {
        type: String,
        default: '',
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    img: {
        type: String,
        default: 'https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg'
    },
    bio: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    likedPlaylists: {
        type: Array,
        default: []
    },
});

//Exports the User Schema
module.exports = mongoose.model('users', UserSchema);