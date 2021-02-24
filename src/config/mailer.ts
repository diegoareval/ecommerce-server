import chalk from "chalk"
import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.USER_EMAIL, // generated ethereal user
      pass: process.env.USER_PASSWORD, // generated ethereal password
    },
})

transport.verify().then(()=>{
    console.log("+++++mail configs++++++++++++++")
    console.log("+++++conected++++++++++++++")
      console.log(`Status: ${chalk.greenBright("ONLINE")}`);
      console.log("+++++conected++++++++++++++")
}).catch(()=>{
    console.log("+++++ not conected++++++++++++++")
      console.log(`Status: ${chalk.redBright("OFFLINE")}`);
      console.log("+++++ not conected++++++++++++++")

});