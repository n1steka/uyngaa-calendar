import { useState } from 'react';
import Home from './admin';
import Link from 'next/link';

function Main() {
  const [year, setYear] = useState(new Date().getFullYear());
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  function getDaysInMonth(month, year) {
    const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysInMonth[month];
  }

  function generateCalendar(year) {
    const calendar = [];
    for (let month = 0; month < 12; month++) {
      const monthDays = getDaysInMonth(month, year);
      const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0-indexed day of the week (0 = Sunday)

      const monthGrid = [];
      for (let i = 0; i < firstDayOfMonth; i++) {
        monthGrid.push('');
      }
      for (let day = 1; day <= monthDays; day++) {
        monthGrid.push(day);
      }
      calendar.push(monthGrid);
    }
    return calendar;
  }

  const calendar = generateCalendar(year);

  return (
    <div className="container mx-auto p-12  m-12">

      <h1 className="text-3xl font-bold mb-4">{year} Calendar</h1>
      <div className="grid grid-cols-3 gap-4">
        {calendar.map((month, index) => (
          <div key={index} className="border p-4 rounded ">
            <h2 className="text-xl font-semibold mb-2">{monthNames[index]}</h2>
            <Link href={`/Home/${index}`} className='underline   cursor-pointer text-red-500'> - Дэлгэрэнгүй -</Link>
            <div className="grid grid-cols-7 gap-2 mt-12">
              {dayNames.map((day, dayIndex) => (
                <div key={dayIndex} className="text-sm text-center font-semibold">{day}</div>
              ))}
              {month.map((date, dateIndex) => (
                <div key={dateIndex} className={`text-center ${date === '' ? 'text-gray-300' : ''}`}>{date}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
