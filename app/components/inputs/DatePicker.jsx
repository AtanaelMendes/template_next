import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import Datepicker from "tailwind-datepicker-react";
import {
    faAsterisk,
    faChevronCircleLeft,
    faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { format, isDate } from "date-fns";
import { FieldLabel } from "@/components/Layouts/Typography";
import { cn } from "@/assets/utils";

const DatePicker = ({ label, onChange, id, maxDate, defaultDate, required }) => {
    const options = {
        title: "",
        autoHide: true,
        todayBtn: true,
        clearBtn: true,
        clearBtnText: "Limpar",
        todayBtnText: "Hoje",
        icons: {
            prev: () => (
                <FontAwesomeIcon
                    icon={faChevronCircleLeft}
                    width="25"
                    height="25"
                    className="text-slate-500"
                />
            ),
            next: () => (
                <FontAwesomeIcon
                    icon={faChevronCircleRight}
                    width="25"
                    height="25"
                    className="text-slate-500"
                />
            ),
        },
        datepickerclassName: "top-26",
        defaultDate: defaultDate,
        language: "pt-br",
        disabledDates: [],
        weekDays: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
        inputNameProp: "date",
        inputIdProp: "date",
        inputPlaceholderProp: "Selecione uma data",
        inputDateFormatProp: {
            day: "numeric",
            month: "long",
            year: "numeric",
        },
        maxDate: maxDate ?? null,
    };

    const [show, setShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState(
        defaultDate && isDate(defaultDate) ? format(defaultDate, "dd/MM/yyyy") : ""
    );

    const handleChange = React.useCallback((date) => {
        setSelectedDate(format(date, "dd/MM/yyyy"));
        onChange(format(date, "dd/MM/yyyy"));
    }, []);

    const handleClose = React.useCallback((state) => {
        setShow(state);
    }, []);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".datepicker") && show) {
                setShow(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [show]);

    return (
        <>
            {label && (
                <div className="flex flex-row gap-1">
                    {required && (
                        <FontAwesomeIcon
                            icon={faAsterisk}
                            width="10"
                            height="10"
                            color="red"
                            className="self-start"
                        />
                    )}
                    <label htmlFor={id}>
                        <FieldLabel>
                            {label || ""}
                        </FieldLabel>
                    </label>
                </div>
            )}
            <Datepicker
                options={options}
                onChange={handleChange}
                show={show}
                setShow={handleClose}
                className="datepicker"
            >
                <div
                    className={cn(
                        `flex bg-gray-50 border-gray-300 rounded-lg border p-2`,
                        show && `border-blue-500 border-2`
                    )}
                >
                    <div className="flex items-center">
                        <FontAwesomeIcon
                            icon={faCalendar}
                            width="20"
                            height="20"
                            className={cn(show ? "text-blue-500" : "text-slate-500")}
                        />
                    </div>
                    <input
                        type="text"
                        className="text-gray-900 bg-gray-50 text-sm border-none focus:border-none focus:outline-none focus:ring-0 focus:ring-transparent block w-full p-0 pl-2.5"
                        placeholder="Selecionar data"
                        value={selectedDate}
                        onFocus={() => setShow(true)}
                        readOnly
                        required={required ? selectedDate === "" : false}
                    />
                </div>
            </Datepicker>
        </>
    );
};

export default DatePicker;
