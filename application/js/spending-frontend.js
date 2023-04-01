$(function(){
    $("#date-select").val(getTodayDate());
    $("#date-insert").val(getTodayDate());
    searchSpending();

    $("#clear-select-btn").click(function(){
        $("#type-select").val("");
        $("#date-select").val("");
    })
    $("#spending-select-btn").click(function(){
        searchSpending();
    });

    $("#spending-insert-btn").click(function(){
        insertSpending();
    });
});

let getTodayDate = () => {
    let date = new Date();
    let nowYear = date.getFullYear();
    let nowMonth = (date.getMonth()+1) >= 10 ? (date.getMonth()+1) : "0" + (date.getMonth()+1);
    let nowDay = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
    return nowYear + "-" + nowMonth + "-" + nowDay;
}

let createTable = (data)=>{
    let tableBody = data.map((ele,i)=>`
        <tr>
            <th scope="row">${i+1}</th>
            <td>${ele.type}</td>
            <td>${ele.date}</td>
            <td>$${ele.price}</td>
            <td>${ele.note}</td>
        </tr>
    `).join("");
    
    $("#spending-select-table tbody").html(tableBody);
};

let searchSpending = () => {
            
    let type = $("#type-select").val();
    let date = $("#date-select").val();

    console.log(type);
    console.log(date);
    
    $.ajax({
        url  : "/spending/list?type=" + type + "&date=" + date, 
        type : "GET"    // requests 的方法 (種類)
        })
        .then(res=>{ 
        console.log(res);
        createTable(res["result"]);  // 丟入 Array 資料
        })
        .catch(err =>{
        console.log("fuck");
        console.log(err);
        });
}

let insertSpending = ()=> {
    let type = $("#type-insert option:selected").val(); 
    let date = $("#date-insert").val();
    let price = $("#price-insert").val();
    let note = $("#note-insert").val();


    if(!date || date.length === 0){
        alert("請輸入日期！");
        return;
    };

    if(!price || price.legnth === 0){
        alert("請輸入花費！");
        return;
    };

    if(!note || note.legnth === 0){
        note = "";
        return;
    };

    $.ajax({
        url  : "/spending/data",
        type : "POST",

        //// 以 application/x-www-form-urlencoded 資料傳送
        data : {
            type,
            date,
            price,
            note
        },
    })
    .then(r=>{
        if(r.message === "ok."){
            alert("更新完成！");
            location.reload();  //頁面 重新整理
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
