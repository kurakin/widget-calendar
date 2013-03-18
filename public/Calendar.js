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
      day : function ( month, day, selected, today, invalid ) {
        var r = [ '<td>' ];
        r.push ( '<span class="day' );
        if ( today ) { r.push ( 'today' ); }
        if ( selected ) { r.push ( 'selected' ); }
        if ( invalid ) { r.push ( 'invalid' ); }
        r.push ( '">' );
        r.push ( day );
        r.push ( '</span></td>' );
        return r.join ( '' );
      }
    , week : function ( month, week, firstDay, lastDay, days ) {
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
    , pretext : function () {}
    , posttext : function () {}
    }
  };

  var renderMonth = function ( date ) {
    var day = new DateHelper ( date )
      , r = []
      ;

    for ( var w = 0; w < 5; w++ ) {
      var week = [];
      for ( var d = 0; d < 7; d++ ) {
        week.push ( this.options.render.day ( 0, d, false, false, false ) );
      }
      r.push ( this.options.render.week ( 0, w, 1, 7, week ) );
    }

    return this.options.render.month ( 0, r, this.options.render.header ( day.date.getMonth () ), this.options.render.footer () );
  }

  var Calendar = function ( options ) {
    options.render && (options.render = api.extend ( {}, defaultOptions.render, options.render ));
    this.options = api.extend ( {}, defaultOptions, options );
    this.eventbus = new EventBus ( this, ['create'], options );

    this.start = new DateHelper ( this.options.startDate );

    this.container = api.createElement ( 'div', { class : this.options.containerClass } );

    this.eventbus.fire ( 'create', this );
  };

  Calendar.prototype.render = function () {
    var months = [];
    for ( var n = 0; n < this.options.months; n++ ) {
      months.push ( renderMonth.call ( this, this.start.nextMonth ( n ).toDate () ) );
    }
    this.container.innerHTML = months.join ( '' );
    return this;
  };

  return Calendar;

}(api));