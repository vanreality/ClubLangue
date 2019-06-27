var container = $("<div>");
var dragElement = $("<div class='fc-event' data-lan='' data-type=''>");
var languages = ["anglais", "chinois", "français", "allemand", "espagnol", "portugal", "japonais"];
var languages_short = ["en", "zh", "fr", "de", "es", "pt", "jp"];
var type = ["Apprendre", "Enseigner"];
var i, j;

document.addEventListener('DOMContentLoaded', function() {
    for(i in languages) {
        for (j in type) {
            var d = dragElement.clone()
                .html(type[j] + " " + languages[i])
                .data("type",j)
                .data("language", languages[i]);

            $("p").after(d);
        }
    }

    var Draggable = FullCalendarInteraction.Draggable;

    var containerEl = document.getElementById('external-events');
    var calendarEl = document.getElementById('calendar');

    // initialize the external events
    // -----------------------------------------------------------------

    new Draggable(containerEl, {
        itemSelector: '.fc-event',
        eventData: function(eventEl) {
            return {
                title: eventEl.innerText
            };
        }
    });

    // initialize the calendar
    // -----------------------------------------------------------------

    var calendar = new FullCalendar.Calendar(calendarEl, {
        header: {
            left: 'dayGridMonth,timeGridWeek', // buttons for switching between views
        },
        plugins: [ 'dayGrid', 'timeGrid', 'interaction' ],
        defaultView: 'timeGridWeek',
        slotDuration: '00:30',
        businessHours: {
            // days of week. an array of zero-based day of week integers (0=Sunday)
            daysOfWeek: [ 1, 2, 3, 4 , 5, 6, 0],

            startTime: '8:00', // a start time
            endTime: '18:00', // an end time
        },
        allDaySlot: false,
        nowIndicator: true,
        editable:true,
        selectable:true,
        selectHelper:true,
        droppable:true,

        events: function(info, successCallback, failureCallback){
            $.ajax({
                url:'load_event',
                method: 'POST',
                error:function(){
                    alert("error");
                },
                success: function(res){
                    var events = [];
                    var i=0;
                    if(res!=null){
                        for (i in res){
                            var time = new Date(res[i].time.replace(" ", "T"));
                            var lan = res[i].language;

                            for(var j in languages) {
                                if (lan === languages_short[j]){
                                    lan = languages[j];
                                }
                            }

                            events.push({
                                start: time,
                                title: type[res[i].type] + " " + lan,
                            });
                        }
                        successCallback(events);
                    }

                }
            })
        },

        select: function(info)
        {
            //TODO select 与 drag方法类似
            alert('selected ' + info.startStr + ' to ' + info.endStr);
        },

        drop: function(info) {
            var choice = info.draggedEl.innerHTML.split(" ");

            var i,j;

            for (i in type) {
                if (choice[0] === type[i]){
                    choice[0] = i;
                }
            }

            for(j in languages) {
                if (choice[1] === languages[j]){
                    choice[1] = languages_short[j];
                }
            }

            var time = info.dateStr.replace(/T/, " ");
            time = time.substr(0, 19);
            $.ajax({
                url:"drag_insert_event",
                type:"POST",
                data:{
                    time: time,
                    language: choice[1],
                    type: choice[0]
                },
                error:function(){
                    alert("error");
                },
                success:function()
                {
                    // alert("Added Successfully");
                }
            })
        },
    });

    calendar.render();
});