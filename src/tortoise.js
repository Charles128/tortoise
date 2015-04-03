var _ = require('underscore');
/*
var Tortoise = require('helpers/molasses')
var tort = new Tortoise({
  iterate: function(s, e, d, m) { var i = this.items.shift(); if(i){ console.log(i); s(); } else { d(); }},
  context: {
    items: 'hi my name is tortoise'.split(' ')
  }
});

  setup - a function that gets the context and returns a modified context
  teardown - same
  iterate - a function that does stuff. 
    runs in context. 
    gets the success, error and done functions and a reference 
      to the tortoise obj.
  wait: '200i' number in ms. i means inclusive: should the time
    it took the task to complete be subtracted from the wait 
    time so that task completion time is more predictable?
  context - the object in which to run everything.

  TODO:
    wait time
    start time / end time on iterations
    error queue integration
    see if it is faster to use a static object or make a new one
    https://jsperf.com/
    move the wait time to success and error
    read up on how to fire events and allow events agnostically
*/
var Tortoise = function(options) {
  this.options = _.defaults(options, {
    setup: function(context) { return context; },
    teardown: function(context) { return context; },
    wait: 2,
  });
  this.context = this.options.context;
};
Tortoise.prototype = {
  // configure: function(options) {
  //   this.options = _.defaults(options, {
  //     setup: function(context) { return context; },
  //     teardown: function(context) { return context; },
  //     wait: 2,
  //   });
  // },
  _ctxt: function(func) {
    return func.apply(this.context, _.rest(arguments));
  },
  run: function() {
    this.setup();
  },
  setup: function() {
    this.iterationCount = 0;
    this.successCount = 0;
    this.errorCount = 0;

    this.context = this._ctxt(this.options.setup, this.context);
    this.iterate();
  },
  wait: function() {
    return 2000;
  },
  iterate: function() {
    setTimeout(_.bind(this.options.iterate, this.context,
      _.bind(this.success, this),
      _.bind(this.error, this),
      _.bind(this.done, this),
      this
    ), this.wait());
  },
  success: function(message, data) {
    console.log('success: ', message)
    this.iterate();
  },
  error: function(message, data) {
    console.log('error: ', message)
    this.iterate();
  },
  done: function(message, data) {
    console.log('finished: ', message)
    this.teardown();
  },
  teardown: function() {
    this.context = this._ctxt(this.options.setup, this.context);
  }
};

module.exports = Tortoise;





