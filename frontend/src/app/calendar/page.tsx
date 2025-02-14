"use client"

import dayjs from "dayjs";
import React, { useState } from "react";
var isBetween = require("dayjs/plugin/isBetween");

const Calendar = () => {
    dayjs.extend(isBetween);
    const date = new Date();

    const [today, setToday] = useState({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
    });

    // set start date and end date of this page
    var start_date_page = dayjs()
        .month(today.month - 1)
        .year(today.year)
        .startOf("month")
        .startOf("week")
        .format();
    var end_date_page = dayjs()
        .month(today.month - 1)
        .year(today.year)
        .endOf("month")
        .endOf("week")
        .format();

    // get array of dates of this page
    function getDatesInRange(d1, d2) {
        const date = new Date(d1);
        const dates = [];
        while (date <= d2) {
            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return dates;
    }

    var arr = getDatesInRange(new Date(start_date_page), new Date(end_date_page));

    // create calendar content
    const content = arr.map((item, index) => {
        return (
            <div key={index} className="md:px-2 md:py-2 p-[2px] cursor-pointer max-w-[20px] md:mb-4 flex md:w-full justify-center">
                <div className="rounded w-[50px] h-[50px] flex flex-col md:gap-2 items-center justify-center bg-white">
                    <p className="text-lg font-semibold text-black rounded-circle flex items-center justify-center w-[30px] h-[30px]">
                        {item.getDate()}
                    </p>
                </div>
            </div>
        );
    });

    // increment and decrement month
    const incrementMonth = () => {
        if (today.month === 12) {
            setToday({
                month: 1,
                year: today.year + 1,
            });
        } else {
            setToday({
                month: today.month + 1,
                year: today.year,
            });
        }
    };

    const decrementMonth = () => {
        if (today.month === 1) {
            setToday({
                month: 12,
                year: today.year - 1,
            });
        } else {
            setToday({
                month: today.month - 1,
                year: today.year,
            });
        }
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="flex items-center justify-center py-3 px-2 md:py-8 md:px-4">
            <div className="max-w-[80%] min-h-[75vh] md:max-w-[90%] w-full shadow-2xl border-[1.6px] rounded-2xl border-gray-500">
                <div className="md:py-12 md:px-5 py-4 px-2 flex flex-col rounded-2xl min-h-[75vh] bg-slate-100">
                    <div className="px-4 md:px-8 flex flex-wrap items-center justify-between">
                        <span className="text-base font-bold text-gray-800">
                            {monthNames[today.month-1]} - {today.year}
                        </span>
                        <div className="flex items-center">
                            <button
                                className="inline-flex items-center px-2 py-1 md:px-4 md:py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900"
                                onClick={decrementMonth}
                            >
                                <span>Prev</span>
                            </button>

                            <button
                                className="m-2 inline-flex items-center px-2 py-1 md:px-4 md:py-2 text-sm font-medium text-white bg-gray-800 rounded-none hover:bg-gray-900"
                                onClick={() => setToday({
                                    month: dayjs().month() + 1,
                                    year: dayjs().year(),
                                })}
                            >
                                Current
                            </button>

                            <button
                                className="inline-flex items-center px-2 py-1 md:px-4 md:py-2 text-sm font-medium text-white bg-gray-800 rounded-r hover:bg-gray-900"
                                onClick={incrementMonth}
                            >
                                <span>Next</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid items-center grid-cols-7 max-w-full justify-between pt-12 overflow-x-auto">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                            <div key={day} className="w-[30px] md:w-full mb-3 flex justify-center">
                                <p className="text-lg text-center text-gray-800 font-semibold">
                                    {day}
                                </p>
                            </div>
                        ))}
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
