




var page_4_HTML = `
<div class="sticky-div">
    <button id="apply_btn"     class="page_button">Apply</button>
    <button id="reset_btn"     class="page_button">Reset</button>
</div>
<div id="page_title"></div>
`;

var showWithTag   = 0;
var showWithGenre = 0;
var filter_selectedIndex = [];  // used to save and restore filter selections

function emby_filters(){
    //
    // put placeholder on the page queue
    //
    page_queue.push( {"temp":"temp"} );

    filter_selectedIndex = [];  // used to save and restore filter selections

    console.log("=== Emby Filters ===");

    var bn = document.getElementById("button_node");

    while (bn.firstChild) { bn.firstChild.remove(); };
    //
    // add html
    //
    bn.innerHTML = page_4_HTML;

    var pn = document.getElementById("page_node");
    while (pn.firstChild) { pn.firstChild.remove(); };
    //
    //   capture clicks on the page node
    //
    pn.onclick = function(data){filter_click(data)};
    //
    // hide the side bar
    //
    document.getElementById("side_node").style.display = "none";
    //
    //   button event listeners
    //
    var apply_btn = document.getElementById("apply_btn");
    var reset_btn = document.getElementById("reset_btn");
 

    apply_btn.onclick = function(event){apply(event)};
    reset_btn.onclick = function(event){reset(event)};


    function apply(event) {
        event.preventDefault();
        console.log("___________ apply Btn _____________");
        
        filter_string = getFilterString();
        console.log("=== Filter String = ",filter_string);

        prev_page_btn();
        return;
    };
    function reset(event) {
        event.preventDefault();
        console.log("___________ reset Btn _____________");
        
        filter_string = "";
        resetFilters(false);
        //prev_page_btn();
        return;
    };

    //
    // add all of the filters
    //
    add_emby_filters(pn);


    function add_emby_filters(pn){

        let aa = [["","Sort By ?"],
        ["SortBy=Album","Sort By Album"],
        ["SortBy=AlbumArtist","Sort By Album Artist"],
        ["SortBy=Artist","Sort By Artist"],
        ["SortBy=Budget","Sort By Budget"],
        ["SortBy=CommunityRating","Sort By Community Rating"],
        ["SortBy=CriticRating","Sort By Critic Rating"],
        ["SortBy=DateCreated","Sort By Date Added"],
        ["SortBy=DatePlayed","Sort By Date Played"],
        ["SortBy=PlayCount","Sort By Play Count"],
        ["SortBy=PremiereDate","Sort By Premiere Date"],
        ["SortBy=ProductionYear","Sort By Production Year"],
        ["SortBy=SortName","Sort By Name"],
        ["SortBy=Revenue","Sort By Revenue"],
        ["SortBy=Runtime","Sort By Runtime"],
        ["SortBy=Random","Sort By Random"]];

        let bb = [["","Sort By Direction ?"],
        ["SortOrder=Ascending","Ascending"],
        ["SortOrder=Descending","Descending"]];

        let cc = [["","Has Theme Video ?"],
        ["HasThemeVideo=false","Has Theme Video = false"],
        ["HasThemeVideo=true","Has Theme Video = true"]];

        let dd = [["","Filters ?"],
        ["Filters=IsFolder","Is Folder"],
        ["Filters=IsNotFolder","Is Not Folder"],
        ["Filters=IsUnplayed","Is Unplayed"],
        ["Filters=IsPlayed","Is Played"],
        ["Filters=IsFavorite","Is Favorite"],
        ["Filters=IsResumable","Is Resumable"],
        ["Filters=Likes","Has Likes"],
        ["Filters=Dislikes","Has Dislikes"]];

        let ee = [["","Is Locked ?"],
        ["IsLocked=false","Is Locked = false"],
        ["IsLocked=true","Is Locked = true"]];
        
        let ff = [["","Is Played ?"],
        ["IsPlayed=false","Is Played = false"],
        ["IsPlayed=true","Is Played = true"]];
        
        let gg = [["","Is Sports ?"],
        ["IsSports=false","Is Sports = false"],
        ["IsSports=true","Is Sports = true"]];
        
        let hh = [["","Is Sports ?"],
        ["IsSports=false","Is Sports = false"],
        ["IsSports=true","Is Sports = true"]];

        let ii = [["","Is Kids ?"],
        ["IsKids=false","Is Kids = false"],
        ["IsKids=true","Is Kids = true"]];

        let jj = [["","Is News ?"],
        ["IsNews=false","Is News = false"],
        ["IsNews=true","Is News = true"]];

        let kk = [["","Is Series ?"],
        ["IsSeries=false","Is Series = false"],
        ["IsSeries=true","Is Series = true"]];

        let mm = [["","Is Movie ?"],
        ["IsMovie=false","Is Movie = false"],
        ["IsMovie=true","Is Movie = true"]];

        let nn = [["","Is Favorite ?"],
        ["IsFavorite=false","Is Favorite = false"],
        ["IsFavorite=true","Is Favorite = true"]];

        let pp = [["","Is Unaired ?"],
        ["IsUnaired=false","Is Unaired = false"],
        ["IsUnaired=true","Is Unaired = true"]];

        let qq = [["","Is HD ?"],
        ["IsHD=false","Is HD = false"],
        ["IsHD=true","Is HD = true"]];

        let rr = [["","Has Overview ?"],
        ["HasOverview=false","Has Overview = false"],
        ["HasOverview=true","Has Overview = true"]];

        let ss = [["","Has Local Trailers ?"],
        ["HasTrailer=false","Has Local Trailers = false"],
        ["HasTrailer=true","Has Local Trailers = true"]];

        let tt = [["","Has Theme Song ?"],
        ["HasThemeSong=false","Has Theme Song = false"],
        ["HasThemeSong=true","Has Theme Song = true"]];

        let uu = [["","Has Subtitles ?"],
        ["HasSubtitles=false","Has Subtitles = false"],
        ["HasSubtitles=true","Has Subtitles = true"]];

        let vv = [["","Include Item Types ?"],
        ["IncludeItemTypes=Movie","Include Item Types, Movie"],
        ["IncludeItemTypes=Video","Include Item Types, Video"],
        ["IncludeItemTypes=Series","Include Item Types, Series"],
        ["IncludeItemTypes=Season","Include Item Types, Season"],
        ["IncludeItemTypes=Episode","Include Item Types, Episode"],
        ["IncludeItemTypes=MusicVideo","Include Item Types, Music Video"],
        ["IncludeItemTypes=Audio","Include Item Types, Audio"],
        ["IncludeItemTypes=CollectionFolder","Include Item Types, Collection Folder"],
        ["IncludeItemTypes=Folder","Include Item Types, Folder"],
        ["IncludeItemTypes=BoxSet","Include Item Types, BoxSet"],
        ["IncludeItemTypes=PhotoAlbum","Include Item Types, Photo Album"],
        ["IncludeItemTypes=Photo","Include Item Types, Photo"],
        ["IncludeItemTypes=Playlist","Include Item Types, Playlist"],
        ["IncludeItemTypes=UserView","Include Item Types, User View"]];
        
        let ww = [["","Exclude Item Types ?"],
        ["ExcludeItemTypes=Movie","Exclude Item Types, Movie"],
        ["ExcludeItemTypes=Video","Exclude Item Types, Video"],
        ["ExcludeItemTypes=Series","Exclude Item Types, Series"],
        ["ExcludeItemTypes=Season","Exclude Item Types, Season"],
        ["ExcludeItemTypes=Episode","Exclude Item Types, Episode"],
        ["ExcludeItemTypes=MusicVideo","Exclude Item Types, Music Video"],
        ["ExcludeItemTypes=Audio","Exclude Item Types, Audio"],
        ["ExcludeItemTypes=CollectionFolder","Exclude Item Types, Collection Folder"],
        ["ExcludeItemTypes=Folder","Exclude Item Types, Folder"],
        ["ExcludeItemTypes=BoxSet","Exclude Item Types, BoxSet"],
        ["ExcludeItemTypes=PhotoAlbum","Exclude Item Types, Photo Album"],
        ["ExcludeItemTypes=Photo","Exclude Item Types, Photo"],
        ["ExcludeItemTypes=Playlist","Exclude Item Types, Playlist"],
        ["ExcludeItemTypes=UserView","Exclude Item Types, User View"]];
        
        let xx = [["","Media Types ?"],
        ["MediaTypes=Video","Media Type, Video"],
        ["MediaTypes=Audio","Media Type, Audio"],
        ["MediaTypes=Photo","Media Type, Photo"],
        ["MediaTypes=Playlist","Media Type, Playlist"]];
        
        let yy = [["","Recursive Search ?"],
        ["Recursive=false","Recursive Search = false"],
        ["Recursive=true","Recursive Search = true"]];
        
        let zz = [["","Min Parental Rating ?"],
        ["MinOfficialRating=TV-Y","Min = TV-Y APPROVED (1)"],
        ["MinOfficialRating=TV-G","Min = G E EC TV-G FSK-0 (1)"],
        ["MinOfficialRating=TV-Y7","Min = TV-Y7 (3)"],
        ["MinOfficialRating=TV-Y7-FV","Min = TV-Y7-FV (4)"],
        ["MinOfficialRating=PG","Min = G TV-PG FSK-6 (5)"],
        ["MinOfficialRating=PG-13","Min = PG-13 T FSK-12 (7)<"],
        ["MinOfficialRating=TV-14","Min = TV-14 FSK-16 (8)"],
        ["MinOfficialRating=TV-MA","Min = R M TV-MA FSK-18 (9)"],
        ["MinOfficialRating=NC-17","Min = NC-17 (10)"],
        ["MinOfficialRating=NR","Min = AO RP UR NR X (15)"],
        ["MinOfficialRating=XXX","Min = XXX (100)"]];
        
        let a1 = [["","Max Parental Rating ?"],
        ["MaxOfficialRating=TV-Y","Max = TV-Y APPROVED (1)"],
        ["MaxOfficialRating=TV-G","Max = G E EC TV-G FSK-0 (1)"],
        ["MaxOfficialRating=TV-Y7","Max = TV-Y7 (3)"],
        ["MaxOfficialRating=TV-Y7-FV","Max = TV-Y7-FV (4)"],
        ["MaxOfficialRating=PG","Max = G TV-PG FSK-6 (5)"],
        ["MaxOfficialRating=PG-13","Max = PG-13 T FSK-12 (7)<"],
        ["MaxOfficialRating=TV-14","Max = TV-14 FSK-16 (8)"],
        ["MaxOfficialRating=TV-MA","Max = R M TV-MA FSK-18 (9)"],
        ["MaxOfficialRating=NC-17","Max = NC-17 (10)"],
        ["MaxOfficialRating=NR","Max = AO RP UR NR X (15)"],
        ["MaxOfficialRating=XXX","Max = XXX (100)"]];

        let b1 = [["","Video Type ?"],
        ["Is4K=true","4K"],
        ["IsHD=true","HD"],
        ["IsHd=false","SD"],
        ["Is3D=true","3D"],
        ["VideoTypes=dvd","DVD"],
        ["VideoTypes=bluray","BluRay"],
        ["VideoTypes=iso","ISO"]];

        let c1 = [[0,"Has a tag ?"],
        [1,"Has a tag = false"],
        [2,"Has a tag = true"]];

        let d1 = [[0,"Has a genre ?"],
        [1,"Has a genre = false"],
        [2,"Has a genre = true"]];

        let e1 = [["","Min Community Rating ?"],
        ["MinCommunityRating=1.0","MinCommunityRating=1.0"],
        ["MinCommunityRating=1.5","MinCommunityRating=1.5"],
        ["MinCommunityRating=2.0","MinCommunityRating=2.0"],
        ["MinCommunityRating=2.5","MinCommunityRating=2.5"],
        ["MinCommunityRating=3.0","MinCommunityRating=3.0"],
        ["MinCommunityRating=3.5","MinCommunityRating=3.5"],
        ["MinCommunityRating=4.0","MinCommunityRating=4.0"],
        ["MinCommunityRating=4.5","MinCommunityRating=4.5"],
        ["MinCommunityRating=5.0","MinCommunityRating=5.0"],
        ["MinCommunityRating=5.5","MinCommunityRating=5.5"],
        ["MinCommunityRating=6.0","MinCommunityRating=6.0"],
        ["MinCommunityRating=6.5","MinCommunityRating=6.5"],
        ["MinCommunityRating=7.0","MinCommunityRating=7.0"],
        ["MinCommunityRating=7.5","MinCommunityRating=7.5"],
        ["MinCommunityRating=8.0","MinCommunityRating=8.0"],
        ["MinCommunityRating=8.5","MinCommunityRating=8.5"],
        ["MinCommunityRating=9.0","MinCommunityRating=9.0"],
        ["MinCommunityRating=9.5","MinCommunityRating=9.5"]];

        let f1 = [["","Min Critic Rating ?"],
        ["MinCriticRating=1.0","MinCriticRating=1.0"],
        ["MinCriticRating=1.5","MinCriticRating=1.5"],
        ["MinCriticRating=2.0","MinCriticRating=2.0"],
        ["MinCriticRating=2.5","MinCriticRating=2.5"],
        ["MinCriticRating=3.0","MinCriticRating=3.0"],
        ["MinCriticRating=3.5","MinCriticRating=3.5"],
        ["MinCriticRating=4.0","MinCriticRating=4.0"],
        ["MinCriticRating=4.5","MinCriticRating=4.5"],
        ["MinCriticRating=5.0","MinCriticRating=5.0"],
        ["MinCriticRating=5.5","MinCriticRating=5.5"],
        ["MinCriticRating=6.0","MinCriticRating=6.0"],
        ["MinCriticRating=6.5","MinCriticRating=6.5"],
        ["MinCriticRating=7.0","MinCriticRating=7.0"],
        ["MinCriticRating=7.5","MinCriticRating=7.5"],
        ["MinCriticRating=8.0","MinCriticRating=8.0"],
        ["MinCriticRating=8.5","MinCriticRating=8.5"],
        ["MinCriticRating=9.0","MinCriticRating=9.0"],
        ["MinCriticRating=9.5","MinCriticRating=9.5"]];

        pn.appendChild( document.createElement("BR") ); 

        pn.appendChild(make_pulldown(aa,0));
        pn.appendChild(make_pulldown(bb,1));
        pn.appendChild(make_pulldown(cc,2));
        pn.appendChild(make_pulldown(dd,3));
        pn.appendChild(make_pulldown(ee,4));
        pn.appendChild(make_pulldown(ff,5));
        pn.appendChild(make_pulldown(gg,6));
        pn.appendChild(make_pulldown(hh,7));
        pn.appendChild(make_pulldown(ii,8));
        pn.appendChild(make_pulldown(jj,9));
        pn.appendChild(make_pulldown(kk,10));
        pn.appendChild(make_pulldown(mm,11));
        pn.appendChild(make_pulldown(nn,12));
        pn.appendChild(make_pulldown(pp,13));
        pn.appendChild(make_pulldown(qq,14));
        pn.appendChild(make_pulldown(rr,15));
        pn.appendChild(make_pulldown(ss,16));
        pn.appendChild(make_pulldown(tt,17));
        pn.appendChild(make_pulldown(uu,18));
        pn.appendChild(make_pulldown(vv,19));
        pn.appendChild(make_pulldown(ww,20));
        pn.appendChild(make_pulldown(xx,21));
        pn.appendChild(make_pulldown(yy,22));
        pn.appendChild(make_pulldown(zz,23));
        pn.appendChild(make_pulldown(a1,24));
        pn.appendChild(make_pulldown(b1,25));

        pn.appendChild(make_pulldown(e1,32));
        pn.appendChild(make_pulldown(f1,33));
        

        create_filter_input(pn, "tagFilter",           "Search for Tags",           "80", "Comma delimeted Tags");
        create_filter_input(pn, "genFilter",           "Search for Genres",         "80", "Comma delimeted Genres");
        create_filter_input(pn, "searchFilter",        "Search for String",         "80", "Search String");
        create_filter_input(pn, "videoCodecFilter",    "Search for Video Codec",    "80", "Comma delimeted Codec Names");
        create_filter_input(pn, "audioCodecFilter",    "Search for Audio Codec",    "80", "Comma delimeted Codec Names");
        create_filter_input(pn, "subtitlesCodecFilter","Search for Subtitle Codec", "80", "Comma delimeted Codec Names");
        create_filter_input(pn, "albumsFilter",        "Search for Albums",         "80", "Comma delimeted Album names");
        create_filter_input(pn, "artistsFilter",       "Search for Artists",        "80", "Comma delimeted Artist names");
        create_filter_input(pn, "studiosFilter",       "Search for Studios",        "80", "Comma delimeted Studio names");
        create_filter_input(pn, "imdbFilter",          "Search for imdb/tmdb/tvdb/omdb ids", "20000", "Example imdb.tt4513678,imdb.tt9032400, ..."); // (imdb,tmdb,tvdb,omdb)


        pn.appendChild( document.createElement("BR") ); 
        pn.appendChild( document.createElement("BR") ); 
        //
        // show with tag and show with genre buttons
        //
        pn.appendChild( make_pulldown (c1, 30, "showWithTag")   );
        pn.appendChild( make_pulldown (d1, 31, "showWithGenre") );
        //
        //   restore the status of each emby button
        //
        setFilters();

        return pn;
    };

    function make_pulldown (A, id, className) {
        let x = document.createElement("SELECT");
        x.name = "pulldown";
        x.id = "filter_"+id;
        x.className = (className) ? className : "filterPulldown";
        x.style.width = "200px";
        x.style.height = "30px";
        x.style.fontSize = "14px";
        x.style.textAlign = "center";
        x.style.marginLeft  = "8px";
        x.style.marginBottom = "6px";
        x.style.background = "blue";
        x.style.color = "white";
        let cnt = A.length;
        for(let i=0; i<cnt; i++){
            let y = document.createElement("option");
            y.setAttribute("value", A[i][0]);
            y.innerText = A[i][1];
            x.appendChild(y);
        };
        return x;
    };

    function setFilters() {
        let allFilters = document.querySelectorAll(".filterPulldown");
        let cnt = allFilters.length;
        //
        // restore the status of all emby filters
        //
        for(var i=0; i<cnt; i++ ) {
            let index = filter_selectedIndex[i];

            allFilters[i].selectedIndex = index;

            if(index>0) {
                allFilters[i].style.background = "purple";
            };
        };
        //
        // make sure the button color for the showWithTag and showWithGenre are set correct
        //
        let swt = document.querySelector(".showWithTag");
        if(showWithTag == 0)      {swt.value = 0; swt.style.background = "blue"; }
        else if(showWithTag == 1) {swt.value = 1; swt.style.background = "purple"; }
        else if(showWithTag == 2) {swt.value = 2; swt.style.background = "purple"; };

        let swg = document.querySelector(".showWithGenre");
        if(showWithGenre == 0)      {swg.value = 0; swg.style.background = "blue"; }
        else if(showWithGenre == 1) {swg.value = 1; swg.style.background = "purple"; }
        else if(showWithGenre == 2) {swg.value = 2; swg.style.background = "purple"; };
    };















    function filter_click(data) {

        let target = data.target;
        console.log("=== Pulldown Clicked ===",target);

        if(target.name=="pulldown") {
            let id = target.id.split("_")[1];
            let value = target.value;
            let pd = document.getElementById("filter_"+id);

            if(value == "" || value == 0) pd.style.background = "blue"; else pd.style.background = "purple";
            console.log("=== id = "+id+", value = "+value);
        };
    };

    //---------------------------------------------------------------------
    function create_filter_input(node, id, lblText, maxLength, placeholder) {
        node.appendChild( document.createElement("BR") ); 

        var lbl = document.createElement("LABEL");
        lbl.innerHTML = '<span style="font-size:16px; margin-left:10px; margin-right:10px;">'+lblText+'</span>';
        lbl.style.display = "inline-block";
        lbl.style.width = "270px";
        node.appendChild(lbl);

        x = document.createElement("INPUT");
        x.id = id;
        x.setAttribute("type",        "text");
        x.setAttribute("value",       "");
        x.setAttribute("size",        "40");
        x.setAttribute("maxlength",   maxLength);
        x.setAttribute("placeholder", placeholder);
        x.setAttribute("autocomplete","off");
        x.className = "textFilter";
        node.appendChild(x);
    };
};


