import firebase from 'firebase';
const config = {
    apiKey: "AIzaSyB9wsL5N9itPExq7vKRAx2FkcG08LOmo70",
    authDomain: "particle-devices-13db5.firebaseapp.com",
    projectId: "particle-devices-13db5",
    storageBucket: "particle-devices-13db5.appspot.com",
    messagingSenderId: "970826206393",
    appId: "1:970826206393:web:5fe8a6c3e666811ff41f68",
    measurementId: "G-18R9MTB5L6"
};
var fire = firebase.initializeApp(config);
export default fire;