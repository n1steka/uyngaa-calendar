import { useState, useEffect } from 'react';
import Link from "next/link";
import axios from 'axios'; // Import axios for making HTTP requests

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
    //     { event_date: new Date(2020, 3, 1), event_title: "April Fool's Day", event_theme: 'blue' },
    //     { event_date: new Date(2020, 3, 10), event_title: "Birthday", event_theme: 'red' },
    //     { event_date: new Date(2020, 3, 16), event_title: "Upcoming Event", event_theme: 'green' }
    // ]);
    const [event_title, setEventTitle] = useState('');
    const [event_date, setEventDate] = useState('');
    const [event_theme, setEventTheme] = useState(`blue`);
    const [openEventModal, setOpenEventModal] = useState(false);

    const isToday = (date) => {
        const today = new Date();
        const d = new Date(year, month, date);
        return today.toDateString() === d.toDateString();
    };

    const showEventModal = (date) => {
        setOpenEventModal(true);
        setEventDate(new Date(year, month, date).toDateString());
    };

    const addEvent = async () => {
        if (event_title === '') return;

        const eventData = {
            event_date: event_date,
            event_title: event_title,
            event_theme: event_theme
        };

        // Send the POST request
        axios.post('/api/event', eventData)
            .then(response => {
                console.log('Event added:', response.data);
                // Optionally, you can handle the response here
            })
            .catch(error => {
                console.error('Error adding event:', error);
                // Optionally, you can handle errors here
            });

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
            <nav className="h-24 w-full bg-slate-300">
                <ul className="flex justify-between p-8">
                    <li>
                        <h1 className="text-2xl mx-5">
                            <Link href={"/"}>
                                Нүүр
                            </Link>
                        </h1>
                    </li>
                    <li>
                        <h1>
                            <Link href={"/login"}>
                                Гарах
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
                                            {events
                                                .filter(event => new Date(event.event_date).toDateString() === new Date(year, month, date).toDateString())
                                                .map((event, index) => (
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

                {openEventModal && (
                    <div className="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full">
                        <div className="flex justify-center items-center bg-black bg-opacity-80 absolute inset-0">
                            <div className="p-4 max-w-xl mx-auto relative bg-white rounded-lg overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-3 -mr-3">
                                    <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-800 " onClick={() => setOpenEventModal(false)}>
                                        <svg className="text-black w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                                <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">Add Event Details</h2>
                                <div className="mb-4">
                                    <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Event title</label>
                                    <input
                                        className="bg-gray-200 appearance-none border-2 border-gray-500 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                        type="text"
                                        value={event_title}
                                        onChange={(e) => setEventTitle(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Event date</label>
                                    <input
                                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                        type="text"
                                        value={event_date}
                                        readOnly
                                    />
                                </div>

                                <div className="inline-block w-64 mb-4">
                                    <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Select a theme</label>
                                    <div className="relative">
                                        <select
                                            value={event_theme}
                                            onChange={(e) => setEventTheme(e.target.value)}
                                            className="block appearance-none w-full bg-gray-200 border-2 border-gray-200 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-gray-700"
                                        >
                                            {events.map((event, index) => (
                                                <option key={index} value={event.event_theme}>{event.event_title}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>


                                <div className="mt-8 text-right">
                                    <button
                                        type="button"
                                        className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm mr-2"
                                        onClick={() => setOpenEventModal(!openEventModal)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-700 rounded-lg shadow-sm"
                                        onClick={addEvent}
                                    >
                                        Save Event
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div >
        </>
    );
}

export default Home;
