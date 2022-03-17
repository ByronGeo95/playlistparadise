//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 25/01/2022
/*Description: Controller containing all the functions that CRUD the playlist collection on MongoDB*/

//Requirement Declarations
let Playlist = require('../models/playlist.model.js');
const fs = require('fs'); 
const imgur = require('imgur-node-api'),
path = require('path');
require('dotenv').config();

//Function to fetch all of a users playlists
exports.fetchUserPlaylists = (req, res) => {
    let username = req.body.username;

    Playlist.find({ 'username': username }, (err, data) => {
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

//Function to create a new playlist
exports.createPlaylist = (req, res) => {
    let username = req.body.username;
    let playlistName = req.body.playlistName;
    let playlistDesc = req.body.playlistDesc;
    let playlistDate = req.body.playlistDate;
    let playlistImg = req.body.playlistImg;

    //Removes the prefix to a base64 image string
    let newImg = playlistImg.replace(/^data:image\/png;base64,/, "");
    //Saves the image as a .png to the server
    fs.writeFile(`${username} playlistImg.png`, newImg, 'base64', function(err) {
        console.log(err);
    });
    //Imgur ID
    imgur.setClientID(process.env.IMGUR_ID);

    let imgurURL = '';
    //Uploads the image from the server to Imgur using the Imgur API, using a third party Imgur npm
    imgur.upload(path.join(__dirname, `../${username} playlistImg.png`), function (err, res1) {
        console.log(res1.data.link);
        imgurURL = res1.data.link;
        //Create a new playlist model
        let newPlaylist = Playlist({
            username: username,
            name: playlistName,
            desc: playlistDesc,
            date: playlistDate,
            img: imgurURL,
        });
        //Save the above created playlist model
        newPlaylist.save((err, data) => {
            if (err)
            {
                console.log(err);
            }
            else
            {
                res.send(data);
            }
        });

    });

};

//Function to add a track to a created playlist
exports.addTrackToPlaylist = (req, res) => {
    let _id = req.body._id;
    let name = req.body.name;
    let artist = req.body.artist;
    let col = req.body.col;
    let artwork = req.body.artwork;
    let preview = req.body.preview;

    Playlist.findOneAndUpdate({ '_id': _id }, { $push: { tracks: { 'name': name, 'artist': artist, 'col': col, 'artwork': artwork, 'preview': preview  } } }, { new: true, useFindAndModify: false }, (err, data) => {
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

//Function to remove a track from a created playlist
exports.deleteTrackFromPlaylist = (req, res) => {
    let _id = req.body._id;
    let pos = req.body.pos;

    Playlist.findById({ '_id': _id }, (err, data) => {
        if (err)
        {
            console.log(err);
        }
        else
        {
            let tracksArr = data.tracks;
            //Removes track using position
            tracksArr.splice(pos, 1);
            Playlist.findByIdAndUpdate({ '_id': _id }, { tracks: tracksArr }, { upsert: true, new: true }, (err, data) => {
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
        }
    });

};

//Function to edit the details of an exisitng playlist
exports.editPlaylist = (req, res) => {

    let _id = req.body._id;
    let name = req.body.name;
    let desc = req.body.desc;
    let img = req.body.img;

    //Check if the playlist contains an image or not
    if (img === '')
    {
        Playlist.findByIdAndUpdate({ '_id': _id }, { 'name': name, 'desc': desc }, { upsert: true, new: true }, (err, data) => {
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
    }
    else
    if (img !== '')
    {
    
    let newImg = img.replace(/^data:image\/png;base64,/, "");

    fs.writeFile(`${_id} playlist.png`, newImg, 'base64', function(err) {
        console.log(err);
    });

    imgur.setClientID(process.env.IMGUR_ID);

    let imgurURL = '';

    imgur.upload(path.join(__dirname, `../${_id} playlist.png`), function (err, res1) {
        console.log(res1.data.link);
        imgurURL = res1.data.link;

            Playlist.findByIdAndUpdate({ '_id': _id }, { 'name': name, 'desc': desc, 'img': imgurURL }, { upsert: true, new: true }, (err, data) => {
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
    });

    }

};

//Function to delete a playlist entirely
exports.deletePlaylist = (req, res) => {

    let _id = req.body._id;

    Playlist.findByIdAndDelete({ '_id': _id }, (err, data) => {
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

//Add a users unique ID to the list of likes upon clicking like
exports.clickLikePlaylist = (req, res) => {
    let _id = req.body._id;
    let user_id = req.body.user_id;

    Playlist.findOneAndUpdate({ '_id': _id }, { $push: { 'likes': user_id } }, { new: true, useFindAndModify: false }, (err, data) => {
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

//Fetch all the playlists a user has liked
exports.fetchLikedPlaylists = (req, res) => {
    let likedPlaylists = req.body.likedPlaylists;
    let likedPlaylistsLen = likedPlaylists.length;

    Playlist.find({ '_id': likedPlaylists }, (err, data) => {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(`data: ${data}`);
            res.send(data);
        }
    });

};

//Remove a users unique ID from a the list of likes upon clicking unlike
exports.unlikeLikedPlaylist = (req, res) => {
    let _id = req.body._id;
    let playlist_id = req.body.playlist_id;

    Playlist.findOneAndUpdate({ '_id': playlist_id }, { $pull: { 'likes': _id } }, { new: true, useFindAndModify: false }, (err, data) => {
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

//Function to fetch the 3 most recently created playlist
exports.fetchRecentPlaylists = (req, res) => {
    let _id = req.body._id;

    Playlist.find({  }, (err, data) => {
        if (err)
        {
            console.log(err);
        }
        else
        {
            let dataLen = data.length - 1;
            let modData = [];

            for (let i = 0; i <= dataLen; i++)
            {
                if (data[i].tracks.length >= 2)
                {
                    modData.push(data[i]);
                }
            }

            let recentPlaylists = [];

            recentPlaylists.push(modData[modData.length-1]);
            recentPlaylists.push(modData[modData.length-2]);
            recentPlaylists.push(modData[modData.length-3]);

            res.send(recentPlaylists);
        }
    });
};

//Function to fetch the 3 playlists with the most likes
exports.fetchTopLikedPlaylists = (req, res) => {
    let _id = req.body._id;

    Playlist.find({  }, (err, data) => {
        let sortDataFind = [];
        if (err)
        {
            console.log(err);
        }
        else
        {
            for (let i = 0; i <= data.length-1; i++)
            {
                sortDataFind.push({ 'likesNum': data[i].likes.length, '_id': data[i]._id });
            }
        }

        sortDataFind.sort((a, b) => {
            return b.likesNum - a.likesNum;
        });

        let _idArr = [ sortDataFind[0]._id, sortDataFind[1]._id, sortDataFind[2]._id ]

        Playlist.find({ '_id': _idArr }, (err, data) => {
            if (err)
            {
                console.log(err);
            }
            else
            {
                res.send(data);
            }
        });

    });

};

//Function to search the entire collection based on the name of the playlist
exports.searchPlaylists = (req, res) => {
    let searchTerm = req.body.searchTerm;

    Playlist.find({ 'name': { $regex: new RegExp(searchTerm, 'i') } }, (err, data) => {
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

//Function to fetch the playlists listed as admin picks
exports.fetchAdminPickPlaylists = (req, res) => {
    let adminPicks_id = req.body.adminPicks_id;

    Playlist.find({ '_id': adminPicks_id }, (err, data) => {
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