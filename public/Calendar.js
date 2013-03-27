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
  , dayClass : 'day'
  , daySelector : '.day'
  , render : {
      day : function ( date, overflow, tdClass ) {
        var r = [ '<td data-date="', date.getTime (), '" class="' ];
        overflow || r.push ( this.options.dayClass );
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
    
    this.days = {};
    var days = api.select ( this.options.daySelector, this.container )
      , d;
    for (var i = days.length - 1; i >= 0; i--) {
      d = days [ i ].getAttribute( 'data-date' );
      this.days [ d ] = days [ i ];
    };
    
    return this;
  };

  Calendar.prototype.setOptions = function ( options ) {
    options || (options = {});
    this.originalOptions || (this.originalOptions = options);
    var ops = this.options || defaultOptions;
    this.options = api.extend ( {}, ops, options, this.originalOptions );
    this.options.render = api.extend ( {}, ops.render, options.render, this.originalOptions.render );
  };

  Calendar.prototype.use = function ( mixin ) {
    mixin.options && (this.setOptions ( mixin.options ));
    for ( var p in mixin ) {
      if ( mixin.hasOwnProperty ( p ) ) {
        if ( 'options' !== p && 'init' !== p ) {
          this [ p ] = mixin [ p ];
        }
      }
    }
    mixin.init && mixin.init.call ( this );

    return this;
  };

  Calendar.mixin = {};

  return Calendar;

}(api));