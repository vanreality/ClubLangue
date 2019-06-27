

var container = $("<div>");
var dragElement = $("<div class='fc-event' data-lan='' data-type=''>");

//the types of the languages
var languages = ["anglais", "chinois", "français", "allemand", "espagnol", "portugal", "japonais"];

// shorten the expression of languages
var languages_short = ["en", "zh", "fr", "de", "es", "pt", "jp"];

// the two types of activities
var type = ["Apprendre", "Enseigner"];

var i, j;


//listen the events of adding events by drag and poser
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
        //ajuste the head
        header: {
            left: 'dayGridMonth,timeGridWeek', // buttons for switching between views
        },

        //add the plugins
        plugins: [ 'dayGrid', 'timeGrid', 'interaction' ],

        //set View default
        defaultView: 'timeGridWeek',

        //set the period of the time
        slotDuration: '00:30',
        businessHours: {
            // days of week. an array of zero-based day of week integers (0=Sunday)
            daysOfWeek: [ 1, 2, 3, 4 , 5, 6, 0],

            startTime: '8:00', // a start time
            endTime: '18:00', // an end time
        },

        //shut the allDay events
        allDaySlot: false,
        nowIndicator: true,

        //set editable
        editable:true,

        //set selectable
        selectable:true,
        selectHelper:true,

        //set droppable
        droppable:true,


        //load the events from the database
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

                            if(res[i].status==1){
                                Color='#278006';
                            }
                            else {
                               Color='#064780';
                            }
                            events.push({
                                id:res[i].id,
                                start: time,
                                description:res[i].status + "",
                                title: type[res[i].type] + " " + lan,
                                color: Color,
                            });
                        }

                        successCallback(events);
                    }

                }
            });


        },

        //delete the event by click the events
        eventClick: function(info) {

            if(confirm("Supprimer la réservation/le cours?"))
            {
                var id = info.event.id;
                console.log(info.event.extendedProps.description);
                if(info.event.extendedProps.description === "1"){
                    $.ajax({
                        url: 'cancel_ref_event',
                        type: 'POST',
                        data:{
                            id:info.event.id,
                        },
                        error: function () {
                            alert("error");
                        },
                        success: function (res) {
                            calendar.refetchEvents();
                        }
                    });
                }
                else{
                    $.ajax({
                        url:"delete_event",
                        type:"POST",
                        data:{id:id},
                        success:function()
                        {
                            // calendar.fullCalendar('refetchEvents');
                            calendar.refetchEvents();
                            alert("Event Removed");
                        }
                    })
                }

            }
        },

        //add the event by drop the event
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