(function() {
    window.loadBookmarklet =  function() {
        jQuery.getScript('http://localhost:5757/bookmarklet.js', function() {
            googleApiClientReady();
        });
    };

    jQuery('<script />').attr({
        src: '//apis.google.com/js/client.js?onload=loadBookmarklet',
        async: true,
        defer: true
    }).appendTo(document.head);
})();