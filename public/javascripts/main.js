function showDropdown(dp) {
    dp.parentElement.getElementsByClassName('dropdown-content')[0].classList.toggle('show');
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function deleteLecture(l){
    if(window.confirm("Are you sure you want to remove the lecture from your timetable?")){
        //Send request to server
        l.className = l.className.replace(/ c[0-8] /g, ' ');

        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
    }
}
