/**
 * File slider.js.
 *
 * Implement interactive mobile and desktop slider
 */

(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
	  define([], factory(root));
	} else if ( typeof exports === 'object' ) {
	  module.exports = factory(root);
	} else {
	  root.CollapsibleBlock = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	var _hasInitialized = false;
	var _publicMethods = {
		managers: [],
		states: {
			COLLAPSED: 'collapsed',
			FIRST_EXPANDED: 'first-expanded',
			EXPANDED: 'expanded',
		},
	};
	var _settings = { };
	var _defaults = {
		bodyClass: 'has-collapsible-block',

		elementSelector: '[data-collapsible]',
		contentElementSelector: '[data-collapsible-content]',
		contentInnerSelector: '.collapsible-content__inner',
		handlerSelector: '[data-collapsible-handler]',
		
		isCollapsedClass: 'is-collapsed',
		isActivatedClass: 'is-activated',
		cssTransition: 'height .15s linear',
		
		targetAttribute: 'data-collapsible-target',
		maxHeightAttribute: 'data-collapsible-max-height',
		createHandlerAttribute: 'data-collapsible-create-handler',
		changeStateOnResizeAttribute: 'data-collapsible-change-state-resize',

		initialState: _publicMethods.states.FIRST_EXPANDED,
		initialStateAttribute: 'data-collapsible-initial-state',
		firstExpandedDelay: 100,
		
		idPrefix: 'collapsible',
		createHandler: false,
		maxHeight: 0,
		handlerTemplate: '<a href="#collapsible" role="button" data-collapsible-handler>Read more</a>',
		contentInnerTemplate: '<div class="collapsible-content__inner"></div>',
	};



	/*!
	* Merge two or more objects together.
	* (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
	* @param   {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	* @param   {Object}   objects  The objects to merge together
	* @returns {Object}            Merged values of defaults and options
	*/
	var extend = function () {
		// Variables
		var extended = {};
		var deep = false;
		var i = 0;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					// If property is an object, merge properties
					if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for (; i < arguments.length; i++) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;
	};



	/**
	 * Provide a crossbrowser way to determine which
	 * transitionend event is supported by the current browser.
	 * 
	 * Based on the work of:
	 * Jonathan Suh - https://jonsuh.com/blog/detect-the-end-of-css-animations-and-transitions-with-javascript/
	 * David Walsh - https://davidwalsh.name/css-animation-callback
	 *
	 * @return  {String}  The transitionend event name
	 */
	var getTransitionEndEvent = function() {
		var t;
		var el = document.createElement('fakeelement');
		var transitions = {
			'transition':'transitionend',
			'OTransition':'oTransitionEnd',
			'MozTransition':'transitionend',
			'WebkitTransition':'webkitTransitionEnd'
		}

		for( t in transitions ){
			if( el.style[t] !== undefined ){
				return transitions[t];
			}
		}

		return 'transitionend';
	};



	/**
	 * Route click events
	 */
	var handleClick = function( e ) {
		if ( e.target.closest( _settings.handlerSelector ) ) {
			e.preventDefault();
			
			// Get target and handler elements
			var handlerElement = e.target.closest( _settings.handlerSelector );
			var targetElement = document.querySelector( '#' + handlerElement.getAttribute( _settings.targetAttribute ) );
			
			if ( ! targetElement ) {
				targetElement = handlerElement;
			}

			// Get the collapsbile element
			var element = targetElement.closest( _settings.elementSelector );

			// Maybe toggle collapsbile element state
			if ( element ) {
				_publicMethods.toggleState( element );
			}
		}
	}



	/**
	 * Create handler element
	 */
	var createHandlerElement = function( manager ) {
		var element = manager.element;
		var contentElement = manager.contentElement;
		var handler = document.createElement('div');
		handler.innerHTML = manager.settings.handlerTemplate.trim();
		manager.handlerElement = handler.childNodes[0];
		manager.handlerElement.setAttribute( manager.settings.targetAttribute, contentElement.id );
		
		// TODO: Fix button role and behavior should be set with JS instead of using the `href` attribute
		manager.handlerElement.setAttribute( 'href', '#' );
		manager.handlerElement.setAttribute( 'role', 'button' );

		element.insertBefore( handler.childNodes[0], contentElement.nextSibling );
	}



	/**
	 * Create content inner element
	 */
	var maybeCreateContentInnerElement = function( manager ) {
		// Bail if content inner element already exists
		if ( manager.contentElement.querySelector( manager.settings.contentInnerSelector ) ) { return; }
		
		var contentElement = manager.contentElement;
		var newContentPlaceholder = document.createElement('div');
		newContentPlaceholder.innerHTML = manager.settings.contentInnerTemplate.trim();
		var contentInner = newContentPlaceholder.childNodes[0];

		// Move content to new content inner element
		contentInner.innerHTML = contentElement.innerHTML;
		contentElement.innerHTML = newContentPlaceholder.innerHTML;
	}



	/**
	 * Get the element's computed `height` even when hidden or collapsed.
	 *
	 * @param   HTMLElement  element  Element to get the computed height value.
	 *
	 * @return  Number                The computed height value of the element.
	 */
	var getComputedHeight = function( element ) {
		// Get original element style values
		var originalPosition = element.style.position;
		var originalDisplay = element.style.display;
		var originalVisibility = element.style.visibility;
		var originalTransition = element.style.transition;
		var originalHeight = element.style.height;

		// Set element styles prior to getting its height
		element.style.position = 'absolute';
		element.style.display = 'block';
		element.style.visibility = 'hidden';
		element.style.transition = 'none';
		element.style.height = '';

		// Get the element's natural height
		var computedHeight = element.scrollHeight;

		// Set element styles back to original values
		element.style.position = originalPosition;
		element.style.display = originalDisplay;
		element.style.visibility = originalVisibility;
		element.style.transition = originalTransition;
		element.style.height = originalHeight;

		return computedHeight;
	}



	/**
	 * Get the element's current used `height` space, even in the middle of a transition.
	 *
	 * @param   HTMLElement  element  Element to get the current height value.
	 *
	 * @return  Number                The current height value of the element.
	 */
	var getCurrentHeight = function( element ) {
		return element.getBoundingClientRect().height;
	}
	


	/**
	 * Resize element
	 */
	var maybeChangeStateOnResize = function( manager ) {
		// Reset collapsed state
		_publicMethods.expand( manager.element );

		requestAnimationFrame( function() {
			var elementRect = manager.element.getBoundingClientRect();

			// Maybe collapse
			if ( elementRect.height > manager.settings.maxHeight ) {
				_publicMethods.collapse( manager.element );
			}
		} );
	}



	/**
	 * Remove changed property values from the target element when the `height` transition ends.
	 */
	var removeProperties = function ( e ) {
		// Maybe bail when handling a transition event but not for the right property
		if ( e && e.propertyName !== 'height' ) return;

		// Remove content element properties when transition is complete
		e.target.style.height = '';
		e.target.style.overflow = '';

		// Remove the event handler so it runs only once
		e.target.removeEventListener( getTransitionEndEvent(), removeProperties );	
	}



	/**
	 * Get slider manager instance from slider element
	 */
	_publicMethods.getInstance = function ( element ) {
		var instance;
		for ( var i = 0; i < _publicMethods.managers.length; i++ ) {
			var manager = _publicMethods.managers[i];
			if ( manager.element == element ) { instance = manager; break; }
		}
		return instance;
	}



	/**
	 * Collapse element
	 */
	_publicMethods.collapse = function( element ) {
		var manager = _publicMethods.getInstance( element );
		
		// Bail if manager not found
		if ( ! manager ) { return; }

		// Collapse element
		manager.element.classList.add( manager.settings.isCollapsedClass );
		
		// Remove `removeProperties` event listener to prevent block from expanding at the end of the transition
		manager.contentElement.removeEventListener( getTransitionEndEvent(), removeProperties );
		
		// Set content element to hide overflowing content
		manager.contentElement.style.overflow = 'hidden';
		
		requestAnimationFrame( function() {
			// Set height of the element to the current height value
			// Without knowing the value of `height` property the browser can't calculate the steps of the `height` values
			// related to the transition time and therefore won't be able to display the transition.
			manager.contentElement.style.height = getCurrentHeight( manager.contentElement ) + 'px';
			
			// Wait for the new height to apply
			requestAnimationFrame( function() {
				// Set height of the element to the `collapsed` state
				manager.contentElement.style.height = manager.settings.maxHeight + 'px';
			});
		} )
	}



	/**
	 * Expand element
	 */
	_publicMethods.expand = function( element ) {
		// Get element manager
		var manager = _publicMethods.getInstance( element );

		// Bail if manager not found
		// TODO: Maybe try to initialize collapsible and manager on the fly
		if ( ! manager ) { return; }

		// Set height of the element to the current height value
		manager.contentElement.style.height = getCurrentHeight( manager.contentElement ) + 'px';

		// Set event handler to remove height value when transition ends
		manager.contentElement.addEventListener( getTransitionEndEvent(), removeProperties );
		
		// Expand element to its content height
		requestAnimationFrame( function() {
			var computedHeight = getComputedHeight( manager.contentElement );
			
			// Wait for the new styles to apply
			requestAnimationFrame( function() {
				// Set height of the element to the `expanded` state
				manager.contentElement.style.height = computedHeight + 'px';
				
				// Update element's state to `expanded`
				manager.element.classList.remove( manager.settings.isCollapsedClass );
			});
		} );
	}



	/**
	 * Toggle collapsible state
	 */
	_publicMethods.toggleState = function( element ) {
		var manager = _publicMethods.getInstance( element );

		// Bail if manager not found
		if ( ! manager ) { return; }

		// Toggle state
		if ( element.classList.contains( manager.settings.isCollapsedClass ) ) {
			_publicMethods.expand( element );
		}
		else {
			_publicMethods.collapse( element );
		}
	}
	


	/**
	 * Get current collapsible block state
	 */
	_publicMethods.getState = function( element ) {
		var manager = _publicMethods.getInstance( element );

		// Bail if manager not found
		if ( ! manager ) { return false; }
		
		// Get current state
		var currentState = _publicMethods.states.EXPANDED;
		if ( element.classList.contains( manager.settings.isCollapsedClass ) ) {
			currentState = _publicMethods.states.COLLAPSED;
		}

		return currentState;
	}
	


	/**
	 * Initialize an element
	 */
	_publicMethods.initializeElement = function( element ) {
		var manager = {};
		_publicMethods.managers.push( manager );
		manager.element = element;
		manager.settings = extend( _settings );
		
		// Get content element
		manager.contentElement = manager.element.matches( _settings.contentElementSelector ) ? manager.element : manager.element.querySelector( manager.settings.contentElementSelector );
		if ( ! manager.contentElement ) {
			manager.contentElement = manager.element;
		}
		
		// Maybe create element ID
		if ( manager.element.id == '' ) {
			manager.element.id = manager.settings.idPrefix + '_' + _publicMethods.managers.length;
		}

		// Maybe create contentElement ID
		if ( manager.contentElement.id == '' ) {
			manager.contentElement.id = manager.element.id + '__content';
		}

		// Get maxHeight from attributes
		var maxHeightAttribute = manager.contentElement.getAttribute( manager.settings.maxHeightAttribute );
		manager.settings.maxHeight = maxHeightAttribute && maxHeightAttribute != '' ? parseInt( maxHeightAttribute ) : manager.settings.maxHeight;

		// Get createHandler from attributes
		var createHandler = manager.element.getAttribute( manager.settings.createHandlerAttribute );
		manager.settings.createHandler = createHandler == 'true' || createHandler == 'false' ? Boolean( createHandler ) : manager.settings.createHandler;
		if ( manager.settings.createHandler ) {
			createHandlerElement( manager );
		}

		// Maybe create content inner element
		maybeCreateContentInnerElement( manager );

		// Set initial state at element initialization
		var initialStateAttribute = manager.contentElement.getAttribute( manager.settings.initialStateAttribute );
		var initialState = initialStateAttribute ? initialStateAttribute : manager.settings.initialState;
		var index = Array.prototype.indexOf.call( manager.element.parentNode.children, manager.element );
		if ( initialState == _publicMethods.states.EXPANDED || ( initialState == _publicMethods.states.FIRST_EXPANDED && index == 0 ) ) {
			setTimeout( function() { _publicMethods.expand( manager.element ); }, manager.settings.firstExpandedDelay );
		}
		else {
			setTimeout( function() { _publicMethods.collapse( manager.element ); }, manager.settings.firstExpandedDelay );
		}
		
		// Maybe change state on resize
		var changeStateOnResizeAttribute = manager.element.getAttribute( manager.settings.changeStateOnResizeAttribute );
		manager.settings.changeStateOnResize = changeStateOnResizeAttribute && changeStateOnResizeAttribute != '' ? Boolean( changeStateOnResizeAttribute ) : false;
		if ( manager.settings.changeStateOnResize ) {
			maybeChangeStateOnResize( manager );
			window.addEventListener( 'resize', function() { maybeChangeStateOnResize( manager ); } );
		}
		
		// Set css transition property
		var computedTransition = window.getComputedStyle( manager.contentElement ).transition;
		var cssTransition = computedTransition != '' ? computedTransition + ', ' + manager.settings.cssTransition : manager.settings.cssTransition;
		manager.contentElement.style.transition = cssTransition;
		
		// Set element as activated
		manager.isActivated = true;
		manager.element.classList.add( manager.settings.isActivatedClass );
	}

	

	/**
	 * Initialize
	 */
	_publicMethods.init = function( options ) {
		if ( _hasInitialized ) return;

		// Merge with general settings with options
		_settings = extend( _defaults, options );

		var elements = document.querySelectorAll( _settings.elementSelector );
		
		for ( var i = 0; i < elements.length; i++ ) {
			_publicMethods.initializeElement( elements[ i ] );
		}
		
		// Add event listeners
		document.addEventListener( 'click', handleClick );

		// Set body class
		document.body.classList.add( _settings.bodyClass );

		_hasInitialized = true;
	};



	//
	// Public APIs
	//
	return _publicMethods;

});
