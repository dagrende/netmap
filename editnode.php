<?
include 'config.php';

$id = $_GET['id'];
$return = $_GET['return'];
$cmd = $_GET['cmd'];
$name = $_GET['name'];
$host = $_GET['host'];
$x = $_GET['x'];
$y = $_GET['y'];

$db = new SQLite3("$webroot/dbdir/db");
$message = "";
$result = true;
if ($cmd == "Save") {
	if ($id) {
		$result = $db->exec("update node set name='$name', host='$host', x=$x, y=$y where id=$id");
	} else {
		$db->exec("insert into node(name, host, x, y) values('$name', '$host', $x, $y)");
	}
	if ($result) {
		if ($return) {
			header("Location: $return");
		} else {
			header("Location: editnode.php?id=$id");
		}
	} else {
		$message = "Could not save";
	}
} elseif ($cmd == "Delete") {
	$result1 = $db->exec("delete from node where id=$id");
	$result2 = $db->exec("delete from rel where srcNode=$id or destNode=$id");
	$result = $result1 && $result2;
	if ($result) {
		if ($return) {
			header("Location: $return");
		} else {
			header("Location: deletemessage.php?id=$id&name=$name");
		}
	} else {
		$message = "Could not delete";
	}
} elseif ($cmd == "Cancel") {
	if ($return) {
		header("Location: $return");
	}
}
if ($id && $result) {
	$result = $db->query("select * from node where id=".$id);
	if ($row = $result->fetchArray()) {
		$id = $row['id'];
		$name = $row['name'];
		$host = $row['host'];
		$x = $row['x'];
		$y = $row['y'];
	}
}
?>
<html>
<body>
<h3><?=$message?></h3>
<form action="#" method="get">
<? if ($id) { ?>
<input type="hidden" name="id" value="<?=$id?>"/>
<? } ?>
<input type="hidden" name="return" value="<?=$return?>"/>
<table>
<tr><td>name:</td><td><input name="name" value="<?=$name?>"/></td></tr>
<tr><td>host:</td><td><input name="host" value="<?=$host?>"/></td></tr>
<tr><td>x:</td><td><input name="x" value="<?=$x?>"/></td></tr>
<tr><td>y:</td><td><input name="y" value="<?=$y?>"/></td></tr>
<tr><td colspan="2"><input type="submit" name="cmd" value="Save">
	<input type="submit" name="cmd" value="Delete">
	<input type="submit" name="cmd" value="Cancel"></td></tr>
</table>
</form>

