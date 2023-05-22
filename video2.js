


var trailerPlayerHTML =`
<div id="trailerContainer">
    <div id="trailerTitle" style="text-align:center">Trailer</div>
    <div id="trailerPath"  style="text-align:center">Trailer Path</div>

    <button id="trailerBtn" class="page_button" type="button">⏎ Return</button><br> 

    <!-- <video id="trailerVideo" width="100%" playsinline controls preload="auto" crossOrigin='anonymous' > -->
    <video id="trailerVideo" width="100%" playsinline controls preload="auto" >
        <source type="video/mp4">
        Your browser does not support HTML5 video.
    </video>
</div>`;



var videoPlayerHTML =`
<div id="videoContainer">
    <div id="videoTitle" style="text-align:center">Video</div>
    <div id="videoTopArea"></div>

    <!-- <video class="video1" width="100%" id="video1" playsinline controls autoplay preload="auto" crossOrigin='anonymous' ></video> -->

    <video id="video1" width="100%" class="video1" playsinline controls autoplay preload="auto" ></video>

    <source id="source1" src="#" ></source>
    <div id="videoBottomArea"></div>
</div>`;




var hls = null;

//-----------------------------------------------------------------------------------
//
// stopped body
//
function get_body_4(playSessionId, mediaSourceId, Id, positionTicks) {

    var stoppedBody = {
                        "VolumeLevel": videoVolume,                   
                        "IsMuted": false,
                        "IsPaused": true,
                        "RepeatMode": "RepeatNone",
                        "SubtitleOffset": 0,
                        "PlaybackRate": 1,
                        "MaxStreamingBitrate": 7000000,
                        "PositionTicks": + positionTicks,
                        "PlaybackStartTimeTicks": 0,
                        "SubtitleStreamIndex": -1,
                        "AudioStreamIndex": 1,
                        "BufferedRanges": [],
                        "PlayMethod": "Transcode",
                        "PlaySessionId": + playSessionId,
                        "MediaSourceId": + mediaSourceId,
                        "CanSeek": true,
                        "ItemId": Id,
                        "PlaylistIndex": 0,
                        "PlaylistLength": 1,
                        "NextMediaType": null,
                        "NowPlayingQueue": []
                        };
    return stoppedBody;
};
//
// stopped url
//
function get_url_4(deviceId) {

    var stoppedUrl = server_url+"Sessions/Playing/Stopped?"+
                                "X-Emby-Client="+myDevice.Client+
                                "&X-Emby-Device-Name="+myDevice.DeviceName+
                                "&X-Emby-Device-Id="+deviceId+
                                "&X-Emby-Client-Version="+myDevice.ApplicationVersion+
                                "&X-Emby-Token="+api_key;
    return stoppedUrl;
};
//-----------------------------------------------------------------------------------
//
// olaying progress body
//
function get_body_3(playSessionId, mediaSourceId, Id, positionTicks) {

    let progressBody = {
            "VolumeLevel": videoVolume,                                 
            "IsMuted": false,
            "IsPaused": false,
            "RepeatMode": "RepeatNone",
            "SubtitleOffset": 0,
            "PlaybackRate": 1,
            "MaxStreamingBitrate": 7000000,
            "PositionTicks": positionTicks,
            "PlaybackStartTimeTicks": 16446994532700000,
            "SubtitleStreamIndex": -1,
            "AudioStreamIndex": 1,
            "PlayMethod": "Transcode",
            "PlaySessionId": playSessionId,
            "MediaSourceId": mediaSourceId,
            "CanSeek": true,
            "ItemId": Id,
            "EventName": "timeupdate",
            "PlaylistIndex": 0,
            "PlaylistLength": 1
        };

    return progressBody;
};
//
//  playing progress URL
//
function get_url_3(deviceId) {

    var progress_url = server_url+"Sessions/Playing/Progress?"+
                                "X-Emby-Client="+myDevice.Client+
                                "&X-Emby-Device-Name="+myDevice.DeviceName+
                                "&X-Emby-Device-Id="+deviceId+
                                "&X-Emby-Client-Version="+myDevice.ApplicationVersion+
                                "&X-Emby-Token="+api_key+
                                "&reqformat=json";
    return progress_url;
};
//-----------------------------------------------------------------------------------
//
// playing body
//
function get_body_2(playSessionId, mediaSourceId, Id) {

    let playingBody = {
        "VolumeLevel": videoVolume,                                    
        "IsMuted": false,
        "IsPaused": false,
        "RepeatMode": "RepeatNone",
        "PlaybackRate": 1,
        "MaxStreamingBitrate": 7000000,
        "PositionTicks": 0,
        "PlaybackStartTimeTicks": 16446994532700000,         
        "SubtitleStreamIndex": -1,
        "AudioStreamIndex": 1,
        "PlayMethod": "Transcode",
        "PlaySessionId": playSessionId,
        "MediaSourceId": mediaSourceId,
        "CanSeek": true,
        "ItemId": Id,
        "PlaylistIndex": 0,
        "PlaylistLength": 1,
        "NowPlayingQueue": [
                                {
                                    "Id": Id,
                                    "PlaylistItemId": "playlistItem1"
                                }
                            ]
        };

        return playingBody;
};
//
// playing url
//
function get_url_2(deviceId) {

    let playing_url = server_url + "Sessions/Playing?"+
                                    "X-Emby-Client="+myDevice.Client+
                                    "&X-Emby-Device-Name="+myDevice.DeviceName+
                                    "&X-Emby-Device-Id="+deviceId+
                                    "&X-Emby-Client-Version="+myDevice.ApplicationVersion+
                                    "&X-Emby-Token="+api_key;
    return playing_url;
};
//-----------------------------------------------------------------------------------
//
// playback info body
//
function get_body_1() {
    let xyz =   {
        "DeviceProfile": {
                            "MaxStaticBitrate": 140000000,
                            "MaxStreamingBitrate": 140000000,
                            "MusicStreamingTranscodingBitrate": 192000,
                            "DirectPlayProfiles":  [
                                                        {
                                                            "Container": "mp4,m4v",
                                                            "Type": "Video",
                                                            "VideoCodec": "h264,vp8,vp9",
                                                            "AudioCodec": "mp3,aac,opus,flac,vorbis"
                                                        },
                                                        {
                                                            "Container": "mkv",
                                                            "Type": "Video",
                                                            "VideoCodec": "h264,vp8,vp9",
                                                            "AudioCodec": "mp3,aac,opus,flac,vorbis"
                                                        },
                                                        {
                                                            "Container": "flv",
                                                            "Type": "Video",
                                                            "VideoCodec": "h264",
                                                            "AudioCodec": "aac,mp3"
                                                        },
                                                        {
                                                            "Container": "mov",
                                                            "Type": "Video",
                                                            "VideoCodec": "h264",
                                                            "AudioCodec": "mp3,aac,opus,flac,vorbis"
                                                        },
                                                        {
                                                            "Container": "opus",
                                                            "Type": "Audio"
                                                        },
                                                        {
                                                            "Container": "mp3",
                                                            "Type": "Audio",
                                                            "AudioCodec": "mp3"
                                                        },
                                                        {
                                                            "Container": "mp2,mp3",
                                                            "Type": "Audio",
                                                            "AudioCodec": "mp2"
                                                        },
                                                        {
                                                            "Container": "aac",
                                                            "Type": "Audio",
                                                            "AudioCodec": "aac"
                                                        },
                                                        {
                                                            "Container": "m4a",
                                                            "AudioCodec": "aac",
                                                            "Type": "Audio"
                                                        },
                                                        {
                                                            "Container": "mp4",
                                                            "AudioCodec": "aac",
                                                            "Type": "Audio"
                                                        },
                                                        {
                                                            "Container": "flac",
                                                            "Type": "Audio"
                                                        },
                                                        {
                                                            "Container": "webma,webm",
                                                            "Type": "Audio"
                                                        },
                                                        {
                                                            "Container": "wav",
                                                            "Type": "Audio",
                                                            "AudioCodec": "PCM_S16LE"
                                                        },
                                                        {
                                                            "Container": "ogg",
                                                            "Type": "Audio"
                                                        },
                                                        {
                                                            "Container": "webm",
                                                            "Type": "Video",
                                                            "AudioCodec": "vorbis,opus",
                                                            "VideoCodec": "VP8,VP9"
                                                        }
                                                ],
                            "TranscodingProfiles": [
                                                    {
                                                        "Container": "aac",
                                                        "Type": "Audio",
                                                        "AudioCodec": "aac",
                                                        "Context": "Streaming",
                                                        "Protocol": "hls",
                                                        "MaxAudioChannels": "2",
                                                        "MinSegments": "1",
                                                        "BreakOnNonKeyFrames": true
                                                    },
                                                    {
                                                        "Container": "aac",
                                                        "Type": "Audio",
                                                        "AudioCodec": "aac",
                                                        "Context": "Streaming",
                                                        "Protocol": "http",
                                                        "MaxAudioChannels": "2"
                                                    },
                                                    {
                                                        "Container": "mp3",
                                                        "Type": "Audio",
                                                        "AudioCodec": "mp3",
                                                        "Context": "Streaming",
                                                        "Protocol": "http",
                                                        "MaxAudioChannels": "2"
                                                    },
                                                    {
                                                        "Container": "opus",
                                                        "Type": "Audio",
                                                        "AudioCodec": "opus",
                                                        "Context": "Streaming",
                                                        "Protocol": "http",
                                                        "MaxAudioChannels": "2"
                                                    },
                                                    {
                                                        "Container": "wav",
                                                        "Type": "Audio",
                                                        "AudioCodec": "wav",
                                                        "Context": "Streaming",
                                                        "Protocol": "http",
                                                        "MaxAudioChannels": "2"
                                                    },
                                                    {
                                                        "Container": "opus",
                                                        "Type": "Audio",
                                                        "AudioCodec": "opus",
                                                        "Context": "Static",
                                                        "Protocol": "http",
                                                        "MaxAudioChannels": "2"
                                                    },
                                                    {
                                                        "Container": "mp3",
                                                        "Type": "Audio",
                                                        "AudioCodec": "mp3",
                                                        "Context": "Static",
                                                        "Protocol": "http",
                                                        "MaxAudioChannels": "2"
                                                    },
                                                    {
                                                        "Container": "aac",
                                                        "Type": "Audio",
                                                        "AudioCodec": "aac",
                                                        "Context": "Static",
                                                        "Protocol": "http",
                                                        "MaxAudioChannels": "2"
                                                    },
                                                    {
                                                        "Container": "wav",
                                                        "Type": "Audio",
                                                        "AudioCodec": "wav",
                                                        "Context": "Static",
                                                        "Protocol": "http",
                                                        "MaxAudioChannels": "2"
                                                    },
                                                    {
                                                        "Container": "mkv",
                                                        "Type": "Video",
                                                        "AudioCodec": "mp3,aac,opus,flac,vorbis",
                                                        "VideoCodec": "h264,vp8,vp9",
                                                        "Context": "Static",
                                                        "MaxAudioChannels": "2",
                                                        "CopyTimestamps": true
                                                    },
                                                    {
                                                        "Container": "ts",
                                                        "Type": "Video",
                                                        "AudioCodec": "mp3,aac",
                                                        "VideoCodec": "h264",
                                                        "Context": "Streaming",
                                                        "Protocol": "hls",
                                                        "MaxAudioChannels": "2",
                                                        "MinSegments": "1",
                                                        "BreakOnNonKeyFrames": true,
                                                        "ManifestSubtitles": "vtt"
                                                    },
                                                    {
                                                        "Container": "webm",
                                                        "Type": "Video",
                                                        "AudioCodec": "vorbis",
                                                        "VideoCodec": "vpx",
                                                        "Context": "Streaming",
                                                        "Protocol": "http",
                                                        "MaxAudioChannels": "2"
                                                    },
                                                    {
                                                        "Container": "mp4",
                                                        "Type": "Video",
                                                        "AudioCodec": "mp3,aac,opus,flac,vorbis",
                                                        "VideoCodec": "h264",
                                                        "Context": "Static",
                                                        "Protocol": "http"
                                                    }
                                                ],

                            "ContainerProfiles": [],
                            "CodecProfiles": [
                                                {
                                                    "Type": "VideoAudio",
                                                    "Codec": "aac",
                                                    "Conditions": [
                                                    {
                                                        "Condition": "Equals",
                                                        "Property": "IsSecondaryAudio",
                                                        "Value": "false",
                                                        "IsRequired": "false"
                                                    }
                                                    ]
                                                },
                                                {
                                                    "Type": "VideoAudio",
                                                    "Conditions": [
                                                    {
                                                        "Condition": "Equals",
                                                        "Property": "IsSecondaryAudio",
                                                        "Value": "false",
                                                        "IsRequired": "false"
                                                    }
                                                    ]
                                                },
                                                {
                                                    "Type": "Video",
                                                    "Codec": "h264",
                                                    "Conditions": [
                                                    {
                                                        "Condition": "EqualsAny",
                                                        "Property": "VideoProfile",
                                                        "Value": "high|main|baseline|constrained baseline|high 10",
                                                        "IsRequired": false
                                                    },
                                                    {
                                                        "Condition": "LessThanEqual",
                                                        "Property": "VideoLevel",
                                                        "Value": "52",
                                                        "IsRequired": false
                                                    }
                                                    ]
                                                }
                                            ],
                            "SubtitleProfiles": [
                                                    {
                                                        "Format": "vtt",
                                                        "Method": "Hls"
                                                    },
                                                    {
                                                        "Format": "vtt",
                                                        "Method": "External"
                                                    },
                                                    {
                                                        "Format": "ass",
                                                        "Method": "External"
                                                    },
                                                    {
                                                        "Format": "ssa",
                                                        "Method": "External"
                                                    }
                                                ],
                            "ResponseProfiles": [
                                                    {
                                                        "Type": "Video",
                                                        "Container": "m4v",
                                                        "MimeType": "video/mp4"
                                                    }
                                                ]
                        }
        };
    return xyz;     // return the structure created
};
//
// playback info url
//
function get_url_1(Id) {

    var url_1 = server_url +  "Items/"+Id+"/PlaybackInfo?"+
                            "UserId="+user_id+
                            "&StartTimeTicks=0"+
                            "&IsPlayback=true"+
                            "&AutoOpenLiveStream=true"+
                            "&MaxStreamingBitrate=140000000"+
                            "&X-Emby-Client="+myDevice.Client+
                            "&X-Emby-Device-Name="+myDevice.DeviceName+
                            "&X-Emby-Device-Id="+deviceId+
                            "&X-Emby-Client-Version="+myDevice.ApplicationVersion+
                            "&X-Emby-Token="+api_key+
                            "&reqformat=json";
    return url_1;
};
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------

