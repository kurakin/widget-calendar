
Calendar.mixin.invalid = ( function () {

  var Invalid = {}
    , today = new Date ().setHours ( 0, 0, 0, 0 );

  Invalid.options = {
    invalidClass : 'invalid'
  , invalid : function ( date ) {
      return date.getTime () < today;
    }
  , render : {
      day : function ( date, overflow, tdClass ) {
        var r = [ '<td class="day' ];
        tdClass && r.push ( ' ' ) && r.push ( tdClass );
        this.options.invalid ( date ) && r.push ( ' ' ) && r.push ( this.options.invalidClass );
        r.push ( '">' );
        if ( !overflow ) {
          r.push ( '<span>' );
          r.push ( date.getDate () );
          r.push ( '</span>' );
        }
        r.push ( '</td>' );
        return r.join ( '' );
      }
    }
  };

  return Invalid;

}());