const axios = require('axios')

(async () => {
    const schedule = getSchedule()

    // generate html
})()

async function getSchedule() {
    const { today, tenDaysFromToday } = getDates()
    const uri = `https://giveyoga.marianatek.com/api/class_sessions?include=in_booking_window&location=48056&min_date=${today}&max_date=${tenDaysFromToday}&ordering=start_datetime&page_size=100`
    const schedule = (await axios.get(uri)).data

    // strongly type this schedule

    return schedule
}

function getDates() {
    let date = new Date()
    const today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    date = addDays(date, 9)
    const tenDaysFromToday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    return { today, tenDaysFromToday }
}

function addDays(originalDate: Date, days: number) {
    var newDate = new Date(originalDate);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}