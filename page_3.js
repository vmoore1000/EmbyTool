

var page_3_HTML = `
<div class="sticky-div">
    <button id="filter_btn"     class="page_button">Filter</button>
    <button id="play_btn"       class="page_button">▶ Play</button>
    <button id="prev_btn"       class="page_button">Prev</button>
    <button id="next_btn"       class="page_button">Next</button>
    <button id="save_btn"       class="page_button">Save</button>
    <button id="collection_btn" class="page_button">Collection</button>
    <button id="playlist_btn"   class="page_button">Playlist</button>
    <button id="clean_btn"      class="page_button">Clean</button>
</div>
<div id="progressBar" style="position: relative; width:100%; height:25px; border: 1px solid white; background-color:grey;">
    <div id="myBar" style="width:1%; height:100%; background-color:red;">
        <div id="myBarLabel" style="height:25px; text-align:center; color:white";>1%</div>
    </div>
</div>
<div id="page_title"></div>
`;

function bulk_editor(selected, obj){
    
    if(selected.length == 0) return;
    //
    // put placeholder on the page queue
    //
    page_queue.push( obj );

    
    let item_value = [];
    var item_name  = [];
    var item_width = [];
    var item_bulk  = [];
    var current_item_data;

    //
    // hide the side bar
    //
    document.getElementById("side_node").style.display = "none";

    var index = 0
    var count = selected.length;

    var bn = document.getElementById("button_node");
    while (bn.firstChild) { bn.firstChild.remove(); };
    //
    // add html
    //
    bn.innerHTML = page_3_HTML;

    var myBar      = document.getElementById("myBar");
    var myBarLabel = document.getElementById("myBarLabel");
    var barDelta   = 0;
    var barWidth   = 0;
   
    //
    //   add page title
    //
    document.getElementById("page_title").innerHTML = "Bulk Edit ("+selected.length+" items)";

    //
    //   hide progress bar
    //
    document.getElementById("progressBar").style.display = "none";
    //
    //   button event listeners
    //
    document.getElementById("filter_btn").onclick     = function(){filter()};
    document.getElementById("play_btn").onclick       = function(){play()};
    document.getElementById("prev_btn").onclick       = function(){prev()};
    document.getElementById("next_btn").onclick       = function(){next()};
    document.getElementById("save_btn").onclick       = function(){save()};
    document.getElementById("collection_btn").onclick = function(){collection()};
    document.getElementById("playlist_btn").onclick   = function(){playlist()};
    document.getElementById("clean_btn").onclick      = function(){clean()};
    //
    // hide clean and filter button
    //
    document.getElementById("filter_btn").style.display = "none";
    document.getElementById("play_btn").style.display = "none";
    document.getElementById("collection_btn").style.display = "none";
    document.getElementById("playlist_btn").style.display = "none";
    document.getElementById("clean_btn").style.display = "none";

    //
    // button event listener functions
    //
    function filter() {
        console.log("___________ filter Btn _____________");
        return;
    };
    function play() {
        console.log("____________ play Btn ______________");
        return;
    };
    function prev() {
        console.log("____________ prev Btn ______________");
        index--;
        if(index < 0) index = count - 1;
        edit_page(selected, obj, index);
        return;
    };
    function next() {
        console.log("____________ next Btn ______________");
        index++;
        if(index >= count) index = 0;
        edit_page(selected, obj, index);
        return;
    };
    function save() {
        console.log("___________ save Btn _____________");
        //
        // prepare the progress bar
        //
        document.getElementById("progressBar").style.display = "block";
        myBar.style.width = "1%";  
        barDelta = 100/selected.length;
        barWidth = 0;

        let master_obj = create_master_obj();
        console.log("=== master obj = ",master_obj);

        save_bulk_data(selected, obj, 0);

        function save_bulk_data(selected, obj, index){
            console.log("___________ bulk save _____________ ",index);

            let item = obj.Items[selected[index]];

            let url = server_url+"Users/"+user_id+"/Items/"+item.Id+"?Fields=MediaStreams,UserData&EnableUserData=true&api_key="+api_key;
            download(url, save_item);


            // --------------------------------------------------
            //   
            // --------------------------------------------------
            function save_item(data){
                let item_data = update_values(data, master_obj);  // this also saves "favorite" and "played"
                console.log("=== data = ",item_data);

                let url = server_url+"Items/"+item_data.Id+"?EnableUserData=true&api_key="+api_key;
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item_data)
                }).then( (response) =>{
                    if(response.ok) { 
                        console.log("=== Finished OK"); 
                        //
                        // update progress bar
                        //
                        barWidth += barDelta;
                        if(barWidth>100) barWidth = 100;
                        myBar.style.width = barWidth.toFixed(0) + "%";
                        myBarLabel.innerHTML = (barWidth*1).toFixed(0) + "%";

                        index++;
                        if(index >= selected.length) {
                            document.getElementById("progressBar").style.display = "none";
                            console.log("___________ finished _____________ ",index);
                            return;
                        }
                        save_bulk_data(selected, obj, index);
                    } else {
                        console.log("=== response was not OK"); 
                        return;
                    };
                }).catch( (err) => {
                    console.log("=== Error ",err);
                    document.getElementById("progressBar").style.display = "none";
                    return;
                });
            };
        };
        return;
    };
    function collection() {
        console.log("_________ collection Btn ___________");
        return;
    };
    function playlist() {
        console.log("__________ playlist Btn ____________");
        return;
    };
    function clean() {
        console.log("____________ clean Btn _____________");
        return;
    };

    edit_page(selected, obj, index);
    
    // --------------------------------------------------
    //   
    // --------------------------------------------------
    function edit_page(selected, obj, index) {
        console.log("=== obj = ",obj);
        console.log("=== selected = ",selected);
        console.log("=== index = ",index);

        let item = obj.Items[selected[index]];

        let url = server_url+"Users/"+user_id+"/Items/"+item.Id+"?Fields=MediaStreams,UserData&EnableUserData=true&api_key="+api_key;
        download(url, edit_item);
    };

    // --------------------------------------------------
    //   
    // --------------------------------------------------
    function edit_item(item_data) {
        console.log("=== edit item - item_data = ",item_data);

        current_item_data = item_data;
        
        var dn = document.getElementById("page_node");
        while (dn.firstChild) { dn.firstChild.remove(); };
        dn.style.background = "gray";
        //
        // get the item's image tag
        //
        if(item_data.ImageTags["Primary"]) {
            var image_url = server_url+"Items/"+item_data.Id+"/Images/Primary?maxHeight=300&maxWidth=200&tag="+item_data.ImageTags.Primary+"&quality=90";
        } else if (item_data.SeriesPrimaryImageTag) {
            var image_url = server_url+"Items/"+item_data.SeriesId+"/Images/Primary?tag="+item_data.SeriesPrimaryImageTag+"&maxWidth=200&maxHeight=300&quality=90";
        } else if(item_data.ImageTags["Thumb"]) {
            var image_url = server_url + "Items/"+item_data.Id+"/Images/Thumb?maxWidth=200&maxHeight=300&api_key=" + api_key;
        } else {
            var image_url = getDefaultImage();
        };
        dn.appendChild( addImage(image_url, "150", "image_id") );    // add the document fragment to the DOM

        // --------------------------------------------------
        //  
        // --------------------------------------------------
        item_name[0]  = "Path";  
        item_name[1]  = "Original Title";
        item_name[2]  = "title";
        item_name[3]  = "Sort Title";
        item_name[4]  = "Taglines";
        item_name[5]  = "Overview";
        item_name[6]  = "Parental Rating";        
        item_name[7]  = "Community Rating";
        item_name[8]  = "Release Date";
        item_name[9]  = "Year"; 
        item_name[10] = "imdb id";
        item_name[11] = "The Movie Db Id";
        item_name[12] = "Date Added";
        item_name[13] = "Local Trailers";
        item_name[14] = "Remote Trailers";
        item_name[15] = "Is Folder";
        item_name[16] = "Width";
        item_name[17] = "Height";
        item_name[18] = "Container";
        item_name[19] = "Custom Rating";
        item_name[20] = "Runtime Minutes";
        item_name[21] = "Size";
        item_name[22] = "Lock Name";
        item_name[23] = "Lock Official Rating";
        item_name[24] = "Lock Genres";
        item_name[25] = "Lock Cast";
        item_name[26] = "Lock Studios";
        item_name[27] = "Lock Tags";
        item_name[28] = "Lock Overview";
        item_name[29] = "Lock All";
        item_name[30] = "Favorite";
        item_name[31] = "Played";
        item_name[32] = "Frame Rate";
        item_name[33] = "Codec 0";
        item_name[34] = "Codec 1";
        item_name[35] = "Codec 2";
        item_name[36] = "Codec 3";
        item_name[37] = "Codec 4";
        item_name[38] = "Codec 5";
        item_name[39] = "Tags";
        item_name[40] = "Genres";
        item_name[41] = "Studios";
        // --------------------------------------------------
        // a = label
        // b = unlock / lock
        // c = true / false
        // d = type text input size 30 max 80
        // e = rating pulldown
        // f = type date
        // g = type text input size 12 max 20
        // h = type textarea
        // i = input type number start 1920 end 2040
        // j = inout type number start 1 end 10
        // k = type text area 4 rows 40 cols
        // --------------------------------------------------
        item_width[0]  =  "a";
        item_width[1]  =  "a";
        item_width[2]  =  "a";
        item_width[3]  =  "a";
        item_width[4]  =  "a";
        item_width[5]  =  "a";   
        item_width[6]  =  "e";
        item_width[7]  =  "j";
        item_width[8]  =  "f";
        item_width[9]  =  "i";
        item_width[10] =  "a";
        item_width[11] =  "a";
        item_width[12] =  "f";
        item_width[13] =  "a";
        item_width[14] =  "a";
        item_width[15] =  "a";
        item_width[16] =  "a";
        item_width[17] =  "a";
        item_width[18] =  "a";  
        item_width[19] =  "e";
        item_width[20] =  "a";  
        item_width[21] =  "a";  
        item_width[22] =  "b";
        item_width[23] =  "b";
        item_width[24] =  "b";
        item_width[25] =  "b";
        item_width[26] =  "b";
        item_width[27] =  "b";
        item_width[28] =  "b";
        item_width[29] =  "c";
        item_width[30] =  "c";
        item_width[31] =  "c";
        item_width[32] =  "a";
        item_width[33] =  "a";
        item_width[34] =  "a";
        item_width[35] =  "a";
        item_width[36] =  "a";
        item_width[37] =  "a";
        item_width[38] =  "a";
        item_width[39] =  "k";
        item_width[40] =  "k";
        item_width[41] =  "k";


        item_bulk[0] = "n";
        item_bulk[1] = "n";
        item_bulk[2] = "n";
        item_bulk[3] = "n";
        item_bulk[4] = "n";
        item_bulk[5] = "n";
        item_bulk[6] = "y";
        item_bulk[7] = "y";
        item_bulk[8] = "y";
        item_bulk[9] = "y";
        item_bulk[10] = "n";
        item_bulk[11] = "n";
        item_bulk[12] = "y";
        item_bulk[13] = "n";
        item_bulk[14] = "n";
        item_bulk[15] = "n";
        item_bulk[16] = "n";
        item_bulk[17] = "n";
        item_bulk[18] = "n";
        item_bulk[19] = "y";
        item_bulk[20] = "n";
        item_bulk[21] = "n";
        item_bulk[22] = "y";
        item_bulk[23] = "y";
        item_bulk[24] = "y";
        item_bulk[25] = "y";
        item_bulk[26] = "y";
        item_bulk[27] = "y";
        item_bulk[28] = "y";
        item_bulk[29] = "y";
        item_bulk[30] = "y";
        item_bulk[31] = "y";
        item_bulk[32] = "n";
        item_bulk[33] = "n";
        item_bulk[34] = "n";
        item_bulk[35] = "n";
        item_bulk[36] = "n";
        item_bulk[37] = "n";
        item_bulk[38] = "n";
        item_bulk[39] = "y";
        item_bulk[40] = "y";
        item_bulk[41] = "y";
        //
        // Collect Data from Emby object
        //
        item_value[0]  = (item_data.Path)              ? item_data.Path : "";
        item_value[1]  = (item_data.OriginalTitle)     ? item_data.OriginalTitle : "No Original Title";                      
        item_value[2]  = (item_data.Name)              ? item_data.Name : "No Title";                    
        item_value[3]  = (item_data.SortName)          ? item_data.SortName : "No Sort Name";
        item_value[4]  = (item_data.Taglines && item_data.Taglines[0]) ? item_data.Taglines[0] : "No Tag Line";
        item_value[5]  = (item_data.Overview)          ? item_data.Overview : "No Overview";
        item_value[6]  = (item_data.OfficialRating)    ? item_data.OfficialRating : "";     // parental rating  
        item_value[7]  = (item_data.CommunityRating)   ? item_data.CommunityRating : "";                       
        item_value[8]  = (item_data.PremiereDate)      ? metadataDate(item_data.PremiereDate) : "";   
        item_value[9]  = (item_data.ProductionYear)    ? item_data.ProductionYear : "";                 
        item_value[10] = (item_data.ProviderIds)       ? item_data.ProviderIds.Imdb : "";
        item_value[11] = (item_data.ProviderIds)       ? item_data.ProviderIds.Tmdb : "";
        item_value[12] = (item_data.DateCreated)       ? metadataDate(item_data.DateCreated) : "";
        item_value[13] = (item_data.LocalTrailerCount) ? item_data.LocalTrailerCount : "0";             
        item_value[14] = (item_data.RemoteTrailers)    ? item_data.RemoteTrailers.length : "0";            
        item_value[15] = (item_data.IsFolder)          ? item_data.IsFolder : "false";
        item_value[16] = (item_data.Width)             ? item_data.Width  : "0";                             
        item_value[17] = (item_data.Height)            ? item_data.Height : "0";                             
        item_value[18] = (item_data.Container)         ? item_data.Container : "NA";
        item_value[19] = (item_data.CustomRating)      ? item_data.CustomRating : "";                        
        item_value[20] = (item_data.RunTimeTicks)      ? ((item_data.RunTimeTicks/10000000)/60).toFixed(0) : "";    // one tick is 10 microseconds
        item_value[21] = (item_data.Size)              ? (item_data.Size/1000000).toFixed(0) : "";

        let lock_array = (item_data.LockedFields) ? item_data.LockedFields : []; // ['Name', 'OfficialRating', 'Genres', 'Cast', 'Studios', 'Tags', 'Overview']

        item_value[22] = (lock_array.indexOf("Name")<0)           ? "Unlocked" : "Locked";
        item_value[23] = (lock_array.indexOf("OfficialRating")<0) ? "Unlocked" : "Locked";
        item_value[24] = (lock_array.indexOf("Genres")<0)         ? "Unlocked" : "Locked";
        item_value[25] = (lock_array.indexOf("Cast")<0)           ? "Unlocked" : "Locked";
        item_value[26] = (lock_array.indexOf("Studios")<0)        ? "Unlocked" : "Locked";
        item_value[27] = (lock_array.indexOf("Tags")<0)           ? "Unlocked" : "Locked";
        item_value[28] = (lock_array.indexOf("Overview")<0)       ? "Unlocked" : "Locked";

        item_value[29] = (item_data.LockData) ? item_data.LockData : false;

        item_value[30] = (item_data.UserData) ? item_data.UserData.IsFavorite : false;
        item_value[31] = (item_data.UserData) ? item_data.UserData.Played : false;

        if(item_data.MediaStreams) {
            let temp = "";
            if (item_data.MediaStreams[0] && item_data.MediaStreams[0].RealFrameRate) {
                temp = ""+item_data.MediaStreams[0].RealFrameRate.toFixed(0);
            };
            item_value[32] = temp;

            let jj = 6; //item_data.MediaStreams.length;
            let kk = 33;
            for(let ii=0; ii<jj; ii++) {
                item_value[kk+ii] = (item_data.MediaStreams[ii]) ? item_data.MediaStreams[ii].DisplayTitle : "No Value";
            };
        };
        // --------------------------------------------------
        //
        //   add tags
        //
        if(item_data.TagItems){
            let tag_array = tagsToArray(item_data.TagItems,"Name");
            item_value[39] = tag_array.toString();
        } else item_value[39] = [];
        // --------------------------------------------------
        //
        //   add genres
        //
        if(item_data.Genres){
            item_value[40] = item_data.Genres.toString();
        } else item_value[40] = [];
        // --------------------------------------------------
        //
        //   add studios
        //
        if(item_data.Studios){
            let studio_array = tagsToArray(item_data.Studios,"Name");
            item_value[41] = studio_array.toString();
        } else item_value[41] = [];

        // --------------------------------------------------
        //   build the HTML page
        // --------------------------------------------------
        let df_1 = new DocumentFragment();

        let max_values = item_name.length;
        let rowCnt = 0;
        //df_1.appendChild( document.createElement("BR") );
        let tb = document.createElement("TABLE");
        tb.id = "table_1";
        //tb.style.clear = "both";

        for(let i=0; i<max_values; i++) {
            let tr = document.createElement("TR");
            tr.id = "filter_row_"+rowCnt;
            rowCnt++
            tb.appendChild(tr);
            //--------------------------------------------
            //
            //  Col 1
            //
            let td_1 = document.createElement("TD");
            td_1.style.width = "200px";

            let y = document.createElement("LABEL");
            y.innerText = item_name[i];
            y.style.color     = "white";
            y.style.fontSize  = "20px";  
            td_1.appendChild(y);
            tr.appendChild(td_1);
            //--------------------------------------------
            //
            //  Col 2
            //
            let td_2 = document.createElement("TD");
            td_2.style.width = "300px";

            let key2 = "a"; 
            let val2 = item_value[i]; 

            td_2.appendChild( makeTD(key2, val2, -1) );

            tr.appendChild(td_2);
            //--------------------------------------------
            //
            //  Col 3
            //
            let td_3 = document.createElement("TD");

            td_3.style.width = "100px";
            td_3.style.textAlign = "center";

            if(i>38) td_3.appendChild( savePulldown("No save", i) );

            tr.appendChild(td_3);
            //--------------------------------------------
            //
            //  Col 4
            //
            let td_4 = document.createElement("TD");
            td_4.style.width = "300px";

            let key4 = item_width[i];
            let val4 = (item_bulk[i] == "y") ? "" : item_value[i];
            td_4.appendChild( makeTD(key4, val4, i) );

            tr.appendChild(td_4);
            //----------------------------------------
            df_1.appendChild(tb);
        };

        dn.appendChild(df_1);    // add the document fragment to the DOM

        // --------------------------------------------------
        //   
        // --------------------------------------------------
        function metadataDate(d) {
            let t = d.split("T");
            return t[0];
        };
        
        // --------------------------------------------------
        //   make TD for the table
        // --------------------------------------------------
        function makeTD(key, val, index) {
            let x;
            //console.log("=== key = ",key,", val = ",val);
            if(key == "a") {
                x = document.createElement("LABEL");
                x.innerHTML = ""+val;
                x.style.color     = "white";
                x.style.fontSize  = "20px";  
                x.className = "editor_data";
            } else
            if(key == "b") {
                x = document.createElement("SELECT");
                x.appendChild(addOption(""));
                x.appendChild(addOption("Unlocked"));
                x.appendChild(addOption("Locked"));
                x.value = val;
            } else
            if(key == "c") {
                x = document.createElement("SELECT");
                x.appendChild(addOption(""));
                x.appendChild(addOption("true"));
                x.appendChild(addOption("false"));
                x.value = val;
            } else
            if(key == "d") {
                x = document.createElement("INPUT");
                x.setAttribute("type", "text");
                x.setAttribute("value", val);
                x.setAttribute("size", "40");
                x.setAttribute("maxlength", "80");
                x.className = "editor_data";
            } else
            if(key == "g") {
                x = document.createElement("INPUT");
                x.setAttribute("type", "text");
                x.setAttribute("value", val);
                x.setAttribute("size", "12");
                x.setAttribute("maxlength", "20");
                x.className = "editor_data";                
            } else 
            if(key == "f") {
                x = document.createElement("INPUT");
                x.setAttribute("type", "date");
                x.value = val;
            } else 
            if(key == "e") {
                x = ratingPulldown(val);
            } else
            if(key == "h") {
                x = document.createElement("TEXTAREA");
                x.setAttribute("rows", "10");
                x.setAttribute("cols", "40");
                x.value = val;
            } else
            if(key == "i") {
                x = document.createElement("INPUT");
                x.setAttribute("type", "number");
                x.setAttribute("min", "1920");
                x.setAttribute("max", "2040");
                x.setAttribute("step", "1");
                x.value = val;      
            } else
            if(key == "j") {
                x = document.createElement("INPUT");
                x.setAttribute("type", "number");
                x.setAttribute("min", "1");
                x.setAttribute("max", "10");
                x.setAttribute("step", ".1");
                x.value = val;      
            } else
            if(key == "k") {
                x = document.createElement("TEXTAREA");
                x.setAttribute("rows", "4");
                x.setAttribute("cols", "40");
                x.placeholder = "Comma delimited list";
                x.value = val;      
            }; 
            //
            // add id to all items so their values can be read
            //
            if(index>=0) {
                x.id = "V_"+index;
                // console.log("=== id = "+x.id+", key = "+key);
            };

            return x;
        };
        // --------------------------------------------------
        //   
        // --------------------------------------------------
        function savePulldown(set_value, index) {
            let x = document.createElement("SELECT");
            x.setAttribute("name", "Type");
            x.id = "P_"+index;
                    
            x.appendChild(addOption("No save"));
            x.appendChild(addOption("Add to"));
            x.appendChild(addOption("Replace All"));
            //x.appendChild(addOption("Remove"));
            x.appendChild(addOption("Delete All"));
    
            x.value = set_value;

            console.log("=== pulldown = ",x);
            return x;
        };
        // --------------------------------------------------
        //   
        // --------------------------------------------------
        function addOption( value) {
            let y = document.createElement("option");
            y.setAttribute("value", value);
            y.innerText = value;
            return y;
        };
        // --------------------------------------------------
        //   
        // --------------------------------------------------
        function ratingPulldown(set_value) {
            let x = document.createElement("SELECT");
            x.setAttribute("name", "Type");
                    
            x.appendChild(addOption("APPROVED"));
            x.appendChild(addOption("TV-Y"));
            x.appendChild(addOption("G"));
            x.appendChild(addOption("E"));
            x.appendChild(addOption("EC"));
            x.appendChild(addOption("TV-G"));
            x.appendChild(addOption("FSK-0"));
            x.appendChild(addOption("GB-U"));
            x.appendChild(addOption("IT-T"));

            x.appendChild(addOption("TV-Y7"));
            x.appendChild(addOption("TV-Y7-FV"));
            x.appendChild(addOption("TV-PG"));
            x.appendChild(addOption("PG"));
            x.appendChild(addOption("FSK-6"));
            x.appendChild(addOption("GB-PG"));
            x.appendChild(addOption("GB-12"));
            x.appendChild(addOption("IT-6+"));

            x.appendChild(addOption("PG-13"));
            x.appendChild(addOption("FSK-12"));
            x.appendChild(addOption("GB-12A"));
            x.appendChild(addOption("IT-14+"));
            x.appendChild(addOption("TV-14"));
            x.appendChild(addOption("FSK-16"));
            x.appendChild(addOption("GB-15"));
            x.appendChild(addOption("R"));
            x.appendChild(addOption("M"));
            x.appendChild(addOption("TV-MA"));
            x.appendChild(addOption("FSK-18"));
            x.appendChild(addOption("GB-18"));
            x.appendChild(addOption("NC-17"));

            x.appendChild(addOption("GB-R18"));
            x.appendChild(addOption("IT-18+"));
            x.appendChild(addOption("AO"));
            x.appendChild(addOption("RP"));
            x.appendChild(addOption("UR"));
            x.appendChild(addOption("NR"));
            x.appendChild(addOption("X"));
            x.appendChild(addOption("XXX"));

            x.value = set_value;

            return x;
        };
    };


    // --------------------------------------------------
    //   
    // --------------------------------------------------
    // function restore_metadata_date(d){
    //     var temp = d+"T00:00:00.0000000+00:00";
    //     return temp;
    // };


    // --------------------------------------------------
    //   
    // --------------------------------------------------
    function update_values(item_data, master_obj) {
        let temp;
        //item_data.Path
        //item_data.OriginalTitle         = document.getElementById("V_1").value;
        //item_data.Name                  = document.getElementById("V_2").value;                 
        //item_data.SortName              = document.getElementById("V_3").value;
        //item_data.Taglines[0]           = document.getElementById("V_4").value;
        //item_data.Overview              = document.getElementById("V_5").value;
        temp = master_obj.OfficialRating;    if(temp != "") item_data.OfficialRating   = temp;
        temp = master_obj.CommunityRating;   if(temp) item_data.CommunityRating        = temp;
        temp = master_obj.PremiereDate;      if(temp != "") item_data.PremiereDate     = temp;
        temp = master_obj.ProductionYear;    if(temp != "") item_data.ProductionYear   = temp;
        temp = master_obj.ProviderIds;       if(temp != "") item_data.ProviderIds.Imdb = temp;
        temp = master_obj.ProviderIds;       if(temp != "") item_data.ProviderIds.Tmdb = temp;
        temp = master_obj.DateCreated;       if(temp != "") item_data.DateCreated      = temp;
        //item_data.LocalTrailerCount     = document.getElementById("V_13").value;
        //item_data.RemoteTrailers.length = document.getElementById("V_14").value;
        //item_data.IsFolder              = document.getElementById("V_15").value;
        //item_data.Width                 = document.getElementById("V_16").value;
        //item_data.Height                = document.getElementById("V_17").value;
        //item_data.Container             = document.getElementById("V_18").value;
        temp = master_obj.CustomRating;      if(temp != "") item_data.CustomRating = temp;
        //((item_data.RunTimeTicks/10000000)/60).toFixed(0)
        //(item_data.Size/1000000).toFixed(0)
        //
        let tagStr    = master_obj.TagValue;
        let genreStr  = master_obj.GenreValue;
        let studioStr = master_obj.StudioValue;
        //
        //   get tag, genre and studio actions
        //
        let tagAction    = item_data.TagAction;
        let genreAction  = item_data.GenreAction;
        let studioAction = item_data.StudioAction;
        
        function strToArray(str) {
            let tags_array = str.split(",");
            let tags_set = new Set(tags_array);
            let tagsArr = Array.from(tags_set);
            return tagsArr;
        };


        let tt = strToArray(master_obj.TagValue);
        let gg = strToArray(master_obj.GenreValue);
        let ss = strToArray(master_obj.StudioValue);

        let pulldown_39_value = master_obj.TagAction;
        let pulldown_40_value = master_obj.GenreAction;
        let pulldown_41_value = master_obj.StudioAction;

        console.log("=== save 1 item data = ",item_data);
        console.log("=== save 1 master data = ",master_obj);
        console.log("=== save 1 tt = ",tt);

        if(tagAction != "No save"){                  // tags
            if(pulldown_39_value == "Add to"){  
                tt.forEach(function(item,pos) { item_data.TagItems.push( {"Name":item} ); });
            };
            if(pulldown_39_value == "Replace"){  
                item_data.TagItems = [];
                tt.forEach(function(item,pos) { item_data.TagItems.push( {"Name":item} ); });
            };
            if(pulldown_39_value == "Remove"){  

            };
            if(pulldown_39_value == "Delete All"){ item_data.TagItems = []; };
        };
        if(genreAction != "No save"){                // genres
            if(pulldown_40_value == "Add to"){  
                gg.forEach(function(item,pos) { item_data.GenreItems.push( {"Name":item} ); });
            };
            if(pulldown_40_value == "Replace"){  
                item_data.GenreItems = [];
                gg.forEach(function(item,pos) { item_data.GenreItems.push( {"Name":item} ); });
            };
            if(pulldown_40_value == "Remove"){  

            };
            if(pulldown_40_value == "Delete All"){ item_data.GenreItems = []; };
        };
        if(studioAction != "No save"){                // studios
            if(pulldown_41_value == "Add to"){  
                ss.forEach(function(item,pos) { item_data.StudioItems.push( {"Name":item} ); });
            };
            if(pulldown_41_value == "Replace"){  
                item_data.Studios = [];
                ss.forEach(function(item,pos) { item_data.StudioItems.push( {"Name":item} ); });
            };
            if(pulldown_41_value == "Remove"){  

            };
            if(pulldown_41_value == "Delete All"){ item_data.StudioItems = []; };
        };

        console.log("=== save 3 item data = ",item_data);




        // let select_all_tags = document.querySelectorAll(".my_tags");
        // let tags_array = [];
        // select_all_tags.forEach(function(item,pos) { tags_array.push( {"Name":item.value} ); });
        // let tags_set = new Set(tags_array);
        // let tagsArr = Array.from(tags_set);
        // item_data.TagItems = (tagsArr.length>0) ? tagsArr : [];






        item_data.LockedFields = master_obj.LockedFields;
        //............................................
        //
        // save "lock all" locks
        //
        let lock_All = master_obj.LockData;
        if(lock_All != "") item_data.LockData = master_obj.lock_All;  
        //............................................
        //
        // upload "played" and "favorite" (these are stored separate in the DB from other data)
        //
        let userdataIsFavorite = master_obj.userdataIsFavorite;
        let userdataPlayed     = master_obj.userdataPlayed;

        console.log("=== Favorite = "+userdataIsFavorite);
        console.log("=== Played = "+userdataPlayed);
        
        let url_2 = server_url+"Users/"+user_id+"/FavoriteItems/"+current_item_data.Id+"?api_key="+api_key;
        let url_1 = server_url+"Users/"+user_id+"/PlayedItems/"+current_item_data.Id+"?api_key="+api_key;

        let req_1 = new Request(url_1,{ method: 'POST',   mode: 'cors' });
        let req_2 = new Request(url_1,{ method: 'DELETE', mode: 'cors' });
        let req_3 = new Request(url_2,{ method: 'POST',   mode: 'cors' });
        let req_4 = new Request(url_2,{ method: 'DELETE', mode: 'cors' });
        //
        // save user data
        //
        if(userdataPlayed != "")     postUserdata( (userdataPlayed=="true")     ? req_1 : req_2 );
        if(userdataIsFavorite != "") postUserdata( (userdataIsFavorite=="true") ? req_3 : req_4 );
        //
        // post to server
        //
        function postUserdata(req) {
            console.log("=== req = ",req);
            fetch(req)
                .then( (response) =>{
                    if(response.ok) { console.log("=== Save Favorite and Played - Finished OK"); return response.json() } else { throw new Error("Bad HTTP"); }
                })
                .then( (jsonData) => {
                    console.log("=== JSON data ",jsonData);
                })
                .catch( (err) => {
                    console.log("=== Error ",err);
                });
        };

        return item_data;
    };

    // --------------------------------------------------
    //   
    // --------------------------------------------------
    function create_master_obj() {
        let item_data = {};
        let temp;

        item_data.Path = "";
        item_data.OriginalTitle = "";
        item_data.Name = "";
        item_data.SortName = "";
        item_data.Taglines = [];
        item_data.Overview = "";

        temp = document.getElementById("V_6").value;   if(temp != "") item_data.OfficialRating   = temp;
        temp = document.getElementById("V_7").value;   if(temp != "") item_data.CommunityRating  = temp;
        temp = document.getElementById("V_8").value;   if(temp != "") item_data.PremiereDate     = temp;
        temp = document.getElementById("V_9").value;   if(temp != "") item_data.ProductionYear   = temp;
        //temp = document.getElementById("V_10").value;  if(temp != "") item_data.ProviderIds["imdb"] = temp;
        //temp = document.getElementById("V_11").value;  if(temp != "") item_data.ProviderIds["Tmdb"] = temp;
        temp = document.getElementById("V_12").value;  if(temp != "") item_data.DateCreated = temp;

        item_data.LocalTrailerCount = "";
        item_data.RemoteTrailers = "";
        item_data.IsFolder = "";
        item_data.Width = "";
        item_data.Height = "";
        item_data.Container = "";

        temp = document.getElementById("V_19").value;  if(temp != "") item_data.CustomRating = temp;

        item_data.RunTimeTicks = "";
        item_data.Size = "";
        //
        //   get tags, genres and studios
        //
        let obj_tag_value    = document.getElementById("V_39").value;  // tags
        let obj_genre_value  = document.getElementById("V_40").value;  // genres
        let obj_studio_value = document.getElementById("V_41").value;  // studios

        item_data["TagValue"]    = obj_tag_value.trim();
        item_data["GenreValue"]  = obj_genre_value.trim();
        item_data["StudioValue"] = obj_studio_value.trim();

        console.log("=== tagValue = ", obj_tag_value );
        console.log("=== p_39 ", document.getElementById("P_39") );

        item_data["TagAction"]    = document.getElementById("P_39").value;  // action for tags
        item_data["GenreAction"]  = document.getElementById("P_40").value;  // action for genres
        item_data["StudioAction"] = document.getElementById("P_41").value;  // action for studios

        // let tags_array = obj_tag_value.split(",");
        // let tags_set = new Set(tags_array);
        // let tagsArr = Array.from(tags_set);
        // item_data.TagItems = (tagsArr.length>0) ? tagsArr : [];

        // let genre_array = obj_genre_value.split(",");
        // let genre_set = new Set(genre_array);
        // let genreArr = Array.from(genre_set);
        // item_data.GenreItems = (genreArr.length>0) ? genreArr : [];

        // let studio_array = obj_studio_value.split(",");
        // let studio_set = new Set(studio_array);
        // let studioArr = Array.from(studio_set);
        // item_data.Studios = (studioArr.length>0) ? studioArr : [];

        //............................................
        let lock_Name     = document.getElementById("V_22").value;
        let lock_OR       = document.getElementById("V_23").value;
        let lock_Genres   = document.getElementById("V_24").value;
        let lock_Cast     = document.getElementById("V_25").value;
        let lock_Studios  = document.getElementById("V_26").value;
        let lock_Tags     = document.getElementById("V_27").value;
        let lock_Overview = document.getElementById("V_28").value;
        //............................................
        // save individual locks
        let LockedFields = [];
        
        if(lock_Name    == "Locked")   LockedFields.push("Name");
        if(lock_OR      == "Locked")   LockedFields.push("OfficialRating");
        if(lock_Genres  == "Locked")   LockedFields.push("Genres");
        if(lock_Cast    == "Locked")   LockedFields.push("Cast");
        if(lock_Studios == "Locked")   LockedFields.push("Studios");
        if(lock_Tags    == "Locked")   LockedFields.push("Tags");
        if(lock_Overview== "Locked")   LockedFields.push("Overview");

        item_data.LockedFields = LockedFields;
        //............................................
        //
        // save "lock all" locks
        //
        let lock_All = document.getElementById("V_29").value;
        if(lock_All != "") item_data.LockData = (lock_All == "true") ? true : false;     
        //............................................
        //
        // upload "played" and "favorite" (these are stored separate in the DB from other data)
        //
        let userdataIsFavorite = document.getElementById("V_30").value;
        let userdataPlayed     = document.getElementById("V_31").value;
        if(userdataIsFavorite != "") item_data.userdataIsFavorite = userdataIsFavorite; 
        if(userdataPlayed != "")     item_data.userdataPlayed     = userdataPlayed;

        console.log("=== Favorite = "+userdataIsFavorite);
        console.log("=== Played = "+userdataPlayed);

        return item_data;
    };
};

