var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//import axios from 'axios';
const axios = require('axios');
(() => __awaiter(this, void 0, void 0, function* () {
    const classes = yield getClasses();
    const html = generateHtml(classes);
    addHtmlToPage(html);
}))();
function getClasses() {
    return __awaiter(this, void 0, void 0, function* () {
        const schedule = yield fetchSchedule();
        return schedule.map((c) => toClass(c));
    });
}
function fetchSchedule() {
    return __awaiter(this, void 0, void 0, function* () {
        const { today, tenDaysFromToday } = getDates();
        const uri = `https://giveyoga.marianatek.com/api/class_sessions?include=in_booking_window&location=48056&min_date=${today}&max_date=${tenDaysFromToday}&ordering=start_datetime&page_size=100`;
        const schedule = (yield axios.get(uri)).data.data;
        return schedule;
    });
}
function getDates() {
    let date = new Date();
    const today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    date = addDays(date, 9);
    const tenDaysFromToday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    return { today, tenDaysFromToday };
}
function addDays(originalDate, days) {
    var newDate = new Date(originalDate);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}
function toClass(classEntity) {
    return {
        startDateTime: new Date(classEntity.attributes.start_datetime),
        room: classEntity.attributes.classroom_display,
        name: classEntity.attributes.class_type_display,
        instructor: classEntity.attributes.instructor_names.join(' - ')
    };
}
function generateHtml(classes) {
    let html = '';
    classes.forEach((c) => html += `<li>${c.name}; ${c.startDateTime}; ${c.instructor}; ${c.room}</li>`);
    return html;
}
function addHtmlToPage(html) {
    document.getElementById('classList').innerHTML = html;
}
//# sourceMappingURL=app.js.map