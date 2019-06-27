document.addEventListener('DOMContentLoaded', function() {
    var Draggable = FullCalendarInteraction.Draggable;

    var containerEl = document.getElementById('external-events');
    var calendarEl = document.getElementById('calendar');

    var CALENDAR = "Calendar";

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
                    var time = new Date(res[0].time.replace(" ", "T"));
                    //TODO 循环res
                    events.push({
                        start: time,
                        title: res[0].language,
                    });
                    successCallback(events);
                }
            })
        },

        select: function(info)
        {
            //TODO select 与 drag方法类似
            alert('selected ' + info.startStr + ' to ' + info.endStr);
        },

        drop: function(info) {
            //TODO console.log可以看到info所包括的内容，其中有所拖拽块的相关信息，可以传给数据库，user信息在session里
            console.log(info);

            var time = info.dateStr.replace(/T/, " ");
            time = time.substr(0, 19);
            $.ajax({
                url:"drag_insert_event",
                type:"POST",
                data:{
                    time: time,
                    // uid: uid,
                    // language: lan,
                    // type: type
                },
                error:function(){
                    alert("error");
                },
                success:function()
                {
                    alert("Added Successfully");
                }
            })
        },
    });

    calendar.render();
});