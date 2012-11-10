/**
 * Module dependencies
 */

var $ = require('jquery'),
    Emitter = require('emitter');

/**
 * Expose `List`.
 */

module.exports = List;

/**
 * Initialize a new `List`
 */

function List() {
  if(!(this instanceof List)) return new List;
  this.items = {};
  this.cid = 0;
  this.el = $('<ul class="list">');
}

/**
 * Mixin `Emitter`
 */

Emitter(List.prototype);

/**
 * Add templating
 *
 * @return {List}
 * @api public
 */

List.prototype.template = function(fn) {
  this.tpl = fn;
  return this;
};

/**
 * Identifier, used to identify list items. This allows
 * you to remove menu items by passing in models or
 * refresh single elements
 *
 * Example:
 *
 * function(item) {
 *   return item.cid;
 * }
 *
 * TODO: Finish me
 */

List.prototype.identifier = function(item) {};

/**
 * Add list item with the given `obj` and optional callback `fn`.
 * Emits an `add` event with the supplied `obj`.
 *
 * When the item is clicked `fn()` will be invoked, along with firing a
 * `select` event. If a `slug` is present, it will also fire the event
 * `slug`, passing the `obj`.
 *
 * @param {Object} obj
 * @param {Function} fn
 * @param {Boolean} _action (private)
 * @return {List}
 * @api public
 */

List.prototype.add = function(obj, fn, _action) {
  var self = this,
      cid = this.cid++,
      tpl = (this.tpl && typeof this.tpl == 'function') ? this.tpl(obj) : obj;
      el = $('<li>').html(tpl);

  el.addClass('list-item-' + cid)
    [_action || 'appendTo'](this.el)
    .click(function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.emit('select', obj);
      self.emit('select:'+cid, obj);
      if(fn) fn(obj);
    });

  this.emit('add', obj);
  this.items[cid] = obj;

  return this;
};

/**
 * Add an item to the top of the list
 *
 * @param {Object} obj
 * @param {Function} fn
 * @return {List}
 * @api public
 */

List.prototype.shift = function(obj, fn) {
  return this.add(obj, fn, 'prependTo');
};

/**
 * Remove items from the list
 *
 * @param {Number} cid
 * @return {List}
 * @api public
 */

List.prototype.remove = function(cid) {
  var item = this.el.find('.list-item-' + cid);
  if (!item) throw new Error('no list item named "' + cid + '"');
  this.emit('remove', this.items[cid]);
  this.emit('remove:'+cid, this.items[cid]);
  item.remove();
  delete this.items[cid];
  return this;
};

/**
 * Check if this list has an item with the given `slug`.
 *
 * @param {String} slug
 * @return {Boolean}
 * @api public
 */

List.prototype.has = function(cid){
  return !! (this.items[cid]);
};
