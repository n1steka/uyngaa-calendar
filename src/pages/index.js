import { useState, useEffect } from 'react';
import Link from "next/link"
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/event'); // Assuming your API endpoint is '/api/event'
        if (res.ok) {
          const data = await res.json();
          setEvents(data.data); // Assuming events data is in the 'data' property of the response
        } else {
          console.error('Failed to fetch events:', res.statusText);
        }
      } catch (error) {
        console.error('Error fetching events:', error.message);
      }
    };

    fetchEvents();
  }, []);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [no_of_days, setNoOfDays] = useState([]);
  const [blankdays, setBlankDays] = useState([]);
  // const [events, setEvents] = useState([
  //   { event_date: new Date(2024, 3, 1), event_title: "April Fool's Day", event_theme: 'blue' },
  //   { event_date: new Date(2024, 3, 10), event_title: "Birthday", event_theme: 'red' },
  //   { event_date: new Date(2024, 3, 16), event_title: "Upcoming Event", event_theme: 'green' }
  // ]);
  const [event_title, setEventTitle] = useState('');
  const [event_date, setEventDate] = useState('');
  const [event_theme, setEventTheme] = useState('blue');
  const [openEventModal, setOpenEventModal] = useState(false);

  const initDate = () => {
    let today = new Date();
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };

  const isToday = (date) => {
    const today = new Date();
    const d = new Date(year, month, date);
    return today.toDateString() === d.toDateString();
  };

  const showEventModal = (date) => {
    setOpenEventModal(true);
    setEventDate(new Date(year, month, date).toDateString());
  };

  const addEvent = () => {
    if (event_title === '') return;

    setEvents([...events, { event_date, event_title, event_theme }]);

    setEventTitle('');
    setEventDate('');
    setEventTheme('blue');

    setOpenEventModal(false);
  };

  const getNoOfDays = () => {
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let dayOfWeek = new Date(year, month).getDay();
    let blankdaysArray = [];
    for (let i = 1; i <= dayOfWeek; i++) {
      blankdaysArray.push(i);
    }

    let daysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    setBlankDays(blankdaysArray);
    setNoOfDays(daysArray);
  };

  return (
    <>
      <nav className="h-24  w-full bg-slate-300">
        <ul className="flex  justify-between p-8">
          <li className=''>
            <h1 className="text-2xl mx-[200px">
              <Link href={"/"}>
                Нүүр
              </Link>
            </h1>
          </li>
          <li className='mx-[200px] '>
            <h1>
              <Link href={"/login"}>
                Нэвтрэх
              </Link>
            </h1>
          </li>
        </ul>
      </nav>
      <div className="antialiased sans-serif bg-gray-100 h-screen">
        <div className="container mx-auto px-4 py-2 md:py-24">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex items-center justify-between py-2 px-6">
              <div>
                <span className="text-lg font-bold text-gray-800">{MONTH_NAMES[month]}</span>
                <span className="ml-1 text-lg text-gray-600 font-normal">{year}</span>
              </div>
              <div className="border rounded-lg px-1" style={{ paddingTop: '2px' }}>
                <button
                  type="button"
                  className={`leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-300 p-1  text-black  items-center ${month === 0 && 'cursor-not-allowed opacity-25'}`}
                  disabled={month === 0}
                  onClick={() => { setMonth(month - 1); getNoOfDays(); }}
                >
                  <svg className="h-6 w-6 text-gray-500 inline-flex leading-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="border-r inline-flex h-6"></div>
                <button
                  type="button"
                  className={`leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer hover:bg-gray-200 p-1 ${month === 11 && 'cursor-not-allowed opacity-25'}`}
                  disabled={month === 11}
                  onClick={() => { setMonth(month + 1); getNoOfDays(); }}
                >
                  <svg className="h-6 w-6 text-gray-500 inline-flex leading-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="-mx-1 -mb-1">
              <div className="flex flex-wrap" style={{ marginBottom: '-40px' }}>
                {DAYS.map((day, index) => (
                  <div key={index} style={{ width: '14.26%' }} className="px-2 py-2">
                    <div className="text-gray-600 text-sm uppercase tracking-wide font-bold text-center">{day}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap border-t border-l">
                {blankdays.map((blankday, index) => (
                  <div key={index} style={{ width: '14.28%', height: '120px' }} className="text-center border-r border-b px-4 pt-2 " ></div>
                ))}
                {no_of_days.map((date, dateIndex) => (
                  <div key={dateIndex} style={{ width: '14.28%', height: '120px' }} className="px-4 pt-2 border-r border-b relative text-green-500 ">
                    <div
                      onClick={() => showEventModal(date)}
                      className={`inline-flex w-6 h-6 items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100  ${isToday(date) ? 'bg-blue-500 text-black' : 'text-gray-700 hover:bg-blue-300'}`}
                    >
                      {date}
                    </div>
                    <div style={{ height: '80px' }} className="overflow-y-auto mt-1">
                      {events.filter(event => new Date(event.event_date).toDateString() === new Date(year, month, date).toDateString()).map((event, index) => (
                        <div key={index} className={`px-2 py-1 rounded-lg mt-1 overflow-hidden border border-${event.event_theme}-200 text-${event.event_theme}-800 bg-${event.event_theme}-100`}>
                          <p className="text-sm truncate leading-tight">{event.event_title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        ч
      </div >
    </>
  );
}

export default Home;
