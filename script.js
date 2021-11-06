
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
        wrongFieldX.textContent = "Вы должны выбрать одно значение X";
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

    x = document.querySelector('input[name="X"]:checked').value;
    y = document.getElementById("Y").value;
    r = document.querySelector('input[name="R"]:checked').value;
    
    let url = "main.php";
    url+= "?X=" + x + "&Y=" + y + "&R=" + r;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert("Error " + xhr.status + " " + xhr.statusText); 
            return;
        }

        $(".scroll-table tr:gt(0)").remove(); 
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
            $('#result-table').append(nRow);
        }
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

$("input:checkbox").on('click', function() {
    var $box = $(this);
    if ($box.is(":checked")) {
      var group = "input:checkbox[name='" + $box.attr("name") + "']";
      $(group).prop("checked", false);
      $box.prop("checked", true);
    } else {
      $box.prop("checked", false);
    }
  });


document.getElementById("submit").addEventListener("click", submit);
document.getElementById("clear").addEventListener("click", clear);

let wrongFieldX = document.getElementById("wrong_field_X");
let wrongFieldY = document.getElementById("wrong_field_Y");
let wrongFieldR = document.getElementById("wrong_field_R");
