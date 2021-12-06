const express=require("express");

const app=express();

app.use(express.static("public"))

let port=process.env.PORT || 5000;
let server=app.listen(port,()=>{
    console.log("Listening to port "+port);
})
