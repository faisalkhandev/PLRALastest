import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Grid, Box } from "@mui/material";
import "./HolidayCalendar.css";
import { useState, useEffect } from "react";
import { Breadcrumb, Loader } from "../../../Components";
import { useGetHolidaysQuery } from "../../../Features/API/Transfer";

function HolidayCalendar() {
    const [currentEvent, setCurrentEvent] = useState([]);

    const { data: holidayData, refetch, isLoading, isError } = useGetHolidaysQuery();

    useEffect(() => {
        if (isError) {
            console.error('Error fetching holidays:', isError);
        }
    }, [isError]);

    console.log("Holidays::;", holidayData?.results);

    const transformedEvents = holidayData?.results?.map((event) => ({
        id: event.id,
        title: event.holiday_type,
        start: event.holiday_from_date,
        end: new
            Date
            (
                new
                    Date
                    (event.holiday_to_date).
                    getTime
                    () +
                86400000
            ).
            toISOString
            ().
            split
            (
                "T"
            )[
            0
        ],
        backgroundColor: "green",
        textColor: "white",
        holidayType: event.holiday_type,
        allowedTo: event.allowed_to,
    })) || [];

    function renderEventContent(eventInfo) {
        return (
            <div className="event-content">
                <span className="event-title">{eventInfo.event.title}</span>
            </div>
        );
    }

    function handleEventSet(events) {
        if (JSON.stringify(events) !== JSON.stringify(currentEvent)) {
            setCurrentEvent(events);
        }
    }

    function formatDate(dateInput, options) {
        if (!dateInput) return "";
        const formatter = new Intl.DateTimeFormat("en-US", options);
        return formatter.format(new Date(dateInput));
    }

    function Sidebar({ currentEvents }) {
        return (
            <Box className="demo-app-sidebar-section">
                <h2 style={{ marginBottom: "20px" }}>
                    All Holidays ({currentEvents.length})
                </h2>
                <ul>
                    {currentEvents.map((event) => (
                        <li key={event.id}>
                            <b>
                                {formatDate(event.start, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </b>
                            {" , "}
                            <b>
                                {formatDate(event.end, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </b>
                            <i style={{ color: "green", fontSize: "14px" }}>
                                {" "}
                                {event.title}
                            </i>
                        </li>
                    ))}
                </ul>
            </Box>
        );
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <div
            style={{ margin: "14px 30px 0 30px", height: "100%" }}
            className="EmployeeTableBox"
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Breadcrumb title="Holidays" breadcrumbItem="Holiday / All Holidays" />
            </Box>
            <Grid container sx={{ padding: "20px", width: "100%" }}>
                <Grid item xs={4} md={4} lg={4}>
                    <Sidebar currentEvents={currentEvent} />
                </Grid>
                <Grid item xs={8} md={8} lg={8}>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        weekends={true}
                        height="auto"
                        events={transformedEvents}
                        timeZone="UTC"
                        eventContent={renderEventContent}
                        eventsSet={handleEventSet}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default HolidayCalendar;
