const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.render("about.html");
});

router.post("/data", (req, res) => {
    res.send({type:"POST"});
});

router.put("/data/:id", (req, res) => {
    res.send({type:"PUT"});
});

router.delete("/data/:id", (req, res) => {
    res.send({type:"DELETE"});
});

module.exports = router;