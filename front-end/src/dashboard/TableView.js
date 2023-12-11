import React, {useState} from "react";
import { deleteReservationIdFromTable, listTables, listReservationsByDate } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function TableView({ table, setTables, setReservations, date }) {
const [error, setError] = useState(null);

  async function finishTable() {
    const shouldFinish = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );

    if (shouldFinish) {
      try {
        await deleteReservationIdFromTable(table.table_id);
        const updatedTables = await listTables();
        const updatedReservations = await listReservationsByDate(date);
        setReservations(updatedReservations)
        setTables(updatedTables);
      } catch (error) {
        setError(error);
      }
    }
  }

    return (
      <div className="card card-body m-2">
        <ErrorAlert error={error} />
        <h6>Name: {table.table_name} - Capacity: {table.capacity}</h6>
        <div className="d-flex justify-content-between">
          <div>
        <p className="badge badge-secondary" data-table-id-status={table.table_id}>
        {table.reservation_id ? 
          "occupied"
         : 
          "free"
        }</p></div>
        {table.reservation_id ? (
        <button onClick={finishTable} data-table-id-finish={table.table_id} data-reservation-id-finish={table.reservation_id} className="btn btn-primary m-1">
                  Finish
                </button>
                ) : (
                  ""
                )}
      </div>
      </div>
    );
  }

export default TableView;