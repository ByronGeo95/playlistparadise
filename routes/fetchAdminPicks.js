//Created by: Byron Georgopoulos
//Created on: 23/11/2021
//Last Modified on: 25/01/2022
/*Description: Fetch the admin picks upom login (editors picks) list (adminPick controller)*/

//Export the ftech admin pick route
module.exports = (app) => {
    const AdminPick = require('../controllers/adminPick.controller.js');
    app.post('/fetchAdminPicks', AdminPick.fetchAdminPicks);
};