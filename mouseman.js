
function NullMouseHandler() {
	this.handle = function (evt) {console.log("NullMouseHandler." + evt.type);}
};

function MouseMan() {
	var state = {
		mouseHandler: new NullMouseHandler()
	}

	this.handle = function(evt) {state.mouseHandler.handle(evt);};

	this.setMouseHandler = function(obj) {
		if (obj) {
			state.mouseHandler = obj;
		} else {
			state.mouseHandler = new NullMouseHandler();
		}
	}

	this.addListeners = function(obj) {
		obj.addEventListener('click', this.handle, false);
		obj.addEventListener('mousedown', this.handle, false);
		obj.addEventListener('mouseup', this.handle, false);
		obj.addEventListener('mouseover', this.handle, false);
		obj.addEventListener('mousemove', this.handle, false);
		obj.addEventListener('mouseout', this.handle, false);
	};
}



