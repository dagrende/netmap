<?
include 'config.php';
$name = $_GET['name'];
$host = $_GET['host'];
$x = $_GET['x'];
$y = $_GET['y'];

$db = new SQLite3("$webroot/dbdir/db");
$db->exec("insert into node(name, host, x, y) values('$name', '$host', $x, $y)");
$db->close();
?>

