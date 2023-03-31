$(function(){

    $("#spending-select-btn").click(function(){

        // [Coding]
        // createTable();
        // alert("QQQQ");
        ////////

        //// 使用 ajax 發 request 
        //// 並用 query_string 攜帶參數
        let type = $("#categories-select").val();

        $.ajax({
            url  : "/spending/list?type=" + type, 
            type : "GET"    // requests 的方法 (種類)
         })
         .then(res=>{ 
            console.log(res);
            createTable(res["result"]);  // 丟入 Array 資料
         })
         .catch(err =>{
            console.log(err);
         });
    });

    $("#spending-insert-btn").click(function(){
        insertNewRecord();
    });

});

let createTable = (data)=>{

    let tableBody = data.map((ele,i)=>`
        <tr>
            <th scope="row">${i+1}</th>
            <td>${ele.category}</td>
            <td>${ele.date}</td>
            <td>$${ele.price}</td>
        </tr>
    `).join("");
    

    $("#spending-select-table tbody").html(tableBody);
};



let insertNewRecord = ()=> {
    let category  = $("#categories-insert option:selected").val(); 
    let date      = $("#date-insert").val();
    let price     = $("#price-insert").val();


    if(!date || date.length === 0){
        alert("請輸入日期！");
        return;
    };

    if(!price || price.legnth === 0){
        alert("請輸入花費！");
        return;
    };


    $.ajax({
        url  : "/spending/data",
        type : "POST",

        //// 以 application/x-www-form-urlencoded 資料傳送
        data : {
            category,
            date,
            price
        },
    })
    .then(r=>{
        if(r.message === "ok."){
            alert("更新完成！");
            // location.reload();  頁面 重新整理
        };
        
    })
    .catch(err=>{
        console.log(err);

        if(err.status === 404){
            alert("找不到該 API !");
            return;
        };
        
        alert("系統有誤 , 請稍後再試！");
    });
};
