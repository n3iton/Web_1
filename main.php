<?php 
session_start();

date_default_timezone_set('Europe/Moscow');
$currentTime = date("H:i:s");
$start = microtime(true);

function checkX() {
	if (!isset($_GET["X"])) {
        echo("isset X");
		return false;
    }
	if (!is_numeric($_GET["X"])) {
        echo("numeric X");
		return false;
    }
	if (!in_array($_GET["X"], array(-5, -4, -3, -2, -1, 0, 1, 2, 3))) {
        echo ("array X");
		return false;
    }
	return true;
}

function checkY() {
	if (!isset($_GET["Y"])) {
        echo("isset Y");
		return false;
    }
	if (!is_numeric($_GET["Y"])) {
        echo("numeric Y");
		return false;
    }
	if ($_GET["Y"] <= -5 || $_GET["Y"] >= 3) {
        echo("array Y");
		return false;
    }
	return true;
}

function checkR() {
	if (!isset($_GET["R"])) {
        echo("isset R");
		return false;
    }
	if (!is_numeric($_GET["R"])) {
        echo("numeric R");
		return false;
    }
	if (!in_array($_GET["R"], array(1, 2, 3, 4, 5))) {
        echo("array R");
		return false;
    }
	return true;
}

function circle_hit_check($x, $y, $r) {
	$result = "NO";
	if ($x*$x + $y*$y <= $r*$r)
		$result = "YES";
	return $result;
}

function rectangle_hit_check($x, $y, $r) {
	$result = "NO";
	if ($x <= $r && $y <= $r/2)
		$result = "YES";
	return $result;
}

	
function triangle_hit_check($x, $y, $r) {
	$result = "NO";
	if ($r + $x >= 2 * $y) 
		$result = "YES";
	return $result; 
}


function hit_check($x, $y, $r) {
	if ($x >= 0 && $y >= 0)
		return rectangle_hit_check($x, $y, $r);
	elseif ($x < 0 && $y > 0 )
		return triangle_hit_check($x, $y, $r);
	elseif ($x > 0 && $y < 0)
		return circle_hit_check($x, $y, $r);
	else return "NO";
}

if ($_GET["Reload"] == "true") {
	foreach($_SESSION['history'] as $resp) {
		$jsonValues = '{' .
			"\"X\":\"$resp[0]\"," .
			"\"Y\":\"$resp[1]\"," .
			"\"R\":\"$resp[2]\"," .
			"\"result\": \"$resp[3]\"," .
			"\"currentTime\":\"$resp[4]\"," .
			"\"processingTime\":\"$resp[5]\"" .
			"}";
		$answer = $answer . $jsonValues . ',';   
	}
	$answer = substr($answer, 0, -1);
	echo '{' . "\"response\":[" . $answer . ']}';
} else {
if (!checkX() || !checkY() || !checkR()) {
    
	header("Status: 400 Bad Request", true, 400);
	exit;
}

$X = $_GET["X"];
$Y = $_GET["Y"];
settype($Y, 'float');
$R = $_GET["R"];



$res = hit_check($X,$Y,$R);
$time = microtime(true) - $start;
$result = array($X,$Y,$R,$res,$currentTime, number_format($time, 10, ".", "") . " sec");

if (!isset($_SESSION['history'])) {
	$_SESSION['history'] = array();
}

array_push($_SESSION['history'], $result);

$answer = "";

foreach($_SESSION['history'] as $resp) {
    $jsonValues = '{' .
        "\"X\":\"$resp[0]\"," .
        "\"Y\":\"$resp[1]\"," .
        "\"R\":\"$resp[2]\"," .
        "\"result\": \"$resp[3]\"," .
        "\"currentTime\":\"$resp[4]\"," .
        "\"processingTime\":\"$resp[5]\"" .
        "}";
    $answer = $answer . $jsonValues . ',';   
}
$answer = substr($answer, 0, -1);
echo '{' . "\"response\":[" . $answer . ']}';
}
?>