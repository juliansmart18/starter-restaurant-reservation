import React, {useState} from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { cancelReservation, listReservationsByDate } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationView({reservation, date, setReservations}) {
const [errorMessage, setErrorMessage] = useState(null);


async function handleCancel() {
  const shouldCancel = window.confirm(
    "Do you want to cancel this reservation? This cannot be undone."
  );

  if (shouldCancel) {
    try {
      await cancelReservation(reservation.reservation_id);
      const updatedReservations = await listReservationsByDate(date);
      setReservations(updatedReservations)
    } catch (error) {
      setErrorMessage(error)
    }
  }
  }

  const {first_name, last_name, people, mobile_number, status, reservation_id, reservation_time, reservation_date} = reservation

    return (
        <div>
          <ErrorAlert error={errorMessage}/>
<div className="card m-2">
  <div className="card-body">
    <h4 className="card-title">{first_name} {last_name}</h4>
    <h6 className="card-subtitle mb-2 text-muted">Party of {people}</h6>
    <p className="card-text">
      Mobile Number: {mobile_number}
    </p>
    <p className="card-text">
      Time: {reservation_time}
    </p>
    <p>Date: {reservation_date}</p>
    <p data-reservation-id-status={reservation_id}>Status: {status}</p>
    
  </div>
  <div class="d-flex justify-content-between">
  <div>
  {(status === "booked") && <Link to={`/reservations/${reservation_id}/seat`} className="btn btn-info m-2">Seat</Link>}
  </div>
  <div>
    <Link to={`/reservations/${reservation_id}/edit`} className="btn btn-info m-2">Edit</Link>
    <button onClick={handleCancel} data-reservation-id-cancel={reservation_id} className="btn btn-danger m-2">Cancel</button>
  </div>
  </div>
</div>
        </div>
    )
}

export default ReservationView;