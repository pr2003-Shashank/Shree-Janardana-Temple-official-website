// Dashboard.js
import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { useState, useEffect } from "react";
import Papa from 'papaparse'; // CSV parsing library
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendarView.scss";

function CalendarView() {
  const [events, setEvents] = useState([]);

  // Localization setup for date-fns
const locales = { "en-US": require("date-fns/locale/en-US") };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

  const baseSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuWARY0Y8KpEDf7LCiMwg1cSNht-Jp_VcPj5cFr5P6DIDVVtddyenn89OKwu7Guc3x5KIAuQa7gnIa/pub?gid=319284677&single=true&output=csv';
  const fetchData = () => {
      const sheetUrl = `${baseSheetUrl}&t=${new Date().getTime()}`;
      fetch(sheetUrl)
          .then(response => response.text())
          .then(data => {
              Papa.parse(data, {
                  header: true,
                  complete: (results) => {
                    const fetchedEvents = results.data.map((row) => ({
                      title: row.Name, 
                      allDay: "true", // Convert "true"/"false" string to boolean
                      start: new Date(row.Date), // Assumes `start` is in a parseable date format
                      end: new Date(row.Date), // Assumes `end` is in a parseable date format
                    }));
        
                    // Update state with transformed events
                    setEvents(fetchedEvents);
                  },
              });
          })
          .catch(error => console.error('Error fetching or parsing data:', error));
  };

  useEffect(() => {
      // Fetch data when the component mounts
      fetchData();
  }, [])

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: "15px" }}
          popup
          views={["month"]} // Only allow month view
        />
      </div>
    </div>
  );
}

export default CalendarView;
