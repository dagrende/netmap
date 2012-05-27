var svgNS = "http://www.w3.org/2000/svg";
var xlinkNS = "http://www.w3.org/1999/xlink";
var nodeRadius = 8;
var logstrings = {};
var nodes;
var rels;

function init(evt) {
	SVGDocument = evt.target.ownerDocument;
	SVGRoot = SVGDocument.documentElement;

	nodes = getJsonByHttp("getnodes.php");
	rels = getJsonByHttp("getrels.php");
	createSvgNodes(nodes);
	createSvgRels(rels);
	traverse(nodes);

	SVGRoot.addEventListener('click', clickEventHandler, false);
	addMouseEventHandler(SVGRoot, new MouseEventHandler());
}

function traverse(nodes) {
	for (var i in nodes) {
		var node = nodes[i];
		node.svgObj.setAttributeNS(null, "fill","gray");
		if (node.host) {
			ajax('/cgi-bin/ping.cgi?host=' + node.host, null, node.svgObj, function(s, t) {
				t.setAttributeNS(null, "fill", (s.charAt(0) != '-' ? "lime" : "red"))});
		}
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

function getByHttp(url) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", url, false);
	xmlHttp.send(null);
	if (xmlHttp.status == 200) {
		return xmlHttp.responseText;
	} else {
		alert("Error getting " + url + ". Status=" + xmlHttp.status);
		return null;
	}
}

// returns the node closest to x, y if closer than d, else null
function getNearNode(x, y, d) {
	var minDist2 = 9999999;
	var nearestNode = null;
	for (var i in nodes) {
		var node = nodes[i];
		
		var dist2 = Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)
		if (dist2 < minDist2) {
			minDist2 = dist2;
			nearestNode = node;
		}
	}
	return minDist2 < d * d && minDist2 > nodeRadius * nodeRadius ? nearestNode : null;
}

function relClickHandler(evt) {
	var rel = evt.target.rel;
	if (rel) {
		window.location="editrel.php?srcNode=" + rel.srcNode + "&destNode=" + rel.destNode + "&return=map.svg";
	}
}

function addMouseEventHandler(obj, handler) {
	obj.addEventListener('click', handler.handle, false);
	obj.addEventListener('mousedown', handler.handle, false);
	obj.addEventListener('mouseup', handler.handle, false);
	obj.addEventListener('mouseover', handler.handle, false);
	obj.addEventListener('mousemove', handler.handle, false);
	obj.addEventListener('mouseout', handler.handle, false);
}

function dist2(p1, p2) {
	return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}

function MouseEventHandler() {
	var states = {wait_for_src:"wait_for_src", at_rel_src:"at_rel_src", dragging_rel:"dragging_rel", at_dest:"at_dest", at_node:"at_node", can_move_node:"can_move_node", moving_node:"moving_node"}
	var t = {state: states.wait_for_src}
	this.handle = function (evt) {
		log(t.state + " " + evt.type);
		switch(t.state) {
  	case states.wait_for_src:
			switch (evt.type) {
			case "mouseover":
				if (evt.target.isNode) {
					t.state = states.at_node;
				}
				break;
			case "mousemove":
				var nearNode = getNearNode(evt.clientX, evt.clientY, 15);
				if (nearNode) {
					t.state = states.at_rel_src;
					t.srcNode = nearNode.svgObj;
				}
				break;
			}
			break;
		case states.at_node:
			switch (evt.type) {
			case "mousedown":
				t.startpos = {x:evt.clientX, y:evt.clientY};
				t.state = states.can_move_node;
				t.node = evt.target;
				break;
			case "mouseout":
				t.state = states.wait_for_src;
				break;
			}
			break;
		case states.can_move_node:
			switch (evt.type) {
			case "mousemove":
				if (dist2(t.startpos, {x:evt.clientX, y:evt.clientY}) > 9) {
					t.state = states.moving_node;
				}
				break;
			case "mouseup":
				t.state = states.wait_for_src;
				clickedNode(t.node.node);
				break;
			}
			break;
		case states.moving_node:
			switch (evt.type) {
			case "mouseup":
				t.state = states.wait_for_src;
				window.location = "editnode.php?&cmd=Save&id=" + t.node.node.id + "&name=" + t.node.node.name + "&host=" + t.node.node.host + "&x=" + evt.clientX + "&y=" + evt.clientY + "&return=map.svg";
				break;
			}
			break;
		case states.at_rel_src:
			switch (evt.type) {
			case "mousedown":
				t.state = states.dragging_rel;
				break;
			case "mouseover":
				if (evt.target.isNode) {
					t.state = states.at_node;
				}
				break;
			case "mousemove":
				var nearNode = getNearNode(evt.clientX, evt.clientY, 15);
				if (t.srcNode.node != nearNode) {
					t.state = states.wait_for_src;
				}
				break;
			}
			break;
		case states.dragging_rel:
			switch (evt.type) {
			case "mouseup":
				t.state = states.wait_for_src;
				break;
			case "mouseover":
				if (evt.target.isNode && evt.target != t.srcNode) {
					t.state = states.at_dest;
				}
				break;
			}
			break;
		case states.at_dest:
			switch (evt.type) {
			case "mouseup":
				t.state = states.wait_for_src;
				createRelation(t.srcNode, evt.target);
				break;
			case "mouseout":
				t.state = states.dragging_rel;
				break;
			}
			break;
		}
	}
};

