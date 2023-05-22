

var tools2_HTML = `

<button id="prev_page_btn" class="prev_page_button">Previous Page</button>
<button id="dashboard_btn" class="prev_page_button">Dashboard</button>

<div id="topPageTitleArea">
    <label id="topPageTitle">Libraries</label>
    <label id="topPageCount"></label>
</div>

<div id="main_container">
    <table>
        <tr>
            <td>
                <div id="button_node"></div>
                <div id="scroll_div">
                    <div id="page_node"></div>
                </div
            </td>
            <td>
                <div id="side_node"></div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="dashboard_area"></div>
            </td>
        </tr>
    </table>
</div>

<div id="modal_node"></div>
`;

var star = "⭐";

var embyServerIp   = "http://192.168.1.201";
var embyServerPort = "8096";
var server_url     = embyServerIp+":"+embyServerPort+"/emby/";

var api_key;
var user_id;
var signon_obj;

var page_queue = [];
var selected_items = [];

var search_for_char = "";
var search_found_id = "";
var applyCustomFilter = false;
var applyGlobalFilter = false;

var filter_string = "";

var playlistId;
var collectionId;

//-----------------------------------------------------------
//    Add Sideboard
//-----------------------------------------------------------
function add_sideboard(){
    let sideDiv = document.createElement("DIV"); 
    sideDiv.id = "sideDiv";

    let alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    for(let i = 0; i<=25; i++) {
        let lbl = document.createElement("LABEL");
        lbl.innerHTML = "<div id=alpha_"+alphabet[i]+" class='side_item' style='text-align:center;' >"+alphabet[i]+"</div>";
        lbl.className = "alphabet";
        sideDiv.appendChild(lbl);
    };

    let sn = document.getElementById("side_node");
    sn.appendChild(sideDiv);

    // document.getElementById("side_node").onclick = function (event) {
    //     event.preventDefault();
    //     const { nodeName, id } = event.target;    // get the node name and id from the clicked target
    //     let a = id.split("_");
    //     let clicked_ch = a[1];
    //     console.log("_____________ Clicked on Alpha _____________",clicked_ch);
    // };
};
//-----------------------------------------------------------
//   Remove Sideboard
//-----------------------------------------------------------
function remove_sideboard(){
    let sn = document.getElementById("side_node");
    while (sn.firstChild) { sn.firstChild.remove(); };
};

//-----------------------------------------------------------
//   Default Image
//-----------------------------------------------------------
function getDefaultImage() {
    return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAC3ARMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5Pooor/RA+DCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z";
    //return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAIiAZADAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJ/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/Z";
};

//-----------------------------------------------------------

var myDevice = { "Client":"EmbyTool", "DeviceName":"ChromeEdge", "DeviceId":"12121212-1212-1212-12121212121212121", "ApplicationVersion":"1.0.0.0" };

var deviceId = "12121212-1212-1212-12121212121212121";

