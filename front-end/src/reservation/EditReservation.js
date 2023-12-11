import React, {useState, useEffect} from "react";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, updateReservation } from "../utils/api";

function EditReservation() {
    const [reservationError, setReservationError] = useState(null);
    const [reservation, setReservation] = useState({});
    const { reservationId } = useParams();
    const history = useHistory();

    useEffect(() => {
        const abortController = new AbortController();
        // Load tables only once
        setReservationError(null);
        readReservation(reservationId, abortController.signal)
        .then((reservation) => {
            setReservation({
              ...reservation,
              reservation_date: reservation.reservation_date.split("T")[0],
            });
          })
          .catch(setReservationError);
    
        return () => abortController.abort();
      }, [reservationId]);


      function handleEditSubmit(updatedReservation) {
        updatedReservation = { ...updatedReservation, people: Number(updatedReservation.people) };
        if (updatedReservation.reservation_time.length === 5) {
            updatedReservation = { ...updatedReservation, reservation_time: (updatedReservation.reservation_time + ":00")}
        }
        const abortController = new AbortController();
        setReservationError(null); // Clear any previous errors
        updateReservation(updatedReservation, abortController.signal)
          .then((data) => {
            history.push(`/dashboard?date=${updatedReservation.reservation_date}`);
          })
          .catch(setReservationError);
    
        return () => abortController.abort();
      }

      function handleCancel() {
        history.push("/dashboard");
    }

    return <div>
        <ErrorAlert error={reservationError} />

        {reservation.reservation_id && <ReservationForm
        initialFormState={reservation}
        submitAction={handleEditSubmit}
        handleCancel={handleCancel}
      />}
    </div>
}


export default EditReservation;