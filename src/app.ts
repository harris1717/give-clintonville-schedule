(async () => {
    const classes = await getClasses();
    const html = generateHtml(classes);
    addHtmlToPage(html);
})();

async function getClasses() {
    const schedule = await fetchSchedule();
    return schedule.map((c: any) => toClass(c)) as Class[];
}

async function fetchSchedule() {
    const { today, tenDaysFromToday } = getDates();
    const uri = `https://giveyoga.marianatek.com/api/class_sessions?include=in_booking_window&location=48056&min_date=${today}&max_date=${tenDaysFromToday}&ordering=start_datetime&page_size=100`;
    const response = await fetch(uri);
    const responseData = await response.json();
    const schedule = responseData.data;
    return schedule;
}

function getDates() {
    let date = new Date();
    const today = `${date.getFullYear()}-${+date.getMonth()}-${date.getDate()}`;
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
    } as Class;
}

function generateHtml(classes: Class[]) {
    let html = '';
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    classes.forEach((c) => html += `<li>${c.name}; ${c.startDateTime.toLocaleDateString('en-US', options)}; ${c.instructor}; ${c.room}</li>`);
    return html;
}

function addHtmlToPage(html: string) {
    document.getElementById('schedule')!.innerHTML = html;
}

type Class = {
    startDateTime: Date;
    room: string;
    name: string;
    instructor: string;
};