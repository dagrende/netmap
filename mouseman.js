
function NullMouseHandler() {
	this.click = function (evt) {alert("click!!");}
	this.onmousedown = function (evt) {}
	this.onmouseup = function (evt) {}
	this.onmouseover = function (evt) {}
	this.onmousemove = function (evt) {}
	this.onmouseout = function (evt) {}
};

function MouseMan() {
	this.mouseHandler = new NullMouseHandler();

	this.click = function(evt) {this.mouseHandler.click(evt);};
	this.onmousedown = function(evt) {this.mouseHandler.onmousedown(evt);};
	this.onmouseup = function(evt) {this.mouseHandler.onmouseup(evt);};
	this.onmouseover = function(evt) {this.mouseHandler.onmouseover(evt);};
	this.onmousemove = function(evt) {this.mouseHandler.onmousemove(evt);};
	this.onmouseout = function(evt) {this.mouseHandler.onmouseout(evt);};

	this.setMouseHandler = function(obj) {
		if (obj) {
			this.mouseHandler = obj;
		} else {
			this.mouseHandler = new NullMouseHandler();
		}
	}

	this.addListeners = function(obj) {
		obj.addEventListener('click', this.click, false);
		obj.addEventListener('onmousedown', this.onmousedown, false);
		obj.addEventListener('onmouseup', this.onmouseup, false);
		obj.addEventListener('onmouseover', this.onmouseover, false);
		obj.addEventListener('onmousemove', this.onmousemove, false);
		obj.addEventListener('onmouseout', this.onmouseout, false);
	};
}



