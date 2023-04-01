const express = require("express");
const fs = require("fs");
const router = express.Router();

let readFilePromise = (dataPath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
};

router.get("/page", (req, res) => {
  res.render("spending.html");
});

router.get("/list", async (req, res) => {   
  //// 讀取 models/sample2.json  
  //// 再透過 type 過濾資料 , 最後 response 給前端
  try {
    let data = await readFilePromise("models/sample2.json");
    let type = req.query.type;
    let date = req.query.date;

    // 過濾資料
    if (type === "" && date === "") {
      res.json({ result: data });
    } else if(type === "") {
      let filteredData = data.filter(ele => ele["date"] === date);
      res.json({ result: filteredData });
    } else if(date === "") {
      let filteredData = data.filter(ele => ele["type"] === type);
      res.json({ result: filteredData });
    } else{
      let filteredData = data.filter(ele => ele["type"] === type && ele["date"] === date);
      res.json({ result: filteredData });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "系統有問題！" });
  };
});

router.post("/data", async (req, res) => { 
  try {
    // 取得前端傳來 Form Data 的參數值
    // console.log("req.body:",req.body);

    // 將 req.body (Form Data) 寫入到 sample2.json 裡
    // 1. 先讀出此 Array
    let data = await readFilePromise("models/sample2.json");

    //新增流水spendingID
    latestId = data.map(n => n["spendingId"])
      .filter(n => n !== undefined)
      .sort((a, b) => b - a)[0];
    newId = Number(latestId) + 1;
    req.body.spendingId = String(newId);

    // 2. 使用 .push 
    data.push(req.body);

    // 3. 再把 資料寫出去 sample2.json (同步處理)
    // fs.writeFileSync("models/sample2.json", data , "utf8");  // 會錯誤 , fs.writeFileSync 只接受 string
    fs.writeFileSync("models/sample2.json", JSON.stringify(data), "utf8");

    res.json({ message: "ok." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "系統有問題！" });
  };
});

module.exports = router;