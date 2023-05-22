

var dashboardHTML = `
    <hr>
    <div id="myDashboard" width="800" height="600">
        <div id="devicesTitle" class="devicesTitle">Active Emby Devices</div>
        <div id="myDevices" style="border:1px solid gray; padding:5px; background-color:lightGray"></div>
    </div>

    <div id="embyActivity" style="margin-left:5px;"></div>

    <div id="embyNews"></div>
    <div id="embyPaths"></div>
    <div id="embySystem"></div>
    `;


var dashboardTimerIndex;                               // <------------<<<  why do I need this ??????????????
var dashboardTimeout = 5000;  // five seconds


function makeDevice(deviceId,sessionId) {

    var device = document.createElement("div");
    //
    device.id                    = "Dev_"+deviceId;
    device.style.border          = "1px solid blue";
    device.style.width           = "300px";
    //device.style.height          = "350px";
    device.style.marginRight     = "5px";
    device.style.marginTop       = "5px";
    device.style.display         = "inline-block";
    device.style.verticalAlign   = "top";
    device.style.backgroundColor = "gray"
    device.style.color           = "white";

    var channelNode = document.createElement("div");
    channelNode.id  = "Channel_"+deviceId;
    device.appendChild(channelNode);                   // this is child 0   --   Channel Name

    tNode = document.createElement("div");
    tNode.innerHTML = "";
    device.appendChild(tNode);                         // this is child 1   --   text

    device.appendChild( makeProgressBar(deviceId) );          // this is child 2   --   progress bar

    var userPhoto = document.createElement("div");
    userPhoto.id = "Up_"+deviceId;
    userPhoto.style.float = "right";
    device.appendChild( userPhoto );                   // this is child 3   --   Photo

    var deviceBtns = document.createElement("div");
    deviceBtns.id = "DB_"+deviceId;
    deviceBtns.style.textAlign = "center";
    deviceBtns.style.marginTop = "4px";

    var devBtnsStr = `<button onclick= "stopRemoteSession('${deviceId+"_"+sessionId}')" class="playerButton" type="button">Stop</button>
                      <button onclick="pauseRemoteSession('${deviceId+"_"+sessionId}')" class="playerButton" type="button" style="margin-left:3px;">Pause</button>
                      <button onclick= "prevRemoteSession('${deviceId+"_"+sessionId}')" class="playerButton" type="button" style="margin-left:3px;">Prev</button>
                      <button onclick= "nextRemoteSession('${deviceId+"_"+sessionId}')" class="playerButton" type="button" style="margin-left:3px;">Next</button>`;
    deviceBtns.innerHTML = devBtnsStr;

    device.appendChild( deviceBtns );                 // this is child 4   --   buttons  (stop, pause, prev-video, next-video)

    return device;
};

function makeProgressBar(i) {
    var div = document.createElement("div");
    var barHTML = 
        '<div id="progressBar" style="position:relative; text-align:center; width:100%; height:25px; border: 1px solid white; background-color:grey;">'+
            '<div id="myBar_'+i+'" style="width:1%; height:100%; background-color:red;">'+
                '<div id="myBarLabel" style="height:25px; text-align:center; color:white";>0%</div>'+
            '</div>'+
        '</div>';
        div.innerHTML = barHTML;
    return div;
};



function sendSessionCommand2(command,deviceId, id) {
    //console.log("=== Command = "+command+", deviceId = "+deviceId+", id = "+id);

    var url = server_url+"Sessions/"+id+"/Playing/"+command+"?"+  // this is the id
                //"X-Emby-Client=Emby%20Web"+
                //"&X-Emby-Device-Name=Chrome"+
                "X-Emby-Device-Id="+deviceId+    // this is the deviceId
                //"&X-Emby-Client-Version=4.6.7.0"+
                "&api_key="+api_key;
    upload(url, "");
};


