
/**
 *
 */
var DateHelper = (function (api, undefined) {

  var DateHelper = function ( date ) {
    this.date = date || new Date ();
  };

  DateHelper.prototype.startOfMonth = function () {
    this.date.setDate ( 1 );
    this.date.setHours ( 0, 0, 0, 0 );
    return this;
  };

  DateHelper.prototype.nextMonth = function ( delta ) {
    if ( delta === undefined ) { delta = 1; }
    this.date.setMonth ( this.date.getMonth () + delta );
    return this;
  }

  DateHelper.prototype.toDate = function () {
    return this.date;
  };

  DateHelper.prototype.clone = function () {
    return new DateHelper ( this.date );
  };

  return DateHelper;

}(api));