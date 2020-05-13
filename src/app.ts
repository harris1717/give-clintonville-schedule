import * as Models from "./models";

(async () => {
    const classes = await getClasses();
    const classesGroupedByDay = groupByDay(classes);
    const html = generateHtml(classesGroupedByDay);
    addHtmlToPage(html);
})();

async function getClasses() {
    const schedule = await fetchSchedule();
    return schedule.map((c: any) => toClass(c)) as Models.Class[];
}

async function fetchSchedule() {
    const { today, tenDaysFromToday } = getDates();
    const uri = `https://giveyoga.marianatek.com/api/class_sessions?include=in_booking_window&location=48056&min_date=${today}&max_date=${tenDaysFromToday}&ordering=start_datetime&page_size=100`;
    const response = await fetch(uri);
    const responseData = await response.json();
    const schedule = responseData.data;
    return schedule;
}

function groupByDay(classes: Models.Class[]) {
    const days = classes.map((c) => c.startDateTime.getDate());
    const uniqueDays = [...new Set(days)];
    const groupedClasses: Models.Class[][] = [];
    uniqueDays.forEach(day => {
        const classesForDay = classes.filter(c => c.startDateTime.getDate() === day);
        groupedClasses.push(classesForDay);
    });
    return groupedClasses;
}

function getDates() {
    let date = new Date();
    const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    date = addDays(date, 9);
    const tenDaysFromToday = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return { today, tenDaysFromToday };
}

function addDays(originalDate: Date, days: number) {
    var newDate = new Date(originalDate);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

function toClass(classEntity: any) {
    return {
        startDateTime: new Date(classEntity.attributes.start_datetime),
        room: classEntity.attributes.classroom_display,
        name: classEntity.attributes.class_type_display,
        instructor: classEntity.attributes.instructor_names.join(' - ')
    } as Models.Class;
}

function generateHtml(classesGroupedByDay: Models.Class[][]) {
    let html = '';
    
    classesGroupedByDay.forEach((c) => html += generateDayHtml(c));
    return html;
}

function generateDayHtml(classes: Models.Class[]) {
    const now = Date.now();
    if (classes.every(c => c.startDateTime.getTime() < now)) return '';
    
    let html = `<div class=\'day\'><h2>${classes[0].startDateTime.toLocaleDateString('en-US', options)}</h2><ul>`;
    classes.forEach(c => html += `<li><p${c.startDateTime.getTime() < now ? ' class="passed"' : ""}>${c.startDateTime.toLocaleTimeString('en-US', dayOptions).replace(' AM', 'am').replace(' PM', 'pm')} ${c.name} <strong>${c.instructor}</strong> in ${c.room.replace(' Studio', '')}</p></li>`)
    return html + '</ul></div>';
}

function addHtmlToPage(html: string) {
    document.getElementById('schedule')!.innerHTML = html;
}

const options = { weekday: 'short', month: 'short', day: 'numeric'};
const dayOptions = { hour: 'numeric', minute: 'numeric' };