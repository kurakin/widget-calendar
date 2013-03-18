/**
 * Utility class for syncronizing multiple instances.
 *
 * @class
 * @author Wil Asche <wasche@tripadvisor.com>
 * @since 2013.02.26
 * @copyright TripAdvisor, LLC
 * @license CC BY 3.0
 */
var Syncro = (function () {
  "use strict";

  /**
   * @constructor
   */
  var Syncro = function () {
    this.components = [];
  };

  /**
   * Add a component to synchronize. Component must implement a method 'sync', that should take an object representing
   * as the data to synchronize as the first parameter.
   * @param component Object component to add
   */
  Syncro.prototype.add = function ( component ) {
    if ( ! component.sync || typeof component.sync !== 'function') { throw new Error ( 'API Error: component must implement sync(data) function.' ); }
    this.components.push ( component );
    this.data && component.sync ( this.data );
  };

  /**
   * Synchronize all registered components using the given data.
   * @param data Object data to synchronize
   */
  Syncro.prototype.sync = function ( component, data ) {
    this.data = data;
    // alert all other components of new data
    for (var i = this.components.length - 1; i >= 0; i--) {
      this.components [ i ] !== component && this.components [ i ].sync ( data );
    }
  };

  return Syncro;

}());