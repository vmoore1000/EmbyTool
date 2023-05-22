

var epgButtonsHTML = `
    <div>
        <button id="tvGuideLeft"    class="page_button" type="button">⏴Left</button>
        <button id="tvGuideRight"   class="page_button" type="button">⏵Right</button>
        <button id="tvGuideRefresh" class="page_button" type="button">↻ Refresh</button>
        <button id="tagChannels"    class="page_button" type="button">Channels</button>
    </div>
    `;

var epgHTML = `
    <div id="tvGuideContainer">
        <br>
        <div id="tvContainer">
            <div id="epgImageDiv"> </div>
            <div id="tvGuideText"></div>
        </div>

        <div id="tvRemotePlayPanel" style="border:1px solid black; background-color:red;">
            <label style="color:white; font-size:18px;">Play</label>
            <label id="tvRemoteTitle" style="color:white; font-size:18px;"></label>

            <button id="tvPlayMovieBtn" class="page_button" style="margin-right:10px" type="button">▶ Locally</button>
            <label style="color:white; font-size:18px;">or select a device </label>
                
            <div id="localRemoteDevices" style="display:inline-block"></div>

            <label style="color:white; font-size:18px;">and play it</label>
            <button id="tvRemotePlayBtn" class="prev_page_button" style="margin-right:10px; margin-left:10px">▶ Remotely</button> 
        </div>

        <div id="rightTableContainer" >
            <table id="rightTable" ></table>
        </div>

    </div>
    <div id="modal_node"></div>
    `;



var $epgImageDiv;
var rightTable;
var $rightTable;
var $rightTableContainer;

var epgTimerIndex;
var timerIndex = 0;

var savedEPG;

//var scrollTargetId;
var epgScrollTop;
//var epgCallback;

//======================================================================================
//
//                                 get EPG
//
//======================================================================================
function getEPG() {
    //epgCallback = callback;

    console.log("=== Get EPG ===");

    //
    //  add epg buttons HTML
    //
    let bn = document.getElementById("button_node");
    while (bn.firstChild) { bn.firstChild.remove(); };
    bn.innerHTML = epgButtonsHTML;

    //
    //    please wait message
    //
    let mn = document.getElementById("modal_node");
    let message = myModal(mn);
    message.innerHTML = "<div style='text-align: center;'><h1>Loading - Please Wait</h1></div>";
    modal_1.style.display = "block";

    if(savedEPG) {
        displayEPG(savedEPG); 
    } else {
        getEPG_2();
        epgScrollTop = 0;
    };
};


function getEPG_3() {
        //
        // restore the scroll position
        //
        //console.log("=== Scroll epg to = ",epgScrollTop);
        //$rightTable.scrollTop = epgScrollTop;

        epgScrollTop = $rightTableContainer.scrollTop.toFixed();
        console.log("=== Top of page scroll position = ",epgScrollTop);

        getEPG_2();
};



function getEPG_2() {

    var url = server_url + "LiveTv/EPG?Type=TV&Fields=MediaStreams%2COverview%2CPath%2CProviderIds&api_key=" + api_key;
    download(url, displayEPG);
};


//======================================================================================
//
//                                display EPG
//
//======================================================================================
function displayEPG(epgData) {
    savedEPG = epgData;

    let pn = document.getElementById("page_node");
    while (pn.firstChild) { pn.firstChild.remove(); };
    pn.innerHTML = epgHTML;


    let sn = document.getElementById("side_node");
    sn.style.display = "none";


    modal_1.style.display = "none"; // remove please wait message



    document.getElementById("topPageTitle").innerHTML = "TV Guide"
    document.getElementById("topPageCount").innerHTML = "";


    console.log("--------------- Live TV EPG ---------------",epgData);

    $epgImageDiv = document.getElementById("epgImageDiv");
    $rightTable = document.getElementById("rightTable");
    $rightTableContainer = document.getElementById("rightTableContainer");

    document.getElementById("tvRemotePlayPanel").style.display = "none";


    while ($rightTable.firstChild) { $rightTable.firstChild.remove(); };

    //---------------------------------------------------------
    var secondWidth = 10 / 60;
    var tvGuide     = epgData["Items"];
    var nbrChannels = tvGuide["length"];
    var badgePre    = "<span style='border:1px solid green; border-radius:10px; font-size:15px; background-color:green; color:white; padding: 0 5px; margin-left: 5px;'>P</span>";
    //var badgeHD     = "<span style='border:1px solid red;   border-radius:10px; font-size:15px; background-color:red;   color:white; padding: 0 5px; margin-left: 5px;'>HD</span>";
    //---------------------------------------------------------
    //
    //  Outer Loop  --  tv guide Rows
    //
    var rightTable = document.createElement("table");

    // this is row 1 of the epg table - it contains the half hour time markers - the rows after this row contain the epg data
    let tr = document.createElement("TR");
    tr.innerHTML = "<th class='timeRow' style='background-color:black'></th><td id='td_00' class='timeRow'></td>";
    $rightTable.appendChild(tr);

    //console.log("=== Added top row = ",tr);

    //---------------------------------------------------------
    //
    // get epg start date and time   get current date and time
    //
    //var sd = tvGuide[0]["Programs"][0]["StartDate"];  // 2022-03-27T05:00:00.0000000+00:00
    var currentDate = new Date();
    //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>");
    //console.log("Current Date   = ",currentDate);
    var hours   = currentDate.getHours();    // (1-24)
    var minutes = currentDate.getMinutes();  // (1-60)
    //console.log("hours   = "+hours);
    //console.log("minutes = "+minutes);

    //---------------------------------------------------------
    // add time line -- this starts with currentDate
    //---------------------------------------------------------
    var startDelta;
    if(minutes>30) {
        hours = hours+1;
        startDelta = 60-minutes;
        minutes = 0;
    } else {
        startDelta = 30-minutes;
        minutes = 30;
    };
    //console.log("startDelta = "+startDelta);

    let width = Math.round((startDelta*60)*secondWidth); 
    //let tw = '<div class="tdDiv" style="text-align:center; width:'+width+'px; background-color:gray;"></div>';
    let tdDiv = document.createElement("DIV");
    tdDiv.className = "tdDiv";
    tdDiv.style.textAlign = "center";
    tdDiv.style.width = ""+width+"px";
    tdDiv.style.backgroundColor = "gray";
    document.getElementById("td_00").appendChild(tdDiv);

    thirtyMinWidth = Math.round(30 * 60 * secondWidth);

    for(var time = 0; time<20160; time+=30) {
    //for(var time = 0; time<200; time+=30) {

        var temp2 = (hours > 12) ? hours-12 : hours;
        var time1 = temp2 + ":" + minutes;
        time1 += (hours>12) ? " PM" : " AM";
        if (minutes>=30) { hours++; minutes=0;} else minutes=30;
        if (hours > 24)  { hours = 1; };

        //var temp3 = '<div class="tdDiv" style="text-align:center; width:'+(thirtyMinWidth)+'px; background-color:gray; color:white;">'+time1+'</div>';
        let tdDiv = document.createElement("DIV");
        tdDiv.className = "tdDiv";
        tdDiv.style.textAlign = "center";
        tdDiv.style.width = ""+thirtyMinWidth+"px";
        tdDiv.style.backgroundColor = "gray";
        tdDiv.innerHTML = time1;
        document.getElementById("td_00").appendChild(tdDiv);
    };

    console.log("=== Add Program Data ===");
    //---------------------------------------------------------
    // add program data
    //---------------------------------------------------------
    for(var jj=0; jj < nbrChannels; jj++) {

        var checkForCurrentDate = true; 
        var showPlayingFound = false;
        //--------------------------------------------------------- 
        var channelObj  = tvGuide[jj];
        var channelData = channelObj["Channel"];
        var channelId   = channelData.Id;
        var channelName = channelData["Name"];
        var channelProg = channelObj["Programs"];      // get channel programs object for a channel
        var programCnt  = channelProg["length"];       // number of programs on a channel
        //--------------------------------------------------------- 
        //
        //  Inner Loop  --  building one row of the tv guide
        //
        let tableRow = document.createElement("TR");
        tableRow.innerHTML =  "<th id='C_"+jj+"'>"+channelName+"</th><td id='td_"+jj+"'></td>"+
        $rightTable.appendChild(tableRow);

        //console.log("=== table Row =",tableRow);

        var totalMinutes = 0;


        for(var ii = 0; ii<programCnt; ii++) {      // cycle throgh the programs and put them into the guide
            programName = channelProg[ii]["Name"];  // get the name for program ii for channel jj
            programId   = channelProg[ii]["Id"];

            //var isPre   = channelProg[ii]["IsPremiere"];
            var isMovie = channelProg[ii]["IsMovie"];
            //var isHD    = channelProg[ii]["Width"] > 720;

            var sd = channelProg[ii]["StartDate"];           // "2021-07-29T14:45:59.0000000+00:00"
            var startDate = new Date(sd);
            var ed = channelProg[ii]["EndDate"];             // "2021-07-29T14:45:59.0000000+00:00"
            var endDate = new Date(ed);

            var timeMin = ((endDate-startDate)/1000)/60;
            totalMinutes += timeMin;

            if(totalMinutes > 20160) {   // two weeks in minutes
                break;  
            };

            var timeWidth = Math.round(((endDate-startDate)/1000)*secondWidth);
            var content = programName;                                             //  <--------------<<<<<<<

            var timeRemainingSec = (endDate-startDate)/1000;

            //console.log("=== Row Data, Name =",programName,",  time = ",timeMin);

            //-----------------------------------------------------
            //
            // does the current item match the current time
            //
            if (checkForCurrentDate) {
                timeRemainingSec = (endDate-currentDate)/1000;

                if(endDate >= currentDate) {                                
                    showPlayingFound = true;
                    checkForCurrentDate = false;
                    
                    timeWidth = Math.round( timeRemainingSec*secondWidth );
                };
            };
            //-----------------------------------------------------
            if(!checkForCurrentDate) {
                //if (isPre) content += badgePre;
                //if (isHD)  content += badgeHD;

                var bgColor = "lightgray";
                var fgColor = "black";

                if (showPlayingFound) { 
                    bgColor="lightgreen"; 
                    showPlayingFound = false; 
                } else if (isMovie) bgColor="lightblue";
                //else if (isSeries)bgColor="lightgreen"; 

                if(timeRemainingSec < (15*60)) content = "";

                //console.log("=== Time in Minutes ="+timeMin);

                let tdDiv = document.createElement("DIV");
                tdDiv.id = "P_"+programId;
                //tdDiv.className = "tdDiv programName";
                tdDiv.style.textAlign = "center";
                tdDiv.style.width = ""+(timeWidth - 2)+"px";
                tdDiv.style.backgroundColor = bgColor;
                tdDiv.style.color = fgColor;
                //tdDiv.innerHTML = "<span id='T_"+programId+"'>"+programName+"</span>";
                tdDiv.innerHTML = content;
                tdDiv.className = "tdDiv";
                //tdDiv.classList.add('tdDiv', 'programName');
                //console.log("=== Row Data =",tdDiv);

                document.getElementById("td_"+jj).appendChild(tdDiv);
            };
        };
    };
    //
    // scroll the screen to its previous position
    //
    // if(scrollTargetId) {
    //     console.log("=== Scroll Id = ",scrollTargetId);
    //     let element = document.getElementById(scrollTargetId);  // scroll the selected item into view
    //     element.scrollIntoView();

    //     scrollTargetId = null;
    // } else {
    //    $rightTableContainer.scrollTop = epgScrollTop;
    // };
        
    if(epgScrollTop) {
        console.log("=== Top of page Scroll Id = ",epgScrollTop);
        $rightTableContainer.scrollTop = epgScrollTop;
    };

    //======================================================================================
    //                                     Buttons
    //======================================================================================
    tvGuideLeft.onclick = function(e) {
        e.preventDefault();
        $rightTableContainer.scrollLeft -= 1000;   // move left 1000px
    };

    tvGuideRight.onclick = function(e) {
        e.preventDefault();
        $rightTableContainer.scrollLeft += 1000;  // move right 1000px
    };
    
    tvGuideRefresh.onclick = function(e) {
        e.preventDefault();
        savedEPG = undefined;
        getEPG();
    };

    tagChannels.onclick = function(e) {
        e.preventDefault();
        console.log("=== EPG - Tag Channels ===");
        clearTimeout(epgTimerIndex);

        liveTvChannels(getEPG);
    };

    // tvGuideReturn.onclick = function(e) {
    //     e.preventDefault();
    //     console.log("=== Return Clicked");
        
    //     clearTimeout(epgTimerIndex);
    //     savedEPG = null;

    //     if(epgCallback) epgCallback();
    // };





    
    //
    // set callback timer
    //
    clearTimeout(epgTimerIndex);
    epgTimerIndex = setTimeout(getEPG_3, 60000); // every 1 minute



    

    //--------------------------------------------------------- 
    //
    //
    //
    //--------------------------------------------------------- 
    rightTableContainer.onclick = function (event) {
        console.log("=== click on right table image",event);

        if(event.target.id.startsWith("C")) return;

        document.getElementById("tvRemotePlayPanel").style.display = "block";
        //
        // reset callback timer
        //
        clearTimeout(epgTimerIndex);

        //
        //------------------------------------------------------------------  

        epgScrollTop = $rightTableContainer.scrollTop.toFixed();
        console.log("=== Top of page scroll position = ",epgScrollTop);

        var target = event.target;
        //var targetId = target.id;

        //scrollTargetId = targetId;
        //var nextElementSibling = target.nextElementSibling;

        var idStr = "";
        var node = target;
        var channelNbr = node.parentNode.id.split("_")[1]; // get channel from the row node "tr"

        console.log(">>> Channel Number = "+channelNbr);

        if(!channelNbr) return;

        var i = 0;
        //
        // for the show selected in channel x, collect a list of 24 shows after the selected shom on the same channel
        //
        while(node) {
            //console.log(">>> node "+i+" = ",node);

            //
            // go through the 'program' nodes for a channel in the EPG -- collect the ids for 25 shows
            //
            var id = node.id.split("_")[1];
            var url = server_url+"Users/"+user_id+"/Items/"+id+
                "?Fields=MediaStreams"+
                "&EnableUserData=true"+
                "&api_key="+api_key;
            download(url, nodeData, i);
            


            function nodeData(data,i) {
                console.log("=== Node Data = ",data,", i = "+i);
                let a = Object.keys(data.ProviderIds);
                console.log("=== Node Keys = ",a);
                let key = a[0];

                var videoId;
                if(key=='vtvp') {
                    videoId = data.ProviderIds.vtvp;   // this is the playable id for the show
                    //videoId = data.ProviderIds[key];   // this is the playable id for the show
                } else {
                    videoId = data.ParentId;
                    //videoId = data.Id;
                    //videoId = data.ProviderIds[key];
                };

                idStr += videoId + ",";                // add it to the comma delimited list
                //console.log(">>> idStr "+i+" = "+idStr);
            };

            node = node.nextElementSibling; // get the next sibling node

            i++;
            if(i>=25) break;            // collect ids for only 25 shows within a channel
        };
        //
        // add the video title to the remote play menu
        //
        var title = document.getElementById("tvRemoteTitle");
        title.innerHTML = target.innerText;
        //
        // get available device sessions
        //
        var url = server_url+"Sessions?ActiveWithinSeconds=300&IncludeAllSessionsIfAdmin=true&api_key="+api_key;

        download(url, deviceSessions);
        


        function deviceSessions(sessions) {
            console.log("=== Device Sessions = ",sessions,", idStr = ",idStr);

            var currentSessionData = [];

            let $trd = document.getElementById("localRemoteDevices");
            $trd.width = "40";
            $trd.style.display = "inline-block";
            while ($trd.firstChild) { $trd.firstChild.remove(); };

            let x = document.createElement("SELECT");
            //x.setAttribute("name", "Type");
            x.id = "tvDeviceId";
            // x.className = "";
            // x.style.width = "35px";
            x.style.margineLeft = "10px";
            x.style.margineRight= "10px";
            x.appendChild(addOption("Select a Remote Device", ""));
            $trd.appendChild(x);
            
            currentSessionData = [];
            //
            //
            //
            sessions.map( (session) => {
                if(session.SupportsRemoteControl) {
                    currentSessionData[session.DeviceId] = [session.DeviceName, session.DeviceId, session.Id, session.SupportedCommands, -1];
                    x.appendChild( addOption(session.DeviceName, session.DeviceId) );
                };
            });
            //
            //
            console.log("=== currentSessionData = ",currentSessionData);
            //
            //  add options to a select / pull down
            //
            function addOption( name, value) {
                let y = document.createElement("option");
                y.setAttribute("value", value);
                y.innerText = name;
                return y;
            };
            //
            // play the video locally
            //
            tvPlayMovieBtn.onclick = function (event) {
                // hide local and remote play buttons area
                //document.getElementById("tvRemotePlayPanel").style.visibility = "hidden";
                document.getElementById("tvRemotePlayPanel").innerHTML = "<h2 style='color:white'>Loading, please wait</h2>";

                var i = idStr.indexOf(",");
                var providerId = idStr.slice(0,i);   //data1.ProviderIds.vtvp;

                console.log(">>> TV Play Btn - Provider Id = "+providerId);
                //
                // play the clicked video
                //
                // videoPN        = pn; 
                // videoCallback  = callback; 
                //videoCallback2 = callback2;

                
                let mn = document.getElementById("modal_node");
                let dn = myModal(mn);
                modal_1.style.display = "block";

                var url = server_url+"Users/"+user_id+"/Items/"+providerId+"?api_key="+api_key;
                download(url, playVideoHLS, [dn, callback, callback, 1]);  // play the video 
            };

            function callback() {
                console.log("=== callback ===");
                displayEPG(savedEPG);
            };
            // function callback2() {
            //     console.log("=== callback2 ===");
            //     displayEPG(savedEPG);
            // };


            //
            // play the video on a remote device like a TV or monitor
            //
            tvRemotePlayBtn.onclick = function (event) {
                
                var deviceId = document.getElementById("tvDeviceId").value;

                console.log("========================================================================================");
                console.log("=== deviceId = ",deviceId,", tvDeviceId = ", document.getElementById("tvDeviceId"));

                document.getElementById("tvRemotePlayPanel").style.display = "none";
                if(deviceId=="") return;

                //currentSessionData[deviceId][4] = channelNbr;  // save the channel number in the session data

                
                //
                // get the session
                //
                var session = currentSessionData[deviceId];   // [DeviceName, DeviceId, Id, SupportedCommands]
                console.log("=== Session = ",session,", currentSessionData = ",currentSessionData,",  deviceId = ",deviceId);
                //
                //  send a stop command just in case something is already playing
                //
                sendSessionCommand("Stop", deviceId, currentSessionData[deviceId][2]);   // stop the remote device before playing another video

                //console.log("=== deviceId = ",deviceId,", id = ",currentSessionData[deviceId][2] );
                idStr = idStr.slice(0, idStr.length - 1); // remove trailing "," at the end of the string
                console.log(">>> Play Remote idStr = "+idStr);

                playRemote(idStr, session);
            };
            //
            //
            //
            function sendSessionCommand(command, deviceId, id) {    // [DeviceName, DeviceId, Id, SupportedCommands]
                var url = server_url+"Sessions/"+id+"/Playing/"+command+"?"+  // this is the id
                        //"X-Emby-Client=Emby%20Web"+
                        //"&X-Emby-Device-Name=Chrome"+
                        "X-Emby-Device-Id="+deviceId+    // this is the deviceId
                        //"&X-Emby-Client-Version=4.6.7.0"+
                        "&api_key="+api_key;
              
                //console.log("=== Session Command url = "+url);
                upload(url, "");
            };
        };
    };






    //-------------------------------------------------------------------
    //
    // mouse clicks on the picture above the tv guide to play the TV show
    //
    //-------------------------------------------------------------------
    epgImageDiv.onclick = function(event) {
        console.log("=== epg Image Div = ",event);
        //let temp = event.target.id;
        //let providerId = temp.split("_")[1];

        //
        // play the clicked video
        //
        //var url = server_url+"Users/"+user_id+"/Items/"+providerId+"?api_key="+api_key;
        //download(url, playVideoHLS, [[], []]);
    };






    function playRemote(idStr, session) {
        console.log("===================================================================");

        console.log(">>> Remote Play idStr = "+idStr);
        console.log(">>> Remote Play Session = ",session);
    
        //if(data.MediaType != "Video") return;
    
        //var idStr = id;  // the id is a comma delimited list of ids
    
        //  selectedItems is an object { id1:id1, id2:id2, id3:id3 }
        //  metadataArray is an array  [id1,id2,id3 ]
    
        // var idStr = "";
        // var a = metadataArray;
        // var cnt = a.length;
        // for (var i=0; i<cnt; i++) {
        //     var j = a[i].split("_")[1];
        //     idStr += j+"%2c";
        // };
        // idStr = idStr.slice(0,-3); // remove last comma
        // console.log( ">>>>>>>>>>>>  idStr = "+idStr+", ("+id+")" );
    
        //let audioIndex = 1;
        //let subtitleIndex = -1;
    
        //var videoId = "ItemIds="+data.Id;               
        var videoId = "ItemIds="+idStr;                 // ItemIds     - A comma-delimited list of item id's
        var playCommand = "PlayNow";                    // PlayCommand - PlayNow, PlayNext or PlayLast
    
        //var mediaSourceId = data.MediaSources[0].Id;
    
        ////remotePlaySession["MediaSourceId"] = data.MediaSources[0].Id;
    
        var sessionId     = session[2];  
        //var mediaSourceId = data.MediaSources[0].Id;    // MediaSourceId - If supplied, this is the media source that should be used for the first item
        var deviceId      = session[1]; 
        var ticks         = "0";                        // StartPositionTicks - If supplied, this is the position in which the first title should start at.
        var audioStreamIndex    = "1";                  // AudioStreamIndex - If supplied, this is the audio stream that should be used for the first item
        var subtitleStreamIndex = "-1";                 // SubtitleStreamIndex - If supplied, this is the subtitle stream that should be used for the first item
        var startIndex          = "0";                  // StartIndex - If supplied, and if playing a list of items, this is the index of the first item that should be played.
    
        url = server_url+"Sessions/"+sessionId+"/Playing?"+videoId+
        "&PlayCommand="+playCommand+
        "&StartPositionTicks="+ticks+
        "&StartIndex="+startIndex+
        //"&MediaSourceId="+mediaSourceId+
        "&AudioStreamIndex="+audioStreamIndex+
        "&SubtitleStreamIndex="+subtitleStreamIndex+
        //"&X-Emby-Client=Emby%20Web"+
        //"&X-Emby-Device-Name=Chrome"+
        "&X-Emby-Device-Id="+deviceId+
        //"&X-Emby-Client-Version=4.6.7.0"+
        "&api_key="+api_key;
    
        //console.log(">>> Send remote command url = "+url);
    
        //sendRemoteCommand(url,"playCommand");
    
        upload(url, "");
    };
    
    

    //--------------------------------------------------------- 
    var lastMouseOverId = 0;
    var lastMouseOverBgColor = "lightgray";

    //--------------------------------------------------------- 

    $rightTable.onmouseover = function(event) {
        //console.log(">>>=== mouse over ",event);
        var target = event.target;
        var id = target.id;

        //console.log("_________ mouse over __________",id);
        

        clearTimeout(timerIndex);

        if(id) {
            if(id.startsWith("C")) return;

            if(lastMouseOverId != 0 && lastMouseOverId != id) {
                document.getElementById(""+lastMouseOverId).style.backgroundColor = lastMouseOverBgColor;
                document.getElementById(""+lastMouseOverId).style.color = "black";
            };

            lastMouseOverId = id;
            lastMouseOverBgColor = document.getElementById(""+id).style.backgroundColor;
        
            var type = id.split("_")[0];
            // console.log(">>> type = "+type+", id = "+id);

            if(type=="P" || type=="T") {

                document.getElementById(""+id).style.backgroundColor = "blue";
                document.getElementById(""+id).style.color = "white";

                timerIndex = setTimeout(doMouseOver, 500);

                function doMouseOver() {
                    var id2 = id.split("_")[1];
                    // console.log(">>> videoId = "+videoId);
                    var url = server_url+"Users/"+user_id+"/Items/"+id2+"?Fields=Genres%2COverview%2CTags%2CPath&api_key="+api_key;
                    download(url, mouseOverVideoData);
                };
            };
        } else {  // you are over the horizontal white space between the channel items
            // console.log(">>>=== bad id ",event);
            if(lastMouseOverId != 0) {
                lastMouseOverBgColor = (lastMouseOverBgColor=="green") ? "lightgray" : lastMouseOverBgColor;
                document.getElementById(""+lastMouseOverId).style.backgroundColor = lastMouseOverBgColor;
                document.getElementById(""+lastMouseOverId).style.color = "black";
                lastMouseOverId = 0;
            };
        };
    };

    //--------------------------------------------------------- 
    $rightTable.onmouseleave = function(event) {
        //console.log(">>>=== exit ",event);
        var target = event.target;
        var id = target.id;

        clearTimeout(timerIndex);

        //if(id.startsWith("P")) {
        let t1 = document.getElementById(""+lastMouseOverId);
        if(t1){
            t1.style.backgroundColor = lastMouseOverBgColor;
            t1.style.color = "black";
        };
        //};


        //$("#rightTable").css("background-color", "white");
        $rightTable.style.backgroundColor = "white";
    };
    //---------------------------------------------------------
    //
    //  display show info above the epg
    //
    //---------------------------------------------------------
    function mouseOverVideoData (data) {

        document.getElementById("tvContainer").style.display = "block";

        console.log("=== video Mouse Over data = ",data);

        var name = data["Name"];                  // get the name for program ii for channel jj
        // var timeTicks = data["RunTimeTicks"];  // get the programs time in 10 micorsecond steps
        // var isPre     = data["IsPremiere"];
        // var imageId   = data["ImageTags"]["Primary"];
        // var serverId  = data["ServerId"];
        var Id = data["Id"]; // use this ID to get the image
        var officialRating = data["OfficialRating"];
        // var channelId = data["ChannelId"];
        // var Type      = data["Type"];
        // var mediaType = data["MediaType"];
        // var channelName = data["ChannelName"];
        var overview    = data["Overview"];
        // var endDate     = data["EndDate"];      // "2021-07-29T14:45:59.0000000+00:00"
        var startDate   = data["StartDate"];       // "2021-07-29T13:58:23.0000000+00:00"
        // var productionYear = data["ProductionYear"];
        var isMovie  = data["IsMovie"];
        var isSeries = data["IsSeries"];
        var episodeTitle = data["EpisodeTitle"];
        var seasonName   = data["SeasonName"];
        var indexNumber  = data["IndexNumber"];
        var providerId = data["ProviderIds"]["vtvp"];  // this is the object to be played
        // var duration   = Math.ceil((timeTicks / 10000000) / 60);  // put time in minutes

        if(!overview) overview = "No overview given";
        if(!officialRating) officialRating = "No Rating";
        if(!indexNumber) indexNumber = "not given";

        var text = "";
        if(isMovie) {
        //     text = "Movie: "+name+"<br>Channel: "+channelName+"Length: "+duration+" minutes";
            text = "<div style='text-align:center; font-size:25px'>"+name+" (Movie, "+officialRating+")</div>";
        } else
        if(isSeries) {
            text = "<div style='text-align:center; font-size:25px'>"+episodeTitle+" ("+officialRating+")</div>";
            text += "<div style='text-align:center; font-size:14px;'>TV Series - "+name+", "+seasonName+" - Episode "+indexNumber+"</div>";
        //  text += "<br>Title: "+episodeTitle+"<br>Length: "+duration+" minutes<br>Channel: "+channelName;
        };
        //
        // 2022-03-27T05:00:00.0000000+00:00
        //
        var sd = new Date(startDate);
        //var timeOffset = Math.round((sd.getTimezoneOffset())/60);  // change the offset to hours
        // getFullYear (yyyy)
        // getMonth   (0-11)
        // getDate    (0-31)
        // getHours   (0-23)    // already timezone corrected
        // getMinutes (0-59)
        // getSeconds (0-59)
        var temp1 = sd.getMinutes();
        var temp2 = (temp1<10) ? "0"+temp1 : ""+temp1;
        var temp3 = (sd.getHours()>12) ? sd.getHours()-12 : sd.getHours();
        var tempTime = ""+(sd.getMonth()+1)+"/"+sd.getDate()+"/"+sd.getFullYear()+", "+temp3+":"+temp2;

        text += "<div style='text-align:center; font-size:14px; margin-bottom:10px;'> ("+tempTime+")</div>";

        text += "<div style='font-size:18px;'>"+overview+"</div>"
        // text += "<br>Production Year: "+productionYear;

        //------------------------------------------------------------------------
        // var s_obj = new Date(startDate);
        // var e_obj = new Date(endDate);
        // var t1 = s_obj.toLocaleTimeString();
        // var t2 = e_obj.toLocaleTimeString();
        // var d1 = s_obj.toLocaleDateString();

        // text += ", Date = "+d1+"<br>Start Time = "+t1+", End Time = "+t2;


        //
        // add the image above the tv guide area
        //
        var url = server_url+"Items/"+Id+"/Images/Primary";
        var iNode = document.createElement("img");
        iNode.src = url;  
        //iNode.loading = "lazy"; 
        iNode.width  = 100; 
        //iNode.height = 75; 
        iNode.id  = providerId;    // the providerId is the video to be played
        iNode.style.marginRight = "10px";
        iNode.style.float = "left";
        iNode.style.cursor = "pointer";
        //vertical-align: top;
        
        while ($epgImageDiv.firstChild) { $epgImageDiv.firstChild.remove(); };

        $epgImageDiv.appendChild(iNode);
        //
        // add tv guide text
        //
        var s2 = document.getElementById("tvGuideText");
        s2.innerHTML = text;

        
    };
    //--------------------------------------------------------- 
 
};