//-----------------------------------------------------------
//   get next url
//-----------------------------------------------------------
function get_next_url(item) {

    if(!item) return server_url+"Users/"+user_id+"/Views?Fields=Genres%2COverview%2CTags%2CPath&api_key="+api_key;

    let Recursion = "true";
    let more =  "DateCreated%2CIndexOptions%2CMediaStreams%2CProviderIds%2CSortName%2CTaglines%2CUserData%2CTags%2CGenres%2CParentId%2CPath%2COverview%2C";

    let collection_type_url = {
        //"livetv"      : emby_url+"LiveTv/EPG?Type=TV&Fields=MediaStreams%2COverview%2CPath%2CProviderIds&api_key="+api_key, //emby_url+"Users/"+user_id+"/Views",
        "livetv"      : server_url+"Users/"+user_id+"/Views?Fields=Genres%2COverview%2CTags%2CPath&api_key="+api_key,
        "tvshows"     : server_url+"Users/"+user_id+"/Items?Recursive="+Recursion+"&ParentId="+item.Id+"&Fields=Genres%2COverview%2CTags%2CPath&IncludeItemTypes=Series&api_key="+api_key,
        "movies"      : server_url+"Users/"+user_id+"/Items?Recursive="+Recursion+"&ParentId="+item.Id+"&Fields="+more+"&IncludeItemTypes=Movie&api_key="+api_key,
        "music"       : server_url+"Users/"+user_id+"/Items?Recursive="+Recursion+"&ParentId="+item.Id+"&Fields=Genres%2CParentId%2CTags&Filters=IsFolder&api_key="+api_key,
        "audiobooks"  : server_url+"Users/"+user_id+"/Items?Recursive="+Recursion+"&ParentId="+item.Id+"&Fields=Genres%2CParentId%2CTags&Filters=IsFolder&api_key="+api_key,
        "audiobooks"  : server_url+"Users/"+user_id+"/Items?ParentId="+item.Id+"&Fields=Genres%2CParentId%2CTags&api_key="+api_key,
        "homevideos"  : server_url+"Users/"+user_id+"/Items?Recursivr="+Recursion+"&ParentId="+item.Id+"&Fields=Genres%2COverview%2CTags%2CPath&api_key="+api_key,
        "books"       : server_url+"Users/"+user_id+"/Items?Recursivr="+Recursion+"&ParentId="+item.Id+"&Fields=Genres%2COverview%2CTags%2CPath&api_key="+api_key,
        "musicvideos" : server_url+"Users/"+user_id+"/Items?ParentId="+item.Id+"&Fields=Genres%2CParentId%2CTags&api_key="+api_key,
        "boxsets"     : server_url+"users/"+user_id+"/items?Fields=Genres%2CChildCount%2CRecursiveItemCount%2COverview&Recursive="+Recursion+"%2CTags&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=boxset&api_key="+api_key,
        "playlists"   : server_url+"Users/"+user_id+"/Items?ParentId="+item.Id+"&Fields=Genres%2COverview%2CTags%2CPath&api_key="+api_key,
        };

    let type_url = {
        "Playlist"         : server_url+"Playlists/"+item.Id+"/Items?Fields=Genres,Overview,Tags,Path&api_key="+api_key,   
        "Series"           : server_url+"Users/"+user_id+"/Items?Recursive="+Recursion+"&ParentId="+item.Id+"&Fields=Genres%2COverview%2CTags%2CPath&IncludeItemTypes=Season&api_key="+api_key,
        "Season"           : server_url+"Users/"+user_id+"/Items?Recursive="+Recursion+"&ParentId="+item.Id+"&Fields=Genres%2COverview%2CTags%2CPath&IncludeItemTypes=Episode&api_key="+api_key,
        "BoxSet"           : server_url+"users/"+user_id+"/items?Parentid="+item.Id+"&Fields=Genres%2COverview%2CTags&api_key="+api_key,
        "PhotoAlbum"       : server_url+"users/"+user_id+"/items?Parentid="+item.Id+"&Fields=Genres%2COverview%2CTags&api_key="+api_key,
        "CollectionFolder" : server_url+"Users/"+user_id+"/Items?ParentId="+item.Id+"&Fields=Genres%2COverview%2CTags%2CPath&api_key="+api_key,
        "Channel"          : server_url+"Users/"+user_id+"/Items?Recursive="+Recursion+"&ParentId="+item.Id+"&Fields=Genres%2COverview%2CTags%2CPath&IncludeItemTypes=Trailer&api_key="+api_key,
        "Folder"           : server_url+"users/"+user_id+"/items?Parentid="+item.Id+"&Fields=Genres%2COverview%2CTags&api_key="+api_key
        };
    
    if (item.CollectionType) return collection_type_url[item.CollectionType];
    else if (item.Type) return type_url[item.Type];
    else return server_url+"Users/"+user_id+"/Views?Fields=Genres%2COverview%2CTags%2CPath&api_key="+api_key;
};
//-----------------------------------------------------------
//   get media width and height
//-----------------------------------------------------------
function get_dimensions (item) {
    if(!item) return { 'width':200, 'height':100 };

    options_1 = {
        "livetv"      : {'width':200, 'height':100 },
        "movies"      : {'width':200, 'height':300 },
        "tvshows"     : {'width':200, 'height':300 },
        "music"       : {'width':200, 'height':200 },
        "audiobooks"  : {'width':200, 'height':250 },
        "homevideos"  : {'width':200, 'height':160 },
        "books"       : {'width':200, 'height':250 },
        "musicvideos" : {'width':200, 'height':160 },
        "boxsets"     : {'width':200, 'height':300 },
        "playlists"   : {'width':200, 'height':250 }
    };
    options_2 = { 
        "Season"           : {'width':200, 'height':150 },
        "Playlist"         : {'width':200, 'height':200 },
        "UserView"         : {'width':200, 'height':100 },
        "Series"           : {'width':200, 'height':300 },
        "BoxSet"           : {'width':200, 'height':300 },
        "PhotoAlbum"       : {'width':200, 'height':200 },
        "CollectionFolder" : {'width':200, 'height':100 },
        "Channel"          : {'width':200, 'height':250 },
        "Folder"           : {'width':200, 'height':150 },
        "Trailer"          : {'width':200, 'height':300 },
        "MusicVideo"       : {'width':200, 'height':150 },
        "Photo"            : {'width':200, 'height':200 },
        "Movie"            : {'width':200, 'height':300 },
        "Audio"            : {'width':200, 'height':200 },
        "Video"            : {'width':200, 'height':150 },
        "Episode"          : {'width':200, 'height':200 }
    };

    if (item.CollectionType) return options_1[item.CollectionType];
    else if (item.Type)      return options_2[item.Type];
    else return { 'width':200, 'height':100 };
};









