/*
* Tween
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * The TweenJS Javascript library provides a simple but powerful tweening interface. It supports tweening of both
 * numeric object properties & CSS style properties, and allows you to chain tweens and actions together to create
 * complex sequences.
 *
 * <h4>Simple Tween</h4>
 * This tween will tween the target's alpha property from 0 to 1 for 1s then call the <code>handleComplete</code> function.
 *
 *	    target.alpha = 0;
 *	    createjs.Tween.get(target).to({alpha:1}, 1000).call(handleComplete);
 *	    function handleComplete() {
 *	    	//Tween complete
 *	    }
 *
 * <strong>Arguments and Scope</strong>
 * Tween also supports a `call()` with arguments and/or a scope. If no scope is passed, then the function is called
 * anonymously (normal JavaScript behaviour). The scope is useful for maintaining scope when doing object-oriented
 * style development.
 *
 *      createjs.Tween.get(target).to({alpha:0})
 *          .call(handleComplete, [argument1, argument2], this);
 *
 * <h4>Chainable Tween</h4>
 * This tween will wait 0.5s, tween the target's alpha property to 0 over 1s, set it's visible to false, then call the
 * <code>handleComplete</code> function.
 *
 *	    target.alpha = 1;
 *	    createjs.Tween.get(target).wait(500).to({alpha:0, visible:false}, 1000).call(handleComplete);
 *	    function handleComplete() {
 *	    	//Tween complete
 *	    }
 *
 * <h4>Browser Support</h4>
 * TweenJS will work in all browsers.
 *
 * @module TweenJS
 * @main TweenJS
 */

// namespace:
this.createjs = this.createjs||{};

