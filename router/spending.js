const express = require("express");
const router = express.Router();
const Spending = require("../models/spending");

let getTodayDate = () => {
  let date = new Date();
  let nowYear = date.getFullYear();
  let nowMonth = (date.getMonth()+1) >= 10 ? (date.getMonth()+1) : "0" + (date.getMonth()+1);
  let nowDay = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
  return nowYear + "-" + nowMonth + "-" + nowDay;
};

//主頁生成今日帳本列表
router.get("/", (req, res, next) => {
  if(req.url == "/"){
    Spending.find({date: getTodayDate()}).then((spendings) => {
      res.render("spending", {title: "記帳系統" , spendings});
    }).catch(next);
//搜尋相符選項的帳本列表
  }else{
    let type = req.query.type;
    let date = req.query.date;
    if (type === "" && date === "") {
      Spending.find({}).then((spending) => {
        res.send(spending);
      }).catch(next);
    }else if(type === ""){
      Spending.find({"date": date}).then((spending) => {
        res.send(spending);
      }).catch(next);
    }else if(date === ""){
      Spending.find({"type": type}).then((spending) => {
        res.send(spending);
      }).catch(next);
    }else{
      Spending.find({"type": type, "date": date}).then((spending) => {
        res.send(spending);
      }).catch(next);
    }
  }
});

//新增帳本功能，回前端開啟新增帳本modal
//編輯帳本功能，把與_id相符的帳本傳回前端開啟新增帳本modal
router.get("/method", (req, res, next) => {
  if(req.url == "/method"){
    res.send({method : "新增帳本"});
  }else{
    Spending.findById({_id: req.query.id}).then((spending) => {
      res.send({method : "更新帳本", spending});
    }).catch(next); 
  }
});

//處理前端回傳的form資料
//createOrUpdate
router.post("/method", (req, res, next) => {
  if(req.body._id){
    updateData(req, res, next);
  } else{
    createData(req, res, next);
  };
});

let createData = (req, res, next) => {
  Spending.create(req.body).then((spending) => {
    console.log("以新增: " + spending);
    res.redirect("/spending");
  }).catch(next);
};

let updateData = (req, res, next) => {
  Spending.findByIdAndUpdate({_id: req.body._id}, req.body).then((spending) => {
    Spending.findOne({_id: spending._id}).then((updatedData) => {
      console.log("已更新: " + updatedData);
      res.redirect("/spending");
    });
  }).catch(next);
};

router.get("/delete/:id", (req, res,  next) =>{
  Spending.findByIdAndRemove({_id: req.params.id}).then((spending) => {
    console.log("已刪除: " + spending);
    res.redirect('/spending');
  }).catch(next);
});

module.exports = router;

// router.get("/list", async (req, res) => {   
//   //// 讀取 models/sample2.json  
//   //// 再透過 type 過濾資料 , 最後 response 給前端
//   try {
//     let data = await readFilePromise("models/sample2.json");
//     let type = req.query.type;
//     let date = req.query.date;

//     // 過濾資料
//     if (type === "" && date === "") {
//       res.json({ result: data });
//     } else if(type === "") {
//       let filteredData = data.filter(ele => ele["date"] === date);
//       res.json({ result: filteredData });
//     } else if(date === "") {
//       let filteredData = data.filter(ele => ele["type"] === type);
//       res.json({ result: filteredData });
//     } else{
//       let filteredData = data.filter(ele => ele["type"] === type && ele["date"] === date);
//       res.json({ result: filteredData });
//     }

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "系統有問題！" });
//   };
// });


// router.post("/data", async (req, res) => { 
//   try {
//     // 取得前端傳來 Form Data 的參數值
//     // console.log("req.body:",req.body);

//     // 將 req.body (Form Data) 寫入到 sample2.json 裡
//     // 1. 先讀出此 Array
//     let data = await readFilePromise("models/sample2.json");

//     //新增流水spendingID
//     latestId = data.map(n => n["spendingId"])
//       .filter(n => n !== undefined)
//       .sort((a, b) => b - a)[0];
//     newId = Number(latestId) + 1;
//     req.body.spendingId = String(newId);

//     // 2. 使用 .push 
//     data.push(req.body);

//     // 3. 再把 資料寫出去 sample2.json (同步處理)
//     // fs.writeFileSync("models/sample2.json", data , "utf8");  // 會錯誤 , fs.writeFileSync 只接受 string
//     fs.writeFileSync("models/sample2.json", JSON.stringify(data), "utf8");

//     res.json({ message: "ok." });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "系統有問題！" });
//   };
// });

