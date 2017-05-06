
      // 2. This code loads the widget API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "http://youglish.com/public/emb/widget.js";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates a widget after the API code downloads.
      var widget;
      function onYouglishAPIReady(){
        widget = new YG.Widget("widget-1", {
          width: 480,
          height:480,
          components:72, //search box & caption 
          events: {
            'onSearchDone': onSearchDone,
            'onVideoChange': onVideoChange,
            'onCaptionConsumed': onCaptionConsumed
          }          
        });
        // 4. process the query
        widget.search("aback","ALL");
      }

     
      var views = 0, curTrack = 0, totalTracks = 0;
    
      // 5. The API will call this method when the search is done
      function onSearchDone(event){
        if (event.totalResult === 0)   alert("No result found");
        else totalTracks = event.totalResult; 
      }
         
      // 6. The API will call this method when switching to a new video. 
      function onVideoChange(event){
        curTrack = event.trackNumber;
        views = 0;
      }
         
      // 7. The API will call this method when a caption is consumed. 
      function onCaptionConsumed(event){
          if (curTrack < totalTracks)  
            widget.next();
      }
