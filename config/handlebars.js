var days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function hbsHelpers(hbs, i18n) {
    return hbs.create({
        defaultLayout: 'main',
        helpers: { // This was missing
            timetable: function(context, options) {
                if(context) {
                    var ret = '';
                    var i = 0;
                    var color = 1;

                    for (var day = 0; day < 5; day++) {
                        var hour = 7;
                        ret += '<div class="col-2-1">';
                        ret += '<div class="day">'+ days[day] +'</div>';

                        while (hour < 21) {
                            if (context[i] && context[i].Lecture.day == day) {
                                var start =parseInt(context[i].Lecture.startTime.substring(0,2));
                                context[i].Lecture.startTime = String(start) + ':00-' + String(start + context[i].Lecture.duration) + ':00';

                                if(start != hour) {
                                    ret += '<div class="lecture lh-' + String(start - hour) + '"></div>';
                                }
                                hour = start + context[i].Lecture.duration;

                                context[i].color = color;
                                ret += options.fn(context[i]);

                                color = color%8+1;
                                i++;
                            } else {
                                ret += '<div class="lecture lh-' + String(21-hour) + '"></div>';
                                hour = 21;
                            }
                        }
                        ret += '</div>';
                    }
                    return ret;
                }
                return '';
            },
            switch: function(value, options) {
                        this._switch_value_ = value;
                        var html = options.fn(this); // Process the body of the switch block
                        delete this._switch_value_;
                        return html;
            },
            case: function(value, options) {
                if (value == this._switch_value_) {
                    return options.fn(this);
                }
            },
            __: function(){
                return i18n.__.apply(this, arguments);
            }
        }
    });
}

module.exports = hbsHelpers;