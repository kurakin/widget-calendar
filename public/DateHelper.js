
/**
 *
 */
var DateHelper = (function (api, undefined) {

  var daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

  var DateHelper = function ( date ) {
    this.date = date || new Date ();
  };

  DateHelper.prototype.zeroTime = function () {
    this.date.setHours ( 0, 0, 0, 0 );
    return this;
  }

  DateHelper.prototype.startOfMonth = function () {
    this.date.setDate ( 1 );
    return this;
  };

  DateHelper.prototype.endOfMonth = function () {
    this.date.setDate ( daysInMonth [ this.date.getMonth () ] );
    return this;
  };

  DateHelper.prototype.nextMonth = function ( delta ) {
    if ( delta === undefined ) { delta = 1; }
    this.date.setMonth ( this.date.getMonth () + delta );
    return this;
  }

  DateHelper.prototype.startOfWeek = function ( offset ) {
    this.date.setDate ( this.date.getDate () - this.date.getDay () + (offset || 0) );
    return this;
  };

  DateHelper.prototype.endOfWeek = function ( offset ) {
    this.date.setDate ( this.date.getDate () + (7 - this.date.getDay () + (offset || 0)) );
    return this;
  };

  DateHelper.prototype.nextDay = function () {
    this.date.setDate ( this.date.getDate () + 1 );
    return this;
  };

  DateHelper.prototype.toDate = function () {
    return this.date;
  };

  DateHelper.prototype.clone = function () {
    return new DateHelper ( this.date );
  };

  return DateHelper;

}(api));