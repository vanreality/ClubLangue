document.addEventListener('DOMContentLoaded', function() {
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
            center: 'addButton'
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
        select: function(start, end)
        {
            alert("selected"+ start + end);
        },

        drop: function(info) {
            //TODO add data to the database
        },

        customButtons: {
            addButton: {
                text: 'add event...',
                click: function() {
                    // var dateStr = prompt('Enter a date in YYYY-MM-DD format');
                    // var date = new Date(dateStr + 'T00:00:00'); // will be in local time
                    //
                    // if (!isNaN(date.valueOf())) { // valid?
                    //     calendar.addEvent({
                    //         title: 'dynamic event',
                    //         start: date,
                    //         allDay: true
                    //     });
                    //     alert('Great. Now, update your database...');
                    // } else {
                    //     alert('Invalid date.');
                    // }
                }
            }
        },
    });

    calendar.render();
});