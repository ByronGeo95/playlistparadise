//Created by: Byron Georgopoulos
//Created on: 23/11/2021
//Last Modified on: 25/01/2022
/*Description: Controller containing all the functions that CRUD the admin picks (editors picks) collection on MongoDB*/

let AdminPick = require('../models/adminPick.model.js');

//Fucntion to add a playlist to the list of admin picks
exports.addToAdminPick = (req, res) => {
    let clicked_id = req.body.clicked_id;

    let newAdminPick = new AdminPick({
        playlist_id: clicked_id,
    });

    newAdminPick.save((err, data) => {
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

//Fucntion to fetch the list of admin picks playlist unique ID's
exports.fetchAdminPicks = (req, res) => {

    AdminPick.find({  }, (err, data) => {
        let adminPickArr = [];
        let dataLen = data.length-1;
        if (err)
        {
            console.log(err);
        }
        else
        {
            for (let i = 0; i <= dataLen; i++)
            {
                adminPickArr.push(data[i].playlist_id);
            }

            res.send(adminPickArr);
        }
    });

};

//Fucntion to remove a unique and specific ID from the admin picks list
exports.removePlaylistAdminPick = (req, res) => {
    let playlist_id = req.body._id;

    AdminPick.findOneAndDelete({ 'playlist_id': playlist_id }, (err, data) => {
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