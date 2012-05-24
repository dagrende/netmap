<?
include 'config.php';

function quote(s) {
	return str_replace("'", "''", s);
}

$name = quote($_GET['name']);
$host = quote($_GET['host']);
$x = $_GET['x'];
$y = $_GET['y'];

#FIXME validate x, y or return 500

$db = new SQLite3("$webroot/dbdir/db");
$db->exec("insert into node(name, host, x, y) values('$name', '$host', $x, $y)");
$db->close();
?>

