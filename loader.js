(function() {
    window.loadBookmarklet =  function() {
        jQuery.getScript('https://rawgit.com/kristache/autobaza-bml/master/min/bookmarklet-min.js', function() {
            googleApiClientReady();
        });
    };

    jQuery('<script />').attr({
        src: '//apis.google.com/js/client.js?onload=loadBookmarklet',
        async: true,
        defer: true
    }).appendTo(document.head);
})();