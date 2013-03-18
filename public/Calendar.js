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
      day : function ( month, day, selected, today, invalid, overflow ) {
        var r = [ '<td>' ];
        r.push ( '<span class="day' );
        if ( today ) { r.push ( 'today' ); }
        if ( selected ) { r.push ( 'selected' ); }
        if ( invalid ) { r.push ( 'invalid' ); }
        r.push ( '">' );
        !overflow && r.push ( day );
        r.push ( '</span></td>' );
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
      , day = new DateHelper ( date ).startOfWeek ()
      , end = new DateHelper ( day.toDate () ).endOfMonth ().endOfWeek ()
      , month = []
      , week = []
      , w = 1
      , i = 1
      ;

    while ( day.date.getTime () <= end.date.getTime () && i < 50 ) {
      week.push ( this.options.render.day ( day.date.getMonth (), day.date.getDate (), false, false, false, day.date.getMonth () !== currentMonth ) );
      i++;
      if ( i % 7 === 0 ) {
        month.push ( this.options.render.week ( day.date.getMonth (), w++, week ) );
        week = [];
      }
      day.nextDay ();
    }

    return this.options.render.month ( currentMonth, month, this.options.render.header ( currentMonth ), this.options.render.footer () );
  }

  var Calendar = function ( options ) {
    options.render && (options.render = api.extend ( {}, defaultOptions.render, options.render ));
    this.options = api.extend ( {}, defaultOptions, options );
    this.eventbus = new EventBus ( this, ['create'], options );

    this.start = new DateHelper ( this.options.startDate ).zeroTime ();

    this.container = api.createElement ( 'div', { class : this.options.containerClass } );

    this.eventbus.fire ( 'create', this );
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

  return Calendar;

}(api));