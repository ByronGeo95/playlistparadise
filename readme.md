# HyperionDev Final Capstone
## PLAYLIST PARADISE : Music Social Media Web App
#### By Byron Georgopoulos
#### Version 1

**Preface:**
This document is intended to be used by the developers of the web application, as well as the users and/or stakeholders.

**Introduction:**
The web application is needed as currently, there is no web application that integrates social media and music streaming services into an all-in-one service that is streamlined and easy-to-use. Spotify and Apple Music have some social media features, but this web application plans to improve on those already existing platforms. It will be connected with the iTunes API for music streaming.

**User Requirements Definition:**
The user will be able to create an account / sign in to an existing account. Then, the user will be able to search from millions of tracks from the iTunes library, stream the tracks, and add them to various user created playlists. The playlists will be able to be customizable, and editable (such as a name, description, an image). Users will be able to also search for other playlists created and curated by other users, and add them to their lists of playlists. Users will also be able to search for other users, and see a list of all the playlists they have created so far. They will also be able to see other information about a user, much like Instagram, on a profile page. There will also be a homepage, which will show popular playlists, recent playlists, as well as playlists chosen by the Playlist Paradise team (Editor's Picks). The user will also be able to update their profile such as their profile image or bio.

The user interface will be clean and minimal, with a strict hierarchy in terms of the size of text, and more important information being on top, with less important information being below. There will be a navigation bar stickied to the top of the web application, that will have the links and search bar needed to navigate the web application. Stickied to the bottom of the web application will be the music player and its controls. There will also be a help link on the navigation bar, with online support and documentation and guides. The application will make use of a JSON Web Token to ensure that all sensitive data is protected, and data will be stored on a secure NoSQL database, MongoDB. The application will be lightweight, and so response times will be kept to a minimum.

**System Architecture:**
The web stack that will be used for this web application will be the MERN Stack (MongoDB, Express.js, React, and Node.js). MongoDB will be used as the web application does not require a SQL based database system, given the data that well be stored for every user. This will make things more streamlined and lightweight. Express.js will be used on the backend for the server as it integrates well with both MongoDB and React, and the MVC model it uses is fast, reliable, and easy-to-use. React will be used from the frontend framework as it is highly responsive, lightweight, and has various packages to customize the web application so that the UI and UX is optimal and user friendly. The website will be used creating CRA (create-react-app), as it will be a single page application, with react-router used for any routing necessary. The frontend React web application will be styled using React Bootstrap, as it is lightweight and highly customizable, with further custom styling using in-line CSS. This is because React Bootstrap has a magnitude of various components to use, that can be customized to suit the user’s needs and is easy-to-use. The web application will be deployed using Heroku as it is a free service that is fast, reliable, secure, and easy to maintain. Furthermore, it is easy to deploy web applications using Heroku.

**System Requirements Specifications:**
The web application will work by utilizing the iTunes API to search for music, play, listen, and stream music from the API, and save music in user generated playlists. All of this information will be stored in the MongoDB database. This will be done by a user entering a search term (i.e. ‘Coldplay’), which will then send a request to the iTunes API, and return a list of tracks associated with the search term. If a user wishes to add the song to one of their playlists, they will be able to interact with the displayed track and add it to their playlist, which will then create a POST Request to the Express.js server and subsequently save the data returned from the iTunes API into the MongoDB database. The user will be able to see all of the playlists they have created and listen to the tracks in the playlist. A user can also search for other users’ playlists, and listen to the tracks that other users have curated. Furthermore, users will be able to search for other users (this is where the ‘social media’ aspect of the web app comes into play), and see all the playlists they have made, which will be visible on their profile. All of this will be achieved using CRUD operations, with GET and POST requests.

The application will be used by anyone that wishes to stream music and keep track of their music seamlessly in a clean, efficient, and easy-to-use single page web application, while being able to keep track of what their friends are doing in terms of music, as well as artists and record labels. Most people will benefit from the web application, as most people use some form of streaming service and some form of social media service. Now, both are wrapped up into one easy-to-use package. 

The music streaming service Spotify is what comes closest to what the web application can achieve, but the web application will build on and improve on Spotify’s already existing features.

The functional requirements of the web application are that you must be able to create/sign into an account effortlessly, create, edit, and delete playlists, search for music, users, and playlists, search the iTunes API for the magnitude of music it contains, and add it to existing playlists, visit other users profiles, like other users playlists, as well as edit a user’s profile.

The non-functional requirements are that the UI/UX must be intuitive, easy-to-use, minimal, 
and aesthetically pleasing. It must also be reliable, with error checking and status reports, so the user knows exactly what went wrong (or right). The web application must be lightweight to ensure fast response times, especially on the backend, where all data handling and CRUD operations will take place. Security in the form of Helmet, JSON Web Tokens, and database security must be efficient to ensure no data is leaked, lost, or stolen.

**User Stories:**
![User Story 1](https://imgur.com/5oGsQvo.png)

![User Story 1](https://imgur.com/SkvzqVI.png)

![User Story 1](https://imgur.com/EBNEI56.png)

**How To Use The App:**
Upon load, click the ‘Sign Up’ link at the underneath the login info. Enter your details, and click the green ‘Sign Up’ button. This will create an account for you, and take you to the homepage. On the left-hand-side, you will see a side navbar with various playlists (Editor’s Picks, Recent Playlists, and Popular Playlists). Click on one and the tracks in the playlist will be displayed on the main portion of the web app. At the top, you will see details about the app, such as name, description, number of likes (clickable to display who likes the tracks), number of tracks, the date it was created, and the user who created it (clickable, which will take you to the user’s profile). There is also an options dropdown button, where you can like the playlist (three horizontal dots). Underneath is the list of tracks, with album art, name, artist, and collection. There is a play button where you can play a track. Upon pressing the play button, it will load into the bottom navbar (audio player navbar). There you will find all the previously mentioned details about the selected track, as well as controls for the track itself (play/pause, volume, and the seek bar to choose the position of the track). At the top of the page is a navbar, where you navigate the app. Clicking on ‘Music’ will take you to your personal music page, where you can create and curate playlists. Click on the ‘Create Playlist’ from the side navbar, and a modal will appear. Click on the album art to choose a custom image for your playlist from your local machine (.png only). Enter a name and description, and click on ‘Create’, and your playlist will be created, and visible on the side navbar. Now it’s time to add music to our newly created playlist. On the top navbar, you will see a search bar. Type in the details about a track, and click ‘Search’. You will be taken to the search page, and your search results will be displayed. You can either play a track using the green play button, or click on the three horizontal dots to add it to a playlist (from a dropdown menu). Once tracks have been added, go back to the ‘Music’ page form the top navbar and click on your playlist. Your added tracks will be displayed. From there, you can either play a track, or delete it using the red trash can button. You can also edit or delete a playlist from the three horizontal dots in the playlist information. You can also search for users to see what playlist they have created or liked, or for playlists created and curated by other users for you to browse through and like if you want. At the right of the top navbar, you can click on your username and a dropdown menu will appear. From there, you can visit your profile, go to your account settings, or logout. Click on account settings to edit your profile. Here you can add your name, location, and bio, and hovering over the default profile image and clicking on it will allow you to add a custom profile picture. Once you have made your changes, click on ‘Save Changes’. You can also look at the other options on the side navbar such as changing your password, or applying to be an admin to be able to create more than 3 playlists. 

**Using The App On Your Local Machine:**
Put the main folder, titled ‘backend’ somewhere easy to access, such as your desktop. Open the command line interface (CLI) of your choice and type in ‘cd backend’. Then type the following lines into the CLI and press enter in-between them:

1.	npm i express
2.	npm i nodemon
3.	npm i body-parser
4.	npm i dotenv
5.	npm i helmet
6.	npm i imgur-node-api
7.	npm i jsonwebtoken
8.	npm i mongoose
9.	npm i chai
10.	npm i mocha

Next, open up another CLI window, and type ‘cd’, and then open up the ‘backend’ folder. You should a folder titled ‘frontend’. Drag that folder into your new CLI window, and press enter. Then type the following lines into the CLI and press enter in-between them:

1.	npm i react
2.	npm i react-bootstrap
3.	npm i react-router-dom
4.	npm i react-test-renderer
5.	npm i react-audio-player
6.	npm i jest
7.	npm i -S @fortawesome/fontawesome-svg-core @fortawesome/react-fontawesome @fortawesome/free-regular-svg-icons @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons

You have now installed all node module packages and dependencies, and the app is ready to be used. Open two new CLI windows. In the first one, cd to your ‘backend’ (using drag and drop as explained above) and type ‘npm start’. Then cd to your frontend and type ‘npm start’. Your default browser should open and load the web app at localhost:3000. The app is now up and running on your local machine.

To test the back and frontend, cd to them using your CLI and type in ‘npm test’ for both. There are already unit and snapshot tests written for both. 

Note: MongoDB URI’s and API keys need not be changed, as they are needed to connect to specific databases and accounts. 

**Security:**
Helmet has been installed as a security measure. Helmet helps you secure your Express apps by setting various HTTP headers. It is Express middleware. API keys and sensitive information has been hidden using a .env file. The application will make use of a JSON Web Token to ensure that all sensitive data is protected, and data will be stored on a secure NoSQL database, MongoDB.

**Third-Party API’s:**
In the backend of the application, I have used the Imgur API to host both profile images, as well as custom playlist images. This is done using a node module package called ‘imgur-node-api’, to make the uploading of images easier. An Imgur client secret is used. In the frontend of the application, I am using the iTunes API to search the iTunes store for music, which is then subsequently saved in the MongoDB database using Mongoose.

**Deployment:**
The web application has been deployed via Heroku and is on GitHub:
Heroku: https://playlistparadise.herokuapp.com/
GutHub: https://github.com/ByronGeo95/playlistparadise