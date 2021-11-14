
let x, y, r;


function checkY() {
    let y = document.getElementById("Y");
    if (y.value.trim() === "") {
        wrongFieldY.textContent = "Поле Y должно быть заполнено";
        return false;
    }
    y.value = y.value.substring(0, 10).replace(',', '.');
    if (!(y.value && !isNaN(y.value))) {
        wrongFieldY.textContent = "Y должен быть числом!";
        return false;
    }
    if (y.value <= -5 || y.value >=3) {
        wrongFieldY.textContent = "Y должен принадлежать промежутку: (-5; 3)!";
        return false;
    }
    return true;
}

function checkX() {
    let xButtons = document.getElementsByName("X");
    let counter = 0
    xButtons.forEach(x => {
        if (x.checked)
            counter++
    })
    if (counter === 0) {
        wrongFieldX.textContent = "Вы должны выбрать минимум одно значение X";
        return false
    }
    return true;
}


function checkR() {
    let rButtons = document.getElementsByName("R"); 
    let counter = 0;
    rButtons.forEach(r => {
        if (r.checked)
            counter++
    })
    if (counter === 0) {
        wrongFieldR.textContent = "Вы должны выбрать одно значение R";
        return false
    }
    return true;
}

function submit () {
    wrongFieldX.textContent = "Choose X";
    wrongFieldY.textContent = "Choose Y";
    wrongFieldR.textContent = "Choose R";

    if (checkX() && checkY() && checkR()) {    
        x = document.querySelectorAll('input[name="X"]:checked');
        x = Object.values(x);
        x = x.map(inputHtml => inputHtml.value);
        
        let xArr = "";
        x.forEach(item => {
            xArr += "X[]="
            xArr += item;
            xArr += "&";
        });

        y = document.getElementById("Y").value;
        r = document.querySelector('input[name="R"]:checked').value;
        
        let url = "main.php";
        url+= "?" + xArr + "Y=" + y + "&R=" + r;

        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.send();
        xhr.onload = function () {
            if (xhr.status != 200) {
                alert("Error " + xhr.status + " " + xhr.statusText); 
                return;
            }

            $(".scroll-table tr:gt(0)").remove();
            let arrayOfResults = JSON.parse(xhr.responseText);

            arrayOfResults.forEach(result => {
                    let nRow = '<tr>';
                    nRow += '<td>' + result["X"] + '</td>';
                    nRow += '<td>' + result["Y"] + '</td>';
                    nRow += '<td>' + result["R"] + '</td>';
                    nRow += '<td>' + result["res"] + '</td>';
                    nRow += '<td>' + result["currentTime"] + '</td>';
                    nRow += '<td>' + result["processingTime"] + '</td>';
                    nRow += '</tr>';
                    $('#result-table').append(nRow);
            });
        };
    }

}

function clear () {
    let url = "clear.php";
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    $(".scroll-table tr:gt(0)").remove();
}

function loadOldData () {
    let url = 'main.php';
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url+"?Reload=true");
    xhr.send();
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert("Error " + xhr.status + " " + xhr.statusText); 
            return;
        }

        $(".scroll-table tr:gt(0)").remove(); 
        let arrayOfResults = JSON.parse(xhr.responseText);
        arrayOfResults.forEach(result => {
                let nRow = '<tr>';
                nRow += '<td>' + result["X"] + '</td>';
                nRow += '<td>' + result["Y"] + '</td>';
                nRow += '<td>' + result["R"] + '</td>';
                nRow += '<td>' + result["res"] + '</td>';
                nRow += '<td>' + result["currentTime"] + '</td>';
                nRow += '<td>' + result["processingTime"] + '</td>';
                nRow += '</tr>';
                $('#result-table').append(nRow);
        });

    }
}

document.getElementById("submit").addEventListener("click", submit);
document.getElementById("clear").addEventListener("click", clear);

loadOldData();

let wrongFieldX = document.getElementById("wrong_field_X");
let wrongFieldY = document.getElementById("wrong_field_Y");
let wrongFieldR = document.getElementById("wrong_field_R");
