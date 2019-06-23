


 import dayGridPlugin from "@fullcalendar/daygrid";
 import timeGridPlugin from '@fullcalendar/timegrid';
 import listPlugin from '@fullcalendar/list';


document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'dayGridPlugin','timeGridPlugin','listPlugin' ],
        defaultView:'timeGridWeek'
    });

    calendar.render();
});