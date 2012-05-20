var svgNS = "http://www.w3.org/2000/svg";
var nodes;
var nodesById;

function init(evt) {
	SVGDocument = evt.target.ownerDocument;
	SVGRoot = SVGDocument.documentElement;

	nodes = getJsonByHttp("table.json");
	nodesById = getNodesById(nodes);
	createNodes(nodes);

	SVGRoot.addEventListener('click', clickEventHandler, false);
}

function ajax(url, vars, callbackFunction) {
	var request =  new XMLHttpRequest();
	request.open("GET", url, true);
	request.setRequestHeader("Content-Type", "application/x-javascript;");

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			if (request.responseText) {
				callbackFunction(request.responseText);
			}
		}
	};
	request.send(vars);
}

function traverse(nodes) {
		for (var i in nodes) {
		var node = nodes[i];

		el.innerHTML = '<img src="/wait2.gif"></img>';
		el.setAttribute('title', el.getAttribute('host'));
		ajax('/cgi-bin/ping.cgi?host=' + el.getAttribute('host'), null, function(s) {el.innerHTML = s;});
	}
	var nodes = el.childNodes;
	for (var i = 0; i < nodes.length; i++) {
		traverse(nodes[i]);
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

function clickEventHandler(evt) {
	if (evt.ctrlKey && evt.altKey) {
		var id = nodes.length + 1;
		var newRect = document.getElementById(id);
		if (newRect == null) {
			newRect = document.createElementNS(svgNS,"circle");
		}
		newRect.setAttributeNS(null, "id", id);	
		newRect.setAttributeNS(null, "r", 4);		
		newRect.setAttributeNS(null, "cx", evt.clientX);
		newRect.setAttributeNS(null, "cy", evt.clientY);
		newRect.setAttributeNS(null, "fill","red");
		newRect.setAttributeNS(null, "stroke","white");
		document.getElementById("nodes").appendChild(newRect);
	}
}


function getNodesById(nodes) {
	var nodesById = {};
	for (var i in nodes) {
		var node = nodes[i];
		nodesById[node.id] = node;
	}
	return nodesById;
}

// create node markers from a tble of nodes having id, name, x, y
// node with id created only if doesn't exist already, otherwise attributes are set
function createNodes(nodes) {
	for (var i in nodes) {
		var node = nodes[i];

		var newRect = document.getElementById(node.id);
		if (newRect == null) {
			newRect = document.createElementNS(svgNS,"circle");
		}
		newRect.setAttributeNS(null, "id", node.id);	
		newRect.setAttributeNS(null, "r", 4);		
		newRect.setAttributeNS(null, "cx", node.x);		
		newRect.setAttributeNS(null, "cy", node.y);	
		newRect.setAttributeNS(null, "fill","red");
		newRect.setAttributeNS(null, "stroke","white");
		document.getElementById("nodes").appendChild(newRect);

	}
}

