
// Paul Irish's shim for requestAnimationFrame
window.requestAnimationFrame = (function () {
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function (callback) {
		window.setTimeout(callback, 1000/60);
	};
})();

var w, h;

$(document).ready(function () {

	w = $(window).width();
	h = $(window).height();

	var $frame = $('.frame');

	var invY = -1;
	var invX = 1;

	var f = 20;

	var tX, tY;

	var insole = $('#shield');

	var clog = function () {
	var args = Array.prototype.slice.call(arguments, 0);
	insole.text(args.join(', '));
	};

	var inLandscape = function () {
		return (w > h)? true : false;
	};

	$(document).on('mousemove', function (e) {
		tY = ((e.clientX / w) * (f * invX)) + ((f/2) * (invX * -1));
		tX = ((e.clientY / h) * (f * invY)) + ((f/2) * (invY * -1));
	});


	(function animloop (){
		requestAnimationFrame(animloop);
		$frame.attr('style', '-webkit-transform:rotateY(' + tY + 'deg) rotateX(' + tX + 'deg);');

	})();


	if (inLandscape()) {

		window.addEventListener('deviceorientation', function (event) {
			//clog('alpha :', event.alpha, 'beta :', event.beta, 'gamma :', event.gamma);
			tY = (event.beta * -1);
			tX = (event.gamma * -1);
		}, true);
	} else {
		window.addEventListener('deviceorientation', function (event) {
			//clog('alpha :', event.alpha, 'beta :', event.beta, 'gamma :', event.gamma);
			tX = (event.beta);
			tY = (event.gamma * -1);
		}, true);
	}

	window.addEventListener("devicemotion", function(event) {
		//clog(event.acceleration, event.accelerationIncludingGravity, event.rotationRate, event.interval);
	}, true);
});