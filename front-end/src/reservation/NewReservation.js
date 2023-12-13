import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservation() {
  const history = useHistory();

  const [reservationError, setReservationError] = useState(null);

  const initialFormState = {
    "first_name": "",
    "last_name": "",
    "mobile_number": "",
    "reservation_date": "",
    "reservation_time": "",
    "people": 1,
  };

  function handleNewReservationSubmit(newReservation) {
    newReservation = { ...newReservation, people: Number(newReservation.people) };
    if (newReservation.reservation_time.length === 5) {
      newReservation = { ...newReservation, reservation_time: (newReservation.reservation_time + ":00")}
  }
    const abortController = new AbortController();
    setReservationError(null); // Clear any previous errors
    createReservation(newReservation, abortController.signal)
      .then((data) => {
        const dateQueryParam = newReservation.reservation_date;
        history.push(`/dashboard?date=${dateQueryParam}`);
      })
      .catch(setReservationError);
    
        return () => abortController.abort();
  }

  function handleCancel() {
    history.push("/dashboard");
}

  return (
    <div>
      <h1>Create a new reservation</h1>
      <ErrorAlert error={reservationError} />
      <ReservationForm
        initialFormState={initialFormState}
        submitAction={handleNewReservationSubmit}
        handleCancel={handleCancel}
      />
    </div>
  );
}

export default NewReservation;