function stopRemoteSession(i) {  // i = deviceId
    //console.log("=== Stop Remote Session "+i);

    let aa = i.split("_");
    let deviceId = aa[0];
    let id = aa[1];

    sendSessionCommand2("Stop",deviceId,id);
};
function pauseRemoteSession(i) {  // i = deviceId
    let aa = i.split("_");
    let deviceId = aa[0];
    let id = aa[1];
    sendSessionCommand2("PlayPause",deviceId,id);
};
function prevRemoteSession(i) {  // i = deviceId
    let aa = i.split("_");
    let deviceId = aa[0];
    let id = aa[1];
    sendSessionCommand2("PreviousTrack",deviceId,id);
};
function nextRemoteSession(i) {
    let aa = i.split("_");
    let deviceId = aa[0];
    let id = aa[1];
    sendSessionCommand2("NextTrack",deviceId,id);
};



//---------------------------------------------------------------------------
//
//                              DASHBOARD
//
//---------------------------------------------------------------------------

function dashboard(includeActivity) {

    let myDash = document.getElementById("dashboard_area");

    while (myDash.firstChild) { myDash.firstChild.remove(); };
    myDash.innerHTML = dashboardHTML;

    //console.log("************** Dashboard **************");
    
    //.......................................................
    //
    // start timer
    //
    timerCallback();
    //
    //
    //
    //var url = server_url+"Sessions?ActiveWithinSeconds=300&IncludeAllSessionsIfAdmin=true&api_key="+api_key;
    //download(url, onComplete_1, false);

    //.......................................................

    var devices = document.getElementById("myDevices");
    var deviceStack = [];
    var timerCountArray = [];
    var timerCount = 0;
    //
    // hide dashboard
    //
    document.getElementById("dashboard_area").style.display = "none";   // hide the dashboard

    //.......................................................

    function timerCallback() {
        //console.log(". "+timerCount);

        if(dashboardTimerIndex) clearTimeout(dashboardTimerIndex); // needed to guarantee only one timer

        timerCount++;

        var url = server_url+"Sessions?ActiveWithinSeconds=300&IncludeAllSessionsIfAdmin=true&api_key="+api_key;
        download(url, onComplete_1, false);

        dashboardTimerIndex = setTimeout(timerCallback, dashboardTimeout);
    };
    
    //.......................................................

    function addNewDevice(deviceId,sessionId) {
        var device = makeDevice(deviceId,sessionId);  // create a new device
        devices.appendChild( device );                // put device into the DOM
        return device
    };

    //.......................................................
    //
    //      Build the Dashboard
    //
    //.......................................................
    function onComplete_1(sessions, update) {
        //console.log("*****************************************************");
        
        //console.log("*** Sessions, Get OK ***",sessions); 

        //
        // this is how to sort objects - we need this to stabalize the devices display
        //
        sessions = sessions.sort(function(a,b){  //return a.Id - b.Id
                                    let x = a.Id.toLowerCase();
                                    let y = b.Id.toLowerCase();
                                    if (x < y) {return -1;}
                                    if (x > y) {return 1;}
                                    return 0;
                                });


        while (devices.firstChild) { devices.firstChild.remove(); }; // remove existing devices




        //
        // loop through each session
        //
        sessions.map( (session) => {
        
            var tNode;              // device text node
            var pbNode;             // device progress bar node
            var chNode;             // Channel name node
            var device;

            var index = session.DeviceId.toString();
            //
            // add the session to the pull down list
            //
            // $trd.append('<option value="'+index+'">'+session.DeviceName+'</option>');  // add a tag to the pulldown list

            if( session.NowPlayingItem ) {
                //console.log("=== Index = "+index+", Session = ",session);

                //.......................................................
                //
                //  a "device" object defines a physical device like a tv or monitor
                //
                var channelNbr = -1;
                //console.log("=== Current Session "+i+" = ",currentSessionData[i]);
                //if(currentSessionData[index]) channelNbr = currentSessionData[index][4]; // get channel number from the old session, if any

                if(update) {
                    device = deviceStack[index];  // keep the 'device' cached
                    if(!device) {
                        device = addNewDevice(index, session.Id);
                        deviceStack[index] = device;
                    };
                } else {
                    //
                    // get a new device object
                    //
                    device = addNewDevice(index, session.Id);
                    deviceStack[index] = device;           // cache the new device
                };
                //
                // get the internal device nodes
                //
                chNode = device.childNodes[0];    // this is the channel name node
                tNode  = device.childNodes[1];    // this is where the device text goes
                tNode.innerHTML = "";             // clear the device text
                pbNode = device.childNodes[2];    // this is the node for the progress bar
                
                //console.log("*** Current device ("+i+") = ",device);
                //
                // channel number
                //
                if (channelNbr > -1) chNode.innerHTML = channelNbr;
                //.......................................................

                var e     = [];
                var n     = [];
                var names = [];

                e[0] = session.UserName;
                e[1] = session.DeviceName;                   
                e[2] = session.RemoteEndPoint;               
                e[3] = session.PlaylistIndex;                
                e[4] = session.PlaylistLength;               
                e[5] = session.PlayState.PlayMethod;        
                e[6] = session.PlayState.PositionTicks;      //  <--------<<<<<
                e[7] = session.UserId;                    
                e[8] = session.UserPrimaryImageTag;
                
             
                e[9]  = (session.PlayState) ? session.PlayState.PlaybackRate : false;
                e[10] = (session.PlayState) ? session.PlayState.SubtitleOffset : false;
                e[13] = (session.PlayState) ? session.PlayState.SubtitleStreamIndex : false;

                e[31] = (session.PlayState) ? session.PlayState.IsMuted : false;
                e[32] = (session.PlayState) ? session.PlayState.IsPaused : false;
           

                if(session.TranscodingInfo) {
                    e[12] = session.TranscodingInfo.width;        
                    e[13] = session.TranscodingInfo.AudioChannels;
                    e[14] = session.TranscodingInfo.AudioCodec;
                    e[15] = session.TranscodingInfo.Bitrate;
                    e[16] = session.TranscodingInfo.Container;
                    e[17] = session.TranscodingInfo.Height;
                    e[18] = session.TranscodingInfo.IsAudioDirect;
                    e[19] = session.TranscodingInfo.IsVideoDirect;
                    e[20] = session.TranscodingInfo.SubProtocol;
                    e[21] = session.TranscodingInfo.TranscodeReasons;
                    e[22] = session.TranscodingInfo.VideoCodec;
                    e[23] = session.TranscodingInfo.VideoDecoder;
                    e[24] = session.TranscodingInfo.VideoDecoderIsHardware;
                    e[25] = session.TranscodingInfo.VideoDecoderMediaType;
                    e[26] = session.TranscodingInfo.VideoEncoder;
                    e[27] = session.TranscodingInfo.VideoEncoderHwAccel;
                    e[28] = session.TranscodingInfo.VideoEncoderIsHardware;
                    e[29] = session.TranscodingInfo.VideoEncoderMediaType;
                    e[30] = session.TranscodingInfo.VideoPipelineInfo;
                };

                names[0] = "User Name";
                names[1] = "Device Name";
                names[2] = "Remote End Point";
                names[3] = "Playlist Index";
                names[4] = "Playlist Length";
                names[5] = "Play Method";
                names[6] = "Position Ticks";

                if(session.NowPlayingItem) {
                    if(document.getElementById("DB_"+index)) document.getElementById("DB_"+index).style.display = 'block';

                    var npi = session.NowPlayingItem;
                    n[0] = npi.Name;
                    n[1] = npi.RunTimeTicks;  // length of media
                    n[2] = npi.Overview;
                    n[3] = npi.ParentBackdropImageTags;
                    n[4] = npi.ParentBackdropItemId;
                    n[5] = npi.Genres;
                    n[6] = npi.Height;
                    n[7] = npi.ImageTags.Primary;
                    n[8] = npi.MediaType;
                    n[9] = npi.ParentId;
                    n[10] = npi.ParentLogoImageTag;
                    n[11] = npi.Width;
                    n[12] = npi.SeriesName;
                    n[13] = npi.SeasonName;
                    n[14] = npi.Type;           //Episode
                    n[15] = npi.ProductionYear;
                    n[16] = npi.MediaType;     // video

                    e[33] = (npi.MediaStreams[0]) ? npi.MediaStreams[0].BitRate : 0;
                    e[34] = (npi.MediaStreams[0]) ? npi.MediaStreams[0].Codec : 0;
                    e[35] = (npi.MediaStreams[1]) ? npi.MediaStreams[1].BitRate : 0;
                    e[36] = (npi.MediaStreams[1]) ? npi.MediaStreams[1].Codec : 0;


                    var temp = "";
                    var timePlayed = convertTime(e[6]);
                    if(n[0]) {
                        var timeLength = convertTime(n[1]);    // minutes

                        if(n[14]=="Episode") {
                            temp += "<div style='font-size:25px; text-align:center;'>"+n[0]+
                                    "<div style='font-size:15px; line-height:15px;'>"+n[12]+" - "+n[13]+"<br>Length "+timeLength+
                                    " (Playing "+timePlayed+")</div></div>";
                        } else {
                            temp += "<div style='font-size:25px; text-align:center;'>"+n[0]+
                                    "<br><span style='font-size:15px'>Length "+timeLength+
                                    " (Playing "+timePlayed+")</span></div></div>";
                        };
                    };
                    //.......................................................
                    addBg("Dev_"+index, session.NowPlayingItem);

                } else {

                    temp = "<div style='font-size:25px; text-align:center;'>No Media Playing</div>";

                    var tCnt = timerCountArray[device.id];

                    if (tCnt) {
                        var dt = (timerCount-tCnt)*5;
                        if(dt>60) {
                            dt = (dt/60).toFixed(0);
                            temp += "<br>Last Seen "+dt+" minutes ago<br>";
                        } else
                            temp += "<br>Last Seen "+dt+" seconds ago<br>";

                    } else timerCountArray[device.id] = timerCount;

                    device.style.backgroundImage = "none";

                    var bar = document.getElementById("myBar_"+index);
                    bar.style.width = "0%";
                    bar.innerHTML = "0%";

                    document.getElementById("DB_"+index).style.display = 'none';
                };
                //
                // add user name and photo
                //
                var url_p = server_url+"Users/"+session.UserId+"/Images/Primary?maxWidth=80&tag="+session.UserPrimaryImageTag+"&quality=90";
                //console.log("*** User Photo URL = "+url_p);
                if(e[0]) {
                    temp += '<br><div style="font-size:25px; text-align:center;">"'+e[0]+'" '+
                            "<img src="+url_p+" class='roundImage' width=55 height=55 style='margin-left:5px; border:1px solid white; vertical-align:middle'></img></div><br>";
                } else {
                    temp += '<br><div style="font-size:25px; text-align:center;">No Name Given</div>';
                };
                //
                // add other data
                //
                temp += "<table style='background:gray; width:100%'>";

                for(j=1; j<6; j++) {
                    temp += "<tr><td>"+names[j]+"</td><td>: "+e[j]+"</td></tr>";
                };

                temp += "<tr><td>Resolution</td><td>: "+n[11]+"</td></tr>";

                if(session.NowPlayingItem) {

                    var xx = (e[32] == true) ? "<span style='color:white; background-color:red;'><b>"+e[32]+"</b></span>" : e[32];
                    var yy = (e[31] == true) ? "<span style='color:white; background-color:red;'><b>"+e[31]+"</b></span>" : e[31];

                    temp += "<tr><td>Muted "+yy+"</td><td>: Paused "+xx+"</td></tr>";
                    temp += "<tr><td>Codec "+e[34]+"</td><td>: Bit Rate "+(e[33]/1000).toFixed(0)+" Kb/s</td></tr>";
                    temp += "<tr><td>Codec "+e[36]+"</td><td>: Bit Rate "+(e[35]/1000).toFixed(0)+" Kb/s</td></tr></table>";
                };
                //temp += "Session Device Id = "+session.DeviceId

                //
                // add the text to the device
                //
                if(tNode) tNode.innerHTML = temp;
                
                //.......................................................
                //
                // update the progress bar for this session, meaning session 'i'
                //
                if(session.NowPlayingItem) {
                    var bar = document.getElementById("myBar_"+index);
                    var progress = e[6];
                    var total    = n[1];
                    var delta    = (100*(progress/total)).toFixed(0);
                    if(delta>100) delta = 100;
                    if(bar) {
                        bar.style.width = delta + "%";
                        bar.innerHTML = ""+delta+"%";
                    };
                };
                //....................................................... 
            };                       
        });
        //masterCounter++;

        if(includeActivity) addActivityAndNews();
    };
    //
    //
    //
    function convertTime(timeTicks){
        if (timeTicks) {
            //var s = (timeTicks / 10000000);     // time in seconds
            var ms = (timeTicks / 10000);         // miliseconds
            var result = new Date(ms).toISOString().slice(11, 19);   //    <-----------------<<<<<
            //console.log("*** time = "+result);                       // "00:10:00" (hh:mm:ss)

            return result;
        } else return false;
    };
    //
    //
    //
    function addBg(divId, mediaObj) {
        var bg_url = "";

        if (mediaObj.BackdropImageTags[0]) {
            bg_url = server_url+"Items/"+mediaObj.Id+"/Images/Backdrop/0?tag="+mediaObj.BackdropImageTags+"&maxWidth=400&quality=70";
            //console.log("=== Background Image Tag found, "+mediaObj.BackdropImageTags[0]);
        } else if (mediaObj.SeriesPrimaryImageTag) {
            bg_url = server_url+"Items/"+mediaObj.SeriesId+"/Images/Backdrop/0?tag="+mediaObj.SeriesPrimaryImageTag+"&maxWidth=400&quality=70";
            //console.log("=== Series Primary Image Tag found, "+mediaObj.SeriesPrimaryImageTag);
        } else if (mediaObj.ParentBackdropImageTags && mediaObj.ParentBackdropImageTags[0]) {
            bg_url = server_url+"Items/"+mediaObj.ParentBackdropItemId+"/Images/Backdrop/0?tag="+mediaObj.ParentBackdropImageTags[0]+"&maxWidth=400&quality=70";
            //console.log("=== Parent Background Image Tag found, "+mediaObj.ParentBackdropImageTags[0]);
        } else {
            bg_url = server_url + "Items/"+mediaObj.Id+"/Images/Primary?api_key=" + api_key;
            //console.log("=== Image from the object id, "+bg_url);
        };

        if(document.getElementById(divId)) {
            document.getElementById(divId).style.backgroundImage = "url("+bg_url+")";      
                //$(divId).css("background-size", "contain"); 
                //$(divId).css("background-size", "400px 250px"); 
            document.getElementById(divId).style.backgroundSize = "100%"; 

            document.getElementById(divId).style.backgroundColor = "rgba(0, 0, 0, 0.4)";
            document.getElementById(divId).style.backgroundBlendMode = "overlay";

            document.getElementById(divId).style.backgroundRepeat = "no-repeat";
                //$(divId).css("background-attachment","fixed");
        };
    };
};

