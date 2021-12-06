const express=require("express");

const app=express();

app.use(express.static("public"))

let port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log("Listening to port "+port);
})