//var snapshotCnt = 0;
var snapshots = [];

var previousTimerTickPosition = 0;
var videoVolume = 25;                // set volume to 25%

//var videoPlayURL;

//======================================================================================
//
//
//                      fetch video from id and play it
//
//
//======================================================================================
function play_video_files(id, pn, callback, callback2) {

    console.log("\n\n\n============ Play Video Files ============",id);

    let videoPlayURL = server_url+"Users/"+user_id+"/Items/"+id+"?api_key="+api_key;
    download(videoPlayURL, playVideoHLS, [pn, callback, callback2, 0]); 
};

var videoMediaObj;
var videoParams;


    //-----------------------------------------------------------------------
    //
    //                        play video object
    //
    //-----------------------------------------------------------------------
    function playVideoHLS (mediaObj, params) {   
        
        videoMediaObj = mediaObj;
        videoParams   = params;

        var pn        = params[0];
        var callback  = params[1];
        var callback2 = params[2];
        var btnChoice = params[3];

        console.log("\n\n\n________________________ Play Video ________________________ ",mediaObj);

        if(mediaObj.IsFolder) {
            console.log("=== exit - obj is a folder ===");
            if(modal_1) modal_1.style.display = "none";
            callback();
            return;
        };
        previousTimerTickPosition = 0;

        // get the Id for the URL for the video to play
        var Id = mediaObj["Id"];

        //
        // get playbackInfo - this info is needed by the m3u8 URL
        //
        upload(get_url_1(Id), get_body_1(), onCompletePlayInfo);




        function onCompletePlayInfo (playbackInfo) {

            if(!playbackInfo) return;

            console.log("=== Playback Info = ", playbackInfo);
            //--------------------------------------------------------------
            //
            //                   video playback info
            //
            var AudioStreamIndex = 1;
            var playSessionId    = playbackInfo.PlaySessionId;
            var name             = mediaObj.Name;
            var mediaSources     = playbackInfo.MediaSources;
            var mediaStreams     = (mediaSources) ? mediaSources[0].MediaStreams : [];
            var mediaSourceId    = mediaSources[0].Id;
            var path             = mediaSources[0].Path;
            var LiveStreamId     = (playbackInfo.MediaSources) ? playbackInfo.MediaSources[0].LiveStreamId : false;
            //--------------------------------------------------------------
            //
            //                 clear the DOM page node
            //
            //--------------------------------------------------------------
            // pn =videoPN
            
            while (pn.firstChild) { pn.firstChild.remove(); };
            //while (sn.firstChild) { sn.firstChild.remove(); };


            //--------------------------------------------------------------
            //
            //           check to see if the video is a trailer
            //
            //--------------------------------------------------------------
            if(mediaStreams.length==0) {
                pn.innerHTML = trailerPlayerHTML;
                console.log(">>> Play Trailer <<<");
                playTrailerVideo(name, path);
                return;
            } else
            if( mediaSources.length == 0 ) {
                console.log(">>> Error, No Media Sources <<<");
                return;
            };
            //--------------------------------------------------------------
            //
            //          add the player html to the page node
            //
            //--------------------------------------------------------------
            pn.innerHTML = videoPlayerHTML;

            videoTitle = document.getElementById("videoTitle");

            let ppn = document.getElementById("videoTopArea");
            while (ppn.firstChild) { ppn.firstChild.remove(); };

            if(btnChoice==0) {
                //----------------------------------------------------------
                // cancel Button
                //
                let s0_btn = document.createElement("BUTTON");
                s0_btn.classList.add('page_button');
                s0_btn.innerHTML = "Cancel";
                s0_btn.id = "cancel_btn";
                //sss_btn.style.marginLeft = "40%";
                ppn.appendChild(s0_btn);
            };
            //----------------------------------------------------------
            // language Button
            //
            let s1_btn = document.createElement("BUTTON");
            s1_btn.classList.add('page_button');
            s1_btn.innerHTML = "Language"
            s1_btn.id = "track_btn";
            //sss_btn.style.marginLeft = "40%";
            ppn.appendChild(s1_btn);

            //----------------------------------------------------------
            // Next/Done Button
            //
            let s2_btn = document.createElement("BUTTON");
            s2_btn.classList.add('page_button');
            s2_btn.innerHTML = (btnChoice==0) ? "Next" : "Done";
            s2_btn.id = (btnChoice==0) ? "next_btn" : "done_btn";
            //sss_btn.style.marginLeft = "40%";
            ppn.appendChild(s2_btn);


            if(btnChoice==0) {
                //-----------------------------------------------------------------------
                //
                //                 cancel movie loop
                //
                //-----------------------------------------------------------------------
                document.getElementById("cancel_btn").onclick = function (event) {
                    event.preventDefault();

                    console.log("====== Video Canceled - Return Clicked ======");
                    terminate("next cancelled",false);
                    callback2();
                };
                //-----------------------------------------------------------------------
                //
                //                 next movie
                //
                //-----------------------------------------------------------------------
                document.getElementById("next_btn").onclick = function (event) {
                    event.preventDefault();

                    console.log("====== Video Canceled - goto next movie ======");
                    terminate("next cancelled",false);
                    callback();
                };
            } else {
                //-----------------------------------------------------------------------
                //
                //                 done - exit movie
                //
                //-----------------------------------------------------------------------
                document.getElementById("done_btn").onclick = function (event) {
                    event.preventDefault();

                    console.log("====== Video Done - cancel movie ======");
                    terminate("next cancelled",false);
                    callback();
                };   
            };         
            //-----------------------------------------------------------------------
            //                Switch Languages
            //-----------------------------------------------------------------------
            track_btn.onclick = function (event) {  // switch to the next language
                //event.preventDefault();
                console.log("====== Next Track ======");
                AudioStreamIndex += 1;
                if(AudioStreamIndex > 4) AudioStreamIndex = 1;

                let url = server_url+"Videos/"+Id+"/main.m3u8?DeviceId="+deviceId+"&Container=mp4&AudioCodec=aac&MaxVideoBitDepth=8&VideoCodec=h264&AudioStreamIndex="+AudioStreamIndex+"&api_key="+api_key;
                video.pause();
                hls.stopLoad();
                hls.loadSource(url);
                hls.startLoad(1);

                video.play();
                video.currentTime = tempTime;
            };




            //--------------------------------------------------------------
            //
            //    add snapshots below the video playing
            //
            //--------------------------------------------------------------
            function doSnapshots() {
                let ppn = document.getElementById("videoBottomArea");
                while (ppn.firstChild) { ppn.firstChild.remove(); };
               
                let primaryImage;
                let backdropImages = [];

                //----------------------------------------------------------
                // Snapshot Button
                // let ss_btn = document.createElement("BUTTON");
                // ss_btn.classList.add('page_button');
                // ss_btn.innerHTML = "Snapshot";
                // ss_btn.id = "snapshotBtn";
                // ppn.appendChild(ss_btn);

                // Add 'make Primary' Button
                let ap_btn = document.createElement("BUTTON");
                ap_btn.classList.add('prev_page_button');
                ap_btn.innerHTML = "Primary SS";
                ap_btn.id = "addToPrimaryBtn";
                ppn.appendChild(ap_btn);

                // Add 'make Backdrop' Button
                let bd_btn = document.createElement("BUTTON");
                bd_btn.classList.add('prev_page_button');
                bd_btn.innerHTML = "Backdrop SS";
                bd_btn.id = "addToBackdropBtn";
                ppn.appendChild(bd_btn);



                // Add 'save primary' Button
                let pd_btn = document.createElement("BUTTON");
                pd_btn.classList.add('prev_page_button');
                pd_btn.innerHTML = "Apply Primary";
                pd_btn.id = "savePrimary";
                ppn.appendChild(pd_btn);

                // Add 'save backdrop' Button
                let db_btn = document.createElement("BUTTON");
                db_btn.classList.add('prev_page_button');
                db_btn.innerHTML = "Apply Backdrops";
                db_btn.id = "saveBackdrop";
                ppn.appendChild(db_btn);



                //ppn.appendChild( document.createElement("BR") );

                let ssp_label = document.createElement("Label")
                ssp_label.innerHTML = "<br><br>Primary Images<br>";
                ppn.appendChild( ssp_label );

                let ssp_div = document.createElement("DIV")
                ssp_div.id = "primary_snapshots";
                ppn.appendChild( ssp_div );

                let ssb_label = document.createElement("Label")
                ssb_label.innerHTML = "Backdrop Images<br>";
                ppn.appendChild( ssb_label );

                let ssb_div = document.createElement("DIV")
                ssb_div.id = "backdrop_snapshots";
                ppn.appendChild( ssb_div );

                //
                // click on ' Save Primary' button
                //
                pd_btn.onclick = function (event) {
                    if(primaryImage) {
                        prosess_picked_file (primaryImage, mediaObj.Id, OK, "Primary");

                        function OK(data){
                            console.log("=== Add to Primary OK");
                        };
                    };
                    primaryImage = undefined;
                };

                //
                // click on 'save backdrop' button
                //
                db_btn.onclick = function (event) {
                    backdropImages.forEach( (image) => {
                        prosess_picked_file (image, mediaObj.Id, OK, "Backdrop");

                        function OK(data){
                            console.log("=== Add to Backdrops OK");
                        };
                    });
                    backdropImages = [];
                };

                //
                // click on 'make Primary' button
                //
                ap_btn.onclick = function (event) {
                    let image = getSnapshot();

                    let primary_node = document.getElementById("primary_snapshots");
                    while (primary_node.firstChild) { primary_node.firstChild.remove(); };

                    let iNode = document.createElement("img");
                    iNode.src = image;
                    iNode.style.width  = "300px";
                    iNode.style.marginBottom = "5px";
                    iNode.style.marginRight = "5px";

                    primary_node.appendChild(iNode);

                    let temp = image.split("base64,");

                    primaryImage = temp[1];
                };
                //
                // click on 'add to backdrops' button
                //
                bd_btn.onclick = function (event) {
                    let image = getSnapshot();

                    let backdrop_node = document.getElementById("backdrop_snapshots");
                    //while (backdrop_node.firstChild) { backdrop_node.firstChild.remove(); };

                    let iNode = document.createElement("img");
                    iNode.src = image;
                    iNode.style.width  = "300px";
                    iNode.style.marginBottom = "5px";
                    iNode.style.marginRight = "5px";

                    backdrop_node.appendChild(iNode);

                    let temp = image.split("base64,");

                    backdropImages.push(temp[1]);
                };

                function getSnapshot() {
                    let canvas = document.createElement('canvas');
                    let video  = document.getElementById('video1');
                    canvas.width  = video.videoWidth;
                    canvas.height = video.videoHeight;
                    let ctx = canvas.getContext('2d');
                    ctx.drawImage( video, 0, 0, canvas.width, canvas.height );
                    
                    return canvas.toDataURL('image/jpeg');
                };
            };







            //--------------------------------------------------------------
            //
            //        add tags and genre if video is not streaming
            //
            //--------------------------------------------------------------
            if(!LiveStreamId) doSnapshots();

            //--------------------------------------------------------------
            var Id = mediaObj["Id"];
            var progressId = Id;        // send progress messages to this Id

            videoTitle.innerHTML = "<h1>"+name+"</h1>";
            //--------------------------------------------------------------
            //
            //    get the DOM id for the HTML5 video element
            //
            //--------------------------------------------------------------
            var video = document.getElementById('video1');
            //--------------------------------------------------------------
            //
            //    instantiate HLS and add the event listeners to it
            //
            //--------------------------------------------------------------
            var hlsjsConfig = {
                "maxBufferSize": 0,
                "maxBufferLength": 30,
                "liveSyncDuration": 30,
                "liveMaxLatencyDuration": Infinity
            };

            if (hls) hls.destroy();       // destroy the hls if it already exists

            hls = new Hls(hlsjsConfig);   // instantiate a new hls
            //
            //    bind the html5 video tag to the hls code
            //
            hls.attachMedia(video);

            console.log("=== Add listeners to the video player ===");
            
            video.addEventListener('ended',          endOfVideo);
            video.addEventListener('waiting',        waiting);
            video.addEventListener('playing',        videoPlaying1);
            video.addEventListener('play',           videoPlaying2);
            video.addEventListener('error',          handleVideoEvent1);
            video.addEventListener('canplay',        handleVideoEvent2);
            video.addEventListener('canplaythrough', handleVideoEvent2)
            video.addEventListener('seeking',        handleVideoEvent4);
            video.addEventListener('seeked',         handleVideoEvent2);
            video.addEventListener('pause',          handleVideoEvent3);
            video.addEventListener('progress',       videoProgressEvent);
            video.addEventListener("volumechange",   setVideoVolume);

            var timeOld = 0;
            var noVideoProgressCnt = 0;
            //--------------------------------------------------------------------------
            //
            //  events from the HTML5 video player
            //
            function endOfVideo(e){
                console.log("\n\n============== End of Video =============== ");
                terminate("end of movie",false);
            };
            function handleVideoEvent1(e) {
                console.log("=== Handle Video Event 1 (error)");
            };
            function handleVideoEvent2(e) {
                console.log("=== Handle Video Event 2 (can play, can play through, seek )");
                //timer1 = clrTimer(timer1);
                timer2 = clrTimer(timer2,1);      // network error
            };
            function handleVideoEvent3(e) {
                console.log("=== Handle Video Event 3 (pause)");
                //timer1 = clrTimer(timer1);
                timer2 = clrTimer(timer2,2);      // network error
            };
            function handleVideoEvent4(e) {
                console.log("=== Handle Video Event 4 (seeking)");
                //timer1 = clrTimer(timer1);
                timer2 = clrTimer(timer2,3);      // network error
            };
            function waiting(e) {
                //console.log(">>> Waiting <<< ",e);
                timer3 = clrTimer(timer3,4);      // video waiting
                timer3 = setNewTimeout(waiting2, timer3, "waiting timer");
                console.log(">>> Waiting, index = "+timer3+" <<<");
                //waitingCount = 0;
            };
            function waiting2(){
                waitingCount++;
                console.log("=== waiting2 - timer3 ("+timer3+") timed out, count = "+waitingCount);
                if(waitingCount > 3) { 
                    //timer3 = clrTimer(timer3);
                    terminate("=== Restart Strean ===", true);  
                    return;
                };
                timer3 = clrTimer(timer3,5);      // video waiting
                timer3 = setNewTimeout(waiting2, timer3, "continue waiting");
            };
            function tryRepairing() {
                recoverCount++;
                console.log("=== timer1 ("+timer1+") timed out, count = "+recoverCount);
                if(recoverCount > 2 || LiveStreamId) { 
                    terminate("=== Stop Repairing ===", LiveStreamId);  // force end of movie
                    return; 
                };
                timer1 = clrTimer(timer1,6);      // buffer stalled
                timer1 = setNewTimeout(tryRepairing, timer1, "Try Repairing");

                timer3 = clrTimer(timer3,7);      // video waiting
            };
            function videoPlaying1(e) {
                console.log("\n\n>>>>>>>>>>>>>>>>>> Playing Video <<<<<<<<<<<<<<<<<<");
                timer1 = clrTimer(timer1,8);      // buffer stalled
                timer2 = clrTimer(timer2,9);      // network error
                timer3 = clrTimer(timer3,10);      // video waiting
                timer4 = clrTimer(timer4,11);      // pause=play
                recoverCount = 0;
            };
            function videoPlaying2(e) {
                console.log(">>> Play Video <<<");
                timer1 = clrTimer(timer1,12);      // buffer stalled
                timer2 = clrTimer(timer2,13);      // network error
                timer3 = clrTimer(timer3,14);      // video waiting
                timer4 = clrTimer(timer4,15);      // pause=play
                recoverCount = 0;

                // let url = server_url+"Videos/"+Id+"/main.m3u8?DeviceId="+deviceId+"&Container=mp4&AudioCodec=aac&MaxVideoBitDepth=8&VideoCodec=h264&AudioStreamIndex="+AudioStreamIndex+"&api_key="+api_key;
                // video.pause();
                // hls.stopLoad();
                // hls.loadSource(url);
                // hls.startLoad(1);

                // video.play();
                // video.currentTime = tempTime;
            };
            //--------------------------------------------------------------
            function setNewTimeout(timer_callback, timerIndex, i) {
                if(timerIndex) {
                    console.log("=== Duplicate timer,  index = "+timerIndex+",  ("+i+") ===");
                    return false;
                };
            
                let timeOut = (LiveStreamId) ? 2000 : 5000;
            
                let index = setTimeout(timer_callback, timeOut, i);
                console.log("___ set new timer,  index = "+index+",  ("+i+")");
                return index;
            };
            //--------------------------------------------------------------
            function clrTimer(index,nbr) {
                if (index) {
                    console.log("___ remove timer,  index = "+index+", nbr = "+nbr);
                    clearTimeout(index);
                    //return null;
                };
                //console.log("=== remove timer,  invalid index = "+index+" ===");
                return null;
            };
            //--------------------------------------------------------------
            //
            // set video volume when the event listener detects the volume has changed
            //
            function setVideoVolume(e) {
                videoVolume = parseInt(video.volume * 100);
                console.log("========= Volume = ",videoVolume," ========= event = ",e);
            };
            //--------------------------------------------------------------
            //
            // 'progress' playing video received from the Event Listener 
            //
            function videoProgressEvent(e) {
                let time = video.currentTime;                   // get the current time that the video has played
                console.log("___ Current time = "+time);

                if ( ( time != timeOld) || (timeOld==0) ) {     // check to see if any progress has been made playing the video
                    noVideoProgressCnt = 0;
                    timeOld = time;
                    //
                    // post progress to the server
                    //
                    var ticks = ( time * 10000000 ).toFixed(0);  // one tick is 10 microseconds
                    //
                    // send playing progress to the server
                    //
                    upload( get_url_3(deviceId), get_body_3(playSessionId, mediaSourceId, progressId, ticks), sendPausePlay );

                    timer1 = clrTimer(timer1,16);  // buffer stalled timer
                    timer4 = clrTimer(timer4,17);  // progress playing timer - used to send pause/play
                } else {
                    noVideoProgressCnt++;
                    console.log(">>> No progress playing counter = "+noVideoProgressCnt);
                    if(noVideoProgressCnt >= 3) terminate(true);        // reload HLS and try again to play video
                };
            };

            function sendPausePlay() {
                clearTimeout(timer4);                                        // raw javascript clear timeout
                timer4 = setTimeout(spp, 8000, "Progress Playing Timer");    // raw javascript set time
                console.log("___ Reset pause-play timer "+timer4+" to 8 seconds ___");
            };

            function spp() {
                console.log("___ Sending pause-play ___");
                video.pause();
                video.play();
            };
            //--------------------------------------------------------------

            var recoverCount = 0;
            var waitingCount = 0;

            var timer1 = null;      // buffer stalled
            var timer2 = null;      // fatal network error
            var timer3 = null;      // video waiting
            var timer4 = null;      // pause-play
        
            //--------------------------------------------------------------
            //
            //          get m3u8 URL to play video
            //
            //--------------------------------------------------------------
            console.log("\n\n=================== Start Playing Video =================== ",mediaObj);
        
            var url;

            if(LiveStreamId) {
                console.log(">>>>>>>>>>>>>>>>  Live TV <<<<<<<<<<<<<<<<");

                //progressId = Id; //mediaObj.CurrentProgram.Id;

                AudioStreamIndex = 0;

                url = server_url +"videos/"+Id+"/master.m3u8?"+
                "DeviceId="+deviceId+                               
                "&MediaSourceId="+mediaSourceId+
                "&PlaySessionId="+playSessionId+
                "&api_key="+api_key+
                "&LiveStreamId="+LiveStreamId+
                "&VideoCodec=h264,h265,hevc"+
                "&AudioCodec=ac3,mp3,aac"+
                "&VideoBitrate=139808000"+
                "&AudioBitrate=192000"+
                "&AudioStreamIndex="+AudioStreamIndex+
                "&TranscodingMaxAudioChannels=2"+
                "&SegmentContainer=m4s,ts"+
                "&MinSegments=1"+
                "&BreakOnNonKeyFrames=True"+
                "&ManifestSubtitles=vtt"+
                "&h264-profile=high,main,baseline,constrainedbaseline,high10"+
                "&h264-level=62"+
                "&TranscodeReasons=ContainerNotSupported";
            } else {
                url = server_url +"videos/"+Id+"/main.m3u8?"+
                "DeviceId="+deviceId+
                "&MediaSourceId="+mediaSourceId+
                "&PlaySessionId="+playSessionId+
                "&api_key="+api_key+
                "&VideoCodec=h264"+
                "&AudioCodec=mp3,aac"+
                "&VideoBitrate=6904000"+
                "&AudioBitrate=96000"+
                "&AudioStreamIndex="+AudioStreamIndex+
                "&TranscodingMaxAudioChannels=2"+
                "&SegmentContainer=ts"+
                "&MinSegments=1"+
                "&BreakOnNonKeyFrames=True"+
                "&ManifestSubtitles=vtt"+
                "&h264-profile=high,main,baseline,constrainedbaseline,high10"+
                "&h264-level=52"+
                "&TranscodeReasons=VideoCodecNotSupported,AudioCodecNotSupported";
            };

            console.log(">>> URL = "+url);
            //
            // load the URL into hls
            //
            hls.loadSource(url);

            // hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            //     //video.muted = true;
            //     video.play();
            // });

            //-----------------------------------------------------------------------
            //
            // now attach listeners to hls
            //
            //-----------------------------------------------------------------------
            hls.on(Hls.Events.MANIFEST_PARSED, function() {   // start playing the video when hls has parsed the manifest 
                hls.startLoad(1);
                video.currentTime = previousTimerTickPosition;
                //
                // play the video
                //
                video.play();

                console.log("\n\n>>>>>>>>>>>>>> Video.play() <<<<<<<<<<<<<<<");
                //
                // send "playing" to the Emby server
                //
                console.log("=== Send Playing to Server");
                upload( get_url_2(deviceId), get_body_2(playSessionId, mediaSourceId, Id) );
            });
            //-----------------------------------------------------------------------
            hls.on(Hls.Events.BUFFER_EOS, function(event, data) {
                //console.log("=== Video Current Time = "+video.currentTime+" ===");
                //console.log("=== Buffer EOS,  data = ",data," ===");
                if( data.fatal ) {
                    console.log("====== Fatal Error 1 ======");
                    terminate("fatal error 1",false);
                };
            });
            hls.on(Hls.ErrorDetails.BUFFER_STALLED_ERROR, function(event, data) {
                console.log("\n\n=== hls Error Buffer Stalled = ",event,",  data = ", data);
                if( data.fatal ) {
                    console.log("====== Fatal Error 2 ======");
                    terminate("fatal error 2",false);
                };
            });
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log('=== fatal network error encountered, trying to recover');
                        timer2 = setNewTimeout(terminate, timer2, "fatal network error");

                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log('=== fatal media error encountered, trying to recover');
                        hls.recoverMediaError();
                        break;
                    default:
                        // cannot recover
                        console.log('=== Can"t recover');
                        terminate("can't recover",false);
                    };
                } else {
                    console.log(">>> Event Received: type = ",event,", data = ",data);

                    if( data.details == "bufferStalledError" ) {
                        //
                        // buffer stalled 
                        //
                        console.log("\n\n================= buffer stalled ==================");
                        // console.log("=== setting Buffer Stalled Timeout ===");

                        timer1 = clrTimer(timer1,18);   // buffer stalled
                        timer2 = clrTimer(timer2,19);   // fatal network error
                        timer3 = clrTimer(timer3,20);   // video waiting 

                        timer1 = setNewTimeout(tryRepairing, timer1, "buffer stalled");

                    } else if( data.details == "levelLoadError" ) {
                        console.log("\n\n=== Level Load Error ===");

                        // stopServerTranscoding();
                        // video.pause();
                        // video.currentTime = 0;
                        // hls.stopLoad();
                        // hls.loadSource(url);

                        terminate("=== Stop Playing ===", false);  // force end of movie
                    } else {
                        timer2 = clrTimer(timer2,21);  // fatal network error
                    };
                };
            });
            //--------------------------------------------------------------------------
            //
            //                    Stop the server from transcoding
            //
            //--------------------------------------------------------------------------
            function stopServerTranscoding() {
                console.log("=== Stop the Server from transcoding ===");

                let url = server_url + "Videos/ActiveEncodings/Delete?"+
                "deviceId="+deviceId+
                "&PlaySessionId="+playSessionId+
                "&X-Emby-Client="+myDevice.Client+
                "&X-Emby-Device-Name="+myDevice.DeviceName+
                "&X-Emby-Device-Id="+deviceId+
                "&X-Emby-Client-Version="+myDevice.ApplicationVersion+
                "&X-Emby-Token="+api_key;

                upload(url, "");
            };
            //--------------------------------------------------------------------------
            //
            //                     TERMINATE Video
            //
            //--------------------------------------------------------------------------
            function terminate(msg, bufferStall) {
                console.log(">>> Terminate Video <<< ("+msg+")");

                stopServerTranscoding();

                video.pause();
                video.currentTime = 0;

                hls.stopLoad();
                //video.srcObject = null
                //window.location.reload(false);

                if(hls) hls.destroy();

                timer1 = clrTimer(timer1,22);      // buffer stalled
                timer2 = clrTimer(timer2,23);      // fatal network error
                timer3 = clrTimer(timer3,24);      // video waiting 
                timer4 = clrTimer(timer4,25);      // pause/play

                console.log("=== Remove video player listeners ===");
                //--------------------------------------------------------------
                //
                //  remove the event listeners from the HTML5 video tag
                //
                video.removeEventListener('ended',          endOfVideo);
                video.removeEventListener('waiting',        waiting);
                video.removeEventListener('playing',        videoPlaying1);
                video.removeEventListener('play',           videoPlaying2);
                video.removeEventListener('error',          handleVideoEvent1);
                video.removeEventListener('canplay',        handleVideoEvent2);
                video.removeEventListener('canplaythrough', handleVideoEvent2)
                video.removeEventListener('seeking',        handleVideoEvent4);
                video.removeEventListener('seeked',         handleVideoEvent2);
                video.removeEventListener('pause',          handleVideoEvent3);
                video.removeEventListener('progress',       videoProgressEvent);
                video.removeEventListener('volumechange',   setVideoVolume);
                //--------------------------------------------------------------
                //
                // remove the tag and genre fields at the bottom of the video
                //
                let ppn = document.getElementById("videoBottomArea");
                if (ppn) while (ppn.firstChild) { ppn.firstChild.remove(); };
                //--------------------------------------------------------------
                //
                //  post stopped to the server
                //
                let t = (video.currentTime * 10000000).toFixed(0);  // one tick is 10 microseconds
                upload( get_url_4(deviceId), get_body_4(playSessionId, mediaSourceId, Id, t) );

                console.log("\n\n>>>>>>>>>>>>>> Terminate <<<<<<<<<<<<<<<");
                //--------------------------------------------------------------
                //
                //  If streaming video and the buffer is stalled, then restart playing the video 
                //
                if(bufferStall && LiveStreamId) {
                    console.log(">>>>>>>>>>>> restart Video <<<<<<<<<<<<<");

                    //download(videoPlayURL, playVideoHLS, [pn, callback, callback2, 0]); 

                    playVideoHLS (videoMediaObj, videoParams);
                    return;
                };
                //--------------------------------------------------------------
                //
                //  end this movie 
                //
                console.log(">>>>>>>>>>> End Video <<<<<<<<<<<");

                if(modal_1) modal_1.style.display = "none";
                //callback();
            };
        };
    };


//-----------------------------------------------------------------------
//                   Play Trailer
//-----------------------------------------------------------------------
function playTrailerVideo(name, path) {
    trailerTitle.innerHTML = '<h2>Trailer for "'+name+'"</h2>';
    trailerPath.innerHTML = "<h4>(Path = "+path+")</h4>";


    trailerVideo.setAttribute("src", path);
    trailerVideo.play(); 
    //
    //  return from Trailer
    //
    trailerBtn.onclick = function (event) {
        //event.preventDefault();
        console.log("====== Return from Trailer ======");

        selected_items = [];


        //refreshPage();
    };
};
//-----------------------------------------------------------------------------

