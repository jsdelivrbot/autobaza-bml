Autobaza Radio Bookmarklet
============

Date: 06/11/2014  
Version: 0.1

Drag the following link to bookmarks bar:

<a href='javascript:(function(){window.loadBookmarklet=function(){jQuery.getScript("https://cdn.jsdelivr.net/gh/kristache/autobaza-bml@master/min/bookmarklet-min.js",function(){googleApiClientReady()})},jQuery("<script />").attr({src:"//apis.google.com/js/client.js?onload=loadBookmarklet",async:!0,defer:!0}).appendTo(document.head)}())'>Add to Garage</a>

How can you not love simplicity? :)