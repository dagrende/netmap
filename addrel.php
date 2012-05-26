<?
include 'config.php';

$srcNode = $_GET['srcNode'];
$destNode = $_GET['destNode'];

$db = new SQLite3("$webroot/dbdir/db");
$db->exec("insert into rel(srcNode, destNode) values($srcNode, $destNode)");
$db->close();
?>

