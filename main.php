<?php 

function checkX() {
	if (!isset($_GET["X"])) {
		return false;
    }

	$X = $_GET["X"];

	foreach ($X as $value)
		if (!is_numeric($value)) {
			return false;
		} 

	foreach ($X as $value)
		if (!in_array($value, array(-5, -4, -3, -2, -1, 0, 1, 2, 3))) {
			return false;
    	}
	return true;
}

function checkY() {
	if (!isset($_GET["Y"])) {
		return false;
    }
	if (!is_numeric($_GET["Y"])) {
		return false;
    }
	if ($_GET["Y"] <= -5 || $_GET["Y"] >= 3) {
		return false;
    }
	return true;
}

function checkR() {
	if (!isset($_GET["R"])) {
		return false;
    }
	if (!is_numeric($_GET["R"])) {
		return false;
    }
	if (!in_array($_GET["R"], array(1, 2, 3, 4, 5))) {
		return false;
    }
	return true;
}

function circle_hit_check($x, $y, $r) {
	$result = "NO";
	if (sqrt($x*$x + $y*$y) <= $r/2)
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

session_start();

date_default_timezone_set('Europe/Moscow');
$currentTime = date("H:i:s");

if ($_GET["Reload"] == "true") {
	foreach ($_SESSION["history"] as $result) {
		$currentJSONObject = json_encode($result);
		$jsonResult .= $currentJSONObject;
		$jsonResult .= ",";
	}
	$jsonResult = substr($jsonResult, 0, -1);
	$jsonResult = "[" . $jsonResult . "]";
	echo($jsonResult);
} else {
	
if (!checkX() || !checkY() || !checkR()) {
	header("Status: 400 Bad Request", true, 400);
	exit;
}

$ArrX = $_GET["X"];
$Y = $_GET["Y"];
settype($Y, 'float');
$R = $_GET["R"];


foreach ($ArrX as $X) {

	$start = microtime(true);
	$res = hit_check($X,$Y,$R);
	$time = microtime(true) - $start;
	$result = array(
	'X' => $X,
	'Y' => $Y,
	'R' => $R,
	'res' => $res,
	'currentTime' => $currentTime,
	'processingTime' => number_format($time, 10, ".", "") . " sec");

	if (!isset($_SESSION['history'])) {
		$_SESSION['history'] = array();
	}

	array_push($_SESSION['history'], $result);
}

	foreach ($_SESSION["history"] as $result) {
		$currentJSONObject = json_encode($result);
		$jsonResult .= $currentJSONObject;
		$jsonResult .= ",";
	}

	$jsonResult = substr($jsonResult, 0, -1);
	$jsonResult = "[" . $jsonResult . "]";
	echo ($jsonResult);
}

?>