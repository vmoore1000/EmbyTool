

var modalHTML = `
<!-- The Modal -->
<div id="myModal" class="modal">
  <span class="close">&times;</span>

  <!-- Modal content -->
  <div id="content_node" class="modal-content">
  
  </div>
</div>
`;

var modal_1;

function myModal(mn) {
    //
    // remove any previous portal
    //
    while (mn.firstChild) { mn.firstChild.remove(); };
    //
    // add html
    //
    mn.innerHTML = modalHTML;

    // Get the modal
    let modal = document.getElementById("myModal");


    modal_1 = modal;

    //modal.style.display = "none";


    // Get the button that opens the modal
    //var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    // btn.onclick = function() {
    //     modal.style.display = "block";
    // };

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            //modal.style.display = "none";

        };
    };

    var cn = document.getElementById("content_node");    
    while (cn.firstChild) { cn.firstChild.remove(); };

    return cn;
};





