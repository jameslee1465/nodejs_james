const express = require("express");
const path = require("path");
const hbs = require("hbs");   // 記得 npm install hbs

const bodyParser = require("body-parser");  // 記得 npm install body-parser

const app = express();
const portNum = 8088;

const spendingRouter = require("./router/spending");


// [Views][1] 設定模板引擎 (解析 html 檔 , 讓 express 看懂 html 程式)
// hbs -> handlebars 為一種模板引擎
// 另外一種熱門的模板引擎 --> pug 
app.engine("html" , hbs.__express);

// [Views][2] 設定模板 (template) 位置
app.set("views" , path.join(__dirname , "application" , "views" ));

// [Views][3] 設定靜態檔的位置 (讀取 *.css / *.js / *.jpg / *.png / *.mp4 / ...)
// --> 處理 靜態檔 相關 requests
app.use( express.static( path.join( __dirname , "application") ));

////// 使 express 可以解析 Form data 
// [Body-Parser][1] 解析 application/json
app.use(bodyParser.json());

// [Body-Parser][2] 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended : false,   // 是否用 額外套件 解析字串
  limit : "1mb",      // 限制 參數資料大小
  parameterLimit : "10000" // 限制參數個數 
}));


app.get("/" , (req,res)=>{
  res.render("index.html");
});

app.use("/spending",spendingRouter);

app.get("/about",(req,res)=>{
  res.render("about.html");
});

app.listen(portNum , ()=>{
  console.log(`Server is running at localhost:${portNum}`);
});
