/*globals api EventBus DateHelper */

/**
 *
 * @author Wil Asche <wasche@tripadvisor.com>
 * @copyright TripAdvisor, LLC.
 * @license Create Commons Attribution 3.0 Unported
 */
var Calendar = (function (api) {

  /**
   * @option months [number=1] number of months to show
   */
  var defaultOptions = {
    months : 1
  , startOfWeek : 0
  , containerClass : 'calendar'
  , daySelector : '.day'
  , render : {
      day : function ( date, overflow, tdClass ) {
        var r = [ '<td class="day' ];
        tdClass && r.push ( ' ' ) && r.push ( tdClass );
        r.push ( '">' );
        if ( !overflow ) {
          r.push ( '<span>' );
          r.push ( date.getDate () );
          r.push ( '</span>' );
        }
        r.push ( '</td>' );
        return r.join ( '' );
      }
    , week : function ( month, week, days ) {
        days.unshift ( '<tr>' );
        days.push ( '</tr>' );
        return days.join ( '' );
      }
    , month : function ( month, weeks, header, footer ) {
        weeks.unshift ( '<tbody>' );
        if ( header ) {
          weeks.unshift ( '</thead>' );
          weeks.unshift ( header );
          weeks.unshift ( '<thead>' );
        }
        weeks.unshift ( '<table>' );
        weeks.push ( '</tbody>' );
        if ( footer ) {
          weeks.push ( '<tfoot>' );
          weeks.push ( footer );
          weeks.push ( '</tfoot>' );
        }
        weeks.push ( '</table>' );
        return weeks.join ( '' );
      }
    , header : function ( month ) {}
    , footer : function ( month ) {}
    , pretext : false
    , posttext : false
    }
  };

  var renderMonth = function ( date ) {
    var currentMonth = date.getMonth ()
      , day = new DateHelper ( date ).startOfMonth ().startOfWeek ()
      , end = new DateHelper ( date ).endOfMonth ().endOfWeek ()
      , month = []
      , week = []
      , w = 1
      , i = 0
      ;

    while ( day.date.getTime () <= end.date.getTime () ) {
      week.push ( this.options.render.day.call ( this, day.date, day.date.getMonth () !== currentMonth ) );
      i++;
      if ( i % 7 === 0 ) {
        month.push ( this.options.render.week.call ( this, day.date.getMonth (), w++, week ) );
        week = [];
      }
      day.nextDay ();
    }

    return this.options.render.month.call ( this, currentMonth, month, this.options.render.header ( currentMonth ), this.options.render.footer () );
  }

  var Calendar = function ( options ) {
    this.setOptions ( options );
    this.eventbus = new EventBus ( this, ['create'], options );
    this.start = new DateHelper ( this.options.startDate ).zeroTime ();
    this.container = api.createElement ( 'div', { class : this.options.containerClass } );
  };

  Calendar.prototype.render = function () {
    var months = [];
    this.options.render.pretext && months.push ( this.options.render.pretext );
    for ( var n = 0; n < this.options.months; n++ ) {
      months.push ( renderMonth.call ( this, this.start.nextMonth ( n ).toDate () ) );
    }
    this.options.render.posttext && months.push ( this.options.render.posttext );
    this.container.innerHTML = months.join ( '' );
    return this;
  };

  // TODO make this a mixin
  Calendar.prototype.setOptions = function ( options ) {
    options || (options = {});
    this.originalOptions || (this.originalOptions = options);
    this.options = api.extend ( {}, defaultOptions, options, this.originalOptions );
    this.options.render = api.extend ( {}, defaultOptions.render, options.render, this.originalOptions.render );
  };

  // TODO make this a mixin
  Calendar.prototype.use = function ( mixin ) {
    for ( var p in mixin ) {
      if ( mixin.hasOwnProperty ( p ) ) {
        if ( 'options' === p ) {
          this.setOptions ( mixin.options );
        } else if ( 'init' === p ) {
          mixin [ p ].call ( this );
        } else {
          this [ p ] = mixin [ p ];
        }
      }
    }

    return this;
  };

  Calendar.mixin = {};

  return Calendar;

}(api));