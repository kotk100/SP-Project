document.addEventListener("DOMContentLoaded", function(event) {
    //add event listeners
    var elements = document.getElementsByClassName('exchange');
    for(var i = 0; i < elements.length; i++)
        elements[i].addEventListener('click', doExchange);

    elements = document.getElementsByClassName('replace');
    for(var i = 0; i < elements.length; i++)
        elements[i].addEventListener('click', doReplace);

    elements = document.getElementsByClassName('remove');
    for(var i = 0; i < elements.length; i++)
        elements[i].addEventListener('click', doRemove);

    elements = document.getElementsByClassName('removeMenu');
    for(var i = 0; i < elements.length; i++)
        elements[i].addEventListener('click', doRemoveMenu);

    elements = document.getElementsByClassName('showDrop');
    for(var i = 0; i < elements.length; i++)
        elements[i].addEventListener('click', showDropdown);

    var element = document.getElementById('newLecture');
    element.addEventListener('click', doInsert);
});

function showDropdown(event) {
    event.target.parentElement.parentElement.getElementsByClassName('dropdown-content')[0].classList.toggle('show');
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
    //Send request to server
    l.className = l.className.replace(/ c[0-8] /g, ' ');

    while (l.firstChild) {
        l.removeChild(l.firstChild);
    }
}

var days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
function getLecturesForCourse(event, callback){
    var course = event.target.getAttribute('data-course');
    var timetable = document.getElementById('courseTimetable');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var lectures = JSON.parse(this.responseText).lectures;
            var i = 0;

            while (timetable.firstChild) {
                timetable.removeChild(timetable.firstChild);
            }

            for (var day = 0; day < 5; day++) {
                var hour = 7;
                var el = document.createElement('div');
                el.className = 'col-2-1';

                var d = document.createElement('div');
                d.appendChild(document.createTextNode(days[day]));
                d.className = 'day';
                el.appendChild(d);

                while (hour < 19) {
                    var lecture = document.createElement('div');
                    lecture.className = 'lecture lh-';

                    if (lectures[i] && lectures[i].day == day) {
                        if(lectures[i].start != hour) {
                            lecture.className += lectures[i].start - hour;
                            el.appendChild(lecture);
                            lecture = document.createElement('div');
                            lecture.className = 'lecture lh-';
                        }
                        hour = lectures[i].start + lectures[i].duration;

                        lecture.className += lectures[i].duration + ' c7';
                        lecture.setAttribute('data-lecture', lectures[i].id);
                        lecture.addEventListener('click', function(event) {
                            return callback(event.target.getAttribute('data-lecture'));
                        });

                        var t = document.createElement('p');
                        t.className = 'title';
                        t.appendChild(document.createTextNode(lectures[i].name));
                        lecture.appendChild(t);

                        t = document.createElement('p');
                        t.className = 'detail enlarge';
                        t.appendChild(document.createTextNode(lectures[i].start + ':00-' + hour + ':00 ' + lectures[i].location + ' '));
                        lecture.appendChild(t);

                        t = document.createElement('p');
                        t.className = 'detail';
                        t.appendChild(document.createTextNode(lectures[i].instructor));
                        lecture.appendChild(t);

                        i++;
                    } else {
                        lecture.className += 19-hour;
                        hour = 19;
                    }

                    el.appendChild(lecture);
                }
                timetable.appendChild(el);
            }
        }
    };

    xhttp.open("GET", "http://zbudim.se/data/courses/"+ course +"/lectures.json", true);
    xhttp.send();
}


function showCourseSelection(callback){
    document.getElementById('courseSelect').style['display'] = 'flex';
    var courseList = document.getElementById('courseSelectList');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var courses = JSON.parse(this.responseText).courses;

            for (var i = 0; i < courses.length; i++) {
                var course = document.createElement('li');
                course.setAttribute('data-course', courses[i].id);
                course.appendChild(document.createTextNode(courses[i].name));

                course.addEventListener('click', function(event) { getLecturesForCourse(event, callback); });

                courseList.appendChild(course);
            }
        }
    };

    xhttp.open("GET", "http://zbudim.se/data/courses.json", true);
    xhttp.send();
}

var courses;
function searchCousrses(input) {
    if(!courses)
        courses = document.getElementById('courseSelectList').getElementsByTagName('li');

    searchVal = input.value.toLowerCase();

    for (var i = 1; i < courses.length; i++) {
        if (!searchVal || courses[i].textContent.toLowerCase().indexOf(searchVal) > -1) {
            courses[i].style['display'] = 'list-item';
        }
        else {
            courses[i].style['display'] = 'none';
        }
    }
};

function doExchange(event){
    showCourseSelection(function(lectureId) {
        confirm('If or when you are matched with another person, you will recieve an email informing you.');
        window.location.reload();
    });
}

function promptDelete(){
    window.confirm("Are you sure you want to remove the lecture from your timetable?");
}

function doReplace(event){
    window.confirm("Are you sure you want to replace the lecture from your timetable? This will remove the selected lecture");
    deleteLecture(event.target.parentElement.parentElement.parentElement.parentElement);
    showCourseSelection(function(lectureId) {
        window.location.reload();
    });
}

function doRemove(event){
    promptDelete();
    deleteLecture(event.target.parentElement.parentElement);
}

function doRemoveMenu(event){
    promptDelete();
    deleteLecture(event.target.parentElement.parentElement.parentElement.parentElement);
}

function doInsert(event){
    showCourseSelection(function(lectureId) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                //TODO send to server
                //if(this.status != 200)
                confirm('Course added!\n This page will now refresh');
                window.location.reload();
            }

        };
        xhttp.open("POST", "http://www.zbudim.se/somePath", true);
        xhttp.send();
    });
}