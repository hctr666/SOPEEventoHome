// Verify DOM is completely ready
const domIsReady = (function (domIsReady) {
   const isBrowserIeOrNot = function () {
      return (!document.attachEvent || typeof document.attachEvent === "undefined" ? 'not-ie' : 'ie');
   }

   domIsReady = function (callback) {
      if (callback && typeof callback === 'function') {
         if (isBrowserIeOrNot() !== 'ie') {
            document.addEventListener("DOMContentLoaded", function () {
               return callback();
            });
         } else {
            document.attachEvent("onreadystatechange", function () {
               if (document.readyState === "complete") {
                  return callback();
               }
            });
         }
      } else {
         console.error('The callback is not a function!');
      }
   }

   return domIsReady;
})(domIsReady || {});


// Helper to add event listeners to element
const attachEvent = (elements, type, listener, callback) => {
   if (typeof elements !== "undefined" && elements.length > 0) {
      for (let i = 0; i < elements.length; i++) {
         elements[i].addEventListener(type, listener)
         if (callback) callback(elements[i])
      }
   }
}

// Helper to remove event listeners to element
const detachEvent = (elements, type, listener, callback) => {
   if (typeof elements !== "undefined" && elements.length > 0) {
      for (let i = 0; i < elements.length; i++) {
         elements[i].removeEventListener(type, listener)
      }
   }
}

// Show an element
const fadeIn = (elem, delay) => {

	// Get the natural height of the element
	const getHeight = function () {
		elem.style.display = 'block'; // Make it visible
		var height = elem.scrollHeight + 'px'; // Get it's height
		elem.style.display = ''; //  Hide it again
		return height;
	};

	var height = getHeight(); // Get the natural height
	elem.classList.add('fade-in'); // Make the element visible
	elem.style.height = height; // Update the max-height

	// Once the transition is complete, remove the inline max-height so the content can scale responsively
	window.setTimeout(() => {
		elem.style.height = ''
	}, delay || 350)

}

// Hide an element
const fadeOut = (elem, delay) => {

	// Give the element a height to change from
	elem.style.height = elem.scrollHeight + 'px';

	// Set the height back to 0
	window.setTimeout(() => {
		elem.style.height = '0';
	}, 1);

	// When the transition is complete, hide it
	window.setTimeout(() => {
		elem.classList.remove('fade-in');
	}, delay || 350);

}

const isTouchMode = () => {
   const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
   const mq = (query) => {
     return window.matchMedia(query).matches;
   }
 
   if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
     return true;
   }
 
   // include the 'heartz' as a way to have a non matching MQ to help terminate the join
   // https://git.io/vznFH
   const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
   return mq(query);
}

const setStyleWithVendors = (element, property, value) => {
   if (typeof element !== "undefined") {
      element.style["webkit" + property] = value;
      element.style["moz" + property] = value;
      element.style["ms" + property] = value;
      element.style["o" + property] = value;
   }
}

const throttle = (fn, wait) => {
   let time = Date.now();
   return () => {
      if ((time + wait - Date.now()) < 0) {
         fn();
         time = Date.now();
      }
   }
}

module.exports = {
   domIsReady : domIsReady,
   attachEvent: attachEvent,
   detachEvent: detachEvent,
   isTouchMode: isTouchMode,
   throttle: throttle
}

