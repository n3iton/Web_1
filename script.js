"use strict";
let x, y, r;
function submit () {
    x = document.querySelector('input[name="X"]:checked').value;
    y = document.getElementById("Y").value;
    r = document.querySelector('input[name="R"]:checked').value;
    
    let url = "main.php";
    url+= "?X=" + x + "&Y=" + y + "&R=" + r;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onload = function () {
        if (xhr.status != 200)
            alert("Error " + xhr.status + " " + xhr.statusText);
        $(".main__table tr:gt(0)").remove();  

        let result = JSON.parse(xhr.responseText);
        for (let i in result.response) {
            let nRow = '<tr>';
            nRow += '<td>' + result.response[i].X + '</td>';
            nRow += '<td>' + result.response[i].Y + '</td>';
            nRow += '<td>' + result.response[i].R + '</td>';
            nRow += '<td>' + result.response[i].result + '</td>';
            nRow += '<td>' + result.response[i].currentTime + '</td>';
            nRow += '<td>' + result.response[i].processingTime + '</td>';
            nRow += '</tr>';
            $('.result_table').append(nRow);
        }
    };

}

document.getElementById("submit").addEventListener("click", submit);
