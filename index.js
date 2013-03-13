var template = require('./template');
var utils = require('utils');

/**
 * Initialize a new `Overlay`.
 *
 * @param {Object} options
 * @api public
 */

function Overlay(options) {
  this.options = _.defaults(options || {}, {
    hiddenClass: 'is-inactive',
    closable: true,
    loadingClass: 'is-loading'
  });

  this.el = $(this.template);
  this.el.appendTo('body');

  if (this.options.closable) {
    this.el.on('click', this.hide.bind(this));
  }
}

_.extend(Overlay.prototype, Backbone.Events);

/**
 * Inherits from `Emitter.prototype`.
 */

Overlay.prototype.template = template;

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
  setTimeout(function(){
    self.el.removeClass(self.options.hiddenClass);
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
  var self = this;
  this.trigger('hide');
  this.isVisible = false;
  utils.afterTransition(this.el, function(){
    self.remove();
  });
  this.el.addClass(this.options.hiddenClass);
  return this;
};

/**
 * Hide the overlay without triggerting "hide".
 *
 * Emits "close" event.
 *
 * @return {Overlay}
 * @api public
 */

Overlay.prototype.remove = function(){
  this.el.remove();
  this.trigger('close');
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
  this.el.toggleClass(this.options.loadingClass, loading);
  this.trigger('loading');
  return this;
};

module.exports = Overlay;