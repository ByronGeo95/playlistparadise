//Created by: Byron Georgopoulos
//Created on: 23/11/2021
//Last Modified on: 25/01/2022
/*Description: Model (Schema) for the admin picks (playlists) collection of the web app. Only admins picks playlists ID's can be saved here*/

//Require Mongoose
const mongoose = require('mongoose');

//Admin Pick Schema
let AdminPickSchema = mongoose.Schema({
    playlist_id: {
        type: String
    }
});

//Export Admin Pick Schema
module.exports = mongoose.model('adminPicks', AdminPickSchema);