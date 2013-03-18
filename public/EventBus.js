
/**
 *
 */
var EventBus = (function () {

  /**
   *
   */
  var EventBus = function ( handler, events, listeners ) {
    this.handler = handler;
    this.eventNames = (typeof events === 'object' && events instanceof Array) ? events : [events];
    this.listeners = {};

    // this.handler.addEvent = 
    // this.handler.removeEvent

    listeners && this.register ( listeners );
  };

  /**
   *
   */
  EventBus.prototype.register = function ( listeners ) {
    for ( var name in listeners ) {
      if ( listeners.hasOwnProperty ( name ) ) {
        var value = listeners [ name ];
        name = name.replace ( /^on/, '' ).toLowerCase ();
        this.listeners [ name ] || (this.listeners [ name ] = []);
        this.listeners [ name ].push ( value );
      }
    }
  };

  /**
   *
   */
  EventBus.prototype.fire = function ( evnt ) {
    if ( !this.listeners [ evnt ] ) { return; }
    var args = Array.prototype.slice.call ( arguments ).slice ( 1 );
    this.listeners [ evnt ].forEach ( function ( listener ) {
      listener.apply ( listener, args );
    });
  };

  return EventBus;

}());