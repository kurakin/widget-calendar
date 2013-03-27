/*global TypeAhead Syncro */
function deleteWord ( source, word ) {
  var x = source.search( '\\b' + word + '\\b' );
  if ( x >= 0 ) {
    return source.slice ( 0, x ) + source.slice ( x + word.length );
  }
  return source;
}

// declare API
var api = {};
api.extend = _.extend; // (destination, source, ... )
api.bind = _.bind; // (function, object, [*arguments])
api.bindAll = _.bindAll; // (object, [*methodnames])
api.addEvent = function ( elmt, type, fn ) { elmt.addEventListener ( type, fn, false ); return elmt; };
api.removeEvent = function ( elmt, type, fn ) { elmt.removeEventListener ( type, fn ); return elmt; };
api.createElement = function ( tag, attributes ) {
  var elmt = document.createElement ( tag );
  for ( var attr in attributes ) {
    elmt.setAttribute ( attr, attributes [ attr ] );
  }
  return elmt;
};
api.getSize = function ( elmt ) { return { x : elmt.offsetWidth, y : elmt.offsetHeight }; };
api.getPosition = function ( elmt ) { return { x : elmt.offsetLeft, y : elmt.offsetTop }; };
api.addClass = function ( elmt, className ) { elmt.className += ' ' + className; };
api.removeClass = function ( elmt, className ) { elmt.className = deleteWord ( elmt.className, className ); };
api.checkBrowser   = function () {
  return Array.from ( arguments ).some ( function ( b ) {
    return !!Browser [ b ];
  });
};

api.select = function ( selector, elmt ) { return $(elmt || document).find ( selector ); };
api.find = function ( selector, elmt ) { return $(elmt || document).find ( selector ).first (); };
