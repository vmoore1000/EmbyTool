




// -----------------------------------------------------------------------------------------------
function get_latest_media(pn, dispObj) {

    if(page_queue.length > 1) return;
    let obj_array = [];
    let j = 0;

    dispObj.Items.forEach( (item) => { 
        if( !(item.CollectionType=="movies" || item.CollectionType=="tvshows") ) return;

        url = server_url + "Users/"+user_id+"/Items/Latest?Limit=10"+
        "&Fields=PrimaryImageAspectRatio,BasicSyncInfo,ProductionYear,Status,EndDate,CanDelete"+
        "&ImageTypeLimit=1"+
        "&EnableImageTypes=Primary,Backdrop,Thumb"+
        "&ParentId="+item.Id+
        //"&X-Emby-Client=Emby Web&X-Emby-Device-Name=Chrome Android"+
        //"&X-Emby-Device-Id="+deviceId+
        //"&X-Emby-Client-Version=4.6.7.0"+
        //"&X-Emby-Token="+api_key;
        "&api_key="+api_key;
        
        download(url, displayLatestItems, [item.Name,j]);
        j++;
    });




    function displayLatestItems(data, param){
        let name = param[0];
        let k    = param[1];

        obj_array[k] = data;

        let df = new DocumentFragment();
        df.appendChild( document.createElement("BR") );
        df.appendChild( document.createElement("HR") );

        let y1_div = document.createElement("DIV");
        y1_div.innerHTML = "Latest "+name;
        y1_div.style.fontSize = "25px";
        y1_div.style.marginBottom = "10px"; 
        y1_div.style.textAlign = "center";

        df.appendChild(y1_div);
        df.appendChild( document.createElement("BR") );

        //console.log("=== data = ",data);

        data.forEach( (item,i) => { 
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
            iNode.id           = "II_"+i;
            iNode.loading      = "lazy";      // only load images if they are visable on the screen
            iNode.className    = "notSelected";
            iNode.style.width  = "100px"; 
            iNode.style.height = "125px"; 
            //
            //   text node
            //
            let tNode = document.createElement("DIV"); 
            tNode.innerText = item.Name;

            var dNode = document.createElement("DIV");
            dNode.className = "dNode2";
            dNode.append(iNode);
            dNode.append(tNode);

            df.appendChild(dNode);  // add the item to the dn
        });

        df.appendChild( document.createElement("BR") );

        let div_0 = document.createElement("Div");
        div_0.id = "latest_"+k;
        div_0.appendChild(df);    // add the document fragment to the DIV

        pn.appendChild(div_0);    // add the document fragment to the DOM


        document.getElementById("latest_"+k).onclick = function(event){
            event.preventDefault();

            console.log("=== latest media ("+k+") clicked id = ",event.target.id);

            let temp = event.target.id;
            let index = temp.split("_")[1];
            let i = parseInt(index);

            let selected = [index];
            let obj = {};
            obj["Items"] = obj_array[k];

            console.log("=== obj_array = ",obj_array);
            console.log("=== selected = ",selected);
            console.log("=== obj = ",obj);

            // if(event["ctrlKey"]) {
            //     console.log("=== ctrl key ===");

            //     let play_obj = obj.Items[index];

            //     let mn = document.getElementById("modal_node");
            //     let dn = myModal(mn);

            //     play_video_files(play_obj, dn, callback, callback2);

            //     function callback() {
            //         console.log("=== callback ===");
            //     };
            //     function callback2() {
            //         console.log("=== callback2 ===");
            //     };

            // } else {
                item_editor(selected, obj, 0);
            //};
        };
    };
};



