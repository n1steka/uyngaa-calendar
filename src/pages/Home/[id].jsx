import { useState, useEffect } from 'react';
import Link from "next/link"
import { useRouter } from 'next/router';
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Home() {
  const [events, setEvents] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [no_of_days, setNoOfDays] = useState([]);
  const [blankdays, setBlankDays] = useState([]);
  const [event_title, setEventTitle] = useState('');
  const [event_date, setEventDate] = useState('');
  const [event_theme, setEventTheme] = useState('blue');
  const [openEventModal, setOpenEventModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const router = useRouter();
  const { id } = router.query; // Get the id parameter from the router
  
  useEffect(() => {
    // Convert id to integer and set it as the month
    const selectedMonth = parseInt(id);
    if (!isNaN(selectedMonth) && selectedMonth >= 0 && selectedMonth <= 11) {
      setMonth(selectedMonth);
    }
  }, [id]);

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
  }, [id]); // Fetch events whenever id (month) changes

  useEffect(() => {
    getNoOfDays();
  }, [month, year]);

  const initDate = () => {
    let today = new Date();
    setMonth(id);
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

    // Adjust days for February in leap years
    if (month === 1 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
      daysArray = Array.from({ length: 29 }, (_, i) => i + 1);
    }

    setBlankDays(blankdaysArray);
    setNoOfDays(daysArray);
  };

  const openModal = () => {
    setIsMenuOpen(true)
  }

  return (
    <>
    <div className='w-full h-[50px] bg-blue-900'>
      <h1 className='text-white flex h-full items-center ml-[50px] '> Утас: 99001122  </h1>
    </div>
      <nav className="h-24 w-full bg-slate-300">
        <ul className="flex justify-between p-8">
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
                  <div key={index} style={{ width: '14.28%', height: '120px' }} className="text-center border-r border-b px-4 pt-2" ></div>
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
                          <p onClick={openModal}  className="cursor-pointer p-2  text-sm truncate leading-tight">{event.event_title}</p>
                          {isMenuOpen && (
                            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                              <div className="bg-white rounded-md p-6 max-w-md w-[500px] h-[500px]">
                                <ul className='p-4'>
                                  <li>
                                    <h1> Дэлгэрэнгүй</h1>
                                    <span className='text-blue-600'>Арга хэмжээ :</span>
                                    <div className='p-4 border w-full h-full rounded-md mt-12'>
                                      <p className="block py-2 px-4 text-gray-800 hover:bg-gray-200"> {event.event_title}  </p>
                                    </div>
                                  </li>
                                </ul>
                                <button
                                  className="block mt-4 px-4 py-2 text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-md"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  Хаах
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
