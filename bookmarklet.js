(function () {
    "use strict";

    var VERSION = '0.1';
    var OAUTH2_CLIENT_ID = '526967893145-n2me97upn32sd4ohpg11hh9949mr9chq.apps.googleusercontent.com';
    var OAUTH2_SCOPES = ['https://www.googleapis.com/auth/youtube'];

    var playlistId;

    window.googleApiClientReady = function() {
        console.log('Autobaza Bookmarklet', VERSION);

        if(window.location.href.indexOf("autobazaradio.ro") === -1) {
            alert("This only works on Autobaza Radio!");
            return;
        }

        gapi.auth.init(function() {
            window.setTimeout(checkAuth, 1);
        });
    };

    function checkAuth() {
        gapi.auth.authorize({
            client_id: OAUTH2_CLIENT_ID,
            scope: OAUTH2_SCOPES,
            immediate: true
        }, handleAuthResult);
    }

    function handleAuthResult(authResult) {
        if (authResult && !authResult.error) {
            loadAPIClientInterfaces();
        } else {
            gapi.auth.authorize({
                client_id: OAUTH2_CLIENT_ID,
                scope: OAUTH2_SCOPES,
                immediate: false
            }, handleAuthResult);
        }
    }

    function loadAPIClientInterfaces() {
        gapi.client.load('youtube', 'v3', function() {
            handleAPILoaded();
        });
    }

    function handleAPILoaded() {
        createPlaylist();
    }

    function createPlaylist() {
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
        var q = window.frames[0].window.md.innerHTML;
        var request = gapi.client.youtube.search.list({
            q: q,
            part: 'snippet'
        });

        request.execute(function(response) {
            console.log(response.result);

            addToPlaylist(response.result.items[0].id.videoId);
        });
    }

    function addToPlaylist(id) {
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
            console.log(response.result);
        });
    }
}());