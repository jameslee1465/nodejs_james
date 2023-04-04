var type = "";
var date = "";
$(function(){
     date = getTodayDate();
    $("#date-select").val(getTodayDate());
});

$("#clear-select-btn").click(function(){
    $("#type-select").val("");
    $("#date-select").val("");
    type = "";
    date = "";
    setList();
})

let showModal = (method, id) => {
    if(method == "create"){
        $.ajax({
            url :"/spending/method",
            type : "GET"
         }).then(res => {
            $('#createOrUpdate_title').html(res.method);
            $("#date-createOrUpdate").val(getTodayDate());
            $('#createOrUpdate_submit').html(res.method);
            $('#createOrUpdate_Modal').modal('show');
        }).catch(err =>{
            console.log(err);
        });
    }else if(method == "update"){
        $.ajax({
            url :"/spending/method?id=" + id,
            type : "GET"
        }).then(res => {
            let idDiv = `
            <input type="hidden" id="id-createOrUpdate" name="_id" value="${res.spending._id}">
            `
            $('#id-createOrUpdate').html(idDiv); 
            $('#type-createOrUpdate').val(res.spending.type);
            $('#date-createOrUpdate').val(res.spending.date);
            $('#price-createOrUpdate').val(res.spending.price);
            $('#note-createOrUpdate').val(res.spending.note);
            $('#createOrUpdate_title').html(res.method);
            $('#createOrUpdate_submit').html(res.method);
            $('#createOrUpdate_Modal').modal('show')
            
        }).catch(err =>{
            console.log(err);
        });
    }
};


let getTodayDate = () => {
    let today = new Date();
    let nowYear = today.getFullYear();
    let nowMonth = (today.getMonth()+1) >= 10 ? (today.getMonth()+1) : "0" + (today.getMonth()+1);
    let nowDay = today.getDate() >= 10 ? today.getDate() : "0" + today.getDate();
    return nowYear + "-" + nowMonth + "-" + nowDay;
}

let search = (key, value) => {
    switch (key){
        case 'type':
            type = value;
            console.log(type);
            setList();
            break;
        case 'date':
            date = value;
            console.log(date);
            setList();
            break;
        default:        
    }
}

let setList = ()=>{
    console.log(type);
    console.log(date);
    $.ajax({
        url  : "/spending?type=" + type + "&date=" + date, 
        type : "GET"    // requests 的方法 (種類)
    }).then(res=>{ 
        let tableBody = res.map((ele,i)=>`
            <tr>
                <th scope="row">${i+1}</th>
                <td>${ele.type}</td>
                <td>${ele.date}</td>
                <td>$${ele.price}</td>
                <td>${ele.note}</td>
                <td>
                    <a href="#" onclick="showModal('update', '${ele._id}')"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></a>
                    <a href="/spending/delete/${ele._id}" onclick="return confirm('Are you sure to delete this record ?');"><i class="fa fa-trash fa-lg" aria-hidden="true"></i></a>
                </td>
            </tr>
        `).join("");
    
        $("#spending-select-table tbody").html(tableBody);  // 丟入 Array 資料
    }).catch(err =>{
        console.log(err);
    });
};