function log(s) {
	var t = logstrings[s];
	if (!t) {
		logstrings[s] = s;
		t = s;
	}
	console.log(t);
}

function clickedNode(node) {
	window.location = "editnode.php?id=" + node.id + "&return=map.svg";
}

function createRelation(src, dest) {
	console.log("createRelation");
	rels.push({srcNode:src.id, destNode:dest.id});
	createSvgRels(rels);
	console.log("addrel.php?srcNode=" + src.id + "&destNode=" + dest.id);
	getByHttp("addrel.php?srcNode=" + src.id + "&destNode=" + dest.id);
}

function createSvgRels(rels) {
	for (var i in rels) {
		var rel = rels[i];

		var path = document.getElementById(rel.srcNode + '-' + rel.destNode);
		if (path == null) {
			var src = document.getElementById(rel.srcNode);
			var dest = document.getElementById(rel.destNode);
			var path = document.createElementNS(svgNS,"path");
			path.setAttributeNS(null, "id", rel.srcNode + '-' + rel.destNode);
			path.setAttributeNS(null, "d", 
					"M " + src.getAttributeNS(null, "cx") +
					" " + src.getAttributeNS(null, "cy") +
					" L " + dest.getAttributeNS(null, "cx") +
					" " + dest.getAttributeNS(null, "cy"));
			path.setAttributeNS(null, "stroke", "black");
			path.setAttributeNS(null, "stroke-width", "3");
			path.isRel = true;
			path.addEventListener('click', relClickHandler, false);
			document.getElementById("rels").appendChild(path);
			rel.svgObj = path;
			path.rel = rel;
		}
	}
}

// create a node for each item in the nodes table, or use existing node if created already
function createSvgNodes(nodes) {
	for (var i in nodes) {
		var node = nodes[i];

		var svgObj = document.getElementById(node.id);
		if (svgObj == null) {
			svgObj = document.createElementNS(svgNS,"circle");
			document.getElementById("nodes").appendChild(svgObj);
			node.svgObj = svgObj;
			svgObj.node = node;
			svgObj.setAttributeNS(null, "id", node.id);	
			svgObj.setAttributeNS(null, "r", nodeRadius);		
			svgObj.setAttributeNS(null, "cx", node.x);		
			svgObj.setAttributeNS(null, "cy", node.y);	
			svgObj.setAttributeNS(null, "fill","gray");
			svgObj.setAttributeNS(null, "stroke","white");
			svgObj.isNode = true;
		}
	}
}

function clickEventHandler(evt) {
	if (evt.ctrlKey && evt.altKey) {
		window.location="editnode.php?&x=" + evt.clientX + "&y=" + evt.clientY + "&return=map.svg";
	}
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

function getNodeById(id) {
	for (var i in nodes) {
		var node = nodes[i];
		if (node.id == id) {
			return node;
		}
	}
	return null;
}


