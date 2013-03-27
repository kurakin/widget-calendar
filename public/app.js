
var monthNames = 'January February March April May June July August September October November December'.split ( ' ' )
  , dayHeader = '<tr><td>S</td><td>M</td><td>T</td><td>W</td><td>R</td><td>F</td><td>S</td></tr>'
  ;

// set up calendars on dom ready
$( function () {
  // check footer position
  var footer = $('footer');
  if ( (footer.offset ().top + footer.outerHeight ()) < $(document).height () ) {
    footer.css ({
      position : 'fixed'
    , bottom : 0
    });
  }

  var renderHeader = function ( month ) {
    return '<tr><th colspan=7>' + monthNames [ month ] + '</th></tr>' + dayHeader;
  };

  // .calendar-inline-single
  $('.calendar-inline-single').append (
    new Calendar ({
      render : {
        header : renderHeader
      }
    })
      .use ( Calendar.mixin.invalid )
      .use ( Calendar.mixin.selection )
      .select ( new DateHelper ().zeroTime ().nextFriday ().toDate () )
      .render ()
      .container
  );

  // .calendar-inline-dual
  $('.calendar-inline-dual').append (
    new Calendar ({
      months : 2
    , render : {
        header : renderHeader
      }
    })
      .use ( Calendar.mixin.invalid )
      .use ( Calendar.mixin.selection )
      .select ( new DateHelper ().zeroTime ().nextFriday ().toDate () )
      .render ()
      .container
  );

  // .calendar-inline-multi

  // .calendar-inline-paired

});

var createSingleCalendar = function () {

};

var createDualCalendar = function () {

};

var createMultiCalendar = function () {

};

var createPairedCalendar = function () {

};
