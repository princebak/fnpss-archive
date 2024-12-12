import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormInput from "./FormInput";
import { getDateOnly, isToday } from "@/utils/myFunctions";

const FileEditAlert = ({
  id,
  scheduledDate,
  setScheduledDate,
  alertDate,
  alertReason,
  setAlertDate,
  setAlertReason,
}: {
  id: string;
  scheduledDate: Date | null;
  setScheduledDate: any;
  alertDate: Date | null;
  alertReason: string;
  setAlertDate: any;
  setAlertReason: any;
}) => {
  const [isOnAlert, setIsOnAlert] = useState(false);

  const handleScheduleDate = (date: Date | null) => {
    if (date) {
      setScheduledDate(getDateOnly(date));
    }
  };

  const handleAlertDate = (date: Date | null) => {
    if (date) {
      setAlertDate(getDateOnly(date));
    }
  };

  const toggleIsOnAlert = () => {
    const newState = !isOnAlert;

    setIsOnAlert(newState);

    if (!newState) {
      setAlertDate(undefined);
      setScheduledDate(undefined);
      setAlertReason(undefined);
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);

      setAlertDate(today);
      setScheduledDate(tomorrow);
      setAlertReason("");
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    const input: HTMLInputElement = document.getElementById(
      `${id}`
    ) as HTMLInputElement;

    input.checked = !isOnAlert;
    input.click();
  };

  useEffect(() => {
    if (alertDate && isToday(alertDate)) {
      setIsOnAlert(true);
    }
  }, [alertDate]);

  return (
    <>
      <label
        htmlFor={`${id}`}
        className="d-flex gap-2"
        onClick={(e) => handleClick(e)}
      >
        <input
          type="checkbox"
          id={`${id}`}
          checked={isOnAlert}
          onChange={() => toggleIsOnAlert()}
        />
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            return;
          }}
        >
          Ajouter une alerte
        </span>
      </label>
      {isOnAlert ? (
        <div
          className="d-flex flex-column gap-2"
          style={{
            border: "solid 1px #ddd",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          <FormInput
            type="date"
            label="Date prévue"
            title="Date prévue"
            name="scheduled_date"
            component={
              <DatePicker
                className="form-control"
                selected={scheduledDate}
                onChange={(date) => handleScheduleDate(date)}
              />
            }
          />

          <FormInput
            type="date"
            label="Date d'alerte"
            title="Date d'alerte"
            id="alert_date"
            name="alert_date"
            component={
              <DatePicker
                className="form-control"
                selected={alertDate}
                onChange={(date) => handleAlertDate(date)}
              />
            }
          />

          <FormInput
            label="Raison de l'alerte"
            title="Raison de l'alerte"
            type="text"
            id="alert_reason"
            name="alert_reason"
            placeHolder="Saisir le motif de l'alerte"
            value={alertReason}
            handleChange={(e: any) => setAlertReason(e.target.value)}
            required
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default FileEditAlert;
