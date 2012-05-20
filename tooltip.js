var SVGDocument = null;
var SVGRoot = null;
var SVGViewBox = null;
var svgns = 'http://www.w3.org/2000/svg';
var xlinkns = 'http://www.w3.org/1999/xlink';
var toolTip = null;
var TrueCoords = null;
var tipBox = null;
var tipText = null;
var tipTitle = null;
var tipDesc = null;

var lastElement = null;
var titleText = '';
var titleDesc = '';


function initTooltips(evt)
{
		SVGDocument = evt.target.ownerDocument;
		SVGRoot = SVGDocument.documentElement;
		TrueCoords = SVGRoot.createSVGPoint();

		toolTip = SVGDocument.getElementById('ToolTip');
		tipBox = SVGDocument.getElementById('tipbox');
		tipText = SVGDocument.getElementById('tipText');
		tipTitle = SVGDocument.getElementById('tipTitle');
		tipDesc = SVGDocument.getElementById('tipDesc');
		//window.status = (TrueCoords);

		//create event for object
		SVGRoot.addEventListener('mouseover', ShowTooltip, false);
		SVGRoot.addEventListener('mouseout', HideTooltip, false);
};


function GetTrueCoords(evt)
{
		// find the current zoom level and pan setting, and adjust the reported
		//    mouse position accordingly
		var newScale = SVGRoot.currentScale;
		var translation = SVGRoot.currentTranslate;
		TrueCoords.x = (evt.clientX - translation.x)/newScale;
		TrueCoords.y = (evt.clientY - translation.y)/newScale;
};


function HideTooltip( evt )
{
		toolTip.setAttributeNS(null, 'visibility', 'hidden');
};


function ShowTooltip( evt )
{
		GetTrueCoords( evt );

		var tipScale = 1/SVGRoot.currentScale;
		var textWidth = 0;
		var tspanWidth = 0;
		var boxHeight = 20;

		tipBox.setAttributeNS(null, 'transform', 'scale(' + tipScale + ',' + tipScale + ')' );
		tipText.setAttributeNS(null, 'transform', 'scale(' + tipScale + ',' + tipScale + ')' );

		var titleValue = '';
		var descValue = '';
		var targetElement = evt.target;
		if ( lastElement != targetElement )
		{
			var targetId = targetElement.getAttributeNS(null, 'id');
			if (!targetId) {
				return;
			}
			var node = nodesById[targetId];
			if (!node) {
				return;
			}

			var targetTitle = targetElement.getElementsByTagName('title').item(0);
			if ( targetTitle )
			{
					// if there is a 'title' element, use its contents for the tooltip title
					titleValue = targetTitle.firstChild.nodeValue;
			}


			var descValue = node.name;
			// if there is still no 'title' element, use the contents of the 'id' attribute for the tooltip title
			if ( '' == titleValue )
			{
					titleValue = targetId;
			}

			// selectively assign the tooltip title and desc the proper values,
			//   and hide those which don't have text values
			//
			var titleDisplay = 'none';
			if ( '' != titleValue )
			{
					tipTitle.firstChild.nodeValue = titleValue;
					titleDisplay = 'inline';
			}
			tipTitle.setAttributeNS(null, 'display', titleDisplay );


			var descDisplay = 'none';
			if ( '' != descValue )
			{
					tipDesc.firstChild.nodeValue = descValue;
					descDisplay = 'inline';
			}
			tipDesc.setAttributeNS(null, 'display', descDisplay );
		}

		// if there are tooltip contents to be displayed, adjust the size and position of the box
		if ( '' != titleValue )
		{
			var xPos = TrueCoords.x + (10 * tipScale);
			var yPos = TrueCoords.y + (10 * tipScale);

			//return rectangle around text as SVGRect object
			var outline = tipText.getBBox();
			tipBox.setAttributeNS(null, 'width', Number(outline.width) + 10);
			tipBox.setAttributeNS(null, 'height', Number(outline.height) + 10);

			// update position
			toolTip.setAttributeNS(null, 'transform', 'translate(' + xPos + ',' + yPos + ')');
			toolTip.setAttributeNS(null, 'visibility', 'visible');
		}
};