(function() {
	"use strict";


// constructor
	/**
	 * Tweens properties for a single target. Methods can be chained to create complex animation sequences:
	 *
	 * <h4>Example</h4>
	 *
	 *	createjs.Tween.get(target)
	 *		.wait(500)
	 *		.to({alpha:0, visible:false}, 1000)
	 *		.call(handleComplete);
	 *
	 * Multiple tweens can share a target, however if they affect the same properties there could be unexpected
	 * behaviour. To stop all tweens on an object, use {{#crossLink "Tween/removeTweens"}}{{/crossLink}} or pass `override:true`
	 * in the props argument.
	 *
	 * 	createjs.Tween.get(target, {override:true}).to({x:100});
	 *
	 * Subscribe to the {{#crossLink "Tween/change:event"}}{{/crossLink}} event to be notified when the tween position changes.
	 *
	 * 	createjs.Tween.get(target, {override:true}).to({x:100}).addEventListener("change", handleChange);
	 * 	function handleChange(event) {
	 * 		// The tween changed.
	 * 	}
	 *
	 * See the {{#crossLink "Tween/get"}}{{/crossLink}} method also.
	 * @class Tween
	 * @param {Object} target The target object that will have its properties tweened.
	 * @param {Object} [props] The configuration properties to apply to this tween instance (ex. `{loop:true, paused:true}`).
	 * All boolean properties default to false. Supported props are:<UL>
	 *    <LI> `loop`: sets the loop property on this tween.</LI>
	 *    <LI> `useTicks`: uses ticks for all durations instead of milliseconds.</LI>
	 *    <LI> `ignoreGlobalPause`: sets the {{#crossLink "Tween/ignoreGlobalPause:property"}}{{/crossLink}} property on this tween.</LI>
	 *    <LI> `override`: if true, {{#crossLink "Tween/removeTweens"}}{{/crossLink}} will be called to remove any active tweens with the same target.
	 *    <LI> `paused`: indicates whether to start the tween paused.</LI>
	 *    <LI> `position`: indicates the initial position for this tween.</LI>
	 *    <LI> `pluginData`: An object containing data for use by installed plugins. See the {{#crossLink "Tween/pluginData:property"}}{{/crossLink}} property for details.</LI>
	 *    <LI> `onChange`: specifies a listener for the {{#crossLink "Tween/change:event"}}{{/crossLink}} event.</LI>
	 * </UL>
	 * @extends EventDispatcher
	 * @constructor
	 */
	function AbstractTween(props) {
		this.EventDispatcher_constructor();
		
	// public properties:
		/**
		 * Causes this tween to continue playing when a global pause is active. For example, if TweenJS is using {{#crossLink "Ticker"}}{{/crossLink}},
		 * then setting this to false (the default) will cause this tween to be paused when `Ticker.setPaused(true)`
		 * is called. See the {{#crossLink "Tween/tick"}}{{/crossLink}} method for more info. Can be set via the `props`
		 * parameter.
		 * @property ignoreGlobalPause
		 * @type Boolean
		 * @default false
		 */
		this.ignoreGlobalPause = false;
	
		/**
		 * Indicates the number of times to loop. If set to -1, the tween will loop continuously.
		 * @property loop
		 * @type {Number}
		 * @default 0
		 */
		this.loop = 0;
	
		/**
		 * Indicates the duration of this tween in milliseconds (or ticks if `useTicks` is true), irrespective of `loops`.
		 * This value is automatically updated as you modify the tween. Changing it directly could result in unexpected
		 * behaviour.
		 * @property duration
		 * @type {Number}
		 * @default 0
		 * @readonly
		 */
		this.duration = 0;
	
		/**
		 * The current normalized position of the tween. This will always be a value between 0 and `duration`.
		 * Changing this property directly will have unexpected results, use {{#crossLink "Tween/setPosition"}}{{/crossLink}}.
		 * @property position
		 * @type {Object}
		 * @default 0
		 * @readonly
		 */
		this.position = 0;
		
		/**
		 * The raw tween position. This value will be between `0` and `loops * duration` while the tween is active.
		 * @property rawPosition
		 * @type {Number}
		 * @default -1
		 * @readonly
		 */
		this.rawPosition = -1;
	
		/**
		 * Uses ticks for all durations instead of milliseconds. This also changes the behaviour of actions (such as `call`):
		 * Only actions on the current position will be executed when `useTicks` is true.
		 * @property useTicks
		 * @type {Boolean}
		 * @default false
		 * @readonly
		 */
		this.useTicks = false;
		
		/**
		 * Causes the tween to play in reverse.
		 * @property reversed
		 * @type {Boolean}
		 * @default false
		 */
		this.reversed = false;
		
		/**
		 * Causes the tween to reverse direction at the end of each loop.
		 * @property bounce
		 * @type {Boolean}
		 * @default false
		 */
		this.bounce = false;
		
		
	// private properties:
		/**
		 * @property _paused
		 * @type {Boolean}
		 * @default false
		 * @protected
		 */
		this._paused = true;
	
		/**
		 * Previous position.
		 * @property _prevPos
		 * @type {Number}
		 * @default -1
		 * @protected
		 */
		this._prevPos = -1;
		
		/**
		 * @property _next
		 * @type {Tween}
		 * @default null
		 * @protected
		 */
		this._next = null;
		
		/**
		 * @property _prev
		 * @type {Tween}
		 * @default null
		 * @protected
		 */
		this._prev = null;
		
		/**
		 * @property _parent
		 * @type {Object}
		 * @default null
		 * @protected
		 */
		this._parent = null;

		if (props) {
			this.useTicks = !!props.useTicks;
			this.ignoreGlobalPause = !!props.ignoreGlobalPause;
			this.loop = props.loop === true ? -1 : (props.loop||0);
			this.reversed = !!props.reversed;
			this.bounce = !!props.bounce;
			props.onChange && this.addEventListener("change", props.onChange);
		}
		if (!props || !props.paused) { this.setPaused(false); }
		
		// while setPosition is shared, it needs to happen after all props are set
	};

	var p = createjs.extend(AbstractTween, createjs.EventDispatcher);

	// TODO: deprecated
	// p.initialize = function() {}; // searchable for devs wondering where it is. REMOVED. See docs for details.

// events:
	/**
	 * Called whenever the tween's position changes.
	 * @event change
	 * @since 0.4.0
	 **/
	

// public methods:
	
	
	/**
	 * Advances the tween by a specified amount.
	 * @method advance
	 * @param {Number} delta The amount to advance in milliseconds (or ticks if useTicks is true). Negative values are supported.
	 * @param {Number} [ignoreActions=false] If true, actions will not be executed due to this change in position.
	 * @return {Boolean} Returns `true` if the tween is complete.
	 */
	p.advance = function(delta, ignoreActions) {
		return this.setPosition(this.rawPosition+delta, !ignoreActions);
	};
	
	/**
	 * Advances the tween to a specified position.
	 * @method setPosition
	 * @param {Number} position The raw position to seek to in milliseconds (or ticks if useTicks is true).
	 * @param {Number} [runActions=false] If true, all actions between the previous and new position will be run (except when useTicks is true, in which case only the actions on the new position will be run).
	 * @return {Boolean} Returns `true` if the tween is complete.
	 */
	p.setPosition = function(position, runActions) {
		var d=this.duration, prevPos=this._prevPos, loopCount=this.loop, step, stepNext;
		
		if (d === 0 && prevPos !== 0) {
			this._prevPos = this.rawPosition = this.position = 0;
			this._setPosition(0, true);
			return true;
		}
		
		// normalize position:
		if (position < 0) { position = 0; }
		var loop = position/d|0;
		var t = position%d;
		
		var end = (loop > loopCount && loopCount !== -1);
		if (end) { position = (t=d)*(loop=loopCount)+d; }
		
		if (position === prevPos) { return end; } // no need to update
		
		var rev = !this.reversed !== !(this.bounce && loop%2); // current loop is reversed
		if (rev) { t = d-t; }
		
		// set this in advance in case an action modifies position:
		this._prevPos = this.rawPosition;
		this.position = t;
		this.rawPosition = position;
		
		var blockActions = this._setPosition(t, end);
		
		if (end) { this.setPaused(true); }
		
		if (runActions && !blockActions) { this._runActions(); }
		this.dispatchEvent("change");
		
		return end;
	};
	

	/**
	 * Pauses or plays this tween.
	 * @method setPaused
	 * @param {Boolean} [value=true] Indicates whether the tween should be paused (`true`) or played (`false`).
	 * @return {Tween} This tween instance (for chaining calls)
	 * @chainable
	 */
	p.setPaused = function(value) {
		createjs.Tween._register(this, value);
		return this;
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	p.toString = function() {
		return "[AbstractTween]";
	};

	/**
	 * @method clone
	 * @protected
	 */
	p.clone = function() {
		throw("AbstractTween can not be cloned.")
	};


// private methods:
	/**
	 * @method _setPosition
	 * @param {Number} t
	 * @param {Boolean} end
	 * @protected
	 */
	p._setPosition = function(t, end) {
		// abstract.
	};
	
	/**
	 * @method _runActions
	 * @protected
	 */
	p._runActions = function() {
		// abstract.
	};

	/**
	 * @method _cloneProps
	 * @param {Object} props
	 * @protected
	 */
	p._cloneProps = function(props) {
		var o = {};
		for (var n in props) { o[n] = props[n]; }
		return o;
	};

	createjs.AbstractTween = createjs.promote(AbstractTween, "EventDispatcher");
}());
