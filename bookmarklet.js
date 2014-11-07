(function () {
    "use strict";

    var VERSION = '0.1';
    var OAUTH2_CLIENT_ID = '526967893145-n2me97upn32sd4ohpg11hh9949mr9chq.apps.googleusercontent.com';
    var OAUTH2_SCOPES = ['https://www.googleapis.com/auth/youtube'];

    var playlistId;

    (function(con) {
        var prop, method;
        var empty = {};
        var dummy = function() {};
        var properties = 'memory'.split(',');
        var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
            'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
            'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
        while (prop = properties.pop()) con[prop] = con[prop] || empty;
        while (method = methods.pop()) con[method] = con[method] || dummy;
    })(window.console = window.console || {});

    window.googleApiClientReady = function() {
        console.log('[abbml] Autobaza Bookmarklet', VERSION);

        if(window.location.href.indexOf("autobazaradio.ro") === -1) {
            alert("This only works on Autobaza Radio!");
            return;
        }

        gapi.auth.init(function() {
            window.setTimeout(checkAuth, 1);
        });
    };

    function checkAuth() {
        console.log('[abbml] Checking authentication');

        gapi.auth.authorize({
            client_id: OAUTH2_CLIENT_ID,
            scope: OAUTH2_SCOPES,
            immediate: true
        }, handleAuthResult);
    }

    function handleAuthResult(authResult) {
        console.log('[abbml] Auth result: %o', authResult);

        if (authResult && !authResult.error) {
            loadAPIClientInterfaces();
        } else {
            console.log('[abbml] Attempt OAuth2');

            gapi.auth.authorize({
                client_id: OAUTH2_CLIENT_ID,
                scope: OAUTH2_SCOPES,
                immediate: false
            }, handleAuthResult);
        }
    }

    function loadAPIClientInterfaces() {
        console.log('[abbml] Load GAPI YouTube');

        gapi.client.load('youtube', 'v3', function() {
            handleAPILoaded();
        });
    }

    function handleAPILoaded() {
        console.log('[abbml] GAPI YouTube successfully loaded');

        getPlaylist();
    }

    function getPlaylist() {
        console.log('[abbml] Retrieve "My Garage" playlist');

        var request = gapi.client.youtube.playlists.list({
            part: 'snippet',
            mine: true
        });

        request.execute(function(response) {
            var result = response.result;
            console.log('[abbml] Retrieval result: %o', result);

            if (result) {
                jQuery.each(result.items, function(i, item) {
                    if (item.snippet.title === 'My Garage') {
                        playlistId = item.id;
                    }
                });

                if (playlistId) {
                    searchVideo();
                } else {
                    createPlaylist();
                }
            } else {
                createPlaylist();
            }
        });
    }

    function createPlaylist() {
        console.log('[abbml] Create "My Garage" playlist');

        var request = gapi.client.youtube.playlists.insert({
            part: 'snippet,status',
            resource: {
                snippet: {
                    title: 'My Garage',
                    description: 'A private playlist created from Autobaza Radio'
                },
                status: {
                    privacyStatus: 'private'
                }
            }
        });

        request.execute(function(response) {
            var result = response.result;
            console.log('[abbml] Creation result: %o', result);

            if (result) {
                playlistId = result.id;
                console.log(result);

                searchVideo();
            } else {
                alert('Could not create playlist');
            }
        });
    }

    function searchVideo() {
        console.log('[abbml] Search video');

        var q = window.frames[0].window.md.innerHTML;
        console.log('[abbml] Query string:', q);

        var request = gapi.client.youtube.search.list({
            q: q,
            part: 'snippet'
        });

        request.execute(function(response) {
            var result = response.result;
            console.log('[abbml] Search results: %o', result);

            addToPlaylist(result.items[0].id.videoId);
        });
    }

    function addToPlaylist(id) {
        console.log('[abbml] Add video to playlist');

        var details = {
            videoId: id,
            kind: 'youtube#video'
        };

        var request = gapi.client.youtube.playlistItems.insert({
            part: 'snippet',
            resource: {
                snippet: {
                    playlistId: playlistId,
                    resourceId: details
                }
            }
        });

        request.execute(function(response) {
            var result = response.result;
            console.log('[abbml] Addition result: %o', result);
        });
    }
}());