function prev_page_btn(){
    //
    // clear epg timer
    //
    clearTimeout(epgTimerIndex);
    clearTimeout(timerIndex);

    document.getElementById("side_node").style.display = "block";

    let top_item;
    let current_item;
    let scroll_position = 0;

    playlistId   = undefined;
    collectionId = undefined;

    selected_items = [];

    console.log("<<<<<<<<<<< page queue = ",page_queue);
    
    if(page_queue.length>0) page_queue.pop();                // remove temp data from display page
    
    if(page_queue.length>0) current_item = page_queue.pop(); // remove current page

    if(current_item) {
        scroll_position = current_item["scroll_to"];
        console.log("=== scroll position = ",scroll_position);
    };

    if(page_queue.length>0) {
        top_item = page_queue[page_queue.length-1]; 
    };
    if(top_item) document.getElementById("topPageTitle").innerText = top_item.Name;
            else document.getElementById("topPageTitle").innerText = "Libraries";

    let url = get_next_url(top_item);
    let dimensions = get_dimensions(top_item);

    console.log("=== top item = ",top_item);
    console.log("=== url  = ",url);
    
    views(url, dimensions.width, dimensions.height, scroll_position);
};
//-----------------------------------------------------------
//
//-----------------------------------------------------------
function goto_page(item) {
    console.log("=== next page, ",item); // this is the item that was clicked

    page_queue.pop(); // remove temp data
    page_queue.push(item);

    console.log(">>>>>>>>>> page queue = ",page_queue);

    let url = get_next_url(item);
    let dimensions = get_dimensions(item);

    console.log("======> dimension = ",dimensions);
    console.log("======> url = ",url);

    views(url, dimensions.width, dimensions.height, 0);
};

//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

signon(callback);

//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

function callback(data) {
    //
    // get signon data locally if it exists
    //
    let sd = {"name":"", "pw":"", "ss":"", "ps":"", "om":""};

    if(document.getElementById("saveSignOnData").checked) {
        sd.name = document.getElementById("usernameString").value;
        sd.pw   = document.getElementById("passwordString").value;
        sd.ss   = document.getElementById("serverString").value;
        sd.ps   = document.getElementById("portString").value;
        sd.om   = document.getElementById("omdbString").value;

        //sd.cb_1 = document.getElementById("includeDashboard").checked;       // dashboard
        //sd.cb_2 = document.getElementById("includeEmbyActivity").checked;    // activity
        //sd.cb_3 = document.getElementById("excludeBG").checked;              // exclude BG
        sd.cb_4 = document.getElementById("saveSignOnData").checked;         // save data
        //sd.cb_5 = document.getElementById("includeCleanBtn").checked;        // include clean button
        //sd.cb_6 = document.getElementById("includeChannelBuilderBtn").checked;        // include channel builder button

        localStorage.setItem("EMBY_SD", JSON.stringify(sd));
    } else {
        localStorage.removeItem("EMBY_SD");
    };





    //
    //   clear top page area
    //
    var tn = document.getElementById("topmost_node");
    while (tn.firstChild) { tn.firstChild.remove(); };
    //
    //   load top page area with html
    //
    tn.innerHTML = tools2_HTML;
    //tn.style.backgroundColor = "yellow";
    //-----------------------------------------------------------
    //   add sideboard
    //-----------------------------------------------------------
    add_sideboard();







    //-----------------------------------------------------------
    //   Dashboard button  (onclick)
    //-----------------------------------------------------------
    document.getElementById("dashboard_btn").onclick = function (event) {
        event.preventDefault();
        console.log("___________ Dashboard Btn ___________");

        if(document.getElementById("dashboard_area").style.display == "none") {
            document.getElementById("dashboard_area").style.display = "block";  // show the dashboard
            dashboardTimeout = 5000;
            document.getElementById("dashboard_btn").className = "dashboard_btn";
        } else {
            document.getElementById("dashboard_area").style.display = "none";   // hide the dashboard
            dashboardTimeout = 15000;
            document.getElementById("dashboard_btn").className = "prev_page_button";
        };
        //document.getElementById("myDashboard").style.visibility = "visible";
    };

    //-----------------------------------------------------------
    //   Previous Page button  (onclick)
    //-----------------------------------------------------------
    document.getElementById("prev_page_btn").onclick = function (event) {
        event.preventDefault();
        console.log("___________ Previous Page Btn ___________");

        filter_string = "";
        
        prev_page_btn();
    };
    //-----------------------------------------------------------
    //  save important signon data
    //-----------------------------------------------------------
    api_key = data.AccessToken;
    user_id = data.SessionInfo.UserId;
    signon_obj = data;
    console.log("=== signon complete === user_id = ",user_id,", api_key = ",api_key);

    page_queue = [];

    //let url = server_url+"Users/"+user_id+"/Views?Fields=Genres%2COverview%2CTags%2CPath&api_key="+api_key;
    let url = get_next_url(undefined);
    views(url, 200, 100, 0);
};

async function download(url, callback, param){
    const res  = await fetch(url);
    const data = await res.json();

    //console.log("== view data = ",data,", view res = ",res);

    if(res.ok == true) {
        if(param)
            callback(data, param); 
        else
            callback(data); 
    };
};








//------------------------------------------------------------------
//
// upload
//
const upload = async (url, data_1, callback, param) => {
    console.log("___ POST ",data_1);
    try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    //'Pragma': 'no-store',
                    //'Cache-Control': 'no-store',
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                body: (typeof data_1 === "string") ? data_1 : JSON.stringify(data_1)
            });
            
            var data_2 = "";
            try {
                data_2 = await response.json();
            } catch (err) {
                console.log("___ No Response Received ___");
            };

            if(callback) callback(data_2, param);

    } catch(error) {
            console.log("=== POST Error = ",error);
    }; 
};








function addImage(image_url, width, id) {
    let iNode = document.createElement("IMG");
    iNode.src = image_url;  // add the image URL to the DOM
    iNode.width = width;
    iNode.id    = id;
    return iNode;
};

function tagsToArray(t_obj,name) { 
    if (!t_obj) return [];
    if (!name)  return [];
    let tag_array = [];
    t_obj.forEach( (n) => { 
        if(n[name]) {
            if(n[name].length > 50) { n[name] = n[name].slice(0,50); };  
            tag_array.push(n[name]); 
        };
    });
    return tag_array;
};


