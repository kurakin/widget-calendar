
Calendar.mixin.invalid = ( function () {

  var Invalid = {}
    , today = new Date ().setHours ( 0, 0, 0, 0 );

  Invalid.options = {
    invalidClass : 'invalid'
  , invalid : function ( date ) {
      return date.getTime () < today;
    }
  };

  // TODO improve setOptions mixin to do this automatically so it can be moved to the mixin options to be overridden
  Invalid.init = function () {
    var renderDay = this.options.render.day;
    this.options.render.day = function ( date, overflow, tdClass ) {
      this.options.invalid ( date ) && (tdClass = (tdClass || '') + ' ' + this.options.invalidClass );
      return renderDay.call ( this, date, overflow, tdClass );
    };
  };

  return Invalid;

}());