!function(){"use strict";function t(){gapi.auth.authorize({client_id:l,scope:c,immediate:!0},e)}function e(t){t&&!t.error?i():gapi.auth.authorize({client_id:l,scope:c,immediate:!1},e)}function i(){gapi.client.load("youtube","v3",function(){o()})}function o(){n()}function n(){var t=gapi.client.youtube.playlists.list({part:"snippet",mine:!0});t.execute(function(t){var e=t.result;e?(jQuery.each(e.items,function(t,e){"My Garage"===e.snippet.title&&(p=e.id)}),p?u():a()):alert("Could not retrieve playlists")})}function a(){var t=gapi.client.youtube.playlists.insert({part:"snippet,status",resource:{snippet:{title:"My Garage",description:"A private playlist created from Autobaza Radio"},status:{privacyStatus:"private"}}});t.execute(function(t){var e=t.result;e?(p=e.id,console.log(e),u()):alert("Could not create playlist")})}function u(){var t=window.frames[0].window.md.innerHTML,e=gapi.client.youtube.search.list({q:t,part:"snippet"});e.execute(function(t){console.log(t.result),r(t.result.items[0].id.videoId)})}function r(t){var e={videoId:t,kind:"youtube#video"},i=gapi.client.youtube.playlistItems.insert({part:"snippet",resource:{snippet:{playlistId:p,resourceId:e}}});i.execute(function(t){console.log(t.result)})}var s="0.1",l="526967893145-n2me97upn32sd4ohpg11hh9949mr9chq.apps.googleusercontent.com",c=["https://www.googleapis.com/auth/youtube"],p;window.googleApiClientReady=function(){return console.log("Autobaza Bookmarklet",s),-1===window.location.href.indexOf("autobazaradio.ro")?void alert("This only works on Autobaza Radio!"):void gapi.auth.init(function(){window.setTimeout(t,1)})}}();