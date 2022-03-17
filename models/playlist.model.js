//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 25/01/2022
/*Description: Model (Schema) for the playlist collection of the web app. All playlists created must follow this format*/

//Require Mongoose
const mongoose = require('mongoose');

//Playlist Schema
let PlaylistSchema = mongoose.Schema({
    username: {
        type: String
    },
    name: {
        type: String
    },
    desc: {
        type: String
    },
    date: {
        type: String
    },
    img: {
        type: String,
        default: 'https://i.pinimg.com/originals/1e/af/79/1eaf79deb5e10c46b43fac10cfcbe6ad.jpg'
    },
    tracks: {
        type: Array,
        default: []
    },
    likes: {
        type: Array,
        default: []
    }
});

//Export the Playlist Schema
module.exports = mongoose.model('playlists', PlaylistSchema);