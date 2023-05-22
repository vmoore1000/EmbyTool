

// GeekProbin
//https://github.com/prabinmagar/movie-search-app-using-omdb-api-vanilla-js-project


var omdbHTML = `
<div class = "wrapper">
    <div id="omdbMovieBtn" style="display:inline-block">
        <button id="saveMovieBtn"   type="button" class="omdbButton" style="margin-right:5px; margin-top:10px">Save Img as Primary</button>
        <button id="metaMovieBtn"   type="button" class="omdbButton" style="margin-right:5px; margin-top:10px">Save Img and Metadata</button>
    </div>   
    <button id="cancelMovieBtn" type="button" class="omdbButton" style="margin-right:5px; margin-top:10px">Cancel</button>

    <!-- search container -->
    <div class = "search-container">
        <div class = "search-element">
            <h3>Search String:</h3>
            <!--  
            <input type = "text" class = "form-control" placeholder="Search Movie Title ..." id = "movie-search-box" onkeyup="findMovies2()" onclick = "findMovies2()">
            -->
            <input type = "text" class = "form-control" placeholder="Search Movie Title ..." id = "movie-search-box">


            <div class = "search-list" id = "search-list">
                <!-- list here -->
            </div>
        </div>
    </div>
    <!-- end of search container -->

    <!-- result container -->
    <div class = "container">
        <div class = "result-container">
            <div class = "result-grid" id = "result-grid">
                <!-- movie information here -->
            </div>
        </div>
    </div>
    <!-- end of result container -->
</div>
 

<style>

:root{
    --md-dark-color: #1d1d1d;
    --dark-color: #171717;
    --light-dark-color: #292929;
    --yellow-color: #d4aa11;
}
/*--------------------------------------------*/
.wrapper{
    min-height: 90vh;
    background-color: var(--dark-color);
}
.wrapper .container{
    max-width: 900px;
    margin: 0 auto;
    padding: 0 1rem;
}
.search-container{
    background-color: var(--md-dark-color);
    height: 180px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
}

.search-element{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: stretch;
        -ms-flex-align: stretch;
            align-items: stretch;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    position: relative;
}
.search-element h3{
    -ms-flex-item-align: center;
        align-self: center;
    margin-right: 1rem;
    font-size: 2rem;
    color: #fff;
    font-weight: 500;
    margin-bottom: 1.5rem;
}
.search-element .form-control{
    padding: 1rem 2rem;
    font-size: 1.4rem;
    border: none;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    outline: none;
    color: var(--light-dark-color);
    width: 350px;
}
.search-list{
    position: absolute;
    right: 0;
    top: 100%;
    max-height: 500px;
    overflow-y: scroll;
    z-index: 10;
}
.search-list .search-list-item{
    background-color: var(--light-dark-color);
    padding: 0.5rem;
    border-bottom: 1px solid var(--dark-color);
    width: calc(350px - 8px);
    color: #fff;
    cursor: pointer;
    -webkit-transition: background-color 200ms ease;
    -o-transition: background-color 200ms ease;
    transition: background-color 200ms ease;
}
.search-list .search-list-item:Hover{
    background-color: #1f1f1f;
}
.search-list-item{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
}
.search-item-thumbnail img{
    width: 40px;
    margin-right: 1rem;
}
.search-item-info h3{
    font-weight: 600;
    font-size: 1rem;
}
.search-item-info p{
    font-size: 0.8rem;
    margin-top: 0.5rem;
    font-weight: 600;
    opacity: 0.6;
}

/* thumbnail */
.search-list::-webkit-scrollbar{
    width: 8px;
}
.search-list::-webkit-scrollbar-track{
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.search-list::-webkit-scrollbar-thumb{
    background-color: var(--yellow-color);
    outline: none;
    border-radius: 10px;
}

/* js related class */
.hide-search-list{
    display: none;
}

/* movie result */
.result-container{
    padding: 3rem 0;
}
.movie-poster img{
    max-width: 300px;
    margin: 0 auto;
    border: 4px solid #fff;
}
.movie-info{
    text-align: center;
    color: #fff;
    padding-top: 3rem;
}

/* movie info stylings */
.movie-title{
    font-size: 2rem;
    color: var(--yellow-color);
}
.movie-misc-info{
    list-style-type: none;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    padding: 1rem;
}
.movie-info .year{
    font-weight: 500;
}
.movie-info .rated{
    background-color: var(--yellow-color);
    padding: 0.4rem;
    margin: 0 0.4rem;
    border-radius: 3px;
    font-weight: 600;
}
.movie-info .released{
    font-size: 0.9rem;
    opacity: 0.9;
}
.movie-info .writer{
    padding: 0.5rem;
    margin: 1rem 0;
}
.movie-info .genre{
    background-color: var(--light-dark-color);
    display: inline-block;
    padding: 0.5rem;
    border-radius: 3px;
}
.movie-info .plot{
    max-width: 400px;
    margin: 1rem auto;
}
.movie-info .language{
    color: var(--yellow-color);
    font-style: italic;
}
.movie-info .awards{
    font-weight: 300;
    font-size: 0.9rem;
}
.movie-info .awards i{
    color: var(--yellow-color);
    margin: 1rem 0.7rem 0 0;
}

@media(max-width: 450px){
    .search-element .form-control{
        width: 90%;
        margin: 0 auto;
        padding: 0.5rem 1rem;
    }
    .search-element h3{
        font-size: 1.4rem;
    }
    .search-list{
        width: 90%;
        right: 50%;
        -webkit-transform: translateX(50%);
            -ms-transform: translateX(50%);
                transform: translateX(50%);
    }
    .search-list .search-list-item{
        width: 100%;
    }
    .movie-misc-info{
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
    }
    .movie-misc-info li:nth-child(2){
        margin: 0.8rem 0;
    }
}

@media(min-width: 800px){
    .search-element{
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
            -ms-flex-direction: row;
                flex-direction: row;
    }
    .search-element h3{
        margin-bottom: 0;
    }
    .result-grid{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
    .movie-info{
        text-align: left;
        padding-top: 0;
    }
    .movie-info .movie-misc-info{
        -webkit-box-pack: start;
            -ms-flex-pack: start;
                justify-content: flex-start;
        padding-left: 0;
    }
    .movie-info .plot{
        margin-left: 0;
    }
    .movie-info .writer{
        padding-left: 0;
        margin-left: 0;
    }
}

.omdbButton {
    width:       200px;
    height:       35px;
    margin-left:  10px;
    margin-bottom: 5px;
    margin-top:    5px;
    border-radius: 4px;
    font-size:    16px;
    text-align: center;
    display: inline-block;
    background-color: blue;
    color: white;
    cursor: pointer;
    }
    .bigButton:hover {
    background-color: lightblue;
    color: black;
    }
</style>
`;


function omdb(sString, item_data, callback, mn){
    //console.log("=================================================");
    //console.log("=== Search String = ",sString);
    //console.log("=== item data = ",item_data);

    //let pn = document.getElementById("page_node");
    //------------------------------------------------------------------
    //while (pn.firstChild) { pn.firstChild.remove(); };

    if(mn) {
        mn.innerHTML = omdbHTML;
        modal_1.style.display = "none";
    } else
        modal_1.style.display = "none";

    //------------------------------------------------------------------
    var omdb_key       = omdbId;   // OMDB API Key
    var movieSearchBox = document.getElementById('movie-search-box');
    var searchList     = document.getElementById('search-list');
    var resultGrid     = document.getElementById('result-grid');

    movieSearchBox.onkeyup = function(){findMovies()};
    movieSearchBox.onclick = function(){findMovies()};

    document.getElementById("saveMovieBtn").onclick   = function(){saveMovieBtn()  };
    document.getElementById("metaMovieBtn").onclick   = function(){saveMetaBtn()  };
    document.getElementById("cancelMovieBtn").onclick = function(){cancelMovieBtn()};

    document.getElementById("omdbMovieBtn").style.display = "none";  
    //------------------------------------------------------------------
    movieSearchBox.value = sString; 
    movieSearchBox.click();
    //------------------------------------------------------------------
    
    var movieDetails;

    //------------------------------------------------------------------
    function saveMovieBtn() {
        console.log("=== save as Primary ===");
        if(movieDetails.Poster) uploadImage(movieDetails.Poster, item_data.Id, "Primary");

        modal_1.style.display = "none";
    };

    function saveMetaBtn() {
        console.log("=== save img & metadata ===");
        saveMetaData();
        saveMovieBtn();
    };

    function cancelMovieBtn() {
        console.log("=== cancel ===");

        modal_1.style.display = "none";


        if(callback) callback();
    };
    //------------------------------------------------------------------
    function findMovies(){
        console.log("=== findMovies 1 ===",searchList);

        let searchTerm = (movieSearchBox.value).trim();   
        console.log("=== findMovies 2 ===",searchTerm);


        if(searchTerm.length > 0){
            searchList.classList.remove('hide-search-list');
            loadMovies(searchTerm);
        } else {
            searchList.classList.add('hide-search-list');
        };
    };

    //------------------------------------------------------------------
    // load movies from API
    async function loadMovies(searchTerm){
        console.log("=== loadMovies ===",searchTerm);
        //
        // &type=movie       (movie, series, episode)
        //
        const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&type=${item_data.Type}&apikey=${omdb_key}`;
        console.log("=== movie url = ",URL);
        const res = await fetch(`${URL}`);
        const data = await res.json();

        console.log("== movie data = ",data);

        if(data.Response == "True") displayMovieList(data.Search);
    };

    //------------------------------------------------------------------
    function displayMovieList(movies){
        console.log("=== displayMovieList ===",movies);

        searchList.innerHTML = "";
        for(let idx = 0; idx < movies.length; idx++){
            let movieListItem = document.createElement('div');
            movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
            movieListItem.classList.add('search-list-item');
            if(movies[idx].Poster != "N/A")
                moviePoster = movies[idx].Poster;
            else 
                moviePoster = getDefaultImage(); 

            movieListItem.innerHTML = `
            <div class = "search-item-thumbnail">
                <img src = "${moviePoster}">
            </div>
            <div class = "search-item-info">
                <h3>${movies[idx].Title}</h3>
                <p>${movies[idx].Year}</p>
            </div>
            `;
            searchList.appendChild(movieListItem);
        };
        loadMovieDetails();
    };

    //------------------------------------------------------------------
    function loadMovieDetails(){
        const searchListMovies = searchList.querySelectorAll('.search-list-item');
        console.log("=== loadMovieDetails ===",searchListMovies);

        searchListMovies.forEach(movie => {

            movie.addEventListener('click', async () => {
                // console.log(movie.dataset.id);
                searchList.classList.add('hide-search-list');
                movieSearchBox.value = "";
                const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=${omdb_key}`);
                const movieDetails = await result.json();
                console.log("=== Movie details = ",movieDetails);
                displayMovieDetails(movieDetails);
            });
        });
    };

    //------------------------------------------------------------------
    function displayMovieDetails(details){
        console.log("=== displayMovieDetails ===",details);
        document.getElementById("omdbMovieBtn").style.display = "inline-block";   // hidden | visible

        movieDetails = details;

        resultGrid.innerHTML = `
        <div class = "movie-poster">
            <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
        </div>
        <div class = "movie-info">
            <h3 class = "movie-title">${details.Title}</h3>
            <ul class = "movie-misc-info">
                <li class = "year">Year: ${details.Year}</li>
                <li class = "rated">Ratings: ${details.Rated}</li>
                <li class = "released">Released: ${details.Released}</li>
            </ul>
            <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
            <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
            <p class = "actors"><b>Actors: </b>${details.Actors}</p>
            <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
            <p class = "language"><b>Language:</b> ${details.Language}</p>
            <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
        </div>
        `;
    };

    //------------------------------------------------------------------
    function saveMetaData(){
        //item_data.OriginalTitle     = 

        item_data.Name              = movieDetails.Title;
        item_data.OfficialRating    = movieDetails.Rated;
        item_data.Genres            = movieDetails.Genre.split(",");
        item_data.Taglines          = [ movieDetails.Awards ];
        item_data.Overview          = movieDetails.Plot;       // string
        item_data.DateCreated       = movieDetails.Released;   // "22 Dec 2021"
        item_data.CommunityRating   = movieDetails.imdbRating; // 7.4
        item_data.ProviderIds.Imdb  = movieDetails.imdbID;

        //item_data.PremiereDate      = movieDetails.Year;
        //item_data.ProductionYear    = movieDetails.Year;
        //item_data.ProviderIds.Tmdb  = 
        //item_data.CustomRating      = 

        console.log("=== Save Metadata = ",item_data,", movie details = ",movieDetails);
    };

    //------------------------------------------------------------------
    function uploadImage(image_url, originalId, imageType) {

        fetchData();

        async function fetchData() {
            const res = await fetch(image_url);
            const contentType = res.headers.get('Content-Type');
            const raw = await res.blob();
            const image = await createImageBitmap(raw);

            let imgWidth    = image.width;
            let imgHeight   = image.height;
            let aspectRatio = originalAR = imgWidth / imgHeight;
            
            let myCanvas = document.createElement('CANVAS');
            ctx = myCanvas.getContext("2d");
    
            myCanvas.width = 400;
            myCanvas.height = myCanvas.width / aspectRatio;
            ctx.drawImage(image, 0, 0, myCanvas.width, myCanvas.height);
    
            let iURL = myCanvas.toDataURL('image/jpeg',1.0);  
            //let tempImage = document.createElement("img");
            //tempImage.src = iURL;

            let temp = iURL.split("base64,");
            let imageData = temp[1];

            upload_image_file (imageData, originalId, OK, imageType);

            function OK(data){
                console.log("=== Image Upload OK ",data);
                //
                // remove temp data on the page_queue
                //
                //page_queue.pop();
                //page_queue.pop();

                if(callback) callback();
            };
        };
    };
};


function upload_image_file (data_1, originalId, callback, imageType) {
    console.log("=== Image Data = ",data_1);

    let image_url = server_url+"Items/"+originalId+"/Images/"+imageType+"?"+
    "X-Emby-Client=Emby Web"+
    "&X-Emby-Device-Name=Chrome"+
    //"&X-Emby-Device-Id="+deviceId+
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





