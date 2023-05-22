

var photoPlayerHTML =`
<div id="photoContainer">
    <!-- <div id="photoTitle" style="text-align:center;">Photo Player</div> 
    -->
    <button id="auto_btn"   class="page_button" type="button">Auto</button> 
    <button id="next_btn"   class="page_button" type="button">Next</button> 
    <button id="cancel_btn" class="page_button" type="button">Cancel</button>

    <div id="photo_Node"></div>
</div>`;

function play_photo_files(obj, pn, callback, callback2) {
    console.log("________________ Play Photo _______________ ");

    pn.innerHTML = photoPlayerHTML;

    let iNode = document.createElement("IMG");
    iNode.style.width = "100%";
    //iNode.style.marginRight = "2px";
    //iNode.style.marginLeft  = "2px";

    let photoNode = document.getElementById("photo_Node");
    photoNode.appendChild(iNode);

    let image_url = server_url + "Items/"+obj.Id+"/Images/Primary?&api_key=" + api_key;
    iNode.src = image_url;  
   
    next_btn.onclick = function (event) {
        event.preventDefault();
        console.log("====== Next Photo ======");
        callback();
    };

    cancel_btn.onclick = function (event) {
        event.preventDefault();
        console.log("====== Cancel Photo ======");
        callback2();
    };

    auto_btn.onclick = function (event) {
        event.preventDefault();
        console.log("====== Auto Photo ======");
        //------------------------------------------

        // let dashboardTimerIndex;
        // if(dashboardTimerIndex) clearTimeout(dashboardTimerIndex);
        // dashboardTimerIndex = setTimeout(timerCallback, dashboardTimeout);

        //------------------------------------------
    };
};




var audioPlayerHTML =`
<div id="audioContainer" style="background-color:grey; color:white;">
<br>

<button id="next_btn" class="page_button">Next</button>
<button id="cancel_btn" class="page_button">Cancel</button>

<br>
<!-- <div class="playerTitle" style="font-size:35px; text-align:center">Audio Player</div> -->
<br>
<img id="audioImage" src="#" alt="Image" style = "float:left; margin-left:10px; margin-right:10px">
<div id="audioAlbum" style="font-size:25px"></div>
<div id="audioTitle" style="font-size:25px"></div>
<div id="audioGenre" style="font-size:25px"></div>
<div id="timeLength" style="font-size:25px"></div>
<br>
<!-- <div id="audioDisplayArea" ></div> -->
<audio id="audio1" controls autoplay>
    <source id="audioSource1" src="#" type="audio/mpeg">
    Your browser does not support the audio element.
</audio>
<div style="clear:both;"></div>  <!-- Stop float left -->
<br>
<br>            
</div>`;

function play_audio_files(play_obj, pn, callback, callback2) {
    console.log("________________ Play Audio _______________ ");

    // var AudioStreamIndex;
    var mediaSourceId;
    var mediaStreams;
    var playSessionId;
    var audioPlayId = play_obj.Id;

    //======================================================================================
    //  add audio player HTML
    //======================================================================================
    pn.innerHTML = audioPlayerHTML;

    //======================================================================================
    //  add audio event listeners
    //======================================================================================

    var myAudio = document.getElementById("audio1");

    myAudio.addEventListener('pause',          audioEvent);
    myAudio.addEventListener('play',           audioEvent);
    myAudio.addEventListener('playing',        audioEvent);
    myAudio.addEventListener('waiting',        audioEvent);
    myAudio.addEventListener('timeupdate',     audioTimeUpdate);

    myAudio.addEventListener('ended',          audioEnded);

    myAudio.addEventListener('seeked',         audioEvent);
    myAudio.addEventListener('seeking',        audioEvent);
    myAudio.addEventListener('volumechange',   audioEvent);
    myAudio.addEventListener('canplaythrough', audioEvent);
    myAudio.addEventListener('canplay',        audioEvent);
    myAudio.addEventListener('stalled',        audioEvent);
    myAudio.addEventListener('error',          audioEvent);
    myAudio.addEventListener('progress',       audioProgress);
    myAudio.addEventListener('loadstart',      audioEvent);
    myAudio.addEventListener('suspend',        audioEvent);

    var timeOld = 0;

    playAudioHLS(play_obj);
  
    //-----------------------------------------------------------------------
    //                 Next
    //-----------------------------------------------------------------------
    next_btn.onclick = function (event) {
        event.preventDefault();
        console.log("====== next clicked ======");

        stop_audio();
        terminate();

        callback();
    };

    //-----------------------------------------------------------------------
    //                 Cancel
    //-----------------------------------------------------------------------
    cancel_btn.onclick = function (event) {
        event.preventDefault();
        console.log("====== cancel clicked ======");

        stop_audio();
        terminate();

        callback2();
    };

    //-----------------------------------------------------------------------
    function audioProgress(e) {
        console.log( ">>> Audio: Progress" );
    };

    //-----------------------------------------------------------------------
    function audioTimeUpdate(e) {
        let time = myAudio.currentTime;
        //console.log( ">>> Audio: Time Update = "+time );
        if ( ((time - timeOld) > 10) || (timeOld==0) ) {
            //console.log("Send time update = "+time);
            timeOld = time;
            sendAudioPlayProgress();
        };
    };

    //-----------------------------------------------------------------------
    function audioEvent(e) {
        let message = ">>> Audio: "+e.type;
        //console.log( message );
    };

    //---------------------------------------------
    // event listener for end of audio
    //---------------------------------------------
    function audioEnded(e) {
        e.preventDefault();
        console.log("_________________ End of Audio _______________");

        stop_audio();
        terminate();

        callback();
    };

    //-----------------------------------------------------------------------
    function stop_audio() {
        console.log("________________ Cancel Audio ________________");

        let currentTicks  = (myAudio.currentTime * 10000000).toFixed(0);  // one tick is 10 microseconds
        let currentVolume = myAudio.volume * 10;
        //
        // turn the audio player off, and remove the html text info
        //
        let s2 = document.getElementById("audioSource1");
        s2.src = "#";
        myAudio.load();
        //
        // send a stop message to the server to stop the streaming
        //
        let audioStopBody = {
                        "VolumeLevel": currentVolume,
                        "IsMuted": false,
                        "IsPaused": true,
                        "RepeatMode": "RepeatNone",
                        "SubtitleOffset": 0,
                        "PlaybackRate": 1,
                        "MaxStreamingBitrate": 140000000,
                        "PositionTicks": currentTicks,
                        "PlaybackStartTimeTicks": 16449447833040000,
                        "SubtitleStreamIndex": -1,
                        "BufferedRanges": [],
                        "PlayMethod": "Transcode",
                        "PlaySessionId": playSessionId,
                        "MediaSourceId": mediaSourceId,
                        "CanSeek": true,
                        "ItemId": audioPlayId,   //<--------------------<<<<<<<<
                        "PlaylistIndex": 0,
                        "PlaylistLength": 0,
                        "NextMediaType": null,
                        "NowPlayingQueue": []
                    };

        let audioStopURL = server_url+"Sessions/Playing/Stopped?"+
                                        "X-Emby-Client="+myDevice.Client+
                                        "&X-Emby-Device-Name="+myDevice.DeviceName+
                                        "&X-Emby-Device-Id="+deviceId+
                                        "&X-Emby-Client-Version="+myDevice.ApplicationVersion+
                                        "&X-Emby-Token="+api_key;

        upload(audioStopURL, audioStopBody);
    };

    function terminate() {
        myAudio.removeEventListener('pause',          audioEvent);
        myAudio.removeEventListener('play',           audioEvent);
        myAudio.removeEventListener('playing',        audioEvent);
        myAudio.removeEventListener('waiting',        audioEvent);
        myAudio.removeEventListener('timeupdate',     audioTimeUpdate);
        myAudio.removeEventListener('ended',          audioEnded);
        myAudio.removeEventListener('seeked',         audioEvent);
        myAudio.removeEventListener('seeking',        audioEvent);
        myAudio.removeEventListener('volumechange',   audioEvent);
        myAudio.removeEventListener('canplaythrough', audioEvent);
        myAudio.removeEventListener('canplay',        audioEvent);
        myAudio.removeEventListener('stalled',        audioEvent);
        myAudio.removeEventListener('error',          audioEvent);
        myAudio.removeEventListener('progress',       audioProgress);
        myAudio.removeEventListener('loadstart',      audioEvent);
        myAudio.removeEventListener('suspend',        audioEvent);
    };

    //---------------------------------------------------------------------------------
    //            send progress messages to the server every 3 seconds
    //---------------------------------------------------------------------------------
    function sendAudioPlayProgress() {
        console.log("-------- Send Audio Progress --------");

        let currentTicks   = (myAudio.currentTime * 10000000).toFixed(0);  // one tick is 10 microseconds
        let currentVolume  = myAudio.volume * 10;
        let timeRange      = myAudio.buffered;
        //let numberOfRanges = timeRange.length;
        //let index = 0;
        //let timeRangeStart = timeRange.start(index);
        //let timeRangeEnd   = timeRange.end(index);

        //console.log("=== buffer start = "+timeRangeStart+", end = "+timeRangeEnd+", volume = "+currentVolume);

        let audioProgressBody = {
            "VolumeLevel": currentVolume,
            "IsMuted": false,
            "IsPaused": false,
            "RepeatMode": "RepeatNone",
            "SubtitleOffset": 0,
            "PlaybackRate": 1,
            "MaxStreamingBitrate": 140000000,
            "PositionTicks": currentTicks,
            "PlaybackStartTimeTicks": 0,
            "SubtitleStreamIndex": -1,
            // "BufferedRanges": [
            //                         {
            //                         "start": timeRangeStart, 
            //                         "end": timeRangeEnd          
            //                         }
            //                     ],
            "PlayMethod": "Transcode",
            "PlaySessionId": playSessionId,
            "MediaSourceId": mediaSourceId,
            "CanSeek": true,
            "ItemId": audioPlayId,                //<--------------------<<<<<<<<
            "EventName": "timeupdate",
            "PlaylistIndex": 0,
            "PlaylistLength": 0
        };
        let audioProgressURL = server_url+ "Sessions/Playing/Progress?"+
                                            "X-Emby-Client="+myDevice.Client+
                                            "&X-Emby-Device-Name="+myDevice.DeviceName+
                                            "&X-Emby-Device-Id="+deviceId+
                                            "&X-Emby-Client-Version="+myDevice.ApplicationVersion+
                                            "&X-Emby-Token="+api_key+
                                            "&reqformat=json";

        upload(audioProgressURL, audioProgressBody);
    };

    //======================================================================================
    //
    //======================================================================================
    function playAudioHLS (mediaObj) {

        console.log(">>> Play Audio Media Obj = ",mediaObj);
        // get the URL for the video to play
        let Id  = mediaObj["Id"];
        // playback info url
        upload(get_url_1(Id),get_body_1(), onCompleteAudioInfo, mediaObj);
    };

    function onCompleteAudioInfo (playbackInfo, mediaObj) {
        //if(playbackInfo == "Bad POST") return;

        console.log("=== Playback Info = ", playbackInfo);

        AudioStreamIndex = 1;
        mediaSourceId    = playbackInfo.MediaSources[0].Id;
        mediaStreams     = playbackInfo.MediaSources[0].MediaStreams;
        playSessionId    = playbackInfo.PlaySessionId;
        audioPlayId      = mediaObj["Id"];

        if(mediaStreams.length==0) {
            console.log(">>> Error, No Media Streams");
            //var msg = document.getElementById("errorMsgPlayback");
            //msg.innerHTML = "This video has no Media Streams";
            //var Id = mediaObj.MediaSources[0].Id;
            return;
        };

        console.log("________________ Start Play Audio _______________ "+audioPlayId);
        //
        // go play the audio
        //
        //var url = server_url+"Audio/"+Id+"/stream?Container=mp3&AudioCodec=mp3&AudioChannels=2&MaxAudioChannels=2&api_key="+api_key;
        let url_2 = server_url+"Items?Ids="+audioPlayId+"&api_key="+api_key;
        download(url_2, playAudioFile);

        //---------------------------------------------------------------------------------
        //
        //---------------------------------------------------------------------------------
        function playAudioFile(obj) {
            console.log("________________ Play Audio Obj ______________", obj);

            let mediaObj = obj.Items[0];
            let Id = mediaObj.Id;

            let PrimaryImageTag = mediaObj.ImageTags.Primary;
            //
            // add image
            //
            let image_url = server_url+"Items/"+Id+"/Images/Primary?maxHeight=300&maxWidth=200&tag="+PrimaryImageTag+"&quality=90";
            let s1 = document.getElementById("audioImage");
            s1.src = (PrimaryImageTag) ? image_url : getDefaultImage();
            //
            // add album and title
            //
            var index = mediaObj.IndexNumber;
            var album = mediaObj.Album;
            var title = mediaObj.Name;

            document.getElementById("audioAlbum").innerHTML = "Album: "+album;
            document.getElementById("audioTitle").innerHTML = "Title: "+title+"<br>Position in Album: "+index;
            //
            //  add genres
            //
            var s = "";
            var genres = mediaObj.GenreItems;
            if(genres) {
            genres.map( (g) => { s += g.Name+", "; } );
            if(s!="") s = "Genre: "+s.slice(0,-2); else s = "No Genre Given";
            document.getElementById("audioGenre").innerHTML = s;
            };
            //
            // add time length
            //
            var time = mediaObj.RunTimeTicks;  // get the programs time in 10 micorsecond steps
            time = (time / 10000000) / 60;     // put time in minutes
            time = time.toFixed(1);            // number of decimal points
            document.getElementById("audioGenre").innerHTML = "Time: "+time+" minutes";

            console.log("-------- Tell Server what's Playing --------");
            //
            // tell the server what you are playing
            //
            upload( get_url_2(deviceId), get_body_2(playSessionId, mediaSourceId, Id) );
            //
            // play the audio file
            //
            let s2 = document.getElementById("audioSource1");
            s2.src = server_url+"Audio/"+Id+"/stream?Container=mp3&AudioCodec=mp3&AudioChannels=2&MaxAudioChannels=2&api_key="+api_key;
            myAudio.load();
            myAudio.play();
        };
    };
};





