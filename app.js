require("dotenv").config();
const express = require("express")
const PORT = process.env.PORT || 3001;

const app = express();

app.get("/",(req,res)=>{
    res.send("Ganpati Bappa Morya!");
})

app.listen(PORT,()=>{
    console.log(`Server Listening On Port: ${PORT}`);
})