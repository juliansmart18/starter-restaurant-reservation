import React, { useState } from "react";
import { listReservationsByMobileNumber } from "../utils/api";
import ReservationView from "../dashboard/ReservationView";
import ErrorAlert from "../layout/ErrorAlert";

function Search() {
    const [mobileNumber, setMobileNumber] = useState("");
    const [searchedNumber, setSearchedNumber] = useState("");
    const [reservationsError, setReservationsError] = useState(null);
    const [reservations, setReservations] = useState([]);
  
    const handleInputChange = (event) => {
      setMobileNumber(event.target.value);
    };
  
    const handleSearch = () => {
      // You can make an API call or perform any action with the phone number here
      const abortController = new AbortController();
      setReservationsError(null);
      setSearchedNumber(mobileNumber);
      setMobileNumber("");
      listReservationsByMobileNumber(mobileNumber, abortController.signal)
      .then(setReservations)
      .catch((error) => {
        setReservations([]);
        setReservationsError(error);
      });
    return () => abortController.abort();
    };
  
    return (
      <div>
        <h1 className="m-2">Search</h1>
        <input
          className="form-group form-control m-2"
          type="text"
          name="mobile_number"
          placeholder="Enter a customer's phone number"
          value={mobileNumber}
          onChange={handleInputChange}
        />
        <button className="btn btn-primary m-2" type="submit" onClick={handleSearch}>Find</button>

        {reservations && reservations.length > 0 && reservations.map((reservation) => 
        <ReservationView key={reservation.reservation_id} reservation={reservation} mobileNumber={searchedNumber} setReservations={setReservations} />
        )}

        {(reservations && reservations.length === 0) && <p className="m-2">
            No reservations found</p>}

        <ErrorAlert error={reservationsError} />
      </div>
    );
  }
  
  export default Search;