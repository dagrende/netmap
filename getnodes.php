<?
	include 'config.php';
	$db = new SQLite3("$webroot/dbdir/db");
	$result = $db->query("select * from node");
	echo '[';
	$first = true;
	while ($row = $result->fetchArray()) {
		$id = $row['id'];
		$name = $row['name'];
		$host = $row['host'];
		$x = $row['x'];
		$y = $row['y'];
		if (!$first) {
			echo ",\n";
		}
		$first = false;
    echo "{id:$id, name:\"$name\", host:\"$host\", x:$x, y:$y}";
	}
	echo ']';
	$db->close();
?>

