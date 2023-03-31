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

  //// 純 讀取 models/sample2.json  , response 給前端
  // try {
  //   let data = await readFilePromise("models/sample2.json");
  //   res.json({ result : data });
  // } catch (err){
  //   res.status(500).json({ message: "系統有問題！"});
  // };


  //// 讀取 models/sample2.json  
  //// 再透過 type 過濾資料 , 最後 response 給前端
  try {
    let data = await readFilePromise("models/sample2.json");
    let type = req.query.type;

    // console.log(testJJJJ);
    // console.log(data);
    // console.log(type);

    // 過濾資料
    if (type === "全") {
      res.json({ result: data });
    } else {
      let filteredData = data.filter(ele => ele["category"] === type);
      res.json({ result: filteredData });
    };

  } catch (err) {
    ////// Status code 整理
    // 2xx --> 請求 ok
    // 3xx --> 請求 ok , 但資源換位置 , response 會告訴你下一個位置
    // 4xx --> Client 端問題 , ex: 參數帶錯
    // 5xx --> Server 端問題 , ex: server.js 出現 bug 
    console.log(err);
    res.status(500).json({ message: "系統有問題！" });
  };
});

router.post("/data", async (req, res) => { 
  try {
    // 取得前端傳來 Form Data 的參數值
    // console.log("req.body:",req.body);
    let payload = req.body;
    console.log(payload["category"]);
    console.log(payload["date"]);

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