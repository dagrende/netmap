
function NullMouseHandler() {
	this.click = function (evt) {console.log("NullMouseHandler.click");}
	this.mousedown = function (evt) {console.log("NullMouseHandler.down");}
	this.mouseup = function (evt) {console.log("NullMouseHandler.up");}
	this.mouseover = function (evt) {console.log("NullMouseHandler.over");}
	this.mousemove = function (evt) {console.log("NullMouseHandler.move");}
	this.mouseout = function (evt) {console.log("NullMouseHandler.out");}
};

function MouseMan() {
	var state = {
		mouseHandler: new NullMouseHandler()
	}

	this.click = function(evt) {state.mouseHandler.click(evt);};
	this.mousedown = function(evt) {state.mouseHandler.mousedown(evt);};
	this.mouseup = function(evt) {state.mouseHandler.mouseup(evt);};
	this.mouseover = function(evt) {state.mouseHandler.mouseover(evt);};
	this.mousemove = function(evt) {state.mouseHandler.mousemove(evt);};
	this.mouseout = function(evt) {state.mouseHandler.mouseout(evt);};

	this.setMouseHandler = function(obj) {
		if (obj) {
			state.mouseHandler = obj;
		} else {
			state.mouseHandler = new NullMouseHandler();
		}
	}

	this.addListeners = function(obj) {
		obj.addEventListener('click', this.click, false);
		obj.addEventListener('mousedown', this.mousedown, false);
		obj.addEventListener('mouseup', this.mouseup, false);
		obj.addEventListener('mouseover', this.mouseover, false);
		obj.addEventListener('mousemove', this.mousemove, false);
		obj.addEventListener('mouseout', this.mouseout, false);
	};
}



