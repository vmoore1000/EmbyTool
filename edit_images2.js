

var editImageHTML = `
<label  style="display:inline-block;">Canvas Width</label>
<select id="canvasSize" style="height:18px; margin-bottom:5px;" >
    <option value=300>300 px</option>
    <option value=325>325 px</option>
    <option value=350>350 px</option>
    <option value=375>375 px</option>
    <option selected value=400>400 px</option>
    <option value=425>425 px</option>
    <option value=450>450 px</option>
    <option value=475>475 px</option>
    <option value=500>500 px</option>
    <option value=525>525 px</option>
    <option value=550>550 px</option>
    <option value=575>575 px</option>
    <option value=600>600 px</option>
    <option value=625>625 px</option>
    <option value=650>650 px</option>
    <option value=675>675 px</option>
    <option value=700>700 px</option>
    <option value=725>725 px</option>
    <option value=750>750 px</option>
    <option value=775>775 px</option>
    <option value=800>800 px</option>
</select>
<br>

<canvas id="myCanvasId" style="margin-bottom:5px" width="400" height="600">
    Your browser does not support the HTML5 canvas tag.
</canvas>

<br>
<button id="imageReset" class="btnImageEdit">Reset Image</button>
<button id="imageCrop"  class="btnImageEdit">Crop</button>
<button id="imageResetFilters" class="btnImageEdit">Reset Filters</button>
<button id="imageTaller"  class="btnImageEdit">Taller</button>
<button id="imageShorter" class="btnImageEdit">Shorter</button>
<button id="imageWider"   class="btnImageEdit">Wider</button>
<button id="imageThiner"  class="btnImageEdit">Thiner</button>

<br>
<label for="brightnessSlider" style="display:inline-block; width:80px">Brightness</label>
<input id="brightnessSlider" class="imageSlider" type="range" value="100" min="0" max="300">
<br>
<label for="contrastSlider" style="display:inline-block; width:80px">Contrast</label>
<input id="contrastSlider" class="imageSlider" type="range" value="100" min="0" max="200">
<br>
<label for="grayscaleSlider" style="display:inline-block; width:80px">Grayscale</label>
<input id="grayscaleSlider" class="imageSlider" type="range" value="0" min="0" max="100">
<br>
<label for="saturationSlider" style="display:inline-block; width:80px">Saturation</label>
<input id="saturationSlider" class="imageSlider" type="range" value="100" min="0" max="300">
<br>
<label for="sepiaSlider" style="display:inline-block; width:80px">Sepia</label>
<input id="sepiaSlider" class="imageSlider" type="range" value="0" min="0" max="200">
<br>
<label for="hueRotateSlider" style="display:inline-block; width:80px">Hue</label>
<input id="hueRotateSlider" class="imageSlider" type="range" value="0" min="0" max="360">
<br>
<br>

<button id="saveImageBtn" class="btnImageEdit" style="width:200px">Save Primary Image</button>
<button id="cancelBtn"    class="btnImageEdit" style="width:200px">Cancel</button>
<br>
<button id="saveBackdropImageBtn" class="btnImageEdit" style="width:405px; marginTop:10px;">Save as Backdrop Image</button>
<br>
<button id="saveLogoImageBtn" class="btnImageEdit" style="width:405px; marginTop:10px;">Save as Logo Image</button>
<br>
<button id="saveThumbImageBtn" class="btnImageEdit" style="width:405px; marginTop:10px;">Save as Thumb Image</button>
<br>
<button id="saveLocallyBtn" class="btnImageEdit" style="width:405px; marginTop:10px;">Save Image Locally</button>
<br>
<!--
<button id="saveLocallyBtn2" class="btnImageEdit" style="width:405px; marginTop:10px;">Save2 Image Locally</button>
<br>
-->
<style>
    .btnImageEdit {
        background-color: blue;
        color: white;
        padding: 4px;
        border: 1px solid lightgray;
    }
    .btnImageEdit:hover {
        background-color: lightblue;
        color: black;
        border: 1px solid gray;
    }
</style>
`;



var editImage2HTML = `
<div style="text-align:center; font-size:25px;">Emby Images</div>
<style>
    .mainChangeButton {
        background-color: blue;
        color: white;
        padding: 4px;
        border: 1px solid lightgray;
    }
    .mainChangeButton:hover {
        background-color: lightblue;
        color: black;
        border: 1px solid gray;
    }
</style>
`;



var externalImageHTML = `
<div style="text-align:center; font-size:25px;">External Images</div>
<div style="font-size:18px;">Click an image to select it:</div>
<br>

<style>
    .mainChangeButton {
        background-color: blue;
        color: white;
        padding: 4px;
        border: 1px solid lightgray;
    }
    .mainChangeButton:hover {
        background-color: lightblue;
        color: black;
        border: 1px solid gray;
    }
</style>
`;




function edit_images(pn, originalId, callback) {

    edit_img();

    function edit_img() {

        let imageAspectRatio = {};
        let urlNames = ["Primary","Logo","Thumb","Backdrop"];

        // current image paths for "Primary", "Logo", "Thumb", "backdrops"
        let url = server_url+"Items/"+originalId+"/Images/?"+
        "X-Emby-Client=Emby Web"+
        "&X-Emby-Device-Name=Chrome Android"+
        //"&X-Emby-Device-Id="+deviceId+
        "&X-Emby-Client-Version=4.6.7.0"+
        "&X-Emby-Token="+api_key;

        download(url, allImagesData);

        function allImagesData(data) {
            console.log("=== all images paths = ",data);

            data.forEach( (item) => {
                //let fileName = item.Filename;
                //let path     = item.Path;
                let imgType  = item.ImageType;
                let width    = item.Width;
                let height   = item.Height;

                imageAspectRatio[imgType] = width/height;
            });
        };

        // providers for external images
        let url_1 = server_url+"Items/"+originalId+"/RemoteImages/Providers?"+
        "X-Emby-Client=Emby Web"+
        "&X-Emby-Device-Name=Chrome Android"+
        "&X-Emby-Device-Id="+deviceId+
        "&X-Emby-Client-Version=4.6.7.0"+
        "&X-Emby-Token="+api_key;

        download(url_1, providerData);

        function providerData(data) {
            console.log("=== providers for external images = ",data);
        };

        //let pn = document.getElementById("page_node");
        //while (pn.firstChild) { pn.firstChild.remove(); };

        pn.innerHTML = editImage2HTML;


        // Add Done button
        let d_btn = document.createElement("Button");
        d_btn.classList.add('page_button');
        d_btn.innerHTML = "Done";
        d_btn.id = "cancelBtn2";
        pn.appendChild(d_btn);

        pn.appendChild( document.createElement("BR") );
        pn.appendChild( document.createElement("BR") );



        // Click on Done Button
        document.getElementById("cancelBtn2").onclick = function (event) {
            event.preventDefault();
            console.log("=== Done");
            
            callback();
        };





        let primaryTag;
        let logoTag;
        let thumbTag;
        let backdropTags = [];

        let url_2 = server_url+"Users/"+user_id+"/Items/"+originalId+"?"+
        "X-Emby-Client=Emby Web"+
        "&X-Emby-Device-Name=Chrome Android"+
        "&X-Emby-Device-Id="+deviceId+
        "&X-Emby-Client-Version=4.6.7.0"+
        "&X-Emby-Token="+api_key;

        download(url_2, primaryImageData);

        function primaryImageData (data) {
            //console.log("=== primary image data = ",data);

            //urlNames = ["Primary","Logo","Thumb","Backdrop","Backdrop","Backdrop","Backdrop",]
            let urls = [];

            primaryTag   = (data.ImageTags.Primary) ? data.ImageTags.Primary : "";
            logoTag      = (data.ImageTags.Logo)    ? data.ImageTags.Logo    : "";
            thumbTag     = (data.ImageTags.Thumb)   ? data.ImageTags.Thumb   : "";
            backdropTags = (data.BackdropImageTags) ? data.BackdropImageTags : [];

            // primary tag image
            if(primaryTag=="") urls[0] = getDefaultImage();
            else urls[0] = server_url+"Items/"+originalId+"/Images/Primary?tag="+primaryTag+"&quality=90&maxWidth=300";
            // logo tag image
            if(logoTag=="") urls[1] = getDefaultImage();
            else urls[1] = server_url+"Items/"+originalId+"/Images/Logo?tag="+logoTag+"&quality=90&maxWidth=300";
            // thumb tag image
            if(thumbTag=="") urls[2] = getDefaultImage();
            else urls[2] = server_url+"Items/"+originalId+"/Images/Thumb?tag="+thumbTag+"&quality=90&maxWidth=300";
            
            // backdrops
            let cnt = backdropTags.length;
            let j = 3;
            for(let i=0; i<cnt; i++) {
                urls[j] = server_url+"Items/"+originalId+"/Images/Backdrop/"+i+"?tag="+backdropTags[i]+"&quality=90&maxWidth=300";
                j++
            };
            //
            // add all pictures to the DOM
            //
            let width = 200;
            cnt = urls.length;
            for(let i=0; i<cnt; i++) {
                if(i==3) {
                    let lblDiv = document.createElement("DIV");
                    lblDiv.style.textAlign = "center";

                    let lbl = document.createElement("LABEL");
                    lbl.innerHTML = "Emby Backdrops";
                    lbl.style.fontSize = "25px";
                    //lbl.className = "alpha";
                    lblDiv.appendChild(lbl);

                    pn.appendChild(lblDiv);
                    pn.appendChild( document.createElement("BR") );

                    // Add Backdrop image button
                    let i_btn = document.createElement("Button");
                    i_btn.classList.add('mainChangeButton');
                    i_btn.innerHTML = "Add Image";
                    //i_btn.style.marginLeft = "10px";
                    i_btn.id = "addImageBtn";

                    pn.appendChild(i_btn);

                    // Add get local image button
                    let loc_btn = document.createElement("Button");
                    loc_btn.classList.add('mainChangeButton');
                    loc_btn.innerHTML = "Local Image";
                    //loc_btn.style.marginLeft = "10px";
                    loc_btn.id = "getImageBtn";

                    pn.appendChild( loc_btn );
                    pn.appendChild( document.createElement("BR") );
                    pn.appendChild( document.createElement("BR") );

                    // Click on Add Image Button
                    document.getElementById("addImageBtn").onclick = function (event) {
                        event.preventDefault();
                        console.log("=== Add Image Btn ", event);

                        externalImages(originalId, "Backdrop");
                    };

                    // Click on Get local Image Button
                    document.getElementById("getImageBtn").onclick = function (event) {
                        event.preventDefault();

                        openImageFile(originalId, OK, urlNames[3] );

                        function OK(data) {
                            console.log("=== OK === ", data);
                            edit_img( originalId );
                        };
                    };
                };

                let ImgDiv = document.createElement("DIV");
                ImgDiv.classList.add('display_image_node');
                pn.appendChild(ImgDiv);

                let j = (i<3) ? i : 3;

                let lbl2 = document.createElement("LABEL");
                lbl2.innerHTML = urlNames[j];
                //lbl2.className = "alpha";
                ImgDiv.appendChild(lbl2);
                ImgDiv.appendChild( document.createElement("BR") );

                let iNode = document.createElement("img");
                iNode.src = urls[i];    // add the image URL to the DOM
                //iNode.loading = "lazy"; // only load images if they are visable on the screen
                //iNode.className = "notSelected";
                iNode.style.width  = width+"px";
                let height = width / imageAspectRatio[urlNames[j]];
                iNode.style.height = height+"px"; 

                ImgDiv.appendChild(iNode);
                ImgDiv.appendChild( document.createElement("BR") );


                // edit image button
                let img_btn = document.createElement("Button");
                img_btn.classList.add('mainChangeButton');
                img_btn.innerHTML = "Edit";
                img_btn.id = "editImageBtn_"+i;

                ImgDiv.appendChild(img_btn);

                // Click on Edit Image Button
                document.getElementById("editImageBtn_"+i).onclick = function (event) {
                    event.preventDefault();
                    console.log("=== Edit Image Btn ", i);

                    editImage2(urls[i], urlNames[j]);
                };

                if(i<3) {
                    // Add get local image button
                    let local_btn = document.createElement("Button");
                    local_btn.classList.add('mainChangeButton');
                    local_btn.innerHTML = "Local Image";
                    //local_btn.style.marginLeft = "10px";
                    local_btn.id = "getImageBtn_"+i;

                    ImgDiv.appendChild(local_btn);

                    // change image button
                    img_btn = document.createElement("Button");
                    img_btn.classList.add('mainChangeButton');
                    img_btn.innerHTML = "Change";
                    img_btn.id = "changeImageBtn_"+i;

                    ImgDiv.appendChild(img_btn);

                    // Click on Edit Image Button
                    document.getElementById("changeImageBtn_"+i).onclick = function (event) {
                        event.preventDefault();
                        console.log("=== Change Image "+i+" Btn ", event);

                        let type = urlNames[j];
                        externalImages(originalId, type);
                    };

                    // Click on Get local Image Button
                    document.getElementById("getImageBtn_"+i).onclick = function (event) {
                        event.preventDefault();

                        openImageFile(originalId, OK, urlNames[i] );

                        function OK(data) {
                            console.log("=== OK === ", data);
                            edit_img( originalId );
                        };
                    };
                } else {
                    // delete image button
                    img_btn = document.createElement("Button");
                    img_btn.classList.add('mainChangeButton');
                    img_btn.innerHTML = "Remove";
                    img_btn.id = "deleteImageBtn_"+i;

                    ImgDiv.appendChild(img_btn);

                    // move image up button
                    img_btn = document.createElement("Button");
                    img_btn.classList.add('mainChangeButton');
                    img_btn.innerHTML = "Move Up";
                    img_btn.id = "moveUpBtn_"+i;

                    ImgDiv.appendChild(img_btn);

                    // Click on delete Image Button
                    document.getElementById("deleteImageBtn_"+i).onclick = function (event) {
                        event.preventDefault();
                        console.log("=== Delete Image "+(i-3)+" Btn ", event);

                        // delete
                        let url = server_url+"Items/"+originalId+"/Images/Backdrop/"+(i-3)+"/Delete?"+
                        "&X-Emby-Client=Emby Web"+
                        "&X-Emby-Device-Name=Chrome Android"+
                        "&X-Emby-Device-Id="+deviceId+
                        "&X-Emby-Client-Version=4.6.7.0"+
                        "&X-Emby-Token="+api_key;

                        upload (url, "", dataUploaded);

                        function dataUploaded(data) {
                            console.log("=== Uploaded === ",data);
                            edit_img( originalId );
                        };
                    };

                    // Click on move up Image Button
                    document.getElementById("moveUpBtn_"+i).onclick = function (event) {
                        event.preventDefault();
                        console.log("=== Move Up Image "+(i-3)+" Btn ", event);
                        let oldIndex = i-3;
                        let newIndex = oldIndex -1;
                        if (newIndex < 0) return;

                        let url = server_url+"Items/"+originalId+"/Images/Backdrop/"+oldIndex+"/Index?newIndex="+newIndex+
                        "&X-Emby-Client=Emby Web"+
                        "&X-Emby-Device-Name=Chrome Android"+
                        "&X-Emby-Device-Id="+deviceId+
                        "&X-Emby-Client-Version=4.6.7.0"+
                        "&X-Emby-Token="+api_key;

                        upload (url, "", dataUploaded);

                        function dataUploaded(data) {
                            console.log("=== Uploaded === ",data);
                            edit_img( originalId );
                        };
                    };
                };
            };
            pn.appendChild( document.createElement("BR") );
        };



        
        function externalImages(id, type) {
            console.log("=== Select an Image"+type);

            //let pn = document.getElementById("page_node");
            while (pn.firstChild) { pn.firstChild.remove(); };

            pn.innerHTML = externalImageHTML;

            // Add Cancel button
            let c_btn = document.createElement("Button");
            c_btn.classList.add('mainChangeButton');
            c_btn.innerHTML = "Cancel";
            c_btn.id = "cancelBtn3";

            pn.appendChild(c_btn);
            pn.appendChild( document.createElement("BR") );
            pn.appendChild( document.createElement("BR") );


            // Click on Cancel Button
            document.getElementById("cancelBtn3").onclick = function (event) {
                event.preventDefault();
                console.log("=== Cancel");

                edit_img( originalId );
            };



            // // get and display Snapshots
            // if(snapshots.length > 0) {
            //     let snapshotTitle = document.createElement("div");
            //     snapshotTitle.innerHTML = "Snapshots";
            //     snapshotTitle.style.fontSize = "18px";
            //     pn.appendChild( snapshotTitle );
            // };

            // for(let i=0; i<snapshots.length; i++) {
            //     let imgUrl = snapshots[i][0];
            //     let width  = snapshots[i][1];
            //     let height = snapshots[i][2];

            //     var iNode = document.createElement("img");
            //     iNode.src = imgUrl;    // add the image URL to the DOM
            //     iNode.id  = "snapshot_"+i;
            //     iNode.loading = "lazy"; // only load images if they are visable on the screen
            //     //iNode.className = "notSelected";
            //     iNode.style.width  = "200px"; 
            //     height = 200 / (width / height);
            //     iNode.style.height = height+"px";
            //     iNode.style.marginBottom = "5px";
            //     iNode.style.marginLeft   = "5px";
            //     iNode.style.border = "1px solid black";

            //     pn.appendChild(iNode);

            //     // Click on Snapshot Image
            //     document.getElementById("snapshot_"+i).onclick = function (event) {
            //         event.preventDefault();

            //         console.log("=== Snapshot "+i);
            //         document.getElementById(event.target.id).style.border = "3px solid red";
            //         let iData = snapshots[i][0];
            //         let temp = iData.split("base64,");
            //         prosess_picked_file (temp[1], originalId, OK, type)

            //         function OK(data){
            //             console.log("=== Snapshot OK");


            //             edit_img( originalId );
            //         };
            //     };
            // };
            
            //pn.appendChild( document.createElement("BR") );
            pn.appendChild( document.createElement("BR") );

            let externalImageTitle = document.createElement("div");
            externalImageTitle.innerHTML = "Select an External Image";
            externalImageTitle.style.fontSize = "18px";
            pn.appendChild( externalImageTitle );

            // get primary images from external source
            let url = server_url+"Items/"+id+"/RemoteImages?Type="+type+"&Limit=50"+
            "&X-Emby-Client=Emby Web"+
            "&X-Emby-Device-Name=Chrome Android"+
            "&X-Emby-Device-Id="+deviceId+
            "&X-Emby-Client-Version=4.6.7.0"+
            "&X-Emby-Token="+api_key;
            
            download(url, remotePrimaryImages);


            function remotePrimaryImages (data) {
                //pn.appendChild( document.createElement("BR") );
                cnt = data.Images.length;

                //console.log("=== remote "+type+" primary image data = ",data,",  cnt = ",cnt,", data.Images = ",data.Images);

                for(let i=0; i<cnt; i++) {

                    let item = data.Images[i];
                    let j = (i<3) ? i : 3;

                    // get logo image
                    let url = server_url+"Images/Remote?api_key="+api_key+"&imageUrl="+item.Url;

                    var iNode = document.createElement("img");
                    iNode.src = url;    // add the image URL to the DOM
                    iNode.id  = "RemoteImage_"+i;
                    iNode.loading = "lazy"; // only load images if they are visable on the screen
                    //iNode.className = "notSelected";
                    iNode.style.width  = "100px"; //width+"px";
                    let height = 100 / (item.Width / item.Height);
                    iNode.style.height = height+"px"; //"100px"; 
                    iNode.style.marginBottom = "5px";
                    iNode.style.marginLeft   = "5px";
                    iNode.style.border = "1px solid black";

                    pn.appendChild(iNode);

                    // Click on Image
                    if(document.getElementById("RemoteImage_"+i)) {
                        document.getElementById("RemoteImage_"+i).onclick = function (event) {
                            event.preventDefault();
                            console.log("=== Image event = ", event);
                            document.getElementById(event.target.id).style.border = "3px solid red";

                            let item = data.Images[i];
                            //console.log("=== Image "+i+" Clicked", item);
                            uploadImage(item);
                            
                        };
                    };
                };
            };


            function uploadImage(item){
                let type = item.Type;
                let url_1  = item.Url;
                // let ThumbUrl = item.ThumbnailUrl;
                let provider = item.ProviderName;
                // download remote image (POST)
                let url_2 = server_url+"Items/"+id+"/RemoteImages/Download?Type="+type+"&ImageUrl="+url_1+"&ProviderName="+provider+
                "&X-Emby-Client=Emby Web"+
                "&X-Emby-Device-Name=Chrome Android"+
                "&X-Emby-Device-Id="+deviceId+
                "&X-Emby-Client-Version=4.6.7.0"+
                "&X-Emby-Token="+api_key;

                upload (url_2, "", dataUploaded);

                function dataUploaded(data) {
                    console.log("=== Uploaded === ",data);
                    edit_img( originalId );
                };
            };
        };






        //------------------------------------------------------------
        //
        //
        //             Image Editor
        //
        //
        //------------------------------------------------------------
        function editImage2(image_url, imageType) {

            fetchData();

            async function fetchData() {
                const res = await fetch(image_url);
                const contentType = res.headers.get('Content-Type');
                const raw = await res.blob();
                const image = await createImageBitmap(raw);

                editImage3(image, imageType);
            };
        };

        function editImage3(image, imageType) {
            console.log("=== edit image ");

            var brightnessSlider;
            var contrastSlider;
            var grayscaleSlider;
            var hueRotateSlider;
            var saturationSlider;
            var sepiaSlider;

            var originalAR;  // original aspect ratio of the image

            imgWidth    = image.width;
            imgHeight   = image.height;
            aspectRatio = originalAR = imgWidth / imgHeight;

            console.log("=== imgWidth = ",imgWidth,", imgHeight = ",imgHeight,", ar = ",aspectRatio);

            //let pn = document.getElementById("page_node");
            while (pn.firstChild) { pn.firstChild.remove(); };

            pn.innerHTML = editImageHTML;  // load the html for the image editor

            var myCanvas = document.getElementById("myCanvasId");
            var ctx = myCanvas.getContext("2d");

            myCanvas.width = 400;
            myCanvas.height = myCanvas.width / aspectRatio;
            ctx.drawImage(image, 0, 0, myCanvas.width, myCanvas.height);
            //
            // create a temp image to work with
            //
            let iURL = myCanvas.toDataURL('image/jpeg',1.0);  
            tempImage = document.createElement("img");
            tempImage.src = iURL;
            //
            // st up the selection rectangle over the image
            //
            var rect = {};
            var updateRectCanvas = selection_rectangle(myCanvas, ctx, updateRect);

            //--------------------------------------------------------------------------
            //
            // Get references to all of the sliders of the image
            //
            brightnessSlider = document.getElementById("brightnessSlider");
            contrastSlider   = document.getElementById("contrastSlider");
            grayscaleSlider  = document.getElementById("grayscaleSlider");
            hueRotateSlider  = document.getElementById("hueRotateSlider");
            saturationSlider = document.getElementById("saturationSlider");
            sepiaSlider      = document.getElementById("sepiaSlider");

            clearImageFilters ();
            drawAfterSizeChange();

            //--------------------------------------------------------------------------
            function updateRect(newRect) {
                rect = newRect;
            };
            //--------------------------------------------------------------------------
            //
            //  set canvas width
            //
            document.getElementById("canvasSize").onclick = function (event) {
                var cWidth = this.value;
                givenCanvasWidth = cWidth;
                myCanvas.width = cWidth;
                myCanvas.height = myCanvas.width / aspectRatio;

                console.log("=== myCanvas.width = ",myCanvas.width,", myCanvas.height = ",myCanvas.height);

                drawAfterSizeChange();
            };
            //--------------------------------------------------------------------------
            //
            //   taller
            //
            document.getElementById("imageTaller").onclick = function (event) {
                //console.log("=== Taller");
                myCanvas.height += 25;
                drawAfterSizeChange();
            };

            //--------------------------------------------------------------------------
            //
            //   shorter
            //
            document.getElementById("imageShorter").onclick = function (event) {
                //console.log("=== Shorter");
                if(myCanvas.height > 75) {
                    myCanvas.height -= 25;
                    drawAfterSizeChange();
                };
            };

            //--------------------------------------------------------------------------
            //
            //   thiner
            //
            document.getElementById("imageThiner").onclick = function (event) {
                //console.log("=== Thiner");
                if(myCanvas.width<=300) return;

                myCanvas.width -= 25;
                document.getElementById("canvasSize").value = myCanvas.width;
                drawAfterSizeChange();
            };

            //--------------------------------------------------------------------------
            //
            //   wider
            //
            document.getElementById("imageWider").onclick = function (event) {
                //console.log("=== Wider");
                if(myCanvas.width>=800) return;

                myCanvas.width += 25;
                document.getElementById("canvasSize").value = myCanvas.width;
                drawAfterSizeChange();
            };
            //--------------------------------------------------------------------------    
            //
            //   Clear Filters   imageResetFilters
            //
            document.getElementById("imageResetFilters").onclick = function (event) { clearImageFilters(); };

            function clearImageFilters () {
                //console.log("=== clear Filters");
                brightnessSlider.value= 100;
                contrastSlider.value  = 100;
                grayscaleSlider.value = 0;
                hueRotateSlider.value = 0;
                saturationSlider.value= 100;
                sepiaSlider.value     = 0;

                applyImageFilter();
            };
            //--------------------------------------------------------------------------
            //
            // reset Image
            //
            document.getElementById("imageReset").onclick = function (event) { reset_image(); };

            function reset_image () {
                //image_init();
                clearImageFilters();

                myCanvas.width = 400;
                myCanvas.height = myCanvas.width / originalAR;

                document.getElementById("canvasSize").value = myCanvas.width;

                ctx.drawImage(image, 0, 0, myCanvas.width, myCanvas.height);

                let iURL = myCanvas.toDataURL('image/jpeg',1.0);  
                tempImage.src = iURL;
                    
                drawAfterSizeChange();
            };
            //--------------------------------------------------------------------------  
            //
            //    crop
            //  
            document.getElementById("imageCrop").onclick = function (event) {
                //console.log("=== Crop");
                //let cropImg = ctx.getImageData(rect.startX, rect.startY, rect.w, rect.h);
                //tImage = document.createElement("img");
                //tImage.src = cropImg;

                aspectRatio = rect.w / rect.h;
                myCanvas.height = myCanvas.width / aspectRatio;

                //ctx.putImageData(cropImg, 0, 0);
                ctx.drawImage(tempImage, rect.startX, rect.startY, rect.w, rect.h, 0, 0, myCanvas.width, myCanvas.height);
                //ctx.drawImage(tImage, 0, 0, rect.w, rect.h, 0, 0, myCanvas.width, myCanvas.height);

                let iURL = myCanvas.toDataURL('image/jpeg',1.0);  
                tempImage.src = iURL;

                drawAfterSizeChange();
            };
            //--------------------------------------------------------------------------
            //
            //   draw after size change
            //
            function drawAfterSizeChange() {
                // rect.startX = (myCanvas.width  / 2) - 30;
                // rect.startY = (myCanvas.height / 2) - 30;
                // rect.w      = 60;
                // rect.h      = 60;

                updateRectCanvas(myCanvas);

                draw();
            };

            //--------------------------------------------------------------------------
            //
            //   draw
            //
            function draw() {
                ctx.drawImage(tempImage, 0, 0, myCanvas.width, myCanvas.height);

                //applyImageFilter();

                //if(noRect) return;

                // ctx.globalCompositeOperation = "source-over";
                // ctx.strokeStyle = "red";
                // ctx.lineWidth   = "2";
                // ctx.beginPath();
                // ctx.rect(rect.startX, rect.startY, rect.w, rect.h);
                // ctx.stroke();
            };
            //--------------------------------------------------------------------------
            //
            //    Cancel
            //
            document.getElementById("cancelBtn").onclick = function (event) {
                console.log("=== Cancel");
                edit_img( originalId );
            };
            //--------------------------------------------------------------------------
            //
            //    Save as Backdrop Image
            //
            document.getElementById("saveBackdropImageBtn").onclick = function (event) {
            
                ctx.drawImage(tempImage, 0, 0, myCanvas.width, myCanvas.height);

                let imgData = myCanvas.toDataURL('image/jpeg', 1.0);
                let temp = imgData.split("base64,");
        
                prosess_picked_file (temp[1], originalId, endSave, "Backdrop");
        
                function endSave() {
                    console.log("=== End Backdrop Image Save");
                    edit_img( originalId );
                };
            };
            //--------------------------------------------------------------------------
            //
            //    Save as Logo Image
            //
            document.getElementById("saveLogoImageBtn").onclick = function (event) {
            
                ctx.drawImage(tempImage, 0, 0, myCanvas.width, myCanvas.height);

                let imgData = myCanvas.toDataURL('image/jpeg', 1.0);
                let temp = imgData.split("base64,");
        
                prosess_picked_file (temp[1], originalId, endSave, "Logo");
        
                function endSave() {
                    console.log("=== End Logo Image Save");
                    edit_img( originalId );
                };
            };
            //--------------------------------------------------------------------------
            //
            //    Save as Thumb Image
            //
            document.getElementById("saveThumbImageBtn").onclick = function (event) {
            
                ctx.drawImage(tempImage, 0, 0, myCanvas.width, myCanvas.height);

                let imgData = myCanvas.toDataURL('image/jpeg', 1.0);
                let temp = imgData.split("base64,");
        
                prosess_picked_file (temp[1], originalId, endSave, "Thumb");
        
                function endSave() {
                    console.log("=== End Thumb Image Save");
                    edit_img( originalId );
                };
            };
            //--------------------------------------------------------------------------
            //
            //    Save Image Locally
            //
            // const butDir = document.getElementById('saveLocallyBtn2');
            // butDir.addEventListener('click', async () => {
            //     let handle = await window.showDirectoryPicker()({ mode: 'read' });
            //     //const dirHandle = await window.showDirectoryPicker();
            //     //for await (const entry of dirHandle.values()) {
            //     //  console.log(entry.kind, entry.name);
            //     //}
            // });


            document.getElementById("saveLocallyBtn").onclick = function (event) {
                ctx.drawImage(tempImage, 0, 0, myCanvas.width, myCanvas.height);
                let imgUrlData = myCanvas.toDataURL('image/jpeg', 1.0);

                //var temp2 = temp1.split("base64,");
                //let image = temp2[1];

                let options = {
                    types: [{
                        description: "Image file",
                        accept: {'image/*': ['.png', '.gif', '.jpeg', '.jpg']}
                    }],
                    excludeAcceptAllOption: true,
                    startIn: 'pictures'
                    //startIn: directoryHandle
                };

                console.log("=== Save Locally");

                //-----------------------------------------------------
                // getDirHandle();

                // async function getDirHandle() {
                //     try{
                //         const dirHandle = await window.showDirectoryPicker(options);
                //         console.log("=== Dir Handle = ",dirHandle);

                //         // const newFileHandle = await dirHandle.getFileHandle('image_1.jpg', { create: true });
                //         // console.log("=== File Handle = ",newFileHandle);
                //         // if(newFileHandle) await writeURLToFile(newFileHandle, imgUrlData);
                //         // else console.log("=== No fole handle");
                //     } catch (error) {
                //         console.log("=== POST Error = ",error);
                //     }; 
                // };

                //-----------------------------------------------------
                getNewFileHandle();

                async function getNewFileHandle() {
                    //const handle = await showOpenFilePicker(options);
                    const handle = await showSaveFilePicker(options);
                    //await writeStrToFile(handle, image)
                    await writeURLToFile(handle, imgUrlData);
                };
                //
                // this method is for saving a string
                //
                // async function writeStrToFile(fileHandle, contents) {
                //     // Create a FileSystemWritableFileStream to write to.
                //     const writable = await fileHandle.createWritable();
                //     // Write the contents of the file to the stream.
                //     await writable.write(contents);
                //     // Close the file and write the contents to disk.
                //     await writable.close();
                // };

                //
                // this method is for saving an image
                //
                async function writeURLToFile(fileHandle, url) {
                    // Create a FileSystemWritableFileStream to write to.
                    const writable = await fileHandle.createWritable();
                    // Make an HTTP request for the contents.
                    const response = await fetch(url);
                    // Stream the response into the file.
                    await response.body.pipeTo(writable);
                    // pipeTo() closes the destination pipe by default, no need to close it.
                };
            };
            //--------------------------------------------------------------------------
            //
            //    Save Primary Image
            //
            document.getElementById("saveImageBtn").onclick = function (event) {
                console.log("=== Save Image");

                ctx.drawImage(tempImage, 0, 0, myCanvas.width, myCanvas.height);

                let imgData = myCanvas.toDataURL('image/jpeg', 1.0);

                //console.log("=== Image Data 2 = ",imgData);

                let temp = imgData.split("base64,");
        
                prosess_picked_file (temp[1], originalId, endSave, imageType);
        
                function endSave() {
                    console.log("=== End Primary Image Save");
                    edit_img( originalId );
                };
            };
            //--------------------------------------------------------------------------
            //
            //   apply filter
            //
            document.getElementById("brightnessSlider").onclick = function (event) { applyImageFilter(); };
            document.getElementById("contrastSlider").onclick   = function (event) { applyImageFilter(); };
            document.getElementById("grayscaleSlider").onclick  = function (event) { applyImageFilter(); };
            document.getElementById("saturationSlider").onclick = function (event) { applyImageFilter(); };
            document.getElementById("sepiaSlider").onclick      = function (event) { applyImageFilter(); };
            document.getElementById("hueRotateSlider").onclick  = function (event) { applyImageFilter(); };

            function applyImageFilter() {
                // Create a string that will contain all the filters to be used for the image
                let filterString =
                    "brightness(" + brightnessSlider.value + "%" +
                    ") contrast(" + contrastSlider.value + "%" +
                    ") grayscale(" + grayscaleSlider.value + "%" +
                    ") saturate(" + saturationSlider.value + "%" +
                    ") sepia(" + sepiaSlider.value + "%" +
                    ") hue-rotate(" + hueRotateSlider.value + "deg" + ")";

                // Apply the filter to the image
                ctx.filter = filterString;

                // Draw the edited image to canvas
                ctx.drawImage(tempImage, 0, 0, myCanvas.width, myCanvas.height);
            };


            //--------------------------------------------------------------------------
            //
            //   add selection rectangle 
            //
            //--------------------------------------------------------------------------

            function selection_rectangle(canvas, ctx, callback) {

                var rect = {},
                    drag = false,
                    mouseX,
                    mouseY,
                    closeEnough = 10,
                    dragTL = false,
                    dragBL = false,
                    dragTR = false,
                    dragBR = false;
              
                  function init() {
                      canvas.addEventListener('mousedown', mouseDown, false);
                      canvas.addEventListener('mouseup',   mouseUp,   false);
                      canvas.addEventListener('mousemove', mouseMove, false);
                      canvas.addEventListener('mouseenter',mouseEnter,false);
                      canvas.addEventListener('mouseout',  mouseOut,  false);

                      canvas.style.backgroundColor = "lightgray"
              
                      rect = {
                          startX: (canvas.width    / 2) - 30,
                          startY: (myCanvas.height / 2) - 30,
                          w: 60,
                          h: 60
                      };
                  };

                function updateCanvas(newCanvas) {
                    canvas.removeEventListener('mousedown', mouseDown);
                    canvas.removeEventListener('mouseup',   mouseUp);
                    canvas.removeEventListener('mousemove', mouseMove);
                    canvas.removeEventListener('mouseenter',mouseEnter);
                    canvas.removeEventListener('mouseout',  mouseOut);

                    canvas = newCanvas;

                    init();
                };

                  function mouseDown(e) {
                      mouseX = e.offsetX;  //e.pageX - this.offsetLeft;
                      mouseY = e.offsetY;  //e.pageY - this.offsetTop;
              
                    //   console.log("=== e = ",e);
                    //   console.log("=== startX = ",rect.startX,", startY = ",rect.startY,", w = ",rect.w,", h = ",rect.h);
                    //   console.log("=== test 1 = ",mouseX, ", ",mouseY);
                    //   console.log("=== test 2 = ",e.pageX, ", ",e.pageY);
                    //   console.log("=== test 3 = ",e.screenX, ", ",e.screenY);
                    //   console.log("=== test 4 = ",e.offsetX, ", ",e.offsetY);

                      
                      if (rect.w === undefined) {  // if there isn't a rect yet
                          rect.startX = mouseY;
                          rect.startY = mouseX;
                          dragBR = true;
                      }
                      // 1. top left
                      else if (checkCloseEnough(mouseX, rect.startX) && checkCloseEnough(mouseY, rect.startY)) {
                          dragTL = true;
                      }
                      // 2. top right
                      else if (checkCloseEnough(mouseX, rect.startX + rect.w) && checkCloseEnough(mouseY, rect.startY)) {
                          dragTR = true;
                      }
                      // 3. bottom left
                      else if (checkCloseEnough(mouseX, rect.startX) && checkCloseEnough(mouseY, rect.startY + rect.h)) {
                          dragBL = true;
                      }
                      // 4. bottom right
                      else if (checkCloseEnough(mouseX, rect.startX + rect.w) && checkCloseEnough(mouseY, rect.startY + rect.h)) {
                          dragBR = true;
                      }
                      // (5.) none of them
                      else {
                          // handle not resizing
                      }
              
                      //ctx.clearRect(0, 0, canvas.width, canvas.height);
                      draw();
                  };
              
                  function checkCloseEnough(p1, p2) {
                      return Math.abs(p1 - p2) < closeEnough;
                  };
              
                  function mouseEnter() {
                      console.log("=== mouse enter ===");
                  };

                  function mouseOut() {
                      console.log("=== mouse out ===");
                      if(callback) callback(rect);
                  };
              
                  function mouseUp() {
                      dragTL = dragTR = dragBL = dragBR = false;
              
                      console.log("=== rect = ",rect);
                  };
              
                  function mouseMove(e) {
                      mouseX = e.pageX - this.offsetLeft;
                      mouseY = e.pageY - this.offsetTop;
              
                      if (dragTL) {
                          rect.w += rect.startX - mouseX;
                          rect.h += rect.startY - mouseY;
                          rect.startX = mouseX;
                          rect.startY = mouseY;
                      } else if (dragTR) {
                          rect.w = Math.abs(rect.startX - mouseX);
                          rect.h += rect.startY - mouseY;
                          rect.startY = mouseY;
                      } else if (dragBL) {
                          rect.w += rect.startX - mouseX;
                          rect.h = Math.abs(rect.startY - mouseY);
                          rect.startX = mouseX;
                      } else if (dragBR) {
                          rect.w = Math.abs(rect.startX - mouseX);
                          rect.h = Math.abs(rect.startY - mouseY);
                      };
                      //ctx.clearRect(0, 0, canvas.width, canvas.height);
                      draw();
                  };
              
                  function draw() {
                      //ctx.fillStyle = "#222222";
                      //ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
              
                      ctx.drawImage(tempImage, 0, 0, myCanvas.width, myCanvas.height);

                      ctx.globalCompositeOperation = "source-over";
                      ctx.strokeStyle = "red";
                      ctx.lineWidth   = "2";
                      ctx.beginPath();
                      ctx.rect(rect.startX, rect.startY, rect.w, rect.h);
                      ctx.stroke();
              
                      drawHandles();
                  };
                    
                  function drawCircle(x, y, radius) {
                      ctx.fillStyle = "#FF0000";
                      ctx.beginPath();
                      ctx.arc(x, y, radius, 0, 2 * Math.PI);
                      ctx.fill();
                  };
              
                  function drawHandles() {
                      drawCircle(rect.startX, rect.startY, closeEnough);
                      drawCircle(rect.startX + rect.w, rect.startY, closeEnough);
                      drawCircle(rect.startX + rect.w, rect.startY + rect.h, closeEnough);
                      drawCircle(rect.startX, rect.startY + rect.h, closeEnough);
                  };
              
                  init();

                  return updateCanvas;
            };
        };
    };
};

const opt2 = {
    types: [{
        description: "Image file",
        accept: {'image/*': ['.png', '.gif', '.jpeg', '.jpg']}
    }],
    excludeAcceptAllOption: true,
    startIn: 'pictures'
};

async function openImageFile(originalId, callback, imageType) {
    //console.log("=== Select an Image with the file picker");

    [fileHandle3] = await window.showOpenFilePicker(opt2);
    var file = await fileHandle3.getFile();

    var name = file.name;
    //console.log("=== filename = "+name);
    var fr = new FileReader();
    fr.onload = () => showImage(fr);
    fr.readAsDataURL(file);

    function showImage(fileReader) {
        let temp1 = fileReader.result;
        var temp2 = temp1.split("base64,");
        let imageData = temp2[1];
        //let imageType = "Primary";

        prosess_picked_file(imageData, originalId, callback, imageType);
    };
};

function prosess_picked_file (data_1, originalId, callback, imageType) {
    //console.log("=== Image Data = ",data_1);

    let image_url = server_url+"Items/"+originalId+"/Images/"+imageType+"?"+
    "X-Emby-Client=Emby Web"+
    "&X-Emby-Device-Name=Chrome"+
    "&X-Emby-Device-Id="+deviceId+
    "&X-Emby-Client-Version=4.6.7.0"+
    "&X-Emby-Token="+api_key;

    let h = new Headers();
    h.append('Accept','Application/json');
    h.append('Content-type', 'image/jpeg');    //'image/x-png,image/gif,image/jpeg'

    let req = new Request(image_url,{ 
        method:  'POST', 
        mode:    'cors',
        headers: h,
        body:    data_1
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
        callback();
    })
    .catch( (err) => {
        console.log("=== Error ",err);
        callback();
    });
};

