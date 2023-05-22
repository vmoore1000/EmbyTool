

var epubPlayerHTML = `
<div id="topArea">
    <!-- <h1 style="text-align:center">Images found in the EPUB file</h1> -->
    <!-- <div id="imgNode"></div> -->

    <!-- <h1 style="text-align:center">Book Overview</h1> -->
    <!-- <div id="bookOverview">None</div> -->

    <input  type="file" id="myfile" onchange="onMyfileChange(this)" />
</div>

<div id='__start_of_book'></div>

<table id="bookArea">
    <tr>
        <td>
            <div><button id="localFile"   class="btn">🖿</button></div>
            <div><button id="prevPage1"    class="btn">◀</button></div>
            <div><button id="prevChapter1" class="btn">˂˂</button></div>
        </td>
        <td>
            <!-- <h1 style="text-align:center">EPUB Book Viewer</h1> -->
            
            <div id="epub_container" >

            </div>
        </td>
        <td>
            <div><button id="bookReturn1"  class="btn2">Return</button></div>
            <div><button id="gotoTop1"     class="btn">T</button></div>
            <div><button id="nextPage1"    class="btn">▶</button></div>
            <div><button id="nextChapter1" class="btn">˃˃</button></div>
        </td>                
    </tr>
</table>

<style>
    #myfile{
        visibility: hidden;
    }
    #epub_container {
        border: 1px solid black;
        height: 850px;
        width: 580px;
        overflow: auto;

        padding: 10px;
    }
    .btn{
        background-color: blue;
        color: white;
        width: 30px;
        margin-bottom: 5px;
    }
    .btn:hover {
        background-color: lightblue;
        color: black;
    }

    .btn2{
        background-color: blue;
        color: white;
        margin-bottom: 5px;
        float: left;
    }
    .btn2:hover {
        background-color: lightblue;
        color: black;
    }
    label {
        font-size: 20px;
    }
    #overview{
        margin-bottom: 20px;
    }
</style>
`;



//--------------------------------------------------------------------------
//--------------------------------------------------------------------------


var chapterHTML = [];
var zipRawNamesArray = [];
var zipNamesArray = [];
var zipFiles = {};
var zipItemCnt = 0;

var currentChapter;
var maxChapter;
var chapterHTML;
var book;
var imageNames;
var css;
var misc;
var opf;
var ncx;
var imgObjs;
var zipFileKeys;

var message;

var $topArea;
var $bookArea;

//var $imgNode;
var $epub_container;
var $page;
//var $bookOverview;
var $navigationAnchor;

var windowWidth;
var windowHeight;

var debugEPUB = false;




//--------------------------------------------------------------------------
//
//  Select EPUB from your computer and unzip it
//
//--------------------------------------------------------------------------
function onMyFileChange(fileInput) {

    if(fileInput.files[0] == undefined) {
        return;
    };
    //
    // fetch the epub and unzip it's files
    //
    let reader = new FileReader();
    reader.readAsArrayBuffer(fileInput.files[0]);

    reader.onload = function(ev) {
        unZip(ev.target.result);
    };

};

//======================================================================================
//                                  epub player
//======================================================================================
function play_book_files(mediaObj, pn, callback) {
    console.log("__________________ E BOOK ________________");

    pn.innerHTML = epubPlayerHTML;

    localFile.onclick    = function (event) { document.getElementById('myfile').click(); };
    prevPage1.onclick    = function (event) { prevPage(); };
    prevChapter1.onclick = function (event) { prevChapter(); };

    bookReturn1.onclick  = function (event) { bookReturn(); };
    gotoTop1.onclick     = function (event) { gotoTop(); };
    nextPage1.onclick    = function (event) { nextPage(); };
    nextChapter1.onclick = function (event) { nextChapter(); };

    $topArea  = document.getElementById("topArea");
    $bookArea = document.getElementById("bookArea");

    //$imgNode  = document.getElementById("imgNode");
    $epub_container= document.getElementById("epub_container");

    //$bookOverview = document.getElementById("bookOverview");
    $navigationAnchor = document.getElementById("navigationAnchor");

    var url = server_url+"Items/"+mediaObj.Id+"/Download?api_key="+api_key;

    download(url);

    async function download(url) {
        let data = await (await fetch(url).catch(handleErr)).arrayBuffer();
    
        if(data.code && data.code==400) {
            console.log("=== Error 400 ",data.code);
            return data;
        };
        console.log("=== Fetched Obj = ",data);
        unZip(data);

        return data;
    };

    function handleErr(err) {
        let resp = new Response(
            JSON.stringify({
                code: 400,
                message: "Error"
            })
        );
        return resp;
    };

    //--------------------------------------------------------------------------
    //
    //          book return
    //
    //--------------------------------------------------------------------------
    function bookReturn(){
        callback();

    };
    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
    function normalizeName(name){
        var a2 = name.split("/");
        return a2[a2.length-1];
    };
    //--------------------------------------------------------------------------
    //
    //  scroll to top
    //
    //--------------------------------------------------------------------------
    function gotoTop() {
        $epub_container.scrollTo(0,0);
    };
    //--------------------------------------------------------------------------
    //
    //  Display the previous chapter
    //
    //--------------------------------------------------------------------------
    function prevChapter() {
        var max = zipFileKeys.length - 1;

        currentChapter--;
        if(currentChapter<0) currentChapter = -1;

        var key = zipFileKeys[currentChapter];
        var a = document.getElementById("internalJumpAnchor");
        a.setAttribute("href","#"+key);

        if(debugEPUB) console.log("=== a =",a)
        a.click();
    };
    //--------------------------------------------------------------------------
    //
    //  Display Prev Page
    //
    //--------------------------------------------------------------------------
    function prevPage() {
        $epub_container.scrollBy(0,-500);
    };
    //--------------------------------------------------------------------------
    //
    //  Display the next chapter
    //
    //--------------------------------------------------------------------------
    function nextChapter() {
        var max = zipFileKeys.length - 1;

        currentChapter++;
        if(currentChapter>=maxChapter) currentChapter = max;

        var key = zipFileKeys[currentChapter];
        var a = document.getElementById("internalJumpAnchor");
        a.setAttribute("href","#"+key);

        if(debugEPUB) console.log("=== a =",a)
        a.click();
    };
    //--------------------------------------------------------------------------
    //
    //  Display Next Page
    //
    //--------------------------------------------------------------------------
    function nextPage() {
        $epub_container.scrollBy(0,500);
    };
    //--------------------------------------------------------------------------
    //
    //  Display a book chapter
    //
    //--------------------------------------------------------------------------
    function displayChapters() {
        
        var myBook = document.createElement("div");
        $page.appendChild(myBook);

        //
        // construct the boo from its chapters
        //
        var totalBook = "\n\n";

        for(var i=0; i<maxChapter; i++) {
            totalBook += book[i];
        };
        //
        //  add an anchor that can be used later when jumping to chapters, for chapters that dont have this target natively
        //
        totalBook += "<a id='internalJumpAnchor' href'#'></a>";

        myBook.innerHTML = totalBook;
        
        //
        // map each image reference to its associated BLOB
        //
        map("img", "src", "jpg");
        map("img", "src", "jpeg");
        map("img", "src", "png");
        map("img", "src", "gif");

        map("image", "xlink:href", "png");
        map("image", "xlink:href", "jpg");
        map("image", "xlink:href", "jpeg");
        //
        //  map each href to its associated html page id
        //
        processAllAnchorTags();
        //
        // scroll the epub container to the top of the book
        //
        $epub_container.scrollIntoView("__start_of_book");
        //
        // list the book html on the console for debugging
        //
        //console.log("===================== Displayed HTML ===================== ");


        var message =
`----------------------------------------------------------------------
|                             
|                             Displayed HTML
|   
-----------------------------------------------------------------------`;
        if(debugEPUB) console.log(message);


        if(debugEPUB) console.log($page.innerHTML);
    };

    //--------------------------------------------------------------------------
    //
    //     Process all anchor tags
    //
    //--------------------------------------------------------------------------
    function processAllAnchorTags() {
        //var anchorArray = document.querySelectorAll("[xlink:href]");


        var anchorArray = document.querySelectorAll("a");
        if(debugEPUB) console.log("====================== Anchor Array ======================= ");
        if(debugEPUB) console.log("=== anchorArray = ",anchorArray);
        var cnt = anchorArray.length;
        for(var i=0; i<cnt; i++ ) {
            var a = anchorArray[i];
            var value = a.getAttribute("href");

            if(value) {
                var index = value.lastIndexOf("#");
                if(debugEPUB) console.log("=== Anchor href = ",value);
                var vv;
                var vn = "";        // currently not used
                if(index > 0) {
                    vv = value.slice(0,index);
                    vn = value.slice(index);
                } else {
                    if(index == 0) vv = value.slice(1,index);  
                    else vv = value;
                };
                if(debugEPUB) console.log("=== Value reference = ",vv);
                value = normalizeName(vv);
                if(debugEPUB) console.log("=== Normalized reference = ",value);
                if(debugEPUB) console.log("----------------------------------------");
                a.setAttribute("href","#"+value);
            };
        };
    };
    //--------------------------------------------------------------------------
    //
    // map each image scourse to its respective BLOB
    //
    //--------------------------------------------------------------------------
    function map(tag, attr, extention) {
        var imgArray = document.querySelectorAll(tag);

        for(var i = 0; i<imgArray.length; i++) {
            var image = imgArray[i];
            //console.log("==== image = ",image);
            var attrValue = image.getAttribute(attr);

            attrValue = attrValue.replace(/%20/g, " ");   // remove all "%20" and replace them with " "
            //console.log("=== attribute value = ",attrValue);

            var a1 = attrValue.split("/");
            var t0 = a1[a1.length-1];
            //var t0 = normalizeName(attrValue);

            if( t0.endsWith(extention) ) image.setAttribute(attr,imgObjs[t0]);
        };
    };
    //--------------------------------------------------------------------------
    //
    //  Select EPUB from your computer and unzip it
    //
    //--------------------------------------------------------------------------
    function onMyfileChange(fileInput) {
        if(fileInput.files[0] == undefined) {
            return;
        };
        //
        // fetch the epub and unzip it's files
        //
        var reader = new FileReader();
        reader.readAsArrayBuffer(fileInput.files[0]);

        reader.onload = function(ev) {
            unZip(ev.target.result);
        };
    };


    //--------------------------------------------------------------------------
    //
    //    unzip arrayBuffer
    //
    //--------------------------------------------------------------------------
    function unZip(myData) {
        //
        // remove previous book's images and pages from the HTML display
        //
        //while ($imgNode.firstChild) { $imgNode.firstChild.remove(); };
        while ($epub_container.firstChild) { $epub_container.firstChild.remove(); };
        //
        // now add a new 'page' div
        //
        var pp = document.createElement("div");
        pp.id = "page";
        $epub_container.appendChild(pp);
        $page = pp;
        $page.innerHTML = "";

        JSZip.loadAsync(myData)
        .then(function(zip) {

            message = 
`----------------------------------------------------------------------
|   The e-book is a zip file. The file paths for file names convey the 
|   directory file structure. 
-----------------------------------------------------------------------`;
            if(debugEPUB) console.log(message);

            if(debugEPUB) console.log("=== Zip = ",zip); // this is the zipped data for the epub
            //console.log(`-----------------------------------------------------------------------`);
            //
            // varables
            //
            zipItemCnt = 0;
            currentChapter = 0; 
            //$bookOverview.innerHTML = "None";

            chapterHTML = [];
            zipRawNamesArray = [];
            zipNamesArray = [];
            zipFileKeys = [];

            zipFiles = {};
            imageNames = [];
            book   = [];
            css    = [];
            misc   = [];
            opf    = [];
            ncx    = [];
            imgObjs= {};
            //
            // get each zip files name
            //
            zip.forEach(function (zipItem){
                zipRawNamesArray.push(zipItem);
                zipNamesArray.push(normalizeName(zipItem));
                zipItemCnt++;
            });

            message =
`----------------------------------------------------------------------
|   zipRawNamesArray is an array of keys. Each key includes a path
|   and a file name.
|   
|   zipNamesArray is an array of keys, where each key is only the
|   file name.
-----------------------------------------------------------------------`;
            if(debugEPUB) console.log(message);

            if(debugEPUB) console.log("=== Zip Raw Names Array = ",zipRawNamesArray);
            if(debugEPUB) console.log("=== Zip Names Array = ",zipNamesArray);

            for(var i=0; i<zipItemCnt; i++) {
                var name = zipRawNamesArray[i];

                if(name.endsWith(".html") || name.endsWith(".xhtml") || name.endsWith(".htm")) {
                    chapterHTML.push(name);
                } else 
                if(name.endsWith(".css")) {
                    css.push(name);
                } else
                if(name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".gif") ) {
                    imageNames.push(name);
                } else 
                if(name.endsWith(".opf")) {
                    opf.push(name);
                } else
                if(name.endsWith(".ncx")) {
                    ncx.push(name);
                } else {
                    misc.push(name);  // this contains everything not selected above
                };
            };

            maxChapter = chapterHTML.length;
            //
            //  uncompress all of the zip files
            //
            uncompressZip(0, zipItemCnt);

            function uncompressZip(i, max) {

                var file = zipRawNamesArray[i];

                if( file.indexOf(".") < 0 ) {
                    i++;
                    if(i<max) uncompressZip(i,max);
                } else
                zip.file(file).async("string").then(function(content) {
                    zipFiles[ zipNamesArray[i] ] = content;
                    i++;
                    if(i<max) uncompressZip(i,max);
                    else { 
                        message =
`----------------------------------------------------------------------
|   The e-book is uncompressed here into a javascript object (zipFiles).
|   The keys convey the directory file structure. 
-----------------------------------------------------------------------`;
                        if(debugEPUB) console.log(message);
                        if(debugEPUB) console.log("=== zipFiles = ",zipFiles)

                        processOPF(); 
                    };
                });
            };

            //
            // process the OPF
            //
            function processOPF() {
                message =
`----------------------------------------------------------------------
|   Now process the OPF to extract the spine and manifest. The spine 
|   has the manifest ids for the files in proper viewing order. Use
|   these ids to fetch hrefs from the manifest that can be used to 
|   fetch from the zipFiles the data to be viewed. These files 
|   compose the e-book.
|   1) the manifest requires Dom ids, its a DOM node
|   2) zipFiles require keys that are just names
|   3) the spine is an array of ids (spineIds)
|
|   The idea is to get an id from the spineIds array, then use that
|   id to find the coresponding manifest item, and from it get the
|   href, which can be normalized to get the appropriate ebook text from
|   the zipArray. To normalize means to use only the name part of the
|   path;
|
|   opfArray contains the file names of the OPF files in zip. There 
|   should only be one.
|
|   htmlOPF is a DOM node used to access the OPF
-----------------------------------------------------------------------`;
                if(debugEPUB) console.log(message);

                //if(debugEPUB) console.log("=== uncompressed = ",{zipFiles});
                if(debugEPUB) console.log("=== OPF array = ",opf);

                var opfFileName = opf[0];
                var name = normalizeName(opfFileName);
                if(debugEPUB) console.log("=== OPF filename = ",name);
                //
                // get content from the zipFile (all uncompressed files
                //)
                var content = zipFiles[name];                                
                if(debugEPUB) console.log("=== OPF content = ",content);
                //
                // the opf is html so put it into a DOM node so its elements can be accessed
                //
                var parser = new DOMParser();
                var htmlOPF = parser.parseFromString(content, "text/xml");
                //
                // retrieve the manifest from the OPF
                //
                var $manifest = htmlOPF.querySelector('manifest');
                //
                // get the spine from the OPF, do this by fetching its children
                //
                var spineChildren = htmlOPF.querySelector('spine').children;
                var spineIds  = [];
                if(debugEPUB) console.log(">>>>>> Spine Children = ",spineChildren);
                //
                // the spline has the css ids (in play order) for the book chapter uri's
                // in the manifest
                //
                for(var i=0; i<spineChildren.length; i++) {
                    //
                    // save the id in the spineIds array
                    //
                    spineIds[i] = spineChildren[i].attributes[0].nodeValue; // get idref then nodeValue
                    if(debugEPUB) console.log(">>> spineIds["+i+"] = ",spineIds[i]);
                    //
                    // using the spineId now get the attributes from the manifest item with that id
                    //
                    var manifestItem = htmlOPF.getElementById(spineIds[i]);
                    var manifestItemAttr = manifestItem.attributes;
                    if(debugEPUB) console.log(">>> manifest item = ",manifestItem);
                    if(debugEPUB) console.log(">>> manifest item attributes = ",manifestItemAttr);

                    var zipFileKey = manifestItemAttr.href.nodeValue;
                    if(debugEPUB) console.log(">>> Attr node value (zipKey) = ",zipFileKey);
                    //
                    // add the key to the zipFileKeys array
                    //
                    var nName = normalizeName(zipFileKey);
                    if(debugEPUB) console.log(">>> normalize key = ",nName);
                    zipFileKeys[i] = nName;
                    
                    var chapter = zipFiles[nName];
                    //
                    // if each chapter has HTML and Body tags the add only the body contents to the book
                    //
                    if(chapter) {
                        //
                        //  remove everything except the body
                        //
                        var totalStr = "";
                        var a1 = chapter.split("<body"); 
                        if(a1.length > 1) {
                            //var s1 = a1[0];  // string before the '<body'
                            var s2 = a1[1];  // string following the '<body'
                            var ii = s2.indexOf(">");
                            var s3 = s2.slice(ii+1);  // string after the trailing '>' of the '<body'
                            var a2 = s3.split("</body>"); 
                            var s4 = a2[0];  // string between '<body>' and '</body>'
                            chapter = s4;
                        }; 
                        //
                        // add a separator <hr> at the end of each chapter just for fun
                        //
                        book[i] = "<hr id='"+nName+"'>" + chapter;  // visible chapter separator - just for fun

                        if(debugEPUB) console.log("=== zipFile key = "+zipFileKeys[i]+" is a key in zipFiles");

                    } else if(debugEPUB) console.log("=== ERROR - zipFile key = "+zipFileKeys[i]+" is not a key in zipFiles");

                    if(debugEPUB) console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                };

                message =
`----------------------------------------------------------------------
|                             zipFileKeys
|   The zipFileKeys are the keys used to access the files in zipFile
|   
-----------------------------------------------------------------------`;
                if(debugEPUB) console.log(message);

                if(debugEPUB) console.log(">>> zip file keys = ",zipFileKeys);

                message =
`----------------------------------------------------------------------
|                             Book
|   Book consolidates all of the html for the book chapters in zipFile
|   
-----------------------------------------------------------------------`;
                if(debugEPUB) console.log(message);

                if(debugEPUB) console.log("=== Book = ",{book});

                //_____________________________________________________________________________________
                //
                // get the book's plot overview
                //
                //console.log("=========================================");

                var temp = htmlOPF.querySelector("description");
                if(temp) {
                    if(debugEPUB) console.log("=== Description = ",{temp});
                    if(debugEPUB) console.log(temp.textContent);
                    //$bookOverview.innerHTML = temp.textContent;
                };
                //console.log("=========================================");

                displayChapters();
            };
            //_____________________________________________________________________________________
            //
            // fetch the images in the epub (mostly cover art)
            //
            if(imageNames.length>0) {

                saveImageFiles(0, imageNames.length);

                function saveImageFiles(i, max) {
                    var iName = imageNames[i];       // these are raw names

                    zip.file(iName).async("blob").then(function(blob) {
                        var image_url = URL.createObjectURL(blob); // create an url for the image
                        //
                        // display the image(s)
                        //
                        // var iNode = document.createElement("img");
                        // iNode.src = image_url;  
                        // iNode.width = 125; 
                        // iNode.style.marginRight = "5px";
                        // $imgNode.appendChild(iNode);

                        var n1 = iName.split("/");
                        var n2 = n1[n1.length-1];
                        imgObjs[n2] = image_url;

                        if(debugEPUB) console.log("=== Cover Name "+i+" = ",n2);

                        i++;
                        if(i<max) saveImageFiles(i,max);
                        else {
                            if(debugEPUB) console.log("=========== image objects = ",imgObjs);
                        };
                    });
                };
            }; 
            //_____________________________________________________________________________________
            //
            //  process the CSS files and add them to the html
            //
            if(css.length>0) {
                for(var i=0; i<css.length; i++) {

                    zip.file(css[i]).async("string").then(function(content) {
                        //
                        // add css to the html
                        //
                        var element = document.createElement("style");
                        element.innerHTML = content;
                        //
                        // add the CSS style to 'page'
                        //
                        $page.appendChild(element);
                        
                        if(debugEPUB) console.log( "=== CSS "+i+" = ",{content} );
                    });
                };
            };
            //_____________________________________________________________________________________
        }).catch(function(err) {
            //console.error("Failed to open", filename, " as ZIP file");
            console.error("=== ERROR : ",err);
        });
    };

    // reader.onerror = function(err) {
    //     console.error("Failed to read file", err);
    // };

    //----------------------------------------------------------------------------------

};