function getFilterString() {
    let filter_str = "";
    let allFilters = document.querySelectorAll(".filterPulldown");
    let cnt = allFilters.length;
    //
    // collect and save the status of all emby filters
    //
    for(var i=0; i<cnt; i++ ) {
        let a = allFilters[i];
        if(a.value!="") filter_str += "&"+a.value;
        filter_selectedIndex[i] = a.selectedIndex;
    };
    //
    //   create the emby filter string that will be added to the API urls
    //
    filter_str = filter_str + addTags() + addGens() + addSearch() + addVideoCodecs()+ addAudioCodecs() + addProviderImdbPairs() + addAlbums() + addArtists() + addSubtitleCodecs() + addStudios();

    console.log("=== Filter Str = ",filter_str);

    let swt = document.querySelector(".showWithTag");
    showWithTag = swt.value;

    let swg = document.querySelector(".showWithGenre");
    showWithGenre = swg.value;

    return filter_str;
};

function resetFilters(skipInputs) {
    let allFilters = document.querySelectorAll(".filterPulldown");
    let cnt = allFilters.length;
    for(var i=0; i<cnt; i++ ) {
        allFilters[i].selectedIndex = 0;
        allFilters[i].style.background = "blue";
    };
    filter_string = "";
    filter_selectedIndex = [];

    showWithTag   = 0;
    showWithGenre = 0;

    if(skipInputs) return;

    document.getElementById("tagFilter").value = "";
    document.getElementById("genFilter").value = "";
    document.getElementById("searchFilter").value = "";
    document.getElementById("videoCodecFilter").value = "";
    document.getElementById("audioCodecFilter").value = "";
    document.getElementById("subtitlesCodecFilter").value = "";
    document.getElementById("artistsFilter").value = "";
    document.getElementById("albumsFilter").value = "";
    document.getElementById("studiosFilter").value = "";
    document.getElementById("imdbFilter").value = "";

    let swt = document.querySelector(".showWithTag");
    swt.value = 0;
    swt.style.background = "blue";

    let swg = document.querySelector(".showWithGenre");
    swg.value = 0;
    swg.style.background = "blue";
};

//---------------------------------------------------------------------
function addTags() {
    var tagStr = document.getElementById("tagFilter").value;
    //console.log("=== tagStr = ",tagStr);

    var a1 = tagStr.split(","); 
    //console.log("=== a1 = ",a1);
    var a2 = [];
    a1.map( g => { a2.push( g.trim().replace(/\s+/g, '%20') ) }); 
    //console.log("=== a2 = ",a2);
    a2 = a2.join("|");
    //console.log("=== a2 = ",a2);

    if(a2=="") {
        //console.log("=== Tag Str Empty");
        return "";
    } else {
        var k = "&Tags="+a2;
        //console.log("=== Tag Str = ",k);
        return k;
    };
};
//---------------------------------------------------------------------
function addGens() {
    var genStr = document.getElementById("genFilter").value;
    //console.log("=== genStr = ",genStr);

    var a1 = genStr.split(","); 
    //console.log("=== a1 = ",a1);
    var a2 = [];
    a1.map( g => { a2.push( g.trim().replace(/\s+/g, '%20') ) }); 
    //console.log("=== a2 = ",a2);
    a2 = a2.join("|");
    //console.log("=== a2 = ",a2);

    if(a2=="") {
        return "";
    } else {
        return "&Genres="+a2;
    };
};
//---------------------------------------------------------------------
function addSearch() {
    var searchStr = document.getElementById("searchFilter").value;
    var s1 = searchStr.trim();
    if(s1=="") return "";

    var s2 = s1.split(" ").join("%20");
    return "&SearchTerm="+s2;
};
//---------------------------------------------------------------------
function addVideoCodecs() {
    var codecStr = document.getElementById("videoCodecFilter").value;
    var s1 = codecStr.replace(/\s+/g, '');
    var s2 = s1.split(",").join("%2C").toLowerCase();

    if(s2=="") {
        return "";
    } else {
        return "&VideoCodecs="+s2;
    };
};
//---------------------------------------------------------------------
function addAudioCodecs() {
    var codecStr = document.getElementById("audioCodecFilter").value;
    var s1 = codecStr.replace(/\s+/g, '');
    var s2 = s1.split(",").join("%2C").toLowerCase();

    if(s2=="") {
        return "";
    } else {
        return "&AudioCodecs="+s2;
    };
};

//---------------------------------------------------------------------
function addSubtitleCodecs() {
    var codecStr = document.getElementById("subtitlesCodecFilter").value;
    var s1 = codecStr.replace(/\s+/g, '');
    var s2 = s1.split(",").join("%2C").toLowerCase();

    if(s2=="") {
        return "";
    } else {
        return "&SubtitleCodecs="+s2;
    };
};
//---------------------------------------------------------------------
function addArtists() {
    var str = document.getElementById("artistsFilter").value;
    var s1  = str.replace(/\s+/g, '%20');
    var s2  = s1.split(",").join("%7C"); //.toLowerCase();

    if(s2=="") {
        return "";
    } else {
        return "&Artists="+s2;
    };
};
//---------------------------------------------------------------------
function addAlbums() {
    var str = document.getElementById("albumsFilter").value;
    var s1  = str.replace(/\s+/g, '%20');
    var s2  = s1.split(",").join("%7C"); //.toLowerCase();

    if(s2=="") {
        return "";
    } else {
        return "&Albums="+s2;
    };
};
//---------------------------------------------------------------------
function addStudios() {
    var str = document.getElementById("studiosFilter").value;
    var s1  = str.replace(/\s+/g, '%20');
    var s2  = s1.split(",").join("%7C"); //.toLowerCase();

    if(s2=="") {
        return "";
    } else {
        return "&Studios="+s2;
    };
};

//---------------------------------------------------------------------
function addProviderImdbPairs() {
    var imdbStr = document.getElementById("imdbFilter").value;
    var s1 = imdbStr.replace(/\s+/g, '');
    var s2 = s1.split(",").join("%2C");

    if(s2=="") {
        return "";
    } else {
        var k = "&AnyProviderIdEquals="+s2;
        //myConsoleLog("=== Imdb Str = "+k);
        return k;
    };
};
//---------------------------------------------------------------------





