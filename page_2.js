

var page_2_HTML = `
<div>
    <button id="prev_btn"       class="page_button">Prev</button>
    <button id="next_btn"       class="page_button">Next</button>
    <button id="save_btn"       class="page_button">Save</button>
    <button id="saveNext_btn"   class="page_button">SaveNext</button>
</div>
<div id="page_title"></div>
`;

function item_editor(selected, obj, selected_index){


    var editor_selected = selected;
    var editor_obj      = obj;
    

    if(selected.length == 0) return;
    //
    // put placeholder on the page queue
    //
    page_queue.push( obj );

    //page_queue.pop(); // remove temp data
    //page_queue.push(obj);

    let item_value = [];
    var item_name  = [];
    var item_width = [];
    var current_item_data;

    document.getElementById("side_node").style.display = "none";

    var index = selected_index;
    var count = selected.length;

    var bn = document.getElementById("button_node");
    while (bn.firstChild) { bn.firstChild.remove(); };
    //
    // add html buttons to the button node
    //
    bn.innerHTML = page_2_HTML;

    //------------------------------------------------------
    //
    //   add ondb to modal node
    //
    var mn = document.getElementById("modal_node");
    //while (mn.firstChild) { mn.firstChild.remove(); };

    let dn = myModal(mn);

    omdb( "", obj.Items[selected[index]], callback_omdb, dn );

    function callback_omdb() {
        console.log("=== omdb done ===");
    };
    //
    //   add page title
    //
    document.getElementById("page_title").innerHTML = "Edit Item ("+selected.length+" items)";
    //
    //   button event listeners
    //
    document.getElementById("prev_btn").onclick       = function(){prev()};
    document.getElementById("next_btn").onclick       = function(){next()};
    document.getElementById("save_btn").onclick       = function(){save()};
    document.getElementById("saveNext_btn").onclick   = function(){saveNext()};
    //
    // button event listener functions
    //
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

        current_item_data = update_values(current_item_data);
        console.log("=== current item data = ",current_item_data);

        let url = server_url+"Items/"+current_item_data.Id+"?EnableUserData=true&api_key="+api_key;
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(current_item_data)
        });
        
        return;
    };
    function saveNext() {
        console.log("_________ save next Btn ___________");

        save();
        next();

        return;
    };
    //------------------------------------------------------
    //------------------------------------------------------
    //------------------------------------------------------

    edit_page(selected, obj, index);

    //------------------------------------------------------
    //------------------------------------------------------
    //------------------------------------------------------    

    function edit_page(selected, obj, index) {
        console.log("=== obj = ",obj);
        console.log("=== selected = ",selected);
        console.log("=== index = ",index);

        let item = obj.Items[selected[index]];

        let url = server_url+"Users/"+user_id+"/Items/"+item.Id+"?Fields=MediaStreams,UserData&EnableUserData=true&api_key="+api_key;
        download(url, edit_item);
    };

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
        dn.appendChild( addImage(image_url, "100", "image_id") );    // add the document fragment to the DOM
        //
        // edit image button
        //
        let edit_img_btn = document.createElement("Button");
        edit_img_btn.classList.add('prev_page_button');
        edit_img_btn.innerHTML = "Change Image";
        edit_img_btn.id = "editImageBtn";
        edit_img_btn.style.verticalAlign = "top";

        dn.appendChild(edit_img_btn);
        //
        // omdb image button
        //
        let omdb_img_btn = document.createElement("Button");
        omdb_img_btn.classList.add('prev_page_button');
        omdb_img_btn.innerHTML = "OMDB";
        omdb_img_btn.id = "omdbImageBtn";
        omdb_img_btn.style.verticalAlign = "top";

        dn.appendChild(omdb_img_btn);

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
        // h = type textarea 10 rows 40 cols
        // i = input type number start 1920 end 2040
        // j = inout type number start 1 end 10
        // k = type text area 4 rows 40 cols
        // --------------------------------------------------
        item_width[0]  =  "a";
        item_width[1]  =  "d";
        item_width[2]  =  "d";
        item_width[3]  =  "d";
        item_width[4]  =  "d";
        item_width[5]  =  "h";   
        item_width[6]  =  "e";
        item_width[7]  =  "j";
        item_width[8]  =  "f";
        item_width[9]  =  "i";
        item_width[10] =  "g";
        item_width[11] =  "g";
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
            td_1.style.width = "180px";

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
            let key = "a";

            let val = item_value[i]; 

            td_2.appendChild( makeTD(key, val, i,false) );

            tr.appendChild(td_2);
            //--------------------------------------------
            //
            //  Col 3
            //
            let td_3 = document.createElement("TD");
            td_3.style.width = "1px";

            tr.appendChild(td_3);
            //--------------------------------------------
            //
            //  Col 4
            //
            let td_4 = document.createElement("TD");
            td_4.style.width = "300px";

            td_4.appendChild( makeTD(item_width[i], item_value[i], i,true) );

            tr.appendChild(td_4);
            //----------------------------------------
            df_1.appendChild(tb);
        };

        dn.appendChild(df_1);    // add the document fragment to the DOM


        //
        // add cast pictures
        //
        cast(item_data,dn);
        //
        // add similar movies
        //
        similarMovies(item_data, dn);  // found in the cast.js file


        document.getElementById("editImageBtn").onclick = function(data){change_image(data)};
        function change_image(data){
            var mn = document.getElementById("modal_node");
            while (mn.firstChild) { mn.firstChild.remove(); };
            
            let dn = myModal(mn);
            edit_images(dn, current_item_data.Id, callback);
            modal_1.style.display = "block";

            function callback(){
                console.log("=== image edit done ===");
                page_queue.pop();
                item_editor(editor_selected, editor_obj, index);
            };
        };


        document.getElementById("omdbImageBtn").onclick = function(data){omdb_image(data)};
        function omdb_image(data){
            console.log("=== omdb image = ",data);

            var mn = document.getElementById("modal_node");
            while (mn.firstChild) { mn.firstChild.remove(); };
            
            let dn = myModal(mn);
            omdb(item_data.Name, item_data, callback, dn);
            modal_1.style.display = "block";

            function callback(){
                console.log("=== omdb done ===");
                page_queue.pop();
                item_editor(editor_selected, editor_obj, index);
            };
        };

        // --------------------------------------------------
        //   
        // --------------------------------------------------
        function metadataDate(d) {
            let t = d.split("T");
            return t[0];
        };
        
        // --------------------------------------------------
        //   make TD
        // --------------------------------------------------
        function makeTD(key, val, index, assignId) {

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
                x.appendChild(addOption("Unlocked"));
                x.appendChild(addOption("Locked"));
                x.value = val;
            } else
            if(key == "c") {
                x = document.createElement("SELECT");
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
                x.value = val;  
            };
            

            //
            // add id to all items so their values can be read
            //
            if(assignId) {
                x.id = "V_"+index;
                //console.log("======= x id = "+x.id+", x = ",x);
            };

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
    function restore_metadata_date(d){
        var temp = d+"T00:00:00.0000000+00:00";
        return temp;
    };
    // --------------------------------------------------
    //   
    // --------------------------------------------------
    function update_values(item_data) {

        item_data.OriginalTitle         = document.getElementById("V_1").value;
        item_data.Name                  = document.getElementById("V_2").value;                 
        item_data.SortName              = document.getElementById("V_3").value;
        item_data.Taglines[0]           = document.getElementById("V_4").value;
        item_data.Overview              = document.getElementById("V_5").value;
        item_data.OfficialRating        = document.getElementById("V_6").value;
        item_data.CommunityRating       = document.getElementById("V_7").value;
        item_data.PremiereDate          = restore_metadata_date(document.getElementById("V_8").value);
        item_data.ProductionYear        = document.getElementById("V_9").value;
        item_data.ProviderIds.Imdb      = document.getElementById("V_10").value;
        item_data.ProviderIds.Tmdb      = document.getElementById("V_11").value;
        item_data.DateCreated           = restore_metadata_date(document.getElementById("V_12").value);
        //item_data.LocalTrailerCount     = document.getElementById("V_13").value;
        //item_data.RemoteTrailers.length = document.getElementById("V_14").value;
        //item_data.IsFolder              = document.getElementById("V_15").value;
        //item_data.Width                 = document.getElementById("V_16").value;
        //item_data.Height                = document.getElementById("V_17").value;
        //item_data.Container             = document.getElementById("V_18").value;
        item_data.CustomRating          = document.getElementById("V_19").value;
        //((item_data.RunTimeTicks/10000000)/60).toFixed(0)
        //(item_data.Size/1000000).toFixed(0)

        //............................................
        //
        // add tags, genres, and studios to item_data
        //
        // function make_array_of_objs(index, remove_spaces){
        //     //str = str.replace(/\s+/g, '');
        //     let temp1 = document.getElementById("V_"+index).value;
        //     if(remove_spaces) temp1 = temp1.replace(/\s+/g, '');  // remove all spaces in string
        //                  else temp1 = temp1.trim();
        //     temp1 = temp1.split(",");           // make an array from the string
        //     let temp2 = [];
        //     temp1.forEach( (item) => { 
        //         temp2.push({"name":item});
        //     });
        //     return temp2;
        // };

        //item_data.TagItems   = make_array_of_objs(39, true);  //document.getElementById("V_39").value;
        //item_data.GenreItems = make_array_of_objs(40, true);  //document.getElementById("V_40").value;
        //item_data.Studios    = make_array_of_objs(41, false); //document.getElementById("V_41").value;

        //............................................
        //
        //   get lock info
        //
        let lock_Name     = document.getElementById("V_22").value;
        let lock_OR       = document.getElementById("V_23").value;
        let lock_Genres   = document.getElementById("V_24").value;
        let lock_Cast     = document.getElementById("V_25").value;
        let lock_Studios  = document.getElementById("V_26").value;
        let lock_Tags     = document.getElementById("V_27").value;
        let lock_Overview = document.getElementById("V_28").value;
        //............................................
        //
        //   save individual locks
        //
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
        item_data.LockData = (lock_All == "true") ? true : false;     
        //............................................
        //
        // upload watched and favorite (these are stored separate in the DB from other data)
        //
        let userdataIsFavorite = document.getElementById("V_30").value;
        let userdataPlayed     = document.getElementById("V_31").value;

        console.log("=== Favorite = "+userdataIsFavorite);
        console.log("=== Played = "+userdataPlayed);
        
        let url_2 = server_url+"Users/"+user_id+"/FavoriteItems/"+current_item_data.Id+"?api_key="+api_key;
        let url_1 = server_url+"Users/"+user_id+"/PlayedItems/"+current_item_data.Id+"?api_key="+api_key;

        let req_1 = new Request(url_1,{ method: 'POST',   mode: 'cors' });
        let req_2 = new Request(url_1,{ method: 'DELETE', mode: 'cors' });
        let req_3 = new Request(url_2,{ method: 'POST',   mode: 'cors' });
        let req_4 = new Request(url_2,{ method: 'DELETE', mode: 'cors' });
        //
        // save data
        //
        if(userdataPlayed != "")     postUserdata( (userdataPlayed=="true")     ? req_1 : req_2 );
        if(userdataIsFavorite != "") postUserdata( (userdataIsFavorite=="true") ? req_3 : req_4 );
        //
        // post
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
        //
        //   get tags, genres and studios
        //
        let tags_array = [];
        let tag_area = document.getElementById("V_"+39);
        let tag_str  = tag_area.value;
        let tt = tag_str.split(",");
        tt.forEach(function(item,pos) { tags_array.push( {"Name":item} ); });
        let tags_set = new Set(tags_array);
        let tagsArr = Array.from(tags_set);
        item_data.TagItems = (tagsArr.length>0) ? tagsArr : [];

        let genres_array = [];
        let genres_area = document.getElementById("V_"+40);
        let genres_str  = genres_area.value;
        let gg = genres_str.split(",");
        gg.forEach(function(item,pos) { genres_array.push( {"Name":item} ); });
        let genres_set = new Set(genres_array);
        let genresArr = Array.from(genres_set);
        item_data.GenreItems = (genresArr.length>0) ? genresArr : [];

        let studios_array = [];
        let studios_area = document.getElementById("V_"+41);
        let studios_str  = studios_area.value;
        let ss = studios_str.split(",");
        ss.forEach(function(item,pos) { studios_array.push( {"Name":item} ); });
        let studios_set = new Set(studios_array);
        let studiosArr = Array.from(studios_set);
        item_data.Studios = (studiosArr.length>0) ? studiosArr : [];

        return item_data;
    };
};




