ta = {};
/**
 * Deferred and Promise API. 
 * 
 * A deferred object is a placeholder for the eventual result of an
 * asynchronous operation. Each deferred contains a promise object,
 * which is essentially a read-only view of the deferred. Can be used to avoid
 * complexity / unencapsulated logic which often results from a deeply nested
 * series of success and failure callbacks.
 * 
 * Usage:
 * Suppose a method (the "caller") calls an asynchronous method (the "callee").
 * 
 * The callee should create a new deferred instance and immediately return the
 * promise object embedded in the deferred.
 * 
 * The caller should attached 'success' and 'failure' callbacks to the returned
 * promise.
 * 
 * When the asynchronous operation is complete, the callee should transition
 * the promise into a 'resolved' or 'rejected' state, which triggers the
 * callbacks set by the caller.
 * 
 * Exposes an API similar to JQuery.Deferred.
 * 
 * Unexpected behavior can result from caching a promise and returning it to
 * multiple callers.
 * 
 * @author  cmundhe
 * @since   2012-05-10
 */
(function(ta) {

  ta.util || (ta.util = {});
  
  /** Built-in promise hooks. */
  var hooks = [ 'success', 'failure', 'always', 'progress' ];

  /** Map of promise statuses to hooks. */
  var statusMap = {
    'resolved' : [ 'success', 'always' ],
    'rejected' : [ 'failure', 'always' ]
  };

  /**
   * Empty private constructor for promises. Invoking this constructor only
   * sets up prototype chain. Construction truly gets completed in
   * the body of ta.util.Deferred.
   */
  var Promise = function() {};

  for (var i = 0; i < hooks.length; i++) {
    (function(hook) {

      /**
       * Callback hooks.
       * 
       * @param  Function callback  
       * @param  Object context     Object to bind callback. Optional.
       * @return Promise
       */
      Promise.prototype[hook] = function(callback, context) {
        
        return enqueue(this, hook, context ? callback.bind(context) : callback);

      };

    }(hooks[i]));
  }

  /**
   * Deferred constructor.
   * 
   * Creates a promise which starts out as 'pending'. Exposes privileged
   * methods .resolve() and .reject() to transition the embedded promise into
   * a fulfilled state. Methods which use a deferred should return the
   * embedded promise to ensure the promise status cannot be modify from
   * outside.
   * 
   * Use of 'new' keyword optional. 
   * 
   */
  ta.util.Deferred = function() {
    
    var status  = 'pending';
    var promise = new Promise();
    
    // Finish promise construction.
    promise.queue  = [];    // Callback queue.
    promise.args   = null;  // Arguments to pass to callbacks.
    
    promise.status = function() { return status; }; // Get current status.

    var deferred = {
      
      /**
       * Triggers 'progress' callbacks. Does NOT fulfill promise.
       * 
       * @return {Promise}
       */
      notify: function() {

        if (isFulfilled(status)) {
          throw new Error('Promise has already been fulfilled.');
        }

        var args = Array.prototype.slice.call(arguments);
        var obj, i, l;
        
        for (i = 0, l = promise.queue.length; i < l; i++) {

          obj = promise.queue[i];
          if (obj.hook == 'progress') {
            obj.callback.apply(null, args);
          }

        }

        return promise;

      },

      /**
       * Resolve promise. Triggers 'success' and 'always' callbacks.
       * 
       * @param  ...      Arguments to be passed to callbacks. Optional.
       * @return Promise
       */
      resolve : function() {
        
        if (isFulfilled(status)) {
          throw new Error('Promise has already been fulfilled.');
        }
        status       = 'resolved';
        promise.args = Array.prototype.slice.call(arguments);
        return dequeue(promise);

      },
      
      /**
       * Reject promise. Triggers 'failure' and 'always' callbacks.
       * 
       * @param  ...      Arguments to be passed to callbacks. Optional.
       * @return Promise
       */
      reject : function() {
        
        if (isFulfilled(status)) {
          throw new Error('Promise has already been fulfilled.');
        }
        status       = 'rejected';
        promise.args = Array.prototype.slice.call(arguments);
        return dequeue(promise);

      },
      
      /**
       * Return promise.
       * 
       * @return Promise
       */
      promise : function() { return promise; }

    };

    return deferred;

  };

  /**
   * Determine whether a promise status is fulfilled.
   * 
   * @param  String status
   * @return Boolean
   */
  var isFulfilled = function(status) {
    
    return status == 'resolved' || status == 'rejected';

  };

  /**
   * Hook a callback onto a given promise.
   * 
   * @param  Promise promise
   * @param  String hook  
   * @param  Function callback
   * @return Promise
   */
  var enqueue = function(promise, hook, callback) {
    
    promise.queue.push({ hook : hook, callback : callback });
    return dequeue(promise);

  };

  /**
   * If a promise is fulfilled, invoke its callbacks. If a callback
   * returns a promise, all remaining callbacks will be executed with respect
   * to this second promise, i.e. execution of remaining callbacks will be
   * delayed until the second promise enters a fulfilled state.
   * 
   * @param  Promise promise
   * @return Promise
   */
  var dequeue = function(promise) {
    
    var obj, newPromise;
    
    while (isFulfilled(promise.status()) && (obj = promise.queue.shift())) {
      
      if (~statusMap[promise.status()].indexOf(obj.hook)) {
        
        // Invoke callback and store its return value.
        newPromise = obj.callback.apply(null, promise.args);
        
        if (newPromise instanceof Promise) {
          
          // Switch context to the returned Promise object.
          newPromise.queue = newPromise.queue.concat(promise.queue);
          promise          = newPromise;

        }
      }
    }

    return promise;
  };

}(ta));