//
//
//
function addActivityAndNews() {
    //----------------------------------------------------------------------------------------------------
    //
    // list the latest Emby Activity
    //
    var url = server_url+"System/ActivityLog/Entries?StartIndex=0&Limit=10&api_key="+api_key;
    download(url, deviceActivity);

    function deviceActivity(data) {
        //("*** Get Activity OK ",data);

        var activity = document.getElementById("embyActivity");
        var textHTML = "<br><div class='devicesTitle'>Emby Activity</div><br>";
        //
        //  add each item
        //
        data.Items.map( (item) => {
            var date = new Date(); //(item.Date).toDateString();
            if(item.UserId) {
                var url = server_url+"Users/"+item.UserId+"/Images/Primary?maxWidth=80&tag="+item.UserPrimaryImageTag+"&quality=90";
                
                textHTML += "<div'><div style='float:left; margin-right:5px;'>"+
                            "<img src="+url+" class='roundImage' style='width:50px; height=50px; margin-bottom:3px;'></img></div>"+
                            "<div>"+item.Name+" : "+item.Type+"<br>"+date+"</div></div><br><br>";
            };
        });

        activity.innerHTML = textHTML;
    };
    //----------------------------------------------------------------------------------------------------
    //
    // list the latest Emby News
    //
    // var url = server_url+"News/Product?StartIndex=0&Limit=10&X-Emby-Device-Id="+deviceId+"&api_key="+api_key;
    // download(url, deviceNews);

    // function deviceNews(data) {
    //     console.log("*** Get News OK ",data);

    //     var news = document.getElementById("embyNews");
    //     var textHTML = "<div class='tvgTitles'>Emby News</div><br>";
    //     //
    //     //  add each item
    //     //
    //     data.Items.map( (item) => {
    //         var date = new Date(item.Date).toDateString();

    //         textHTML += "<div style='margin-left:10px; margin-bottom:5px;'><a href="+item.Link+">"+item.Title+"</a><br>"+date+"</div><br>"; 
    //         //textHTML += item.DescriptionHtml;
    //         //textHTML += item.Description+"<br>"+date+"<br>";
    //     });

    //     news.innerHTML = textHTML;
    // };
    //----------------------------------------------------------------------------------------------------

    // var info = [];

    // info[0]  = system_obj.ServerName;
    // info[1]  = system_obj.Version;
    // info[2]  = system_obj.SystemUpdateLevel;
    // info[3]  = system_obj.HasUpdateAvailable;
    // info[4]  = system_obj.HasPendingRestart;

    // info[5]  = system_obj.OperatingSystem;
    // info[6]  = system_obj.SupportsHttps;
    // info[7]  = system_obj.SupportsLocalPortConfiguration;
    // info[8]  = system_obj.LocalAddress;
    // info[9]  = system_obj.WanAddress;
    // info[10] = system_obj.HttpServerPortNumber;
    // info[11] = system_obj.HttpsPortNumber;
    // //.......................................................
    // var myPaths = [];

    // myPaths[0] = system_obj.CachePath;
    // myPaths[1] = system_obj.InternalMetadataPath;
    // myPaths[2] = system_obj.ItemsByNamePath;
    // myPaths[3] = system_obj.LogPath;
    // myPaths[4] = system_obj.ProgramDataPath;
    // myPaths[5] = system_obj.TranscodingTempPath;

    // var myPathNames = [];

    // myPathNames[0] = "Cache Path";
    // myPathNames[1] = "Internal Metadata Path";
    // myPathNames[2] = "Items By Name Path";
    // myPathNames[3] = "Log Path";
    // myPathNames[4] = "Program Data Path";
    // myPathNames[5] = "Transcoding Temp Path";

    // var embyPaths = document.getElementById("embyPaths");
    // var textHTML = "<div class='tvgTitles'>Emby Paths</div><br>";
    // textHTML += "<div style='margin-left:10px; font-size:20px;'><table>";
    // for(var j=0; j<5; j++) {
    //     textHTML += "<tr><td>"+myPathNames[j]+"</td><td>"+myPaths[j]+"</td></tr>"; 
    // };
    // textHTML += "</table></div><br>";
    // embyPaths.innerHTML = textHTML;
};

            