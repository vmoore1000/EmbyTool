


var page_1_HTML = `
<button id="filter_btn"     class="page_button">Filter</button>
<button id="custom_btn"     class="page_button">Custom</button>
<button id="play_btn"       class="page_button">Play</button>
<button id="edit_btn"       class="page_button">✍ Edit</button>
<button id="bulk_btn"       class="page_button">🗐 Bulk</button>
<button id="remove_btn"     class="page_button">Remove</button>
<button id="collection_btn" class="page_button">Collection</button>
<button id="playlist_btn"   class="page_button">Playlist</button>
<button id="clear_btn"      class="page_button">Clear</button>
`;

function views(view_url, width, height, scroll_position){

    console.log("=== view_url = ",view_url);
    //
    //    please wait message
    //
    let mn = document.getElementById("modal_node");

    let message = myModal(mn);
    message.innerHTML = "<div style='text-align: center;'><h1>Loading - Please Wait</h1></div>";
    modal_1.style.display = "block";
    //
    //   load buttons
    //
    let bn = document.getElementById("button_node");
    while (bn.firstChild) { bn.firstChild.remove(); };
    bn.innerHTML = page_1_HTML;
    bn.style.backgroundColor = "lightgray";   // button area background color
    //
    //   clear page node
    //
    let pn = document.getElementById("page_node");
    while (pn.firstChild) { pn.firstChild.remove(); };
    pn.style.backgroundColor = "lightgray";  // page node background color



    //
    //   download the page to display
    //
    download(view_url+filter_string, display_page);





    //
    //   monitor clicks on display node
    //
    pn.onclick = function(data){pn_click(data)};



    document.getElementById("sideDiv").onclick = function(data){side_node_click(data)};
    //-----------------------------------------------------------
    //             page node item clicked
    //-----------------------------------------------------------
    function pn_click(data) {
        console.log("___________ item clicked ___________",data);
        let temp1 = data.target.id;
        let temp2 = temp1.split("_");

        let index = temp2[1];
        let item_clicked;

        //console.log("=== index =",index);

        if(!(temp2[0]=="I")) return;

        if( data["shiftKey"] ){  
            //if(page_queue.length <= 1) return;  // dont select all on views page

            //
            // select all
            //
            let not_selected = document.querySelectorAll(".notSelected");
            let cnt = not_selected.length;
            for(let i=0; i<cnt; i++ ) {
                let item = not_selected[i];
                item.className = "selected";
            };
    
            let selected = document.querySelectorAll(".selected");
            let selected_cnt = selected.length;

            selected_items = [];
            for(let i=0; i<selected_cnt; i++ ) selected_items.push(""+i);

            if(selected.length == 1) {
                edit_btn.style.display = "inline-block";
                play_btn.style.display = "inline-block";
                bulk_btn.style.display = "none";
                collection_btn.style.display = "inline-block";
                playlist_btn.style.display   = "inline-block";
                clear_btn.style.display   = "inline-block";
            } else
            if(selected.length > 1) {
                edit_btn.style.display = "inline-block";
                play_btn.style.display = "inline-block";
                bulk_btn.style.display = "inline-block";
                collection_btn.style.display = "inline-block";
                playlist_btn.style.display   = "inline-block";
                clear_btn.style.display   = "inline-block";
            };

            return;
        };

        //console.log("=== page queue = ",page_queue);

        let obj;

        if(page_queue.length > 0){
            obj = page_queue[page_queue.length-1];   // remove the display page object from the page queue
            item_clicked = obj.Items[index];         // get the item clicked
            //console.log("=== item clicked = ",item_clicked);
            if(item_clicked.IsFolder)
                document.getElementById("topPageTitle").innerText = item_clicked.Name;

        } else return;



        if (item_clicked.Type) {
            if (item_clicked.Type=="Playlist") {
                console.log("=== Playlist ===");
                playlistId = item_clicked.Id;
            } else
            if (item_clicked.Type=="BoxSet") {
                console.log("=== Collection ===");
                collectionId = item_clicked.Id;
            };
        };




        if(item_clicked && item_clicked.IsFolder && !data["ctrlKey"]) {
            console.log("=== item clicked is a folder ====");

            item_clicked["scroll_to"] = pn.scrollTop;


            if(item_clicked.CollectionType == "livetv") {
                getEPG();

                return;
            };

            goto_page(item_clicked);
            return;
        };



        if (data.target.className == "notSelected") {
            document.getElementById(temp1).className = "selected"
        } else {
            document.getElementById(temp1).className = "notSelected"
        };


        let selected = document.querySelectorAll(".selected");

        console.log("=== Selected length = ",selected.length);

        if(selected.length == 0) {
            edit_btn.style.display = "none";
            play_btn.style.display = "none";
            bulk_btn.style.display = "none";
            collection_btn.style.display = "none";
            playlist_btn.style.display   = "none";
            clear_btn.style.display   = "none";
            remove_btn.style.display   = "none";

            //document.getElementById("topPageTitle").innerText = "";
        } else
        if(selected.length == 1) {
            edit_btn.style.display = "inline-block";
            play_btn.style.display = "inline-block";
            bulk_btn.style.display = "none";
            collection_btn.style.display = "inline-block";
            playlist_btn.style.display   = "inline-block";
            clear_btn.style.display   = "inline-block";
            if((playlistId || collectionId) && selected.length>0) remove_btn.style.display = "inline-block";
        } else
        if(selected.length > 1) {
            edit_btn.style.display = "inline-block";
            play_btn.style.display = "inline-block";
            bulk_btn.style.display = "inline-block";
            collection_btn.style.display = "inline-block";
            playlist_btn.style.display   = "inline-block";
            clear_btn.style.display   = "inline-block";
            if((playlistId || collectionId) && selected.length>0) remove_btn.style.display = "inline-block";
        };
    };



    //-----------------------------------------------------------
    //                  sidebar clicked
    //-----------------------------------------------------------

    function side_node_click(data) {
        console.log("_____________________ Click on Alpha _____________________",data);

        const { nodeName, id } = data.target;    // get the node name and id from the clicked target
        let id_array = id.split("_");

        if(id_array[0] == "alpha") {
            if(search_for_char=="") {
                console.log("=== alpha clicked ",id_array[1]);
                search_for_char = id_array[1];

                let obj = page_queue.pop(); //[page_queue.length-1];  // get the displayed object from the page queue

                display_page(obj);
            };
        }; 
    };

    //-----------------------------------------------------------
    //                  
    //-----------------------------------------------------------

    //
    //   button event listeners
    //
    var filter_btn     = document.getElementById("filter_btn");
    var custom_btn     = document.getElementById("custom_btn");
    var play_btn       = document.getElementById("play_btn");
    var edit_btn       = document.getElementById("edit_btn");
    var bulk_btn       = document.getElementById("bulk_btn");
    var remove_btn     = document.getElementById("remove_btn");
    var collection_btn = document.getElementById("collection_btn");
    var playlist_btn   = document.getElementById("playlist_btn");
    var clear_btn      = document.getElementById("clear_btn");

    //filter_btn.style.display     = "none";
    //custom_btn.style.display     = "none";
    edit_btn.style.display       = "none";
    play_btn.style.display       = "none";
    bulk_btn.style.display       = "none";
    remove_btn.style.display     = "none"; //(playlistId || collectionId) ? "inline-block" : "none";
    collection_btn.style.display = "none";
    playlist_btn.style.display   = "none";
    clear_btn.style.display      = "none";

    filter_btn.onclick     = function(){filter()};
    custom_btn.onclick     = function(){custom()};

    play_btn.onclick       = function(){play()};

    edit_btn.onclick       = function(){edit()};
    bulk_btn.onclick       = function(){bulk()};
    remove_btn.onclick     = function(){remove()};
    collection_btn.onclick = function(){collection()};
    playlist_btn.onclick   = function(){playlist()};
    clear_btn.onclick      = function(){clear()};

    function filter() {
        console.log("___________ filter Btn _____________");
        
        emby_filters();
        return;
    };
    function custom() {
        console.log("____________ custom filter Btn ______________");
        if(page_queue.length>0){
            let obj = page_queue[page_queue.length-1];  // get the displayed object from the page queue
            //
            // get all selected items
            //
            let selected = document.querySelectorAll(".selected");
            //
            // for each selected item put it's index into obj into the array "a"
            //
            let a = [];
            selected.forEach( (item) => {
                        let temp = item.id.split("_");
                        a.push(parseInt(temp[1]));
                    });
            custom_filter (a, obj);
        };
        
        return;
    };

    function play() {
        console.log("____________ play Btn ______________");
        let obj = page_queue[page_queue.length-1];  // get the displayed object from the page queue
        //
        // get all selected items
        //
        let selected = document.querySelectorAll(".selected");

        console.log("=== selected = ",selected);
        console.log("=== obj = ",obj);
        //
        // for each selected item put it's index into obj into the array "a"
        //
        let a = [];
        selected.forEach( (item) => {
                    let temp = item.id.split("_");
                    a.push(parseInt(temp[1]));
                });
        //....................................................
        let play_index = 0; 

        play_item();

        function play_item() {
            let mn = document.getElementById("modal_node");
            let dn = myModal(mn);
            let play_obj = obj.Items[ a[play_index] ];

            console.log("=== play_obj = ",play_obj);

            if(play_obj.Type=="Movie" || play_obj.Type=="MusicVideo" || play_obj.Type=="Video") {
                play_video_files(play_obj.Id, dn, callback, callback2);
            } else
            if(play_obj.Type=="Audio") {
                play_audio_files(play_obj, dn, callback, callback2);
            } else
            if(play_obj.Type=="Photo") {
                play_photo_files(play_obj, dn, callback, callback2);
            } else
            if(play_obj.Type=="Book") {
                play_book_files(play_obj, dn, callback, callback2);
            } else {
                callback();
            };

            modal_1.style.display = "block";
        };

        function callback(){
            console.log("=== item playing done ===");
            //modal_1.style.display = "none";

            play_index++;

            if(play_index < a.length) {
                play_item();
            } else {
                callback2();
                //clear();
            };
        };

        function callback2(){
            console.log("=== loop playing finished ===");
            modal_1.style.display = "none";
            //page_queue.pop();

            //while (pn.firstChild) { pn.firstChild.remove(); };

            views(view_url, width, height, scroll_position);
            //clear();
        };
        //....................................................
    
        return;
    };

    function edit() {
        console.log("____________ edit Btn ______________");

        if(page_queue.length>0){
            let obj = page_queue[page_queue.length-1];  // get the displayed object from the page queue

            page_queue.pop(); // remove temp data
            page_queue.push(obj);
            //
            // get all selected items
            //
            let selected = document.querySelectorAll(".selected");
            //
            // for each selected item put it's index into obj into the array "a"
            //
            let a = [];
            selected.forEach( (item) => {
                        let temp = item.id.split("_");
                        a.push(parseInt(temp[1]));
                    });
            item_editor(a, obj, 0);
        };

        return;
    };
    function bulk() {
        console.log("____________ bulk Btn ______________");
        if(page_queue.length>0){
            let obj = page_queue[page_queue.length-1];  // get the displayed object from the page queue
            //
            // get all selected items
            //
            let selected = document.querySelectorAll(".selected");
            //
            // for each selected item put it's index into obj into the array "a"
            //
            //console.log("=== obj = ",obj);
            //console.log("=== selected = ",selected);
            let a = [];
            selected.forEach( (item) => {
                        let temp = item.id.split("_");
                        a.push(parseInt(temp[1]));
                    });
            //console.log("=== selected array = ",a);

            bulk_editor(a, obj);
        };
        return;
    };
    function remove() {
        console.log("___________ remove Btn _____________");
        if(page_queue.length>0){
            console.log("=== playlistId = ",playlistId);
            console.log("=== collectionId = ",collectionId);

            let obj = page_queue[page_queue.length-1];  // get the displayed object from the page queue
            //
            // get all selected items
            //
            let selected = document.querySelectorAll(".selected");
            //
            // for each selected item put it's index into obj into the array "a"
            //
            let a = [];
            selected.forEach( (item) => {
                        let temp = item.id.split("_");
                        a.push(parseInt(temp[1]));
                     }
            );
            // a = array of selected indexes into obj
            
            console.log("=== obj = ",obj);
            console.log("=== a = ",a);

            let b = [];
            a.forEach(
                (index) => {
                    let temp = obj.Items[index];
                    console.log("=== temp = ",temp);
                    if(playlistId) {
                        b.push(temp.PlaylistItemId );
                    } else {
                        b.push(temp.Id );
                    };
                }
            );
            let selectedItemsIdStr = b.toString();
            console.log("=== selectedItemsIdStr = ",selectedItemsIdStr);

            //-------------------------------------------------------   
            let url;
            if(playlistId) {
                url = server_url+"Playlists/"+playlistId+"/Items?EntryIds="+selectedItemsIdStr+"&api_key="+api_key;
            } else {
                url = server_url+"Collections/"+collectionId+"/Items?Ids="+selectedItemsIdStr+"&api_key="+api_key;
            };

            console.log("=== collection/playlist URL = "+url);

            let h = new Headers();
            h.append('Accept','Application/json');

            let req;
            req = new Request(url,{ 
                method:  'DELETE', 
                mode:    'cors',
                headers: h
            });
            fetch(req)
                .then( (response) =>{
                    if(response.ok) { 
                        console.log("=== Finished OK"); 
                        return response.json() } 

                    else { throw new Error("Bad HTTP"); }
                })
                .then( (jsonData) => {
                    console.log("=== JSON data ",jsonData);
                    playlistUpdated();
                })
                .catch( (err) => {
                    console.log("=== Error ",err);
                    playlistUpdated();
                });

            function playlistUpdated() {
                console.log("=== Update Finished OK");

                page_queue.pop();  // get the displayed object from the page queue

                views(view_url, width, height, scroll_position);
                return;
            };
            //-------------------------------------------------------
        };
        return;
    };
    function collection() {
        console.log("_________ collection Btn ___________");
        let obj = page_queue[page_queue.length-1];  // get the displayed object from the page queue
        //
        // get all selected items
        //
        let selected = document.querySelectorAll(".selected");
        //
        // for each selected item put it's index into obj into the array "a"
        //
        let a = [];
        selected.forEach( (item) => {
                    let temp = item.id.split("_");
                    a.push(parseInt(temp[1]));
                });

        let mn = document.getElementById("modal_node");
        //while (mn.firstChild) { mn.firstChild.remove(); };

        let dn = myModal(mn);
        collections(dn, a, obj, callback);
        modal_1.style.display = "block";

        function callback(){
            console.log("=== collections done ===");
            clear();
            //page_queue.pop();
            //item_editor(editor_selected, editor_obj, index);
        };

        //collections(a, obj);
        return;
    };
    function playlist() {
        console.log("__________ playlist Btn ____________");
        let obj = page_queue[page_queue.length-1];  // get the displayed object from the page queue
        //
        // get all selected items
        //
        let selected = document.querySelectorAll(".selected");
        //
        // for each selected item put it's index into obj into the array "a"
        //
        let a = [];
        selected.forEach( (item) => {
                    let temp = item.id.split("_");
                    a.push(parseInt(temp[1]));
                });



        let mn = document.getElementById("modal_node");
        //while (mn.firstChild) { mn.firstChild.remove(); };

        let dn = myModal(mn);
        playlists1(dn, a, obj, callback);
        modal_1.style.display = "block";

        function callback(){
            console.log("=== playlist done ===");
            clear();
            //page_queue.pop();
            //item_editor(editor_selected, editor_obj, index);
        };



        //playlists(a, obj)
        return;
    };
    function clear() {
        console.log("_______ clear Selectios Btn ________");
        play_btn.style.display       = "none";
        edit_btn.style.display       = "none";
        bulk_btn.style.display       = "none";
        remove_btn.style.display     = "none";
        collection_btn.style.display = "none";
        playlist_btn.style.display   = "none";
        clear_btn.style.display      = "none";

        //document.getElementById("topPageTitle").innerText = "";
        //
        // select all
        //
        let selected = document.querySelectorAll(".selected");
        let cnt = selected.length;
        for(let i=0; i<cnt; i++ ) {
            let item = selected[i];
            item.className = "notSelected";
        };
        return;
    };
    
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    // let myBar = document.getElementById("myBar");
    // let myBarLabel = document.getElementById("myBarLabel");
    // let barDelta = 0;
    // let barWidth = 0;
    // let include_progress_bar = false;
    //document.getElementById("progressBar").style.display = "none";



    //-----------------------------------------------------------
    //-----------------------------------------------------------
    //-----------------------------------------------------------
    //-----------------------------------------------------------
    // var mn = document.getElementById("message_node");
    // mn.innerHTML = "<div style='text-align: center;><h1>Loading - Please Wait</h1></div>";

    // download(view_url+filter_string, display_page);
    //-----------------------------------------------------------
    //-----------------------------------------------------------
    //-----------------------------------------------------------
    //-----------------------------------------------------------



    //-----------------------------------------------------------
    //                      Display Page
    //-----------------------------------------------------------
    function display_page(data) {

        console.log("=== display page = ",data);
        //
        // top page item count
        //
        document.getElementById("topPageCount").innerHTML = "("+data.Items.length+" items)";
        //
        // put placeholder on the page queue
        //
        page_queue.push( data );

        console.log("=== display page - page queue = ",page_queue);
        //
        //   remove 'Loading - Please Wait' Message
        //
        modal_1.style.display = "none";
        //
        //
        //
        let items = data.Items;

        for(let i=0; i<items.length; i++) {
            //
            //   get item
            //
            let item = items[i];
            //
            // get the item's image tag
            //
            if(item.ImageTags["Primary"]) {
                var image_url = server_url+"Items/"+item.Id+"/Images/Primary?maxHeight=300&maxWidth=200&tag="+item.ImageTags.Primary+"&quality=90";
            } else if (item.SeriesPrimaryImageTag) {
                var image_url = server_url+"Items/"+item.SeriesId+"/Images/Primary?tag="+item.SeriesPrimaryImageTag+"&maxWidth=200&maxHeight=300&quality=90";
            } else if(item.ImageTags["Thumb"]) {
                var image_url = server_url + "Items/"+item.Id+"/Images/Thumb?maxWidth=200&maxHeight=300&api_key=" + api_key;
            } else {
                var image_url = getDefaultImage();
            };
            //
            //   image node
            //
            let iNode = document.createElement("img");
            iNode.src          = image_url;   // add the image URL to the DOM
            iNode.id           = "I_"+i;
            iNode.loading      = "lazy";      // only load images if they are visable on the screen
            iNode.className    = "notSelected";
            iNode.style.width  = width+"px"; 
            iNode.style.height = height+"px"; 
            //
            //   text node
            //
            let tNode   = document.createElement("DIV"); // note label does not have a 'width' attribute, set width with CSS
            let fav     = (item.UserData) ? item.UserData["IsFavorite"] : false;
            let fav_str = ( fav ) ? "<span style='color:red'> ♥</span>" : "";

            tNode.innerHTML = "<b>"+item.Name+fav_str+"</b>";
            if( item.UserData && item.UserData["Played"] ) { tNode.style.backgroundColor = "yellow"; tNode.style.color = "black"; }
            if( item["IsFolder"] ) { tNode.style.backgroundColor = "brown";  tNode.style.color = "white"; };
            tNode.className = "tNode";
            // -----------------------------------------------------------------------------------------------
            //
            //   add tags
            //
            let tag_str = "";
            if(item.TagItems){
                let tag_array = tagsToArray(item.TagItems,"Name");
                tag_str = tag_array.toString();
            };
            // -----------------------------------------------------------------------------------------------
            //
            //   add genres
            //
            let genres_str = "";
            if(item.Genres){
                genres_str = item.Genres.toString();
            };
            // -----------------------------------------------------------------------------------------------
            //
            //   s Node
            //
            let show_tags = true;

            let sNode  = document.createElement("DIV");
            sNode.className = "sNode";
            sNode.innerHTML = (show_tags) ? "<div class='tags'>"+tag_str+"</div><div class='genres'>"+genres_str+"</div>" : "";


            if(search_for_char != ""){
                let search_name = item.Name.toUpperCase();
                if(search_name.startsWith("THE ")) search_name = search_name.slice(4);
                else
                if(search_name.startsWith("A ")) search_name = search_name.slice(2);

                if(search_for_char == search_name[0]) {
                    search_found_id = iNode.id
                    search_for_char = "";
                    console.log("=== Found = ",item.Name,", id = "+iNode.id); 
                };
            };
            // -----------------------------------------------------------------------------------------------
            //
            //  tag filter
            //
            if(showWithTag!=0) {
                if(showWithTag==1) {        //  1 = has no tags, 2 = has tag
                    if(tag_str != "") continue;
                } else {                    //  show item if item has tags
                    if(tag_str == "") continue;
                };

                iNode.className = "selected";
                selected_items.push(""+i);
                
                edit_btn.style.display = "inline-block";
                if(selected_items.length>1) bulk_btn.style.display = "inline-block";
                collection_btn.style.display = "inline-block";
                playlist_btn.style.display   = "inline-block";
                clear_btn.style.display   = "inline-block";
            };
            // -----------------------------------------------------------------------------------------------
            //
            // genre filter
            //
            if(showWithGenre!=0) {
                if(showWithGenre==1) {        //  1 = has no genre, 2 = has genre
                    if(genre_str != "") continue;
                } else {                      //  show item if item has genres
                    if(genre_str == "") continue; 
                };

                iNode.className = "selected";
                selected_items.push(""+i);

                edit_btn.style.display = "inline-block";
                if(selected_items.length>1) bulk_btn.style.display = "inline-block";
                collection_btn.style.display = "inline-block";
                playlist_btn.style.display   = "inline-block";
                clear_btn.style.display   = "inline-block";
            };
            // -----------------------------------------------------------------------------------------------
            //
            // apply custom filter
            //
            if( applyCustomFilter ) {
                if(testResults[i]) {
                    iNode.className = "selected";
                    selected_items.push(""+i);

                    edit_btn.style.display = "inline-block";
                    if(selected_items.length>1) bulk_btn.style.display = "inline-block";
                    collection_btn.style.display = "inline-block";
                    playlist_btn.style.display   = "inline-block";
                    clear_btn.style.display   = "inline-block";
                } else continue;
            };
            // -----------------------------------------------------------------------------------------------
            // 
            //   d Node
            //
            var dNode = document.createElement("DIV");
            dNode.className = "dNode";
            dNode.append(iNode);
            dNode.append(tNode);
            dNode.append(sNode);

            pn.appendChild(dNode);  // add the item to the dn
        };

        console.log("=== display page - end");

        //
        // scroll to search char, or restore scroll position
        //
        if(search_found_id != "") {
            //console.log("=== Scroll to "+search_found_id );
            let selected = document.getElementById(search_found_id);  // scroll the selected item into view
            if(selected) selected.scrollIntoView(true);
        } else {
            //
            // restore the scroll position
            //
            if(scroll_position >= 0) {
                console.log("=== Scroll to = ",scroll_position);
                pn.scrollTop = scroll_position;
            };
        };
        search_found_id = "";
        search_for_char = "";
        applyCustomFilter = false;
        //applyGlobalFilter = false;

        //
        // display the latest media
        //
        get_latest_media(pn, data);
    };
    //
    // add dashboard
    //
    dashboard(true);
};



