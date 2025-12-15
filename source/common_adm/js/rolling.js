	
// ticker
function tickerRotation() {
	// options
	var scrollType = 'vertical'; // 'horizontal', 'vertical', 'none';

	// private
	var currentNumber = 0;
	var objWrap = null;
	var objContentBox = null;
	var objWrapLIs = null;
	var cellWidth = 0;
	var cellHeight = 0;
	this.GoodsSetTime = null;

	// scroll animation variables.
	var scroll = {time:1, start:0, change:0, duration:25, timer:null};
	var originaltime = scroll.time;

	this.setScrollType = function (type) {
		switch (type) {
			case 'vertical':
			case 'horizontal':
			case 'none':
				scrollType = type;
				break;
			default:
				alert('!');
				break;
		}
	}
	// constructor
	this.initialize = function () {
		objWrap = document.getElementById(this.wrapId);
		objContentBox = document.getElementById(this.listId);
		objWrapLIs = objWrap.getElementsByTagName('li');
		cellWidth = objWrapLIs[0].offsetWidth;
		cellHeight= objWrapLIs[0].offsetHeight;

		objWrap.style.overflow = 'hidden'; //

		switch (scrollType) {
			case 'vertical':
				this.objWrapSize = cellHeight * this.listNum;
				this.objSize = objWrapLIs.length * cellHeight;
				break;
			case 'none':
				this.objWrapSize = cellWidth * this.listNum;
				this.objSize = objWrapLIs.length * cellWidth;
				break;
			default:
				this.objWrapSize = cellWidth * this.listNum;
				this.objSize = objWrapLIs.length * cellWidth;
				break;
		}
		if (this.objWrapSize < this.objSize) {

			if (objWrapLIs.length > 0) {
				switch (scrollType) {
					case 'vertical':
						objContentBox.style.height = objWrapLIs.length * cellHeight + 'px';
						objWrap.style.height = this.listNum * cellHeight + 'px';
						break;
					case 'none':
						objContentBox.style.width = objWrapLIs.length * cellWidth + 'px';
						objWrap.style.width = this.listNum * cellWidth + 'px';
						break;
					default:
						objContentBox.style.width = objWrapLIs.length * cellWidth + 'px';
						objWrap.style.width = this.listNum * cellWidth + 'px';
						break;
				}
			}
			/*
			if (this.btnPrev)
				document.getElementById(this.btnPrev).href = this.objName + ".prev();";
			if (this.btnNext)
				document.getElementById(this.btnNext).href = this.objName + ".next();";
			if (this.btnStop)
				document.getElementById(this.btnStop).href = this.objName + ".stop();";
			*/

			if (this.autoScroll == 'none') {
			} else {
				if (this.scrollDirection == 'direction') {
					this.GoodsSetTime = setInterval(this.objName + ".next()", this.scrollGap);
				} else {
					this.GoodsSetTime = setInterval(this.objName + ".prev()", this.scrollGap);
				}
			}
		}
	}

	this.next = function () {
		if (currentNumber == 0) {
			var objLastNode = objContentBox.removeChild(objContentBox.getElementsByTagName('li').item(objWrapLIs.length - 1));
			objContentBox.insertBefore(objLastNode, objContentBox.getElementsByTagName('li').item(0));
			switch (scrollType) {
				case 'vertical':
					objWrap.scrollTop += cellHeight;
					break;
				case 'none':
					objWrap.scrollLeft += cellWidth;
					break;
				default:
					objWrap.scrollLeft += cellWidth;
					break;
			}
			currentNumber++;
		}

		//objWrap.scrollLeft -= cellWidth;
		var position = getActionPoint('indirect');
		startScroll(position.start, position.end);

		currentNumber = currentNumber - 1;

		if (currentNumber > 0)
			currentNumber = 0;
		if (this.autoScroll == 'none') {
			// do nothing.
		} else {
			this.scrollDirection = 'direction';
			clearInterval(this.GoodsSetTime);
			this.GoodsSetTime = setInterval(this.objName + ".next()", this.scrollGap);
		}
	}

	this.prev = function () {
		if (currentNumber == objWrapLIs.length - 1) {
			var objLastNode = objContentBox.removeChild(objContentBox.getElementsByTagName('li').item(0));
			objContentBox.appendChild(objLastNode);
			switch (scrollType) {
				case 'vertical':
					objWrap.scrollTop -= cellHeight;
					break;
				case 'none':
					objWrap.scrollLeft -= cellWidth;
					break;
				default:
					objWrap.scrollLeft -= cellWidth;
					break;
			}
			currentNumber--;
		}

		//objWrap.scrollLeft += cellWidth;
		var position = getActionPoint('direct');
		startScroll(position.start, position.end);

		currentNumber = currentNumber + 1;

		if (currentNumber < objWrapLIs.length - 1)
			currentNumber = objWrapLIs.length - 1;
	
		if (this.autoScroll == 'none') {
			// do nothing.
		} else {
			this.scrollDirection = 'indirection';
			clearInterval(this.GoodsSetTime);
			this.GoodsSetTime = setInterval(this.objName + ".prev()", this.scrollGap);
		}
	}

	this.stop = function () {
		clearInterval(this.GoodsSetTime);
	}

	var startScroll = function (start, end) {
		if (scroll.timer != null) {
			clearInterval(scroll.timer);
			scroll.timer = null;
		}

		scroll.start = start;
		scroll.change = end - start;

		switch (scrollType) {
			case 'vertical':
				scroll.timer = setInterval(scrollVertical, 15);
				break;
			case 'none':
				objWrap.scrollLeft = end;
				break;
			default:
				scroll.timer = setInterval(scrollHorizontal, 15);
				break;
		}
	}

	var scrollVertical = function () {
		if (scroll.time > scroll.duration) {
			clearInterval(scroll.timer);
			scroll.time = originaltime;
			scroll.timer = null;
		} else {
			objWrap.scrollTop = sineInOut(scroll.time, scroll.start, scroll.change, scroll.duration);
			scroll.time++;
		}
	}

	var scrollHorizontal = function () {
		if (scroll.time > scroll.duration) {
			clearInterval(scroll.timer);
			scroll.time = originaltime;
			scroll.timer = null;
		} else {
			objWrap.scrollLeft = sineInOut(scroll.time, scroll.start, scroll.change, scroll.duration);
			scroll.time++;
		}
	}

	var getActionPoint = function (dir) {
		if (dir == 'direct') {
			var position = findElementPos(objWrap.getElementsByTagName('li').item(currentNumber + 1)); // target image.
			var offsetPos = findElementPos(objWrap.getElementsByTagName('li').item(currentNumber)); // first image.
		} else {
			var position = findElementPos(objWrap.getElementsByTagName('li').item(currentNumber - 1)); // target image.
			var offsetPos = findElementPos(objWrap.getElementsByTagName('li').item(currentNumber)); // first image.
		}

		switch (scrollType) {
			case 'vertical':
				var start = objWrap.scrollTop;
				var end = position[1] - offsetPos[1];
				break;
			case 'none':
				// do nothing.
				break;
			default:
				var start =  objWrap.scrollLeft;
				var end = position[0] - offsetPos[0];
				break;
		}

		var position = {start:0, end:0};
		position.start = start;
		position.end = end;

		return position;
	}

	var sineInOut = function (t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	}

	var findElementPos = function (elemFind) {
		var elemX = 0;
		var elemY = 0;
		do {
			elemX += elemFind.offsetLeft;
			elemY += elemFind.offsetTop;
		} while (elemFind = elemFind.offsetParent)

		return Array(elemX, elemY);
	}
}