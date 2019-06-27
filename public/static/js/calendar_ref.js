var languages = ["anglais", "chinois", "français", "allemand", "espagnol", "portugal", "japonais"];
var languages_short = ["en", "zh", "fr", "de", "es", "pt", "jp"];
var type = ["Apprendre", "Enseigner"];
var i, j;

document.addEventListener('DOMContentLoaded', function() {

    var calendarEl = document.getElementById('calendar');

    var CALENDAR = "Calendar";

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


        //load events of the user reference
        events: function(info, successCallback, failureCallback){
            $.ajax({
                url:'load_ref_event',
                type: 'POST',
                data:{
                    "ref_id":getQueryVariable("ref_id"),
                    "type":getQueryVariable("type")
                },
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
                                id:res[i].id,
                                start: time,
                                title: type[res[i].type] + " " + lan,
                            });
                        }
                        successCallback(events);
                    }

                }
            })
        },


        //book a class
        eventClick: function(info) {

            if(confirm("Réserver ce cours?"))
            {
                $.ajax({
                    url: 'update_ref_event',
                    type: 'POST',
                    data:{
                        id:info.event.id,
                    },
                    error: function () {
                        alert("error");
                    },
                    success: function (res) {

                    }
                });


                if(confirm("laisser un message/ lancer une conversation?")){
                    window.location="message";

                }


            }
        },



    });

    calendar.render();
});

//get the parameter
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}