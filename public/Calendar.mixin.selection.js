
Calendar.mixin.selection = ( function (api) {

  var select = function ( d ) {
    this.selected && api.removeClass ( this.days [ this.selected ], this.options.selectedClass );
    this.selected = d;
    this.days && api.addClass ( this.days [ d ], this.options.selectedClass );
    return this;
  };

  var Selection = {};

  Selection.options = {
    selectedClass : 'selected'
  };

  // TODO improve setOptions mixin to do this automatically so it can be moved to the mixin options to be overridden
  Selection.init = function () {
    var renderDay = this.options.render.day;
    this.options.render.day = function ( date, overflow, tdClass ) {
      this.selected && this.selected === date.getTime ().toString () && (tdClass = (tdClass || '') + ' ' + this.options.selectedClass );
      return renderDay.call ( this, date, overflow, tdClass );
    };

    var render = this.render;
    this.render = function () {
      render.call ( this );
      for ( var d in this.days ) {
        if ( this.days.hasOwnProperty ( d ) ) {
          api.addEvent ( this.days [ d ], 'click', api.bind ( select, this, d ) );
        }
      }
      return this;
    };
  };

  Selection.select = function ( date ) {
    return select.call ( this, date.getTime ().toString () );
  };

  return Selection;

}(api));