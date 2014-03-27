var template = require('./template');
var afterTransition = require('after-transition');
var domify = require('domify');
var events = require('event');
var emitter = require('emitter');

/**
 * Initialize a new `Overlay`.
 *
 * @param {Object} options
 * @api public
 */

function Overlay(options) {
  this.entered = false;
  this.isVisible = false;
  this.options = this.normalizeOptions(options);
  this.el = domify(this.template);
  this.render();
}

/**
 * Default options
 * @type {Object}
 */
Overlay.defaults = {
  hiddenClass: 'is-inactive',
  closeable: true,
  fixed: true,
  loadingClass: 'is-loading',
  parent: document.body
};

emitter(Overlay.prototype);

/**
 * Backwards compatibility
 * @type {Function}
 */
Overlay.prototype.trigger = Overlay.prototype.emit;

/**
 * Inherits from `Emitter.prototype`.
 */
Overlay.prototype.template = template;

/**
 * Normalize the options to return a consistent object we can use
 * @param  {String|Object} options
 * @return {Object}
 */
Overlay.prototype.normalizeOptions = function(options) {
  options = options || {};
  for(var key in Overlay.defaults) {
    if(options[key] == null) {
      options[key] = Overlay.defaults[key];
    }
  }
  return options;
};

/**
 * Completely remove the dialog and all references to it
 * @return {void}
 */
Overlay.prototype.destroy = function(){
  this.emit('destroy');
  this.hide();
  this.off();
  this.leaveDocument();
};

/**
 * Add a class or classes
 * @param  {String} classes
 * @return {Dialog}
 */
Overlay.prototype.addClass = function(classes) {
  this.el.classList.add.apply(this.el.classList, classes.split(' '));
  return this;
};

/**
 * Remove a class or classes
 * @param  {String} classes
 * @return {Dialog}
 */
Overlay.prototype.removeClass = function(classes) {
  this.el.classList.remove.apply(this.el.classList, classes.split(' '));
  return this;
};

/**
 * Render the view
 * @return {Overlay}
 */
Overlay.prototype.render = function() {
  if(this.options.fixed) {
    this.el.classList.add('is-fixed');
  }
  if(this.options.closeable) {
    events.bind(this.el, 'click', this.hide.bind(this));
  }
  return this;
}

/**
 * Show the overlay.
 *
 * Emits "show" event.
 *
 * @return {Overlay}
 * @api public
 */
Overlay.prototype.show = function(){
  var self = this;
  this.trigger('show');
  this.isVisible = true;
  this.enterDocument();
  setTimeout(function(){
    self.removeClass(self.options.hiddenClass);
  }, 0);
  return this;
};

/**
 * Hide the overlay.
 *
 * Emits "hide" event.
 *
 * @return {Overlay}
 * @api public
 */
Overlay.prototype.hide = function(){
  this.isVisible = false;
  afterTransition.once(this.el, function(){
    this.leaveDocument();
    this.emit('hide finished');
  }.bind(this));
  this.addClass(this.options.hiddenClass);
  this.emit('hide');
  this.emit('close'); // Backwards compatibility
  return this;
};

/**
 * If the overlay should show a loading state
 *
 * Emits "loading" event.
 *
 * @return {Overlay}
 * @api public
 */
Overlay.prototype.loading = function(loading){
  if(loading) {
    this.emit('loading');
    this.addClass(this.options.loadingClass);
  }
  else {
    this.emit('ready');
    this.removeClass(this.options.loadingClass);
  }
  return this;
};

/**
 * Remove the element from the DOM
 * @return {void}
 */
Overlay.prototype.leaveDocument = function() {
  if(this.entered === false) return false;
  this.entered = false;
  this.el.parentNode.removeChild(this.el);
  this.emit('leave');
};

/**
 * Add the element to the DOM
 * @return {void}
 */
Overlay.prototype.enterDocument = function() {
  if(this.entered) return false;
  this.entered = true;
  this.options.parent.appendChild(this.el);
  this.emit('enter');
};

module.exports = Overlay;