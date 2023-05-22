

var master_filter = []; 
var opp_array = [];
//var max_values = 42;

var testResults = [];

var filterProgressBarHTML = `
    Symbol Key, '=':equal, '>':greater than, '<':less than, 'S':starts with, 'E':ends with, 'C':contains
    <div>
        <button id="test_btn"       class="page_button">Test</button>
        <button id="apply_btn"      class="page_button">Apply</button>
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
    <input type="radio" id="matchAll" value = "all" name="matchType" > <span style="margin-right:10px">All Must Match</span>
    <input type="radio" id="matchOne" value = "one" name="matchType" > <span style="margin-right:10px">One or More Must Match</span>
    `;

var filterBarDelta;
var filterBarWidth;


function test_all(displayed_obj) {

    testResults = [];

    let totalCnt = displayed_obj.Items.length;

    let jj = 0;
    let temp1 = document.getElementById("myBar");
    let temp2 = document.getElementById("myBarLabel");
    //
    // prepare the progress bar
    //
    document.getElementById("progressBar").style.display = "block";
    temp1.style.width = "1%";  
    filterBarDelta = 100/totalCnt;
    filterBarWidth = 0;

    //console.log("=== displayed Obj = ",displayed_obj,", cnt"+cnt);

    //
    // get radio button checked  ("all" or "one")
    //
    var matchType = document.querySelector('input[name="matchType"]:checked').value;
    //console.log('=== match type = '+matchType);

    var itemCnt = 0;
    processBlock();
    //
    // cycle through all of the items in the folder
    //
    function processBlock() {
        let item = displayed_obj.Items[itemCnt];
        let url = server_url+"Users/"+user_id+"/Items/"+item.Id+"?Fields=MediaStreams,UserData&EnableUserData=true&api_key="+api_key;
        download(url, test_item);

        function test_item(data) {
            testResults[itemCnt] = customFilterTest(data, matchType);
            //
            // progress bar
            //
            filterBarWidth += filterBarDelta;
            if(filterBarWidth>100) filterBarWidth = 100;
            temp1.style.width = filterBarWidth.toFixed(0) + "%";
            temp2.innerHTML = (filterBarWidth*1).toFixed(0) + "%";

            itemCnt++;
            //console.log("=== total cnt = "+totalCnt+", itemCnt = "+itemCnt);

            if(itemCnt >= totalCnt) prev_page_btn(); else processBlock();            //  <-----------<<<<<<
        };
    };
};

function customFilterTest(item, matchType) {

    let item_value = getItemData(item);

    //console.log("=== item =",item,", item_value = ",item_value);

    let false_found = false;
    let true_found  = false;
    let max_values  = item_value.length;

    for(let i=0; i<max_values; i++) {

        if( master_filter[i] ) {
            let temp;
            //console.log("=== i="+i+", master = "+master_filter[i]+", item = "+item_value[i]+", type = "+(typeof item_value[i])+", opp "+opp_array[i]);

            if((typeof item_value[i] != "string")) {
                item_value[i] = item_value[i].toString();
            };

            item_value[i] = item_value[i].toLowerCase();
            master_filter[i] = master_filter[i].toLowerCase();

            var opp = opp_array[i];

            if(opp=="=") {
                temp = ( item_value[i] == master_filter[i] ) ? true : false;
            } else 
            if(opp==">") {
                temp = ( item_value[i] > master_filter[i] ) ? true : false;
            } else 
            if(opp=="<") {
                temp = ( item_value[i] < master_filter[i] ) ? true : false;
            } else 
            if(opp=="S") {
                temp = ( item_value[i].startsWith(master_filter[i]) ) ? true : false;
            } else 
            if(opp=="E") {
                temp = ( item_value[i].endsWith(master_filter[i]) ) ? true : false;
            } else 
            if(opp=="C") {
                temp = ( item_value[i].includes(master_filter[i]) ) ? true : false;
                //console.log("=== i="+i+", item = "+item_value[i],", master = "+master_filter[i]+", found = ",!false_found);
            }; 

            //console.log("]]]]]] i="+i+", item = "+item_value[i],", master = "+master_filter[i]+", match = ",temp);
            if(temp) true_found = true; else false_found = true;
        };
    };
    
    //console.log("=== Found = "+!false_found);

    if(matchType=="all") {
        return !false_found;
    } else {
        return true_found;
    };
};







// -----------------------------------------------------------------------------------------------
//
//
//
// -----------------------------------------------------------------------------------------------
function custom_filter (selected_items, displayed_obj) {

    //console.log("=== Custom Filter ===");

    //
    // put placeholder on the page queue
    //
    page_queue.push( displayed_obj );

    var bn = document.getElementById("button_node");
    
    while (bn.firstChild) { bn.firstChild.remove(); };

    if(selected_items.length == 0) if(displayed_obj.Items.length>0) {
                                        selected_items = ["0"];
                                    } else return;
    //
    //   add button html html
    //
    bn.innerHTML = filterProgressBarHTML;
    //
    //   page node
    //
    var dn = document.getElementById("page_node");
    while (dn.firstChild) { dn.firstChild.remove(); };
    //
    //   button event listeners
    //
    document.getElementById("test_btn").onclick       = function(){test()};
    document.getElementById("apply_btn").onclick      = function(){apply()};
    document.getElementById("prev_btn").onclick       = function(){prev()};
    document.getElementById("next_btn").onclick       = function(){next()};
    document.getElementById("save_btn").onclick       = function(){save()};
    document.getElementById("collection_btn").onclick = function(){collection()};
    document.getElementById("playlist_btn").onclick   = function(){playlist()};
    document.getElementById("clean_btn").onclick      = function(){clean()};
    //
    // hide unused buttons
    //
    document.getElementById("save_btn").style.display = "none";
    document.getElementById("collection_btn").style.display  = "none";
    document.getElementById("playlist_btn").style.display  = "none";
    document.getElementById("clean_btn").style.display  = "none";
    //
    // button event listener functions
    //
    function test() {
        console.log("___________ test Btn _____________");
        test();
        return;
    };
    function apply() {
        console.log("____________ apply Btn ______________");
        getFilterData();

        test_all(displayed_obj);

        applyCustomFilter = true;
        return;
    };
    function prev() {
        console.log("____________ prev Btn ______________");
        getFilterData();
        item_index--;
        if(item_index<0) item_index = max_index-1;

        filter(item_index);
        return;
    };
    function next() {
        console.log("____________ next Btn ______________");
        getFilterData();
        item_index++;
        if(item_index >= max_index) item_index = 0;

        filter(item_index);
        return;
    };
    function save() {
        console.log("___________ save Btn _____________");
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











    //console.log("=== displayed obj ",displayed_obj,",  selected items =",selected_items);



    //
    // hide the side bar
    //
    document.getElementById("side_node").style.display = "none";

    //var myBar      = document.getElementById("myBar");
    //var myBarLabel = document.getElementById("myBarLabel");

    document.getElementById("progressBar").style.display = "none";

    document.getElementById("matchAll").checked = true;








    var filterValueArray = [];
    var item_width = [];
    var item_name  = [];
    var item_value = [];
    var item_index = 0;
    var max_index  = selected_items.length;

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

    let max_values = item_name.length;

    if(master_filter.length==0) for(let i=0; i<max_values; i++) master_filter[i] = "";
    if(opp_array.length==0)     for(let i=0; i<max_values; i++) opp_array[i] = "=";
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
    item_width[0]  =  "g";
    item_width[1]  =  "d";
    item_width[2]  =  "d";
    item_width[3]  =  "d";
    item_width[4]  =  "d";
    item_width[5]  =  "d";   
    item_width[6]  =  "e";
    item_width[7]  =  "j";
    item_width[8]  =  "f";
    item_width[9]  =  "i";
    item_width[10] =  "g";
    item_width[11] =  "g";
    item_width[12] =  "f";
    item_width[13] =  "g";
    item_width[14] =  "g";
    item_width[15] =  "c";
    item_width[16] =  "g";
    item_width[17] =  "g";
    item_width[18] =  "g";  
    item_width[19] =  "e";
    item_width[20] =  "g";  
    item_width[21] =  "g";  
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
    item_width[32] =  "g";
    item_width[33] =  "g";
    item_width[34] =  "g";
    item_width[35] =  "g";
    item_width[36] =  "g";
    item_width[37] =  "g";
    item_width[38] =  "g";
    item_width[39] =  "d";
    item_width[40] =  "d";
    item_width[41] =  "d";



    var fn = document.createElement("DIV");
    dn.appendChild(fn);



    //.....................................................
    //
    // Test
    //
    function test() {
        getFilterData();
        let false_found = false;

        let max_values  = item_name.length;

        for(let i=0; i<max_values; i++) {

            document.getElementById("filter_row_"+i).style.backgroundColor = "gray";

            if( filterValueArray[i] ) {
                //console.log("=== i="+i+", filter = "+filterValueArray[i]+", item = "+item_value[i]+", type = "+(typeof item_value[i]));
                if((typeof item_value[i] != "string")) {
                    item_value[i] = item_value[i].toString();
                };

                var opp = opp_array[i];

                if(opp=="=") {
                    if( item_value[i].toLowerCase() == filterValueArray[i] ) {
                        document.getElementById("filter_row_"+i).style.backgroundColor = "green";
                    } else {
                        false_found = true;
                        document.getElementById("filter_row_"+i).style.backgroundColor = "red";
                    };
                } else 
                if(opp==">") {
                    if( item_value[i].toLowerCase() > filterValueArray[i] ) {
                        document.getElementById("filter_row_"+i).style.backgroundColor = "green";
                    } else {
                        false_found = true;
                        document.getElementById("filter_row_"+i).style.backgroundColor = "red";
                    };
                } else 
                if(opp=="<") {
                    if( item_value[i].toLowerCase() < filterValueArray[i] ) {
                        document.getElementById("filter_row_"+i).style.backgroundColor = "green";
                    } else {
                        false_found = true;
                        document.getElementById("filter_row_"+i).style.backgroundColor = "red";
                    };
                } else 
                if(opp=="S") {
                    if( item_value[i].toLowerCase().startsWith(filterValueArray[i]) ) {
                        document.getElementById("filter_row_"+i).style.backgroundColor = "green";
                    } else {
                        false_found = true;
                        document.getElementById("filter_row_"+i).style.backgroundColor = "red";
                    };    
                } else 
                if(opp=="E") {
                    if( item_value[i].toLowerCase().endsWith(filterValueArray[i]) ) {
                        document.getElementById("filter_row_"+i).style.backgroundColor = "green";
                    } else {
                        false_found = true;
                        document.getElementById("filter_row_"+i).style.backgroundColor = "red";
                    };
                } else 
                if(opp=="C") {
                    if( item_value[i].toLowerCase().includes(filterValueArray[i]) ) {
                        document.getElementById("filter_row_"+i).style.backgroundColor = "green";
                    } else {
                        false_found = true;
                        document.getElementById("filter_row_"+i).style.backgroundColor = "red";
                    };
                }; 
            };
        };
    };
    //.....................................................
   
    //.....................................................

    filter(item_index);

    //.....................................................

    function filter(ii) {
        //console.log("=== index = "+ii);

        let index = parseInt(selected_items[ii]);
        let item = displayed_obj.Items[index];

        let url = server_url+"Users/"+user_id+"/Items/"+item.Id+"?Fields=MediaStreams,UserData&EnableUserData=true&api_key="+api_key;
        download(url, filter_item);
    };
        
    // -----------------------------------------------------------------------------------------------
    //                  Filter one Item
    // -----------------------------------------------------------------------------------------------
    function filter_item(item_data) {
        //console.log("=== Filter item_data ",item_data);

        while (fn.firstChild) { fn.firstChild.remove(); };

        //.....................................................
        //
        // Collect Data from Emby object
        //
        item_value = getItemData(item_data);
        //console.log("=== item values = ",item_value);

        fn.style.backgroundColor = "gray";
        fn.style.color = "white";

        // fn.appendChild( document.createElement("BR") );  

        
        //.....................................................
        //
        // Add Image
        //
        let img_div = document.createElement("DIV");
        //img_div.id = "globalImgArea";
        //img_div.style.display = "inline-block";
        img_div.style.float = "left";
        // get the image
        let img_url = server_url+"Items/"+item_data.Id+
        "/Images/Primary?"+
        "maxHeight=300"+
        "&maxWidth=200"+
        "&tag="+item_data.ImageTags.Primary+
        "&quality=90";
        let iNodeImg = addImage(img_url, "100", "globalImgId");
        img_div.appendChild(iNodeImg);

        fn.appendChild(img_div);

        //.....................................................
        //
        // Add Title
        //

        let y2_div = document.createElement("DIV");
        y2_div.style.textAlign = "center";
        let y2 = document.createElement("LABEL");
        y2.innerHTML = "<span id='page_title'>Custom Filter</span>";
        y2_div.appendChild(y2);
        

        fn.appendChild(y2_div);


        //............................................
        //
        //
        //
        //............................................
        let df_1 = new DocumentFragment();

        //df_1.appendChild( document.createElement("BR") );
        let max_values  = item_name.length;

        let tb = document.createElement("TABLE");
        tb.style.clear = "both";
        //tb.className    = "tb_values";
        let rowCnt = 0;

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

            let key = "a"; 
            let val = item_value[i]; 

            td_2.appendChild(makeTD(key, val));
            tr.appendChild(td_2);
            //--------------------------------------------
            //
            //  Col 3
            //
            let td_3 = document.createElement("TD");
            td_3.style.width = "30px";

            if(item_name[i] != "") td_3.appendChild(math_op(opp_array[i], i));

            tr.appendChild(td_3);
            //--------------------------------------------
            //
            //  Col 4
            //
            let td_4 = document.createElement("TD");
            td_4.style.width = "280px";

            let key4 = item_width[i];
            let val4 = master_filter[i]; 

            td_4.appendChild(makeTD(key4, val4, i));

            tr.appendChild(td_4);
            //--------------------------------------------
            df_1.appendChild(tb);
        };

        fn.appendChild(df_1);    // add the document fragment to the DOM

        test();

        // -----------------------------------------------------------------------------------------------
        function math_op(val,i,value) {
            let x = document.createElement("SELECT");
            x.appendChild(addOption("="));
            x.appendChild(addOption(">"));
            x.appendChild(addOption("<"));
            x.appendChild(addOption("S"));
            x.appendChild(addOption("E"));
            x.appendChild(addOption("C"));
            x.id = "opp_"+i;
            x.value = val;

            return x;
        };

        // -----------------------------------------------------------------------------------------------
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
                x.setAttribute("size", "30");
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



            if(index>=0) {
                x.id = "value_"+index;
                //console.log("=== id = "+x.id+", key = "+key);
            };

            return x;
        };

        // -----------------------------------------------------------------------------------------------
        function addOption( value) {
            let y = document.createElement("option");
            y.setAttribute("value", value);
            y.innerText = value;
            return y;
        };

        // -----------------------------------------------------------------------------------------------
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
    // -----------------------------------------------------------------------------------------------
    function getFilterData (){
        //console.log("=== Get Data === ");
        let max_values  = item_name.length;

        for(let i=0; i<max_values; i++) {
            let temp = document.getElementById("value_"+i); 
            master_filter[i] = (temp.value) ? temp.value : "";
            if(temp) {
                let val  = temp.value;
                //let name = item_name[i];
                //console.log("=== "+name+" - "+val);
                if(val) filterValueArray[i] = val.toLowerCase();
                   else filterValueArray[i] = val;
            }; 
            temp = document.getElementById("opp_"+i); 
            if(temp) opp_array[i] = temp.value;
        };
        //console.log("=== filter Value Array = ",filterValueArray);
        //console.log("=== item Value Array   = ",item_value);
    };
};

//.....................................................
function metadataDate(d) {
    let t = d.split("T");
    return t[0];
};
//.....................................................
//
// Collect Data from Emby object
//
function getItemData(item_data) {
    let item_value = [];

    item_value[0]  = (item_data.Path) ? item_data.Path : "";
    item_value[1]  = (item_data.OriginalTitle) ? item_data.OriginalTitle : "No Original Title";                      
    item_value[2]  = (item_data.Name)     ? item_data.Name : "No Title";                    
    item_value[3]  = (item_data.SortName) ? item_data.SortName : "No Sort Name";
    item_value[4]  = (item_data.Taglines && item_data.Taglines[0]) ? item_data.Taglines[0] : "No Tag Line";
    item_value[5]  = (item_data.Overview) ? item_data.Overview : "No Overview";
    item_value[6]  = (item_data.OfficialRating)    ? item_data.OfficialRating : "No Parental Rating";     // parental rating  
    item_value[7]  = (item_data.CommunityRating)   ? item_data.CommunityRating : "No Community Rating";                       
    item_value[8]  = (item_data.PremiereDate)      ? metadataDate(item_data.PremiereDate) : "No Release Date";   
    item_value[9]  = (item_data.ProductionYear)    ? item_data.ProductionYear : "No Production Year";                 
    item_value[10] = (item_data.ProviderIds)  ? item_data.ProviderIds.Imdb : "No Value";
    item_value[11] = (item_data.ProviderIds)  ? item_data.ProviderIds.Tmdb : "No Value";
    item_value[12] = (item_data.DateCreated)       ? metadataDate(item_data.DateCreated) : "No Date";
    item_value[13] = (item_data.LocalTrailerCount) ? item_data.LocalTrailerCount : "0";             
    item_value[14] = (item_data.RemoteTrailers) ? item_data.RemoteTrailers.length : "0";            
    item_value[15] = (item_data.IsFolder)       ? item_data.IsFolder : "false";
    item_value[16] = (item_data.Width)        ? item_data.Width  : "0";                             
    item_value[17] = (item_data.Height)       ? item_data.Height : "0";                             
    item_value[18] = (item_data.Container)    ? item_data.Container : "NA";
    item_value[19] = (item_data.CustomRating) ? item_data.CustomRating : "No Custom Rating";                        
    item_value[20] = (item_data.RunTimeTicks) ? ((item_data.RunTimeTicks/10000000)/60).toFixed(0) : "No Value";    // one tick is 10 microseconds
    item_value[21] = (item_data.Size)         ? (item_data.Size/1000000).toFixed(0) : "No Value";

    let lock_array = (item_data.LockedFields) ? item_data.LockedFields : []; // ['Name', 'OfficialRating', 'Genres', 'Cast', 'Studios', 'Tags', 'Overview']

    item_value[22] = (lock_array.indexOf("Name")<0)           ? "Unlocked" : "Locked";
    item_value[23] = (lock_array.indexOf("OfficialRating")<0) ? "Unlocked" : "Locked";
    item_value[24] = (lock_array.indexOf("Genres")<0)         ? "Unlocked" : "Locked";
    item_value[25] = (lock_array.indexOf("Cast")<0)           ? "Unlocked" : "Locked";
    item_value[26] = (lock_array.indexOf("Studios")<0)        ? "Unlocked" : "Locked";
    item_value[27] = (lock_array.indexOf("Tags")<0)           ? "Unlocked" : "Locked";
    item_value[28] = (lock_array.indexOf("Overview")<0)       ? "Unlocked" : "Locked";
    item_value[29] = (item_data.LockData) ? item_data.LockData : false;
    item_value[30] = item_data.UserData.IsFavorite;
    item_value[31] = item_data.UserData.Played;

    if(item_data.MediaStreams) {

        let temp = "";
        if (item_data.MediaStreams[0] && item_data.MediaStreams[0].RealFrameRate) {
            temp = ""+item_data.MediaStreams[0].RealFrameRate.toFixed(0);
        };
        item_value[32] = temp;

        let jj = 6; //item_data.MediaStreams.length;
        let kk = 33;
        for(let ii=0; ii<jj; ii++) {
            //item_value[kk+ii] = item_data.MediaStreams[ii].DisplayTitle + ", ["+item_data.MediaStreams[ii].Codec+"]";
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





    return item_value;
};




