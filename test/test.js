const userController = require('../controllers/user.controller.js');

let expect = require('chai').expect;
let should = require('chai').should();

let request = require('request');

describe('#searchUsers(req, res)', function () {
    it('should set the result to an object array', function () {

        //Arrange
        let req = {
            body: { 
                searchTerm: 'Mic',
                username: 'Byron',
                name: 'Byron'     
            }
        }

        let res = {
            data: { },
            send: function (_data) {
                data = _data
            }
         };

        //Act
        userController.searchUsers(req, res);

        //Assert/Expect/Should
        expect(res.data).to.be.a('object');
    });
});

describe('#searchUsers(req, res)', function () {
    it('should have a length of 12', function () {

        //Arrange
        let req = {
            body: { 
                searchTerm: 'Mic',
                username: 'Byron',
                name: 'Byron'     
            }
        }

        let res = {
            data: {"_id":{"$oid":"61997224855d55d328c73291"},"admin":true,"accType":"dev","email":"byrongeo95@gmail.com","name":"Byron Geo","username":"ByronGeo95","password":"stevengerrard8LFC","img":"https://i.imgur.com/5BCWS2v.jpeg","bio":"Peak Time / Driving Techno Fan","location":"Johannesburg","likedPlaylists":["61998109e6a2e5a984baa283","619997430e9d7f5012615043","619984f32b767e918656adfd"],"__v":{"$numberInt":"0"}},
            send: function (_data) {
                data = _data
            }
         };

        //Act
        userController.searchUsers(req, res);

        //Assert/Expect/Should
        Object.keys(res.data).should.have.lengthOf(12);
    });
});

describe('#getLikedUserDetails(req, res)', function () {
    it('should set the result to an object array', function () {
        
        //Arrange
        let req = {
            body: { 
                clickedLikes: [ '61997224855d55d328c73291', '61997d6ec6b24a70e14f215d' ]
            }
        }

        let res = {
            data: { },
            send: function (_data) {
                data = _data
            }
         };

        //Act
        userController.getLikedUserDetails(req, res);

        //Assert
        expect(res.data).to.be.a('object');
    });
});

describe('#getLikedUserDetails(req, res)', function () {
    it('should have a length of 2', function () {
        
        //Arrange
        let req = {
            body: { 
                clickedLikes: [ '61997224855d55d328c73291', '61997d6ec6b24a70e14f215d' ]
            }
        }

        let res = {
            data: [ {"_id":{"$oid":"61997224855d55d328c73291"},"admin":true,"accType":"dev","email":"byrongeo95@gmail.com","name":"Byron Geo","username":"ByronGeo95","password":"stevengerrard8LFC","img":"https://i.imgur.com/5BCWS2v.jpeg","bio":"Peak Time / Driving Techno Fan","location":"Johannesburg","likedPlaylists":["61998109e6a2e5a984baa283","619997430e9d7f5012615043","619984f32b767e918656adfd"],"__v":{"$numberInt":"0"}}, {"_id":{"$oid":"61997d6ec6b24a70e14f215d"},"admin":false,"accType":"default","email":"mic444@gmail.com","name":"Michael Flerianos","username":"Mic444","password":"platini444","img":"https://i.imgur.com/mnAfXxt.png","bio":"T Swizzle & Teddy Cream","location":"Athens, GR","likedPlaylists":["6199743a937c7eda99a85b2f","619976ff0238fd1c04920003","619a89274047700ae54170db","619974f512f8fe2eed0e1d76","61998109e6a2e5a984baa283"],"__v":{"$numberInt":"0"}} ],
            send: function (_data) {
                data = _data
            }
         };

        //Act
        userController.getLikedUserDetails(req, res);

        //Assert
        Object.keys(res.data).should.have.lengthOf(2);
    });
});

// describe('Status and content', function() {
//     describe ('Main Page', function() {
//         it('status', function(done){
//             request('http://localhost:3001', function(error, response, body) {
//             expect(response.statusCode).to.equal(200);
//             done();
//             });
//         });
//         it('content', function(done) {
//             request('http://localhost:3000/' , function(error, response, body) {
//             expect(body).to.equal('respond with a resource');
//             done();
//         });
//         });
//     });
// });