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

    var element = document.getElementById('search');
    element.addEventListener('keyup', searchCousrses);
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
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 204) {
            l.className = l.className.replace(/ c[0-8] /g, ' ');

            while (l.firstChild) {
                l.removeChild(l.firstChild);
            }
        }
    };
    //send request to server
    xhttp.open("DELETE", "http://localhost:3000/lecture/" + l.getAttribute('data-lecture'), true);
    xhttp.send();
}

var days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
function getLecturesForCourse(event, callback, idSubject){
    var course = idSubject ? idSubject : event.target.getAttribute('data-subject');
    var timetable = document.getElementById('courseTimetable');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var lectures = JSON.parse(this.responseText);
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

                while (hour < 21) {
                    var lecture = document.createElement('div');
                    lecture.className = 'lecture lh-';

                    if (lectures[i] && lectures[i].day == day) {
                        var start = parseInt(lectures[i].startTime.substring(0,2));
                        if(start != hour) {
                            lecture.className += start - hour;
                            el.appendChild(lecture);
                            lecture = document.createElement('div');
                            lecture.className = 'lecture lh-';
                        }
                        hour = start + lectures[i].duration;

                        lecture.className += lectures[i].duration + ' c7';
                        lecture.setAttribute('data-lecture', lectures[i].idLecture);
                        lecture.addEventListener('click', function(event) {
                            return callback(event.target.getAttribute('data-lecture') || event.target.parentElement.getAttribute('data-lecture'));
                        });

                        var t = document.createElement('p');
                        t.className = 'title';
                        t.appendChild(document.createTextNode(lectures[i]['Subject.subjectName']));
                        lecture.appendChild(t);

                        t = document.createElement('p');
                        t.className = 'detail enlarge';
                        t.appendChild(document.createTextNode(start + ':00-' + hour + ':00 ' + lectures[i].location + ' '));
                        lecture.appendChild(t);

                        t = document.createElement('p');
                        t.className = 'detail';
                        t.appendChild(document.createTextNode(lectures[i]['Lecturer.lecturerName']));
                        lecture.appendChild(t);

                        i++;
                    } else {
                        lecture.className += 21-hour;
                        hour = 21;
                    }

                    el.appendChild(lecture);
                }
                timetable.appendChild(el);
            }
        }
    };

    xhttp.open("GET", "http://localhost:3000/lecture/" + course, true);
    xhttp.send();
}


function showCourseSelection(callback){
    document.getElementById('courseSelect').style['display'] = 'flex';
    var courseList = document.getElementById('courseSelectList');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var courses = JSON.parse(this.responseText);

            for (var i = 0; i < courses.length; i++) {
                var course = document.createElement('li');
                course.setAttribute('data-subject', courses[i].idSubject);
                course.appendChild(document.createTextNode(courses[i].longName));

                course.addEventListener('click', function(event) { getLecturesForCourse(event, callback); });

                courseList.appendChild(course);
            }
        }
    };

    xhttp.open("GET", "http://localhost:3000/lecture/", true);
    xhttp.send();
}

var courses;
function searchCousrses(input) {
    if(!courses)
        courses = document.getElementById('courseSelectList').getElementsByTagName('li');

    searchVal = input.value.toLowerCase();

    for (var i = 0; i < courses.length; i++) {
        if (!searchVal || courses[i].textContent.toLowerCase().indexOf(searchVal) > -1) {
            courses[i].style['display'] = 'list-item';
        }
        else {
            courses[i].style['display'] = 'none';
        }
    }
};

function doExchange(event){
    document.getElementById('courseSelect').style['display'] = 'flex';
    getLecturesForCourse(null, function(lectureId) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                confirm('Exchange added. If or when you are matched with another person, you will recieve an email informing you.');
                window.location.reload();
            }
        };
        xhttp.open("POST", "http://localhost:3000/lecture/exchange/" + lectureId + '/' + event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-lecture'), true);
        xhttp.send();
    }, event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-subject'));
}

function promptDelete(){
    window.confirm("Are you sure you want to remove the lecture from your timetable?");
}

function doReplace(event){
    window.confirm("Are you sure you want to replace the lecture from your timetable? This will remove the selected lecture");
    deleteLecture(event.target.parentElement.parentElement.parentElement.parentElement);
    doInsert();
}

function doRemove(event){
    if(window.confirm("Are you sure you want to remove the lecture from your timetable?"))
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
            if (this.readyState == 4 && this.status == 200) {
                confirm('Course added!\n This page will now refresh');
                window.location.reload();
            }
        };
        xhttp.open("POST", "http://localhost:3000/lecture/add/" + lectureId, true);
        xhttp.send();
    });
}