// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// async function createMessage() {
//   const message = await client.messages.create({
//     body: "This is the ship that made the Kessel Run in fourteen parsecs?",
//     from: "+12692304594",
//     to: "+15558675310",
//   });

//   console.log(message.body);
// }

// createMessage();

exports.createMessage=async(body,to)=>{
    console.log("Text is and to is" , body , to)
    try{

        const message = await client.messages.create({
            body:body,
            from:'+12692304594',
            to:to
        })
        return message;
    }
    catch(error){
    console.log(error)
    }
}


// make a call api


exports.createcall=async(to)=>{
    try{

        const call =  await client.calls.create({
            from:'+12692304594',
            to:to,
            url: 'http://demo.twilio.com/docs/voice.xml',

        })
        return call

    }catch(error){
        console.log(error)
    }
}