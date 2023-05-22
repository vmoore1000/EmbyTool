

var channelsButtonsHTML = `
                    <div class="sticky-div">
                        <button id="channelCancel" type="button" class="page_button">Return</button>
                        <button id="channelFilter" type="button" class="page_button">Filters</button>
                        <button id="channelEdit"   type="button" class="page_button">Edit</button>
                        <button id="bulkEdit"      type="button" class="page_button">Bulk</button>
                    </div>
                    `;

var channelsHTML = `
                    <div id="channelsTitle"></div>
                    <div id="channelArea"></div>
                    `;

var channelEditHTML = `<div id="channelEditContainer">
                    <div id="channelEditTitle" style="text-align:center">Edit Channels</div>
                    <button id="channelEditCancel" type="button" class="page_button">Return</button>
                    <button id="channelEditPrev"   type="button" class="page_button">Prev</button>
                    <button id="channelEditNext"   type="button" class="page_button">Next</button>
                    <button id="channelEditSave"   type="button" class="page_button">Save</button>
                    <br>
                    <div id="editTitle"></div>
                    <br>
                    <div id="editArea"></div>
                </div>`;

var bulkEditHTML = `<div id="bulkEditContainer">
                <div id="bulkEditTitle" style="text-align:center">Bulk Edit Channels</div>
                <button id="bulkEditCancel" type="button" class="page_button">Return</button>
                <button id="bulkEditSave"   type="button" class="page_button">Save</button>
                <br>
                <div id="bulkEditTitle"></div>
                <br>
                <div id="bulkEditArea"></div>
            </div>`;                


var editChannelCallback;

//======================================================================================
//
//                               display Channels 
//
//======================================================================================
function liveTvChannels(callback) {
    //
    // put placeholder on the page queue
    //
    page_queue.push( {} );

    console.log("=== Start Display Channels ===");
    
    editChannelCallback = callback;

    filter_string = "";
    //
    //  add channels button HTML
    //
    let bn = document.getElementById("button_node");
    while (bn.firstChild) { bn.firstChild.remove(); };
    bn.innerHTML = channelsButtonsHTML;


   
    let sn = document.getElementById("side_node");
    sn.style.display = "none";

    displayCH();
};

function displayCH() {
    let pn = document.getElementById("page_node");
    while (pn.firstChild) { pn.firstChild.remove(); };
    pn.innerHTML =  "<br><h1 style='color:red'>Loading Channels, Please Wait!</h1>";

    let url = server_url + "LiveTv/Channels?"+
    "Fields=Genres%2COverview%2CTags&"+
    "MediaStreams,UserData&EnableUserData=true&"+
    "api_key=" + api_key;
    //let url = server_url + "LiveTv/Channels?api_key=" + api_key;
    download(url + filter_string, displayChannels, pn);
};


function displayChannels(data, pn) {
    //var $channelEdit;
    //var $bulkEdit;

    console.log("=== Display Channels ===",data);

    var selected = [];

    pn.innerHTML = channelsHTML;  // add HTML to display channels

    let $channelEdit = document.getElementById("channelEdit");
    let $bulkEdit    = document.getElementById("bulkEdit");

    //let $overlay = document.getElementById("overlay_2")
    //$overlay.style.display = "block";

    $channelEdit.style.display = "none";
    $bulkEdit.style.display = "none";

    //
    // add title to page
    //
    document.getElementById("channelsTitle").innerHTML = "<div style='text-align:center'><h1>Live TV Channels</h1></div>";

    var channelCnt = data["Items"].length;  // get the number of channels
    
    var $channelArea = document.getElementById("channelArea"); // This is where the channels are going to go

    //var temp_tag_array = [];

    for(let i=0; i<channelCnt; i++) {
        let channel = data["Items"][i];
        let tag_array = tagsToArray(channel.TagItems,"Name");   //  <---------------<<<<<<<
        //if(i==0) temp_tag_array = tag_array;
        let tags = tag_array.toString();

        let tNode = document.createElement("DIV");
        tNode.innerText = tags;
        tNode.className = "channelTagText";

        let channelNode = document.createElement("DIV");
        channelNode.className = "channelNode";
        channelNode.id = "CH_"+channel.Id;
        let name    = (channel.Name) ? channel.Name : "No Name";
        let number  = (channel.ChannelNumber) ? channel.ChannelNumber : "No Channel Number";
        let program = (channel.CurrentProgram) ? channel.CurrentProgram.Name : "No Program";
        channelNode.innerHTML = ""+name+"<br>"+number+"<br>"+program;
        
        let viewNode = document.createElement("DIV");
        viewNode.className = "viewNode";
        viewNode.appendChild(channelNode);
        viewNode.appendChild(tNode);

        $channelArea.appendChild(viewNode);  // add the item to the DOM
        //
        // channel background image
        //
        if(channel.ImageTags["Primary"]) {
            //console.log("=== Image Tag = ",channel.ImageTags["Primary"]);

            let bg_url = server_url+"Items/"+channel.Id+
            "/Images/Primary?"+
            "maxHeight=300"+
            "&maxWidth=200"+
            "&tag="+channel.ImageTags["Primary"]+
            "&quality=90";

            //console.log("=== bg_url = ",bg_url);

            let cn = document.getElementById("CH_"+channel.Id);

            cn.style.backgroundImage = "url("+bg_url+")";      
            cn.style.backgroundSize = "100%"; 
            cn.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            cn.style.backgroundBlendMode = "overlay";
            cn.style.backgroundRepeat = "no-repeat";
            cn.style.color = "white";
        };
    };
    //
    //           click on a channel
    //
    channelArea.onclick = function(event) {
        event.preventDefault();   // stop the event from propagating further

        if(!event.target.id.startsWith("CH_")) return;   // if the click is on anything other than a channel box then return

        console.log("------------- Channel Clicked -------------");
        console.log(event);
        console.log("-------------------------------------------");

        if( event["shiftKey"] ){ 
            let aa = document.querySelectorAll(".channelNode");
            let cnt = aa.length;
            for(let i=0; i<cnt; i++) {
                aa[i].className = "channelNodeRed";
            };
        };

        if (event.target.className == "channelNode") {
            event.target.className = "channelNodeRed";
            
            $channelEdit.style.display = "inline-block";    // channel edit button
                          
            if( document.querySelectorAll(".channelNodeRed").length > 1 ) {

                $bulkEdit.style.display = "inline-block";    // channel edit button
            };    
        } else  {
            event.target.className = "channelNode";
            if( document.querySelectorAll(".channelNodeRed").length <= 0 ) {

                $channelEdit.style.display = "none";    // channel edit button
            } 
            if( document.querySelectorAll(".channelNodeRed").length <= 1 ) {

                $bulkEdit.style.display = "none";    // channel edit button
            };    
        };

        let selected = document.querySelectorAll(".channelNodeRed");
        console.log("=== Selected = ",selected);
    };
    //
    // channel cancel button
    //
    channelCancel.onclick = function(event) {
        event.preventDefault();   
        console.log("------------- Channel Cancel -------------");

        // $overlay.style.display = "none";
        page_queue.pop();
        if(editChannelCallback) editChannelCallback();
    };
    //
    // channel filter button
    //
    channelFilter.onclick = function(event) {                          //      <<--------------------<<<<<<<<<<< ?????
        event.preventDefault();   
        console.log("------------- Channel Filter -------------");
        //emby_filters();
        //displayCH();
    };
    
       
    //------------------------------------------------------------------------------------
    //
    //  Click Edit Button
    //
    channelEdit.onclick = function(event) {
        event.preventDefault();   // stop the event from propagating further
        console.log("------------- Channel Edit -------------",event);

        selected = document.querySelectorAll(".channelNodeRed");
        console.log(">>>> Selected = ",selected);

        channelEdit_2();
    };

    function channelEdit_2() {
        //
        // put placeholder on the page queue
        //
        //page_queue.push( {} );


        //let pn = document.getElementById("page_node");
        let mn = document.getElementById("modal_node");
        let dn = myModal(mn);
        modal_1.style.display = "block";

        var data_obj = [];
       
        //while (dn.firstChild) { dn.firstChild.remove(); };

        dn.innerHTML = channelEditHTML;

        document.getElementById("channelEditTitle").innerHTML = '<h1 style="text-align:center">Edit '+selected.length+' Channels</h1>';

        var next = 0;

        let id = selected[0].id;
        console.log(">>>> Selected id = ",id);

        edit_item(id);

        function edit_item(id){

            let ea = document.getElementById("editArea");
            while (ea.firstChild) { ea.firstChild.remove(); };

            id = id.split("_")[1];
    
            //
            // get object to edit
            //
            let url = server_url+"Users/"+user_id+"/Items/"+id+"?"+
            "Fields=ChannelMappingInfo&"+
            //"X-Emby-Client=Emby Web&"+
            //"X-Emby-Device-Name=Chrome&"+
            //"X-Emby-Device-Id=ebc67504-7bbb-4911-a028-69882a9f0ccc&"+
            //"X-Emby-Client-Version=4.6.7.0&"+
            //"X-Emby-Token=0cdee5cec71c440881e814d2b1ba08f3"+
            "api_key="+api_key;
            download(url, sel_item, ea);
    
            function sel_item(data, ea) {
                data_obj = data;
                console.log(".... channel data = ",data);
                //
                // convert the channel tags object to an array
                //
                let tag_array = tagsToArray(data.TagItems,"Name");   //  <---------------<<<<<<<
    

                let xx = document.createElement("LABEL");
                xx.innerText = "Channel Name";
                xx.style.fontSize = "16px";
                xx.style.marginRight = "5px";
                xx.style.display = "inline-block";
                xx.style.width = "130px";
                ea.appendChild(xx);
                ea.appendChild( add_text_input (data.Name, "Channel Name", "class_channel_name") );

                ea.appendChild( document.createElement("BR") );

                let yy = document.createElement("LABEL");
                yy.innerText = "Channel Number";
                yy.style.fontSize = "16px";
                yy.style.marginRight = "5px";
                yy.style.display = "inline-block";
                yy.style.width = "130px";
                ea.appendChild(yy);
                ea.appendChild( add_text_input (data.ChannelNumber, "Channel Number", "class_channel_number") );

                ea.appendChild( document.createElement("BR") );
                
                let aa = document.createElement("LABEL");
                aa.innerText = "Sort Title";
                aa.style.fontSize = "16px";
                aa.style.marginRight = "5px";
                aa.style.display = "inline-block";
                aa.style.width = "130px";
                ea.appendChild(aa);
                ea.appendChild( add_text_input (data.SortName, "Sort Title", "class_sort_title") );

                ea.appendChild( document.createElement("BR") );
                
                let bb = document.createElement("LABEL");
                bb.innerText = "If you change the Sort Title you must also LOCK the Sort Name or the server will reset the Sort Title back to its original value.";
                bb.style.fontSize = "20px";
                ea.appendChild(bb);

                ea.appendChild( document.createElement("BR") );

                //
                // add the channel tags
                //
                tags(ea, tag_array);

                //ea.appendChild( document.createElement("BR") );

                //
                // add channel locks
                //
                let zz = document.createElement("LABEL");
                zz.innerHTML = "<br><br>Locks:<br>";
                zz.style.fontSize = "25px";
                ea.appendChild(zz);

                let lock_array = (data.LockedFields) ? data.LockedFields : []; // ['Name', 'OfficialRating', 'Genres', 'Cast', 'Studios', 'Tags', 'Overview']
                ea.appendChild( manage_locks(lock_array) );

                //ea.appendChild( document.createElement("BR") );

                //
                // get the channel logos
                //
                let yyy = document.createElement("LABEL");
                yyy.innerHTML = "<br>Channel Logos:<br><br>";
                yyy.style.fontSize = "25px";
                ea.appendChild(yyy);

                let tbl_1 = document.createElement("TABLE");
                let tr_1  = document.createElement("TR");
                let tr_2  = document.createElement("TR");
                let td_1  = document.createElement("TD");
                let td_2  = document.createElement("TD");
                let td_3  = document.createElement("TD");
                let td_4  = document.createElement("TD");
                let td_5  = document.createElement("TD");
                let td_6  = document.createElement("TD");

                ea.appendChild(tbl_1);
                tbl_1.appendChild(tr_1);
                tbl_1.appendChild(tr_2);
                
                //
                //  add the channel images
                //
                if(data.ImageTags.Primary) {
                    let img_url = server_url+"Items/"+data.Id+
                    "/Images/Primary?"+
                    "maxHeight=300"+
                    "&maxWidth=200"+
                    "&tag="+data.ImageTags.Primary+
                    "&quality=90";
                    let iNodeImg_1 = addImage(img_url, "200", "channelImgId");
                    //iNodeImg_1.style.marginRight = "10px";
                    //ea.appendChild(iNodeImg_1);
                    td_1.appendChild(iNodeImg_1);
                } else {
                    let yyy1 = document.createElement("LABEL");
                    yyy1.innerHTML = "No Dark Logo";
                    yyy1.style.display = "inline-block"; 
                    yyy1.style.width = "210px";
                    yyy1.style.textAlign = "center";
                    yyy1.style.fontSize = "20px";
                    yyy1.style.marginBottom = "20px";
                    //ea.appendChild(yyy1);
                    td_1.appendChild(yyy1);
                };

                tr_1.appendChild(td_1);

                if(data.ImageTags.LogoLight) {
                    img_url = server_url+"Items/"+data.Id+
                    "/Images/LogoLight?"+
                    "maxHeight=300"+
                    "&maxWidth=200"+
                    "&tag="+data.ImageTags.LogoLight+
                    "&quality=90";
                    let iNodeImg_2 = addImage(img_url, "200", "channelImgId");
                    //iNodeImg_2.style.marginRight = "10px";
                    //ea.appendChild(iNodeImg_2);
                    td_2.appendChild(iNodeImg_2);
                } else {
                    let yyy2 = document.createElement("LABEL");
                    yyy2.innerHTML = "No Light Logo";
                    yyy2.style.display = "inline-block"; 
                    yyy2.style.width = "210px";
                    yyy2.style.textAlign = "center";
                    yyy2.style.fontSize = "20px";
                    yyy2.style.marginBottom = "20px";
                    //ea.appendChild(yyy2);
                    td_2.appendChild(yyy2);
                };

                tr_1.appendChild(td_2);

                if(data.ImageTags.LogoLightColor) {
                    img_url = server_url+"Items/"+data.Id+
                    "/Images/LogoLightColor?"+
                    "maxHeight=300"+
                    "&maxWidth=200"+
                    "&tag="+data.ImageTags.LogoLightColor+
                    "&quality=90";
                    let iNodeImg_3 = addImage(img_url, "200", "channelImgId");
                    //ea.appendChild(iNodeImg_3);
                    td_3.appendChild(iNodeImg_3);
                } else {
                    let yyy3 = document.createElement("LABEL");
                    yyy3.innerHTML = "No Light Color Logo";
                    yyy3.style.display = "inline-block"; 
                    yyy3.style.width = "210px";
                    yyy3.style.textAlign = "center";
                    yyy3.style.fontSize = "20px";
                    yyy3.style.marginBottom = "20px";
                    //ea.appendChild(yyy3);
                    td_3.appendChild(yyy3);
                };
                
                tr_1.appendChild(td_3);
                
                //............................................

                //ea.appendChild( document.createElement("BR") );

                //
                // add buttons to change the channel images
                //
                let yy1 = document.createElement("Button");
                yy1.classList.add('supButton');
                yy1.innerHTML = "Change Logo\nDark";
                yy1.id = "changeLogoBtn_1";
                yy1.style.marginLeft = "25px";
                //ea.appendChild(yy1);
                td_4.appendChild(yy1);
                //td_4.style.align = "center";
                tr_2.appendChild(td_4);

                let yy2 = document.createElement("Button");
                yy2.classList.add('supButton');
                yy2.innerHTML = "Change Logo\nLight";
                yy2.id = "changeLogoBtn_2";
                yy2.style.marginLeft = "25px";
                //ea.appendChild(yy2);
                td_5.appendChild(yy2);
                //td_5.style.align = "center";
                tr_2.appendChild(td_5);

                let yy3 = document.createElement("Button");
                yy3.classList.add('supButton');
                yy3.innerHTML = "Change Logo\nLight Color";
                yy3.id = "changeLogoBtn_3";
                yy3.style.marginLeft = "25px";
                //ea.appendChild(yy3);
                td_6.appendChild(yy3);
                //td_6.style.align = "center";
                tr_2.appendChild(td_6);

                //............................................
                // image picker
                //............................................
                document.getElementById("changeLogoBtn_1").onclick = function (event) {
                    event.preventDefault();   // stop the event from propagating further
                    console.log("=== logo picker - LogoDark === ");
                    openImageFile(data.Id, channelEdit_2, "Primary");
                };
                //............................................
                // image picker
                //............................................
                document.getElementById("changeLogoBtn_2").onclick = function (event) {
                    event.preventDefault();   // stop the event from propagating further
                    console.log("=== logo picker - LogoLight === ");
                    openImageFile(data.Id, channelEdit_2, "LogoLight");
                };
                //............................................
                // image picker
                //............................................
                document.getElementById("changeLogoBtn_3").onclick = function (event) {
                    event.preventDefault();   // stop the event from propagating further
                    console.log("=== logo picker - LogoLightColor === ");
                    openImageFile(data.Id, channelEdit_2, "LogoLightColor");
                };
                //............................................
            };
        };

        //
        // edit channel button event listeners
        //
        channelEditCancel.onclick = function(event) {
            event.preventDefault();   // stop the event from propagating further
            console.log("------------- Edit Cancel -------------");

            modal_1.style.display = "none";
            if(editChannelCallback) liveTvChannels(editChannelCallback);
        };
        channelEditNext.onclick = function(event) {
            event.preventDefault();   // stop the event from propagating further
            console.log("------------- Edit Next -------------");
            next++;
            if(next >= selected.length) next = 0;
            let id = selected[next].id;
            //console.log(">>>> Selected id = ",id);
            edit_item(id);
        };
        channelEditPrev.onclick = function(event) {
            event.preventDefault();   // stop the event from propagating further
            console.log("------------- Edit Prev -------------");
            next--;
            if(next < 0) next = selected.length - 1;
            let id = selected[next].id;
            //console.log(">>>> Selected id = ",id);
            edit_item(id);
        };
        function channelEdit() {                          //   <<--------------------------<<<<<<<<<<<<<
            let id = selected[next].id;
            //console.log(">>>> Selected id = ",id);
            edit_item(id);
        };

        //
        // save channel data
        //
        channelEditSave.onclick = function(event) {
            event.preventDefault();   // stop the event from propagating further

            let data = data_obj;
            console.log("------------- Edit Save -------------");

            data.ChannelName = document.querySelector(".class_channel_name").value;
            data.Name = data.ChannelName;
            data.ChannelNumber = document.querySelector(".class_channel_number").value;
            data.SortName = document.querySelector(".class_sort_title").value;
            data.ForcedSortName = data.SortName;

            console.log("_______ Sort Name _______ = ",data.SortName);
            //
            // get tags
            //
            let select_all_tags = document.querySelectorAll(".my_channel_tags");
            let tags_array = [];
            select_all_tags.forEach(function(item,pos) { tags_array.push( {"Name":item.value} ); });
            let tags_set = new Set(tags_array);
            let tagsArr = Array.from(tags_set);
            data.TagItems = (tagsArr.length>0) ? tagsArr : [];
            //
            // get lockss
            //
            let lock_Name     = document.getElementById("Lock_Name").value;
            let lock_SortName = document.getElementById("Lock_SortName").value;
            let lock_ChannelNumber = document.getElementById("Lock_ChannelNumber").value;
            //let lock_OR       = document.getElementById("Lock_OfficialRating").value;
            //let lock_Genres   = document.getElementById("Lock_Genres").value;
            //let lock_Cast     = document.getElementById("Lock_Cast").value;
            //let lock_Studios  = document.getElementById("Lock_Studios").value;
            let lock_Tags     = document.getElementById("Lock_Tags").value;
            //let lock_Overview = document.getElementById("Lock_Overview").value;
            
            let LockedFields = [];

            if(lock_Name     == "Locked")   LockedFields.push("Name");
            if(lock_SortName == "Locked")   LockedFields.push("SortName");
            //
            // to change the SortName you must also include SortName in the LockedFields, otherwise it will be reset
            //
            //LockedFields.push("SortName");

            if(lock_ChannelNumber == "Locked")   LockedFields.push("ChannelNumber");
            //if(lock_OR      == "Locked")   LockedFields.push("OfficialRating");
            //if(lock_Genres  == "Locked")   LockedFields.push("Genres");
            //if(lock_Cast    == "Locked")   LockedFields.push("Cast");
            //if(lock_Studios == "Locked")   LockedFields.push("Studios");
            if(lock_Tags    == "Locked")   LockedFields.push("Tags");
            //if(lock_Overview== "Locked")   LockedFields.push("Overview");

            data.LockedFields = LockedFields;

            console.log("========== Data = ",data);
            //
            // save the channel data
            //
            let url = server_url+"Items/"+data.Id+"?api_key="+api_key;
            upload(url, data, uploadOK);

            function uploadOK(data) {
                console.log("=== Upload OK = ",data);

                savedEPG = undefined;

                modal_1.style.display = "none";
                if(editChannelCallback) liveTvChannels(editChannelCallback);  // return from channel edit and close the modal
            };
        };
    };












    //------------------------------------------------------------------------------------
    //
    //  Click bulk Edit Button
    //
    bulkEdit.onclick = function(event) {
        event.preventDefault();   // stop the event from propagating further

        selected = document.querySelectorAll(".channelNodeRed");

        let pn = document.getElementById("page_node");
        while (pn.firstChild) { pn.firstChild.remove(); };

        pn.innerHTML = bulkEditHTML;

        document.getElementById("bulkEditTitle").innerHTML = '<h1 style="text-align:center">Bulk Edit '+selected.length+' Channels</h1>';

        let ea = document.getElementById("bulkEditArea");
        while (ea.firstChild) { ea.firstChild.remove(); };

        //ea.appendChild( document.createElement("BR") );

        let tag_array = [];
        tags(ea, tag_array);

        
        function tagPulldown() {
            let x = document.createElement("SELECT");
            x.setAttribute("name", "Type");
            x.style.marginLeft = "20px";
            x.id = "tagPulldown_1";
            // x.className = "";
            x.appendChild(addOption("Do not Save"));
            x.appendChild(addOption("Add to Existing Tags"));
            x.appendChild(addOption("Replace Existing Tags"));
            x.appendChild(addOption("Remove All Tags"));
            x.appendChild(addOption("Delete These Tags"));

            x.value = "Do not Save";
            return x;
        };
        ea.appendChild( tagPulldown() );

        //ea.appendChild( document.createElement("BR") );

        let zz = document.createElement("LABEL");
        zz.innerHTML = "<br><br>Locks:<br>";
        zz.style.fontSize = "25px";
        ea.appendChild(zz);

        let lock_array = []; // ['Name', 'OfficialRating', 'Genres', 'Cast', 'Studios', 'Tags', 'Overview']
        ea.appendChild( manage_locks(lock_array) );

        document.getElementById("Lock_Name").value = "";
        document.getElementById("Lock_Tags").value = "";
        document.getElementById("Lock_SortName").value = "";
        document.getElementById("Lock_ChannelNumber").value = "";

        //
        // cancel button
        //
        bulkEditCancel.onclick = function(event) {
            event.preventDefault();   // stop the event from propagating further
            console.log("------------- bulk Cancel -------------");

            modal_1.style.display = "none";
            if(editChannelCallback) liveTvChannels(editChannelCallback);
        };
        //
        // Bulk save button
        //
        bulkEditSave.onclick = function(event) {
            event.preventDefault();   // stop the event from propagating further

            console.log("------------- bulk Save -------------",selected);

            let select_all_tags = document.querySelectorAll(".my_channel_tags");
            let tags_array = [];
            select_all_tags.forEach(function(item,pos) { tags_array.push( {"Name":item.value} ); });
            let tags_set = new Set(tags_array);
            var tagsArr = Array.from(tags_set);

            var tagAction = document.getElementById("tagPulldown_1").value;  // starts with "Do not", "Add", "Replace", "Remove", "Delete"

            let lock_Name = document.getElementById("Lock_Name").value;
            let lock_Tags = document.getElementById("Lock_Tags").value;

            var LockedFields = [];
            if(lock_Name == "Locked") LockedFields.push("Name");
            if(lock_Tags == "Locked") LockedFields.push("Tags");

            for(let i=0; i<selected.length; i++) {
                let data = selected[i];
                console.log("=== Bulk data = ",data);
                let id = data.id;
                id = id.split("_")[1];
                //
                // get object 
                //
                let url = server_url+"Users/"+user_id+"/Items/"+id+"?"+
                "Fields=ChannelMappingInfo&"+
                //"X-Emby-Client=Emby Web&"+
                //"X-Emby-Device-Name=Chrome&"+
                //"X-Emby-Device-Id=ebc67504-7bbb-4911-a028-69882a9f0ccc&"+
                //"X-Emby-Client-Version=4.6.7.0&"+
                //"X-Emby-Token=0cdee5cec71c440881e814d2b1ba08f3"+
                "api_key="+api_key;
                download(url, sel_item, i);
        
                function sel_item(data, i) {

                    if( !tagAction.startsWith('Do') ) {
                        if(tagAction.startsWith('Replace')) {       // replace the current tags with the new tags
                            data.TagItems = tagsArr;
                        } else
                        if(tagAction.startsWith('Remove')) {        // remove all tages
                            data.TagItems = [];
                        } else if(tagAction.startsWith('Add')) {    // add the new tags to the current ones
                            data.TagItems = data.TagItems.concat(tagsArr);
                        } else {                                    // remove given tags
                            tags_array = (data.TagItems) ? data.TagItems : [];  // these are the tags from the media obj

                            console.log("=== Bulk delete tags ===",tags_array);
                            tagsArr = [];
                            var cnt = 0;
                            tags_array.forEach(function(item1,pos) { 
                                console.log("=== item1 = ",item1.Name);
                                let i1 = item1.Name.toLowerCase();
                
                                select_all_tags.forEach(function(item2,pos) {
                                    let i2 = (""+item2.value).toLowerCase();
                                    if(i1 == i2) cnt++;
                                    console.log("=== item2 = ",item2.value,",  cnt = "+cnt);
                                });
                
                                if(cnt==0) { tagsArr.push( {"Name":item1.Name} ) }
                                else cnt = 0;
                            });
                            console.log("=== tagsArr = ",tagsArr);
                            data.TagItems = tagsArr;
                        };
                    };

                    data.LockedFields = LockedFields;

                    console.log("=== data = ",data);
                    //
                    // save the channel data
                    //
                    let url = server_url+"Items/"+data.Id+"?api_key="+api_key;
                    upload(url, data, uploadOK);

                    function uploadOK(data) {
                        console.log("=== Upload OK = ",data);
                        if(i < (selected.length-1)) {

                            modal_1.style.display = "none";
                            if(editChannelCallback) liveTvChannels(editChannelCallback);
                        };
                    };
                };
            };

            


        };
    };
};

// -----------------------------------------------------------------------------------------------
function manage_locks(lock_array) {
    //console.log("=== Locks = ",lock_array); // ['Name','OfficialRating','Genres','Cast','Studios','Tags','Overview']
    //console.log("=== Lock All = ",lock_all);
    let tb = document.createElement("TABLE");
    tb.appendChild( add_row("Name",          lock_array.indexOf("Name") ) );
    tb.appendChild( add_row("SortName",      lock_array.indexOf("SortName") ) );
    tb.appendChild( add_row("ChannelNumber",   lock_array.indexOf("ChannelNumber") ) );
    //tb.appendChild( add_row("OfficialRating",lock_array.indexOf("OfficialRating") ) );
    //tb.appendChild( add_row("Genres",        lock_array.indexOf("Genres") ) );
    //tb.appendChild( add_row("Cast",          lock_array.indexOf("Cast") ) );
    //tb.appendChild( add_row("Studios",       lock_array.indexOf("Studios") ) );
    tb.appendChild( add_row("Tags",          lock_array.indexOf("Tags") ) );
    //tb.appendChild( add_row("Overview",      lock_array.indexOf("Overview") ) );

    return tb;
};

// -----------------------------------------------------------------------------------------------
function add_row( A, B ) {
    let x = document.createElement("SELECT");
    //x.setAttribute("name", "Lock");
    // x.id = "";
    // x.className = "";
    //x.appendChild(addOption(""));
    x.appendChild(addOption("Locked"));
    x.appendChild(addOption("Unlocked"));
    x.value = (B>=0) ? "Locked" : "Unlocked";
    x.id = "Lock_"+A

    let tr   = document.createElement("TR");
    let td_1 = document.createElement("TD");
    let td_2 = document.createElement("TD");
    tr.appendChild(td_1);
    tr.appendChild(td_2);
    td_1.innerHTML = A;
    td_2.appendChild(x);

    return tr;
};

// -----------------------------------------------------------------------------------------------
function addOption( value) {
    let y = document.createElement("option");
    y.setAttribute("value", value);
    y.innerText = value;
    return y;
};

// -----------------------------------------------------------------------------------------------
function tags(editArea, tag_array) {
    editArea.appendChild( document.createElement("BR") );
    
    let item_div = document.createElement("DIV");
    item_div.id = "tag_area";
    item_div.style.display = "inline-block";
    item_div.appendChild( add_header("Tags","Add Tag","tag_btn") );

    //let tag_array = tagsToArray(TagItems,"Name"); 

    let tag_cnt = tag_array.length;
    for(let i=0; i<tag_cnt; i++) {
        item_div.appendChild( add_text_input(tag_array[i], "enter a tag", "my_channel_tags") );
        item_div.appendChild( document.createElement("BR") );
    };

    editArea.appendChild(item_div);

    let $addBtn = document.getElementById("tag_btn");
    $addBtn.onclick = function (event) {
        event.preventDefault();
        item_div.appendChild( add_text_input("", "add a tag", "my_channel_tags" ) );

        item_div.appendChild( document.createElement("BR") );
    };
};
// -----------------------------------------------------------------------------------------------
function genres(pn, gen_array) {
    //pn.appendChild( document.createElement("BR") );

    let item_div = document.createElement("DIV");
    item_div.id = "genre_area";
    item_div.style.float = "right";
    item_div.style.marginTop = "20px";
    item_div.appendChild( add_header("Genres","Add Genre","gen_btn") );

    //let gen_array = tagsToArray(item_data.GenreItems,"Name"); 

    let gen_cnt = gen_array.length;
    for(let i=0; i<gen_cnt; i++) {
        item_div.appendChild( add_text_input(gen_array[i], "enter a genre", "my_channel_genres" ) );
        item_div.appendChild( document.createElement("BR") );
    };

    pn.appendChild(item_div);

    let $addBtn = document.getElementById("gen_btn");
    $addBtn.onclick = function (event) {
        event.preventDefault();
        item_div.appendChild( add_text_input("","add a genre", "my_channel_genres" ) );

        item_div.appendChild( document.createElement("BR") );
    };
};
// -----------------------------------------------------------------------------------------------
function add_header(label_title,button_title,button_ip) {
    let df = new DocumentFragment();
    let xx = document.createElement("LABEL");
    xx.innerHTML = "<span class='editor_label'>"+label_title+"</span>";
    xx.style.fontSize = "20px";
    xx.style.marginLeft = "40px";
    let yy = document.createElement("Button");
    yy.classList.add('page_button');
    yy.innerHTML = button_title;
    yy.id = button_ip;
    
    df.appendChild(yy);
    df.appendChild(xx);
    df.appendChild(document.createElement("BR"));

    return df;
};
// -----------------------------------------------------------------------------------------------
function add_text_input (value, placeholder, class_name) {
    let x = document.createElement("INPUT");
    x.setAttribute("type", "text");
    x.setAttribute("value", value);
    x.setAttribute("size", "40");
    x.setAttribute("maxlength", "80");
    if(placeholder) x.setAttribute("placeholder", placeholder);
    x.style.marginBottom = "5px";
    x.className = class_name;
    
    return x;
};
// -----------------------------------------------------------------------------------------------


// function channel_name(editArea, text, classNm) {
//     let Lbl = document.createElement("LABEL");
//     Lbl.innerHTML = text;
//     Lbl.style.fontSize = "16px";
//     editArea.appendChild(Lbl);

//     let t_input = document.createElement("INPUT");
//     t_input.setAttribute("type", "text");
//     t_input.setAttribute("value", "");
//     t_input.setAttribute("size", "40");
//     t_input.setAttribute("maxlength", "80");
//     t_input.className = classNm;
//     editArea.appendChild(t_input);
// };


// -----------------------------------------------------------------------------------------------



//http://70.185.104.93:8096/emby/Users/e62c08bb99774ba794d6bcec82f76237/Items/159585?Fields=ChannelMappingInfo&X-Emby-Client=Emby Web&X-Emby-Device-Name=Chrome&X-Emby-Device-Id=ebc67504-7bbb-4911-a028-69882a9f0ccc&X-Emby-Client-Version=4.6.7.0&X-Emby-Token=0cdee5cec71c440881e814d2b1ba08f3

//http://70.185.104.93:8096/emby/LiveTv/Channels?AddCurrentProgram=false&X-Emby-Client=Emby Web&X-Emby-Device-Name=Chrome&X-Emby-Device-Id=ebc67504-7bbb-4911-a028-69882a9f0ccc&X-Emby-Client-Version=4.6.7.0&X-Emby-Token=0cdee5cec71c440881e814d2b1ba08f3

//http://70.185.104.93:8096/emby/Users/e62c08bb99774ba794d6bcec82f76237/Images/Primary?tag=32829448db15f1f3bc77893141b45823&height=24&quality=90

//post
//http://70.185.104.93:8096/emby/Items/159585?X-Emby-Client=Emby Web&X-Emby-Device-Name=Chrome&X-Emby-Device-Id=ebc67504-7bbb-4911-a028-69882a9f0ccc&X-Emby-Client-Version=4.6.7.0&X-Emby-Token=0cdee5cec71c440881e814d2b1ba08f3






// get
//http://70.185.104.93:8096/emby/Users/e62c08bb99774ba794d6bcec82f76237/Items/159585?Fields=ChannelMappingInfo&X-Emby-Client=Emby Web&X-Emby-Device-Name=Chrome&X-Emby-Device-Id=ebc67504-7bbb-4911-a028-69882a9f0ccc&X-Emby-Client-Version=4.6.7.0&X-Emby-Token=0cdee5cec71c440881e814d2b1ba08f3
//post
//http://70.185.104.93:8096/emby/Items/159585?X-Emby-Client=Emby Web&X-Emby-Device-Name=Chrome&X-Emby-Device-Id=ebc67504-7bbb-4911-a028-69882a9f0ccc&X-Emby-Client-Version=4.6.7.0&X-Emby-Token=0cdee5cec71c440881e814d2b1ba08f3


