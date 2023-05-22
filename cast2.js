

var personHTML = `
<div id="personsInfoArea">
    <button id="personsInfoAreaReturnBtn" class="page_button">Return</button>
    <div id="personsInfoContainer" style="overflow:hidden; width:100%; margin-bottom:10px; background-color:green; color:white">
        <br>
        <div style="margin-left:20px; width:95%; height:100%">
            <span id="personsImage"   style="margin-bottom:25px;"></span>
            <div id="personsName"     style="font-size:35px; text-align:center;">Name</div>
            <br>
            <div id="personsOverview" style="font-size:20px; text-align:left;">Overview</div>
            <br>
            <div style="clear:both;"></div>  <!-- Stop float left -->
            <div id="moviesPlayedIn" style="font-size:25px;">Played in these Movies:
                <br>
                <br>
                <div id="moviesPlayedInNode"></div>
                <br>
            </div>
        </div>
    </div>
</div>
`;

var peopleDiv;
var peopleMediaObj;

function cast(mediaObj, pn) {
    peopleMediaObj = mediaObj;

    peopleDiv = document.createElement("DIV");
    peopleDiv.id = "peopleArea";
    pn.appendChild(peopleDiv);
    //
    //   click on peopleArea
    //
    document.getElementById("peopleArea").onclick = function(data){castPerson(data)};
    
    cast_2();
};

function cast_2() {
    mediaObj = peopleMediaObj;
    while (peopleDiv.firstChild) { peopleDiv.firstChild.remove(); };

    let y1 = document.createElement("LABEL");
    y1.innerHTML = "Cast";
    y1.style.fontSize = "25px";
    y1.style.color = "white";
    peopleDiv.appendChild(y1);

    peopleDiv.appendChild( document.createElement("BR") ); 
    peopleDiv.appendChild( document.createElement("BR") );

    let people = mediaObj.People;

    if(people) people.map( (person) => { 
        if(person.PrimaryImageTag) {
            var image_url = server_url+"Items/"+person.Id+"/Images/Primary?maxHeight=186&maxWidth=124&tag="+person.PrimaryImageTag+"&quality=90";
            var iNode = document.createElement("img");
            iNode.src = image_url;  // add the image URL to the DOM
            iNode.id  = "PR_"+person.Id;
            iNode.loading     = "lazy";   // only load images if they are visable on the screen
            iNode.style.width = "124px";
            // -----------------------------------------------------------------------------------------------
            var tNode = document.createElement("DIV"); // note label does not have a 'width' attribute, set width with CSS
            tNode.innerHTML = "<b class='word_wrap'>"+person.Name+"</b><br><i>"+person.Role+"</i>";
            tNode.className = "tNode";
            // -----------------------------------------------------------------------------------------------
            var viewItemNode = document.createElement("DIV");
            viewItemNode.append(iNode);
            viewItemNode.append(tNode);

            viewItemNode.style.width           = "124px";
            viewItemNode.style.display         = "inline-block";
            viewItemNode.style.marginRight     = "10px";
            viewItemNode.style.marginBottom    = "10px";
            viewItemNode.style.verticalAlign   = "top";
            viewItemNode.style.textAlign       = "center";
            viewItemNode.style.backgroundColor = "grey";

            peopleDiv.appendChild(viewItemNode);      // add the item to the DOM 
        };
    });
};


function castPerson(item) {
    let target = item.target;
    let a = target.id.split("_");
    let type = a[0];
    let id   = a[1];
    
    //console.log("=== person id, ",id);

    if(type == "PR") {
        let url = server_url+"emby/Users/"+user_id+"/Items/"+id+"?"+
                    "X-Emby-Client=Emby Web"+
                    "&X-Emby-Device-Name=Chrome"+
                    "&X-Emby-Device-Id=62b7b47e-bb63-42dd-8c75-a7f42e91ef30"+
                    "&X-Emby-Client-Version=4.6.7.0"+
                    "&X-Emby-Token="+api_key;

        download(url, onPersonData);
    };
};


function onPersonData(data) {
    while (peopleDiv.firstChild) { peopleDiv.firstChild.remove(); };
    //
    // add HTML
    //
    peopleDiv.innerHTML = personHTML;

    console.log("=== Person data = ",data);

    //.....................................................
    //
    // Return Btn on Click
    //
    document.getElementById("personsInfoAreaReturnBtn").onclick = function (event) {
        event.preventDefault();
        console.log("=== Return Clicked");
        cast_2();
    };
    //.....................................................

    //
    // add persons image
    //
    var image_url = server_url+"Items/"+data.Id+"/Images/Primary?maxHeight=300&maxWidth=200&tag="+data.ImageTags.primary+"&quality=90";    
    var iNode = document.createElement("img");
    iNode.src = image_url;  // add the image URL to the DOM
    //iNode.loading     = "lazy";   // only load images if they are visable on the screen
    //iNode.id          = "I_"+item.Id;
    iNode.style.width = "200px";
    iNode.style.float = "right"; 
    iNode.style.border= "2px solid white";
    document.getElementById("personsImage").appendChild(iNode);
    //
    // update the name and overview 
    //
    document.getElementById("personsName").innerHTML = data.Name;

    var s = (data.Overview) ? data.Overview : "No Overview";
    document.getElementById("personsOverview").innerHTML = s;
    //
    // remove all of the previous listed movies
    //
    while (moviesPlayedInNode.firstChild) { moviesPlayedInNode.firstChild.remove(); };

    let url = server_url+"Users/"+user_id+"/Items?IncludeItemTypes=Movie"+
    "&Limit=12"+
    "&SortBy=SortName"+
    "&Fields=PrimaryImageAspectRatio,ProductionYear"+
    "&SortOrder=Ascending"+
    "&Recursive=true"+
    "&CollapseBoxSetItems=false"+
    "&PersonIds="+data.Id+
    "&ImageTypeLimit=1"+
    "&EnableTotalRecordCount=false"+
    "&X-Emby-Client=Emby Web"+
    "&X-Emby-Device-Name=Chrome"+
    //"&X-Emby-Device-Id="+deviceId+
    "&X-Emby-Client-Version=4.6.7.0"+
    "&X-Emby-Token="+api_key;

    download(url, onPersonMovies);
};


function onPersonMovies(data) {
    console.log("=== movies actor played in = ",data);

    data.Items.map( (item) => { 
        var image_url = server_url+"Items/"+item.Id+"/Images/Primary?maxHeight=250&maxWidth=150&tag="+item.ImageTags.primary+"&quality=90";
        var iNode = document.createElement("img");
        iNode.src = image_url;  // add the image URL to the DOM
        iNode.loading     = "lazy";   // only load images if they are visable on the screen
        iNode.id          = "I_"+item.Id;
        iNode.style.width = "150px";
        // -----------------------------------------------------------------------------------------------
        var tNode = document.createElement("DIV"); // note label does not have a 'width' attribute, set width with CSS
        tNode.innerHTML = "<b class='word_wrap'>"+item.Name+"</b><br><i>"+item.ProductionYear+"</i>";
        tNode.className = "tNode";
        // -----------------------------------------------------------------------------------------------
        var viewItemNode = document.createElement("DIV");
        viewItemNode.append(iNode);
        viewItemNode.append(tNode);

        viewItemNode.style.width           = "150px";
        viewItemNode.style.display         = "inline-block";
        viewItemNode.style.marginRight     = "10px";
        viewItemNode.style.marginBottom    = "10px";
        viewItemNode.style.verticalAlign   = "top";
        viewItemNode.style.textAlign       = "center";
        viewItemNode.style.backgroundColor = "lightgrey";

        document.getElementById("moviesPlayedInNode").appendChild(viewItemNode);  // add the item to the DOM       
    });
};










//-------------------------------------------------------------------------------------
//
//
//
//-------------------------------------------------------------------------------------
function similarMovies(mediaObj, pn) {
    pn.appendChild( document.createElement("HR") );
    
    let y1 = document.createElement("LABEL");
    y1.innerHTML = "Similar Media";
    y1.style.fontSize = "25px";
    y1.style.color = "white";
    pn.appendChild(y1);

    pn.appendChild( document.createElement("BR") ); 
    pn.appendChild( document.createElement("BR") );

    let similarDiv = document.createElement("DIV");
    similarDiv.id = "similarArea";
    pn.appendChild(similarDiv);
    //
    // get similar shows
    //
    let url = server_url+"Items/"+mediaObj.Id+"/Similar?"+
                "Limit=12"+
                "&UserId="+user_id+
                "&ImageTypeLimit=1"+
                "&Fields=PrimaryImageAspectRatio,UserData,CanDelete,ProductionYear"+
                "&EnableTotalRecordCount=false"+
                "&X-Emby-Client=Emby Web"+
                "&X-Emby-Device-Name=Chrome Android"+
                //"&X-Emby-Device-Id="+deviceId+
                "&X-Emby-Client-Version=4.6.7.0"+
                "&X-Emby-Token="+api_key;

    download(url, onSimilarVideos);


    function onSimilarVideos(data) {
        console.log("=== Similar Videos Data = ",data);

        data.Items.map( (item) => { 
            let image_url = server_url+"Items/"+item.Id+"/Images/Primary?maxHeight=250&maxWidth=150&tag="+item.ImageTags.primary+"&quality=90";
            let iNode = document.createElement("img");
            iNode.src = image_url;  // add the image URL to the DOM
            iNode.loading     = "lazy";   // only load images if they are visable on the screen
            iNode.id          = "SM_"+item.Id;
            iNode.style.width = "150px";
            // -----------------------------------------------------------------------------------------------
            let tNode = document.createElement("DIV"); // note label does not have a 'width' attribute, set width with CSS
            tNode.innerHTML = "<b class='word_wrap'>"+item.Name+"</b><br><i>"+item.ProductionYear+"</i>";
            tNode.className = "tNode";
            // -----------------------------------------------------------------------------------------------
            let viewItemNode = document.createElement("DIV");
            viewItemNode.append(iNode);
            viewItemNode.append(tNode);

            viewItemNode.style.width           = "150px";
            viewItemNode.style.display         = "inline-block";
            viewItemNode.style.marginRight     = "10px";
            viewItemNode.style.marginBottom    = "10px";
            viewItemNode.style.verticalAlign   = "top";
            viewItemNode.style.textAlign       = "center";
            viewItemNode.style.backgroundColor = "lightgrey";

            pn.appendChild(viewItemNode);  // add the item to the DOM  
            similarDiv.appendChild(viewItemNode);      // add the item to the DOM      
        });

    };
};
  


//----------------------------------------------------------------
//
//  play a similar movie click area
//
function similarMovieId(itemId) {
    console.log("=== Similar Movie id, ",itemId);

    //removeBg();
    //$playBtn.style.visibility   = "hidden";     // hidden | visible
    //$filterBtn.style.visibility = "hidden";     // hidden | visible

    //let url = server_url+"Users/"+user_id+"/Items/"+itemId+"?api_key="+api_key;
    //download(url, playVideoHLS, [[], ["xx"],""]); 

};

