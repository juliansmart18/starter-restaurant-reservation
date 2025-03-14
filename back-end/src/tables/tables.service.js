const knex = require("../db/connection");


function create(newTable) {
    return knex("tables")
      .insert({
        table_name: newTable.table_name,
        capacity: newTable.capacity,
        reservation_id: newTable.reservation_id
      })
      .returning("*");
  }


  function read(table_id) {
    return knex("tables").select("*").where({ table_id }).first();
  }

  function readReservation(reservation_id) {
    return knex("reservations").select("*").where({reservation_id}).first();
  }


function list() {
    return knex("tables")
    .select("*")
}

function listAvailable() {
    return knex("tables")
    .select("*")
    .where({ "tables.reservation_id": null })
}

function update(updatedTable) {
    return knex("tables")
      .where({ table_id: updatedTable.table_id })
      .update({
        reservation_id: updatedTable.reservation_id,
      })
      .returning("*")
      .then(table => table[0]);
  }

function updateReservationStatusToSeated(reservation_id) {
  return knex("reservations")
  .where({ reservation_id })
  .update({ status: "seated" })
  .returning("*");
}

  function deleteReservationId(table_id) {
    return knex("tables")
      .where({ table_id })
      .update({ reservation_id: null });
  }

function updateReservationStatusToFinished(reservation_id) {
  return knex("reservations")
  .where({ reservation_id })
  .update( {status: "finished"} )
  .returning("*")
}


module.exports = {
    create,
    read,
    readReservation,
    list,
    listAvailable,
    update,
    updateReservationStatusToSeated,
    updateReservationStatusToFinished,
    deleteReservationId
}