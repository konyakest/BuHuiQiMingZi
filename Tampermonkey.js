// ==UserScript==
// @name         不会起名字
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.nfls.com.cn:10611/*
// @exclude      http://*/problem/*/*
// @require      http://www.nfls.com.cn:20035/cdnjs/blueimp-md5/2.10.0/js/md5.min.js
// @icon         https://cdn.jsdelivr.net/gh/NFLSCode/nflsoj-helper@master/images/icon.png
// @icon64       https://cdn.jsdelivr.net/gh/NFLSCode/nflsoj-helper@master/images/icon.png
// @grant        none
// ==/UserScript==



let usrName=["SXbaizongyu","SpadeA261","SXrenzihao","SXhanyuanrui","dayux"];
let proName=[
    "2276","5076",//24 B C
    "12914","12915",//25 B C
    "2279","2281"//26 B C
];




function showTable(data,dt2){
    var table = document.createElement("table");
    var data2=dt2;
    table.id="table";
    for (let i = 0; i < data.length; i++) {
        var row = document.createElement("tr"); // 创建表格行
        for (let j = 0; j < data[i].length; j++) {
            var cell = document.createElement(i === 0 ? "th" : "td"); // 第一行创建表头<th>，其他行创建表格单元格<td>
            cell.textContent = data[i][j]; // 设置单元格的内容
            //console.log("data2[i][j]",data2[i][j]);
            cell.onclick=function(i,j){window.open(data2[i][j],"_blank","")}.bind(null,i,j); // 设置单元格的内容
            //console.log(cell);
            row.appendChild(cell); // 将单元格添加到行中
        }
        table.appendChild(row); // 将行添加到表格中
    }
    window.open("","_blank","").document.getElementsByTagName("body")[0].appendChild(table);
    return table;
}

function setTableStyle(table){
    table.style.lineHeight="1.5";
    var cells=table.getElementsByTagName("tr");
    /*for(var i=0;i<cells.length;i++){
        cells[i].style.fontSize="20px";
        cells[i].style.border = "2px solid black";
    }*/
    for(var row=0;row<table.rows.length;row++){
        //console.log(row);
        for(var cell=0;cell<table.rows[row].cells.length;cell++){
            //console.log("cell",cell);
            table.rows[row].cells[cell].style.border = "1px solid black";
        }
    }
/*
    var tableWidth = table.offsetWidth; //获取表格宽度
    var pageWidth = document.body.clientWidth; //获取页面宽度
    var dis = (pageWidth - tableWidth) / 2; //获取表格需要移动的距离
    table.style.position = "relative"; //设置table的position属性为relative
    table.style.left = dis + "px"; //设置table的left属性为dis*/

}

async function getTitle(id){
    let name='http://www.nfls.com.cn:10611/submissions?contest=&practice=&problem_id='+id+'&submitter=&min_score=0&max_score=100&language=&status=';
    let str="";
    await fetch(name).then(function(x){return x.text();})
    .then(function(x){
        var p=x.match("\"problemName\":");
        p=p.index+15;
        while(x[p]!="\""){str+=x[p];p++;}
        //console.log(str);
    });
    return str;
}

async function calcAndShow(usrName,proName){
    //console.log(usrName,proName);
    let arr=["题目id"],arr2=[""],arr3=["题目名称"];
    for(let i in proName) arr.push(proName[i]);
    for(let i in proName) arr2.push("http://www.nfls.com.cn:10611/problem/"+proName[i]+"/?key="+md5(proName[i] + "problem_xxx"));
    for(let i in proName) arr3.push(await getTitle(proName[i]));
    let data=[],data2=[];
    data.push(arr);
    data.push(arr3);
    data2.push(arr2);
    data2.push(arr2);
    var tot=0;
    for(var usr in usrName){
        let tmp=[usrName[usr]],tmp2=[""];
        for(var i in proName){
            let name='http://www.nfls.com.cn:10611/submissions?contest=&practice=&problem_id='+proName[i]+'&submitter='+usrName[usr]+'&min_score=0&max_score=100&language=&status=';
            await fetch(name)
            .then(function(x){
                if(!x) return "";
                return x.text();
            })
            .then(function(x){
                var str;
                var p=x.match("\"score\":");
                if(!p) str="0";
                else{
                    p=p.index;
                    str=x[p+8];
                    if(x[p+9]!='}'){
                        str+=x[p+9];
                        if(x[p+10]!='}') str+=x[p+10];
                    }
                }
                console.log(tot,"/",usrName.length*proName.length,"finished");
                tot++;
                tmp.push(str);
                tmp2.push('http://www.nfls.com.cn:10611/submissions?contest=&practice=&problem_id='+proName[i]+'&submitter='+usrName[usr]+'&min_score=0&max_score=100&language=&status=');
            });
        }
        //console.log(tmp);
        data.push(tmp);
        data2.push(tmp2);
    }
    //console.log("data",data,data2);
    var table=showTable(data,data2);
    setTableStyle(table);
}

function buildproblemkey() {
    'use strict';
    let id;
    if (window.location.pathname.search("contest") < 0) {
        id = window.location.pathname.split('/').pop();
    } else {
        let statistics = document.querySelector("body > div:nth-child(2) > div.ui.main.container > div:nth-child(8) > div:nth-child(1) > div > div:nth-child(1) > a.small.ui.orange.button");
        if (statistics) {
            let tmp = statistics.href.split('/');
            id = tmp[tmp.length - 3];
        }
    }
    if (!id) return;
    //console.log(id);
    //let key = md5(id + "problem_xxx");
    let div = document.getElementsByClassName("ui main container")[0];
    let a = document.createElement("a");
    a.className = "small ui primary button";
    //a.href = `/problem/${id}?key=${key}`;
    //console.log(a);
    a.onmousedown=function(){/*console.log("calcAndShow");*/calcAndShow(usrName,[id])};
    a.innerHTML = "record";
    div.appendChild(a);
}

(function() {
    'use strict';

    //getTitle("12969");
    buildproblemkey();

    let div = document.getElementsByClassName("ui fixed borderless menu")[0];
    let button = document.createElement("a");
    button.className = "small ui primary button";
    button.style.width="100px";
    button.style.height="35px";
    button.style.align="center";
    //a.href = `/problem/${id}?key=${key}`;
    //console.log(a);
    button.onmousedown=function(){/*console.log("calcAndShow");*/calcAndShow(usrName,proName)};
    button.innerHTML = "补题情况";
    div.appendChild(button);
/*
    var button = document.createElement("button");
    button.id = "id001"; button.textContent = "repeat ranklist";
    button.style.width = "150px";
    button.style.height="40px";
    button.style.align="center";
    button.onclick=function(){calcAndShow(usrName,proName)};
    document.getElementsByClassName('ui fixed borderless menu')[0].appendChild(button);
*/
    var button2 = document.createElement("input");
    button2.type="text";
    button2.placeholder="input problem";
    button2.style.width = "200px";
    button2.style.height="35px";
    button2.style.align="center";
    button2.addEventListener("keydown", function(event){
        if(event.keyCode === 13){
            calcAndShow(usrName,[button2.value]);
            //window.open("http://www.nfls.com.cn:10611/contests?keyword="+button2.value);
        }
    });
    document.getElementsByClassName('ui fixed borderless menu')[0].appendChild(button2);

})();
