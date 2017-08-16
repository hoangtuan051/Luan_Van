(function($) { // Begin jQuery
  $(function() {
    //search suggest
      $('.typeahead').typeahead({
          name: 'vocc',
          remote: 'http://localhost:3000/search?key=%QUERY',
          limit: 10,
          highlight: true
      });
    });
  })(jQuery);
