<?
	include 'config.php';
	$db = new SQLite3("$webroot/dbdir/db");
	$result = $db->query("select * from rel");
	echo '[';
	$first = true;
	while ($row = $result->fetchArray()) {
		$srcNode = $row['srcNode'];
		$destNode = $row['destNode'];
		if (!$first) {
			echo ",\n";
		}
		$first = false;
    echo "{srcNode:$srcNode, destNode:$destNode}";
	}
	echo ']';
	$db->close();
?>

