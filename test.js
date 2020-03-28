const moment = require('moment');

const a = new Date().setDate(24);
const b = new Date();

const c = moment()
  .date(1)
  .hour(3);

const YEAR_START = moment()
  .month(0)
  .date(1)
  .hour(3)
  .minute(0)
  .seconds(0)
  .toDate();

console.log(YEAR_START);

console.log(a > b);
