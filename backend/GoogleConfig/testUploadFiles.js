const fs = require('fs');
const { google }= require('googleapis');
import apikeys from "./api_key.json"
const SCOPE = ['https://www.googleapis.com/auth/drive.file'];

// A Function that can provide access to google drive api
async function authorize(){
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    );

    await jwtClient.authorize();

    return jwtClient;
}

// A Function that will upload the desired file to google drive folder
async function uploadFile(authClient){
    return new Promise((resolve,rejected)=>{
        const drive = google.drive({version:'v3',auth:authClient}); 

 
    });
}

authorize().then(uploadFile).catch("error",console.error()); // function call