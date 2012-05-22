var svgNS = "http://www.w3.org/2000/svg";
var xlinkNS = "http://www.w3.org/1999/xlink";
var nodes;

function init(evt) {
	SVGDocument = evt.target.ownerDocument;
	SVGRoot = SVGDocument.documentElement;

	nodes = getJsonByHttp("getnodes.php");
	createSvgNodes(nodes);
	traverse(nodes);

	SVGRoot.addEventListener('click', clickEventHandler, false);
}

function traverse(nodes) {
	for (var i in nodes) {
		var node = nodes[i];
		node.svgObj.setAttributeNS(null, "fill","gray");
		ajax('/cgi-bin/ping.cgi?host=' + node.host, null, node.svgObj, function(s, t) {
			t.setAttributeNS(null, "fill", (s.charAt(0) != '-' ? "lime" : "red"))});
	}
}

// returns a json object from url
function getJsonByHttp(url) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", url, false);
	xmlHttp.send(null);
	if (xmlHttp.status == 200) {
		var theObject = eval("(" + xmlHttp.responseText + ")");
		return theObject;
	} else {
		alert("Error getting " + url + ". Status=" + xmlHttp.status);
		return null;
	}
}

// create a node for each item in the nodes table, or use existing node if created already
function createSvgNodes(nodes) {
	for (var i in nodes) {
		var node = nodes[i];

		var svgObj = document.getElementById(node.id);
		if (svgObj == null) {
			var ael = document.createElementNS(svgNS,"a");
			ael.setAttributeNS(xlinkNS, "xlink:href","editnode.php?id=" + node.id + "&return=map.svg");
			svgObj = document.createElementNS(svgNS,"circle");
			document.getElementById("nodes").appendChild(ael);
			ael.appendChild(svgObj);
			node.svgObj = svgObj;
			svgObj.setAttributeNS(null, "id", node.id);	
			svgObj.setAttributeNS(null, "r", 6);		
			svgObj.setAttributeNS(null, "cx", node.x);		
			svgObj.setAttributeNS(null, "cy", node.y);	
			svgObj.setAttributeNS(null, "fill","gray");
			svgObj.setAttributeNS(null, "stroke","white");
		}
	}
}

function clickEventHandler(evt) {
	if (evt.ctrlKey && evt.altKey) {
		var newNode = {id: nextFreeId(), name: '', x: evt.clientX, y: evt.clientY}
		nodes.push(newNode);
		createSvgNodes(nodes);
		createRemoteNode(newNode);
	}
}

function createRemoteNode(newNode) {
	getJsonByHttp("addnode.php?name=" + newNode.name + "&host=&x=" + newNode.x + "&y=" + newNode.y);
}

function ajax(url, vars, t, callbackFunction) {
	var request =  new XMLHttpRequest();
	request.open("GET", url, true);
	request.setRequestHeader("Content-Type", "application/x-javascript;");

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			if (request.responseText) {
				callbackFunction(request.responseText, t);
			}
		}
	};
	request.send(vars);
}

function nextFreeId() {
	var maxid = -1;
	for (var i in nodes) {
		var node = nodes[i];
		maxid = Math.max(node.id, maxid);
	}
	return maxid + 1;
}


function getNodeById(id) {
	for (var i in nodes) {
		var node = nodes[i];
		if (node.id == id) {
			return node;
		}
	}
	return null;
}


