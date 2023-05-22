

function collections(pn, selected_items, displayed_obj, callback) {
    //
    // put placeholder on the page queue
    //
    //page_queue.push( displayed_obj );
    
    console.log("=== Collections, selected items = ",selected_items,", displayed Objs = ",displayed_obj);

    //let pn = document.getElementById("page_node");

    //while (pn.firstChild) { pn.firstChild.remove(); };

    var selectedCollectionId;
    var selectedItemsIdStr = "";
    //
    // hide the side bar
    //
    //document.getElementById("side_node").style.visibility = "hidden";
    //-----------------------------------------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------------------------------------
    let y1 = document.createElement("DIV");
    y1.innerHTML = "<h1>Manage Collections</h1>";
    //y1.style.fontSize = "35px";
    y1.style.textAlign = "center";
    //y1.className = "editor_label";
    pn.appendChild(y1);
    //pn.appendChild( document.createElement("BR") );  




    var x1x = document.createElement("Button");
    x1x.classList.add('page_button');
    x1x.innerHTML = "Cancel";
    x1x.id = "cancelBtn";
    pn.appendChild(x1x);
    pn.appendChild( document.createElement("BR") );





    let y2 = document.createElement("LABEL");
    y2.innerHTML = "<h2 style='display:inline-block'>Selected Items</h2>";
    //y2.style.fontSize = "30px";
    //y2.className = "editor_label";
    pn.appendChild(y2);
    // pn.appendChild( document.createElement("BR") ); 

    let len = selected_items.length;
    let items = [];

    for(let i=0; i<len; i++) {
        let item = displayed_obj.Items[selected_items[i]];
        items.push(item);
    };

    selectedItemsIdStr = listImages(pn,items);




    function listImages(pn,items) {
        let displayedItemsIdStr = "";
        let len = items.length;

        let y7 = document.createElement("LABEL");
        y7.innerHTML = "<h3 style='display:inline-block; margin-left:10px'>(Count = "+len+")</h3>";
        //y7.style.fontSize = "20px";
        if(len>100) {
            y7.innerHTML = "<h3>Selected Item Count = "+len+", the first 100 are shown below</h3>";
            len = 100;
        };
        pn.appendChild(y7);
        pn.appendChild( document.createElement("BR") );  
        
        for(let i=0; i<len; i++) {
            let item = items[i];

            displayedItemsIdStr += item.Id+",";

            //var image_url = server_url+"Items/"+item.Id+"/Images/Primary?maxHeight=300&maxWidth=200&tag="+item.ImageTags.Primary+"&quality=90";

            //
            // get the items image
            //
            if(item.ImageTags["Primary"]) {
                var image_url = server_url+"Items/"+item.Id+"/Images/Primary?"+"maxHeight=300"+"&maxWidth=200"+"&tag="+item.ImageTags.Primary+"&quality=90";
            } else if (item.SeriesPrimaryImageTag) {
                var image_url = server_url+"Items/"+item.SeriesId+"/Images/Primary?tag="+item.SeriesPrimaryImageTag+"&maxWidth=200&quality=90";
            } else
            if(item.ImageTags["Thumb"]) {
                var image_url = server_url + "Items/"+item.Id+"/Images/Thumb?api_key=" + api_key;
            } else {
                var image_url = getDefaultImage();
            };

            var iNode = document.createElement("img");
            iNode.src = image_url;    // add the image URL to the DOM
            iNode.loading = "lazy"; // only load images if they are visable on the screen
            //iNode.className = "notSelected";
            iNode.style.marginLeft = "5px";
            iNode.style.width  = "100px";
            //iNode.style.height = "100px"; 
            pn.appendChild(iNode);
        };
        return displayedItemsIdStr.slice(0, -1);
    };







    pn.appendChild( document.createElement("BR") );  
    let y9 = document.createElement("LABEL");
    y9.innerHTML = "<h2 style='display:inline-block'>These items are in these Collections</h2>";
    //y2.style.fontSize = "30px";
    //y2.className = "editor_label";
    pn.appendChild(y9);
    let imagesInCollectionsDiv = document.createElement("DIV")
    pn.appendChild( imagesInCollectionsDiv ); 



    getCollectionsItemIsIn(imagesInCollectionsDiv, selectedItemsIdStr);

    function getCollectionsItemIsIn(ppn, item_ids_str) {
        // find out which collections this item is in
        let url = server_url+"Users/"+user_id+"/Items?Fields=MediaStreams,UserData&IncludeItemTypes=BoxSet&Recursive=true&ListItemIds="+item_ids_str+"&api_key="+api_key;
        download(url, getCollections);

        function getCollections(itemInCollections) {
            console.log("=== item is in these collections ",itemInCollections);
            let itemsArray = itemInCollections.Items;

            itemsArray.forEach ( (item) => { 
                let name = item.Name;
                let imageTag = item.ImageTags["Primary"];
                let id = item.Id;
                console.log("=== item name = ",name,", imageTag = ",imageTag);

                var image_url = server_url+"Items/"+id+"/Images/Primary?"+"maxHeight=300"+"&maxWidth=200"+"&tag="+imageTag+"&quality=90";
                let iNode = document.createElement("img");
                iNode.src = image_url;    // add the image URL to the DOM
                //iNode.loading = "lazy";   // only load images if they are visable on the screen
                //iNode.className = "notSelected";
                iNode.style.marginLeft = "5px";
                iNode.style.width      = "100px";
                //iNode.style.height = "100px"; 
                ppn.appendChild(iNode);
            });
        };
    };







    pn.appendChild( document.createElement("HR") );  
    //pn.appendChild( document.createElement("BR") );  


    let y3 = document.createElement("Div");
    y3.innerHTML = "<h2>Select a Collection</h2>";
    //y3.style.fontSize = "20px";
    y3.style.marginRight = "5px";
    //y1.className = "editor_label";
    pn.appendChild(y3);


    //-----------------------------------------------------------------------------------------------
    //
    // get all collections
    //
    //-----------------------------------------------------------------------------------------------
    let url_1 = server_url+"users/"+user_id+"/items?Fields=Genres%2CChildCount%2CRecursiveItemCount%2COverview&Recursive=true%2CTags&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=boxset&api_key="+api_key;
    download(url_1, allCollections);

    function allCollections(data) {
        console.log("=== All Collections = ",data);
        
        let x = document.createElement("SELECT");
        x.id = "allCollections";
        x.style.fontSize = "20px";

        let y = document.createElement("option");
        y.setAttribute("value", "*");
        y.innerText = "Select a Collection";
        x.append(y);
        //
        // map to pulldown list
        //
        data.Items.map( (item) => {
            let z = document.createElement("option");
            z.setAttribute("value", item.Id);
            z.innerText = item.Name;
            x.append(z);
        });
        pn.appendChild(x);
        //pn.appendChild( document.createElement("BR") );

        let dd2 = document.createElement("DIV");
        dd2.id = "collectionsArea";
        pn.appendChild(dd2);

        pn.appendChild( document.createElement("HR") ); 
        //
        // add and remove buttons
        //
        let dd = document.createElement("DIV");
        dd.id = "addRemoveButtons";

        var xx = document.createElement("Button");
        xx.classList.add('page_button');
        xx.innerHTML = "Add";
        xx.id = "addItemToCollection";
        dd.appendChild(xx);
        //dd.appendChild( document.createElement("BR") );

        let y4 = document.createElement("LABEL");
        y4.innerHTML = "<h2 style='display:inline-block; margin-left:10px'>the selected items to the chosen collection</h2>";
        dd.appendChild(y4);
        //dd.appendChild( document.createElement("BR") );

        // var yy = document.createElement("Button");
        // yy.classList.add('ltlButton');
        // yy.innerHTML = "Remove";
        // yy.id = "remItemFromCollection";
        // dd.appendChild(yy);

        // let y5 = document.createElement("LABEL");
        // y5.innerHTML = "the Selected Items from the selected Collection";
        // y5.style.fontSize = "18px";
        // dd.appendChild(y5);

        pn.appendChild(dd);

        document.getElementById("addRemoveButtons").style.display = "none";

        let y8 = document.createElement("LABEL");
        y8.innerHTML = "<h2 style='display:inline-block; margin-right:10px'>Or</h2>";
        y8.id = "Or";
        //y6.style.fontSize = "18px";
        pn.appendChild(y8);
        //
        // add create collection button
        //
        var zz = document.createElement("Button");
        zz.classList.add('page_button');
        zz.innerHTML = "Create";
        zz.id = "createNewCollection";
        zz.marginRight = "10px";
        pn.appendChild(zz);

        let y6 = document.createElement("LABEL");
        y6.innerHTML = "<h2 style='display:inline-block; margin-left:10px'>a New Collection</h2>";
        y6.id = "createNew";
        //y6.style.fontSize = "18px";
        pn.appendChild(y6);
        //
        // add input area for create collection name
        //
        pn.appendChild( document.createElement("BR") );
        let x1 = document.createElement("INPUT");
        x1.style.fontSize = "20px";
        x1.setAttribute("type", "text");
        x1.setAttribute("value", "");
        x1.setAttribute("size", "30");
        x1.setAttribute("maxlength", "50");
        //x1.className = "editor_data";
        x1.setAttribute("placeholder", "Enter New Collection Name");
        x1.id = "createCollectionName";
        pn.appendChild(x1);
        //
        // cancel button
        //
        // pn.appendChild( document.createElement("BR") );
        // pn.appendChild( document.createElement("BR") );

        // var zzz = document.createElement("Button");
        // zzz.classList.add('page_button');
        // zzz.innerHTML = "Cancel";
        // zzz.id = "cancelBtn";
        // pn.appendChild(zzz);

        //-----------------------------------------------------------------------------------------------
        //
        //-----------------------------------------------------------------------------------------------
        document.getElementById("allCollections").onchange = function (event) {
            event.preventDefault();
            selectedCollectionId = this.value;

            console.log("=== On Change Collection === ",this.value);

            if(selectedCollectionId=="*") {
                document.getElementById("addRemoveButtons").style.display = "none";
                document.getElementById("createNewCollection").style.display = "inline-block";
                document.getElementById("Or").style.display = "inline-block";
                document.getElementById("createNew").style.display = "inline-block";
                document.getElementById("createCollectionName").style.display = "block";
                return;
            };

            document.getElementById("addRemoveButtons").style.display = "block";
            document.getElementById("createNewCollection").style.display = "none";
            document.getElementById("Or").style.display = "none";
            document.getElementById("createNew").style.display = "none";
            document.getElementById("createCollectionName").style.display = "none";
        };
        //
        // event listeners for the buttons
        //
        // document.getElementById("cancelBtn").onclick = function (event) {
        //     event.preventDefault();
        //     refreshPage();
        // };
        document.getElementById("addItemToCollection").onclick = function (event) {
            event.preventDefault();
            add_remove_create_collection(1);
        };
        document.getElementById("createNewCollection").onclick = function (event) {
            event.preventDefault();
            let value = document.getElementById("createCollectionName").value;
            if(value) add_remove_create_collection(3, value);
        };
        document.getElementById("cancelBtn").onclick = function (event) {
            event.preventDefault();

            modal_1.style.display = "none";
            if(callback) callback();
        };
    };
    //-----------------------------------------------------------------------------------------------
    //
    //-----------------------------------------------------------------------------------------------
    function add_remove_create_collection(option, newCollectionName) {
        // option 1 = add selected items to an existing collection
        // option 2 = remove selected items from an existing collection
        // option 3 = create a new collection and add the selected items to it

        let url;
        if (option==1 || option==2) {
            url = server_url+"Collections/"+selectedCollectionId+"/Items?Ids="+selectedItemsIdStr+"&api_key="+api_key;
        } else {
            if(!newCollectionName) return;
            url = server_url+"Collections?Name="+newCollectionName+"&Ids="+selectedItemsIdStr+"&api_key="+api_key;
        };
        console.log("Collection Url = "+url);

        let req;
        let h = new Headers();
        h.append('Accept','Application/json');

        if (option==1 || option==3) {    // Add to and Create Collection
            req = new Request(url,{ 
                method:  'POST', 
                mode:    'cors',
                headers: h
            });
        } else if (option==2) {          // Delete from Collection
            req = new Request(url,{ 
                method:  'DELETE', 
                mode:    'cors',
                headers: h
            });
        };
        fetch(req)
            .then( (response) =>{
                if(response.ok) { 
                    console.log("=== Finished OK"); 
                    return response.json() } 
                else { throw new Error("Bad HTTP"); }
            })
            .then( (jsonData) => {
                console.log("=== JSON data ",jsonData);
                collectionUpdated();
            })
            .catch( (err) => {
                console.log("=== Error ",err);
                collectionUpdated();
            });

        function collectionUpdated() {
            console.log("=== Collection Update Finished OK");

            callback();

        };
    };
};











            //  // find out which collections this item is in
            //  let url_1 = server_url+"Users/"+user_id+"/Items?Fields=MediaStreams,UserData&IncludeItemTypes=BoxSet&Recursive=true&ListItemIds="+item_data.Id+"&api_key="+api_key;
            //  download(url_1, getItemInCollections);

            // function getItemInCollections(itemsInCollections) {

    //             pn.appendChild( document.createElement("BR") ); 
    //             //.log("=== Collection media is in = ",itemsInCollections);
                
    //             let x = document.createElement("SELECT");
    //             x.id = "inCollections";

    //             let y = document.createElement("option");
    //             y.setAttribute("value", "@");
    //             y.innerText = "Select a Collection";
    //             x.append(y);
    //             //
    //             // map to pulldown list
    //             //
    //             itemsInCollections.Items.map( (item) => {
    //                 //console.log("===In Collection, item = ",item);

    //                 let y = document.createElement("option");
    //                 y.setAttribute("value", item.Id);
    //                 y.innerText = item.Name;
    //                 x.append(y);
    //             });
    //             pn.appendChild(x);
    //             pn.appendChild(yy);

    //             document.getElementById("remItemFromCollection").onclick = function (event) {
    //                 event.preventDefault();
    //                 add_delete_create_collection(2);
    //             };

    //             pn.appendChild( document.createElement("BR") ); 



    //             //
    //             // add input area for create collection name
    //             //
    //             let x1 = document.createElement("INPUT");
    //             x1.setAttribute("type", "text");
    //             x1.setAttribute("value", "");
    //             x1.setAttribute("size", "30");
    //             x1.setAttribute("maxlength", "80");
    //             x1.className = "editor_data";
    //             x1.setAttribute("placeholder", "Enter New Collection Name");
    //             x1.id = "createCollectionName";
    //             pn.appendChild(x1);
    //             //
    //             // add button
    //             //
    //             pn.appendChild(zz);
    //             pn.appendChild( document.createElement("BR") ); 
    //             pn.appendChild( document.createElement("HR") ); 

    //             document.getElementById("createNewCollection").onclick = function (event) {
    //                 event.preventDefault();
    //                 let value = document.getElementById("createCollectionName").value;
    //                 if(value) add_delete_create_collection(3, value);
    //             };



    //http://192.168.1.201:8096/emby/Users/e62c08bb99774ba794d6bcec82f76237/Items?fields=BasicSyncInfo,CanDelete,Container,PrimaryImageAspectRatio&IncludeItemTypes=Playlist,BoxSet&Recursive=true&SortBy=SortName&ListItemIds=1213920&Limit=12&X-Emby-Client=Emby Web&X-Emby-Device-Name=Chrome Windows&X-Emby-Device-Id=20630783-23d6-40c3-9e69-414ea652ba5d&X-Emby-Client-Version=4.7.11.0&X-Emby-Token=8c9bcc58b1024af8ad3d52d46385c368&X-Emby-Language=en-us
