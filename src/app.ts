import axios from 'axios';

(async () => {
    const classes = await getClasses();
    const html = generateHtml(classes);
    addHtmlToPage(html);
})()

async function getClasses() {
    const schedule = await fetchSchedule();
    return schedule.map((c: any) => toClass(c)) as Class[];
}

async function fetchSchedule() {
    const { today, tenDaysFromToday } = getDates();
    const uri = `https://giveyoga.marianatek.com/api/class_sessions?include=in_booking_window&location=48056&min_date=${today}&max_date=${tenDaysFromToday}&ordering=start_datetime&page_size=100`;
    const schedule = (await axios.get(uri)).data.data;
    return schedule;
}

function getDates() {
    let date = new Date();
    const today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    date = addDays(date, 9);
    const tenDaysFromToday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
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
    } as Class;
}

function generateHtml(classes: Class[]) {
    let html = '';
    classes.forEach((c) => html += `<li>${c.name}; ${c.startDateTime}; ${c.instructor}; ${c.room}</li>`);
    return html;
}

function addHtmlToPage(html: string) {
    document.getElementById('classList').innerHTML = html;
}

type Class = {
    startDateTime: Date;
    room: string;
    name: string;
    instructor: string;
};