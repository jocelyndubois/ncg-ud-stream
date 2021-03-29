const endedEvent = new Event('ended');

function Timer(duration, element) {
	var self = this;
	this.duration = duration;
	this.element = element;
	this.running = false;

	this.els = {
		ticker: document.getElementById('ticker'),
		seconds: document.getElementById('seconds'),
	};

	var hammerHandler = new Hammer(this.element);
	hammerHandler.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
	hammerHandler.on('panup pandown', function(ev) {
		if (!self.running) {
			if (ev.direction === Hammer.DIRECTION_UP && self.duration < 999000) {
				self.setDuration(self.duration + 1000);
			} else if (ev.direction === Hammer.DIRECTION_DOWN && self.duration > 0) {
				self.setDuration(self.duration - 1000);
			}
		}
	});

	hammerHandler.on('tap', function() {
		if (self.running) {
			self.reset();
		} else {
			self.start();
		}
	})
}

Timer.prototype.start = function() {
	var self = this;
	var start = null;
	this.running = true;
	var remainingSeconds = this.els.seconds.textContent = this.duration / 1000;

	self.element.classList.remove('countdown--ended');

	function draw(now) {
		if (!start) start = now;
		var diff = now - start;
		var newSeconds = Math.ceil((self.duration - diff)/1000);

		if (diff <= self.duration) {
			self.els.ticker.style.height = 100 - (diff/self.duration*100) + '%';

			if (newSeconds != remainingSeconds) {
				self.els.seconds.textContent = newSeconds;
				remainingSeconds = newSeconds;
			}

			self.frameReq = window.requestAnimationFrame(draw);
		} else {
			//self.running = false;
			self.els.seconds.textContent = 'GO';
			self.els.ticker.style.height = '0%';
			self.element.classList.add('countdown--ended');
			document.dispatchEvent(endedEvent);
		}
	};

	self.frameReq = window.requestAnimationFrame(draw);
}

Timer.prototype.reset = function() {
	this.running = false;
	window.cancelAnimationFrame(this.frameReq);
	this.els.seconds.textContent = this.duration / 1000;
	this.els.ticker.style.height = null;
	this.element.classList.remove('countdown--ended');
}

Timer.prototype.setDuration = function(duration) {
	this.duration = duration;
	this.els.seconds.textContent = this.duration / 1000;
}
