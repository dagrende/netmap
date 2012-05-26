var svgNS = "http://www.w3.org/2000/svg";
var xlinkNS = "http://www.w3.org/1999/xlink";
var nodes;
var rels;
var mouseMan = new MouseMan();

function init(evt) {
	SVGDocument = evt.target.ownerDocument;
	SVGRoot = SVGDocument.documentElement;

	nodes = getJsonByHttp("getnodes.php");
	rels = getJsonByHttp("getrels.php");
	createSvgNodes(nodes);
	createSvgRels(rels);
	traverse(nodes);

	SVGRoot.addEventListener('click', clickEventHandler, false);
	mouseMan.addListeners(SVGRoot);
	mouseMan.setMouseHandler(new MouseEventHandler());
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

function getNearestNode(x, y) {
	for (var i in nodes) {
		var node = nodes[i];
		
		
	}
}

function MouseEventHandler() {
	var states = {wait_for_src:0, at_src:1, dragging_rel:2, at_dest:3}
	var t = {state: states.wait_for_src}
	this.handle = function (evt) {
		console.log(evt.type);
		switch(t.state) {
  	case states.wait_for_src:
			switch (evt.type) {
			case "mouseover":
				if (evt.target.isNode) {
					t.state = states.at_src;
				}
				break;
			}
			break;
		case states.at_src:
			switch (evt.type) {
			case "mousedown":
				t.state = states.dragging_rel;
				t.srcNode = evt.target;
				break;
			case "mouseout":
				t.state = states.wait_for_src;
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

function createRelation(src, dest) {
	console.log("createRelation");
	rels.push({srcNode:src.id, destNode:dest.id});
	createSvgRels(rels);
	console.log("addrel.php?srcNode=" + src.id + "&destNode=" + dest.id);
	getJsonByHttp("addrel.php?srcNode=" + src.id + "&destNode=" + dest.id);
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
			document.getElementById("rels").appendChild(path);
		}
	}
}

// create a node for each item in the nodes table, or use existing node if created already
function createSvgNodes(nodes) {
	for (var i in nodes) {
		var node = nodes[i];

		var svgObj = document.getElementById(node.id);
		if (svgObj == null) {
			var docnodes = document.getElementById("nodes");
			var ael = document.createElementNS(svgNS,"a");
			ael.setAttributeNS(xlinkNS, "xlink:href","editnode.php?id=" + node.id + "&return=map.svg");

			if (true) {
				svgObjb = document.createElementNS(svgNS,"circle");
				docnodes.appendChild(svgObjb);
				svgObjb.setAttributeNS(null, "id", "b" + node.id);	
				svgObjb.setAttributeNS(null, "r", 16);		
				svgObjb.setAttributeNS(null, "cx", node.x);		
				svgObjb.setAttributeNS(null, "cy", node.y);	
				svgObjb.setAttributeNS(null, "fill","gray");
				svgObjb.setAttributeNS(null, "stroke","white");
				svgObjb.isAroundNode = true;
//				svgObjb.addEventListener('click', relClick, false);
			}

			docnodes.appendChild(ael);

			svgObj = document.createElementNS(svgNS,"circle");
			ael.appendChild(svgObj);
			node.svgObj = svgObj;
			svgObj.setAttributeNS(null, "id", node.id);	
			svgObj.setAttributeNS(null, "r", 6);		
			svgObj.setAttributeNS(null, "cx", node.x);		
			svgObj.setAttributeNS(null, "cy", node.y);	
			svgObj.setAttributeNS(null, "fill","gray");
			svgObj.setAttributeNS(null, "stroke","white");
			svgObj.isNode = true;
		}
	}
}

function relClick(evt) {
	alert('relClick');
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


