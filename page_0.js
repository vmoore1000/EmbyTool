


var page_0_HTML = `
<div>
<br>
<span class='keys' style="margin-left: 10px; font-size: 20px;">Color Key</span>
<span style='background-color:brown; color:white' class='keys'>Folder</span>
<span style='background-color:lightgray; color:black' class='keys'>File</span>
<span style='background-color:red; color:white' class='keys'>Tags</span>
<span style='background-color:green; color:white' class='keys'>Genres</span>
<span style='background-color:yellow; color:black' class='keys'>Played File</span>
<span style='color:black; margin-left:5px; font-size: 20px;'>Favorite</span><span style='font-size: 20px; color:red; margin-left:5px'>♥</span>
<br>
<label style="margin-left: 10px; font-size: 20px;">Click to select a file, Ctl-Click to select a folder, Shift-Click to select all files in a folder</label>
<br>
<br>
<label id="signonTitle" style="margin-left: 5px; font-size: 35px;">Please Sign In:</label>
<br>
<br>

<table id="signOnTable" style="border:1px solid lightgray;">
    <tr>
        <td style="width:150px"><label style="margin-left: 5px; font-size: 25px;">Username</label></td>
        <td><input type="text" id="usernameString" style="font-size: 18px;" minlength="3" maxlength="60" size="40" placeholder="Enter User Name"></td>
    </tr>
    <tr>
        <td><label style="margin-left: 5px; font-size: 25px;">Password</label></td>
        <td><input type="password" id="passwordString" style="font-size: 18px;" minlength="8" maxlength="60" size="40" placeholder="Enter User Password"></td>
    </tr>
    <tr>
        <td><label style="margin-left: 5px; font-size: 25px;">Server</label></td>
        <td><input type="text" id="serverString" style="font-size: 18px;" minlength="10" maxlength="60" size="40" placeholder="Enter Server IP"></td>
    </tr>
    <tr>
        <td><label style="margin-left: 5px; font-size: 25px;">Port</label></td>
        <td><input type="text" id="portString" style="font-size: 18px;" minlength="1" maxlength="5" size="5" placeholder="Port"></td>
    </tr>
    <tr>
        <td><label style="margin-left: 5px; font-size: 25px;">OMDB Id</label></td>
        <td><input type="password" id="omdbString" style="font-size: 18px;" minlength="6" maxlength="10" size="10" placeholder="optional"></td>
    </tr>
</table>
<br>
<table>
    <tr>
        <td style="width:250px"><label style="margin-left: 5px; font-size: 25px;">Save 'Sign On' Info</label></td>
        <td><input type="checkbox" id="saveSignOnData" ></td>
    </tr>
</table>

<button id="signOnButton" type="button" class="page_button" style="margin-right:20px; margin-top:20px">Sign In</button>

</div>
`;


var signOnData = {
    "Username" : "",
    "Password" : "",
    "Pw"       : ""
};
var signOnCallback;
var omdbId;

//------------------------------------------------------------------
//
//                         Sign On to Server
//
//------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', (event) => {
    let sd = localStorage.getItem("EMBY_SD");
    if(sd) {
        sd2 = JSON.parse(sd);
        document.getElementById("usernameString").value = sd2.name;
        document.getElementById("passwordString").value = sd2.pw;
        document.getElementById("passwordString").value = sd2.pw;
        document.getElementById("serverString").value   = sd2.ss;
        document.getElementById("portString").value     = sd2.ps;
        document.getElementById("omdbString").value     = sd2.om;

        //document.getElementById("includeDashboard").checked    = sd2.cb_1;    // dashboard
        //document.getElementById("includeEmbyActivity").checked = sd2.cb_2;    // activity
        //document.getElementById("excludeBG").checked           = sd2.cb_3;    // exclude BG
        document.getElementById("saveSignOnData").checked      = sd2.cb_4;    // save data
        //document.getElementById("includeCleanBtn").checked     = sd2.cb_5;    // include clean button
        //document.getElementById("includeChannelBuilderBtn").checked     = sd2.cb_6;    // include channel button
    };


    document.getElementById("signOnButton").onclick = function (event) {
        //event.preventDefault();
        signOnData.Username = document.getElementById("usernameString").value;
        signOnData.Password = document.getElementById("passwordString").value;
        signOnData.Pw       = document.getElementById("passwordString").value;

        let embyServerIp    = document.getElementById("serverString").value;
        let embyServerPort  = document.getElementById("portString").value;

        omdbId              = document.getElementById("omdbString").value;

        var temp = embyServerIp.toLowerCase();
        if(!temp.startsWith("http://") && !temp.startsWith("https://")) embyServerIp = "http://"+embyServerIp;

        console.log("=== signOnData = ",signOnData,", Server Ip = "+embyServerIp+",  Port = "+embyServerPort);

        server_url = ""+embyServerIp+":"+embyServerPort+"/emby/";

        signon_url = server_url+"Users/AuthenticateByName?format=json";

        let goodURL = true

        try { url = new URL(signon_url); } 
        catch (err) { 
            goodURL = false; 
            console.log("=== url error = ",err);
        };

        if( goodURL ) { upload_signon(signon_url, signOnData, signOnCallback); } else { tryAgain(); };
    };
});

function tryAgain() {
    console.log("Signon Failed");

    document.getElementById("usernameString").value = "";
    document.getElementById("passwordString").value = "";
    document.getElementById("passwordString").value = "";
    document.getElementById("serverString").value = "";
    document.getElementById("portString").value = "";
    document.getElementById("omdbString").value = "";

    //$prevPageBtn.style.visibility = "hidden";   // hidden | visible

    document.getElementById("signonTitle").innerText = "Sign On Failed -- Try Again:";
};

async function upload_signon(url, data, callback){
    let h = new Headers();
    h.append('Accept','application/json, text/plain, */*');
    h.append('Content-type', 'application/json; charset=UTF-8');
    h.append('X-Emby-Authorization', 'MediaBrowser Client="EmbyTool", Device="Chrome", DeviceId="12121212-1212-1212-12121212121212121", Version="1.0.0.0"');

    let req = new Request(url, {
        method: 'POST',
        headers: h,
        mode:   'cors',
        body:   JSON.stringify(data)
    });
    let res = await fetch(req);

    if(res.ok) {
        console.log("=== Sign on POST Success ",res);
        let data = await res.json();
        console.log("== signon data = ",data);
        if(callback) callback(data);
    } else {
        console.log("=== signon error ===",res);
        if(callback) callback(res);
    };
};

function test_url(url) {
    let goodURL = true

    try { url = new URL(signon_url); } 
    catch (err) { 
        goodURL = false; 
        console.log("=== url error = ",err);
    };

    return goodURL;
};

function signon(callback) {

    signOnCallback = callback;
    //
    //   clear page area
    //
    var tn = document.getElementById("topmost_node");
    while (tn.firstChild) { tn.firstChild.remove(); };
    //
    //   load page area with html
    //
    tn.innerHTML = page_0_HTML;
    //
    //   background color
    //
    tn.style.backgroundColor = "lightgray";
};

