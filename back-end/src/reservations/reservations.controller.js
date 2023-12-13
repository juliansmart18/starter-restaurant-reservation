const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// validation middleware

async function reservationExists(req, res, next) {
  const reservation = await reservationsService.read(req.params.reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({
    status: 404,
    message: `Reservation with the ID ${req.params.reservationId} cannot be found.`,
  });
}

// validates data property of request

function validateReservationData(req, res, next) {
  if (!req.body.hasOwnProperty("data")) {
    return next({
      status: 400,
      message: "Request must be have a data property.",
    });
  }
  return next();
}

// validates all required properties exist and are not empty

function validateReservationProperties(req, res, next) {
  const { data = {} } = req.body;
  const requiredProperties = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];
  for (const property of requiredProperties) {
    if (!data.hasOwnProperty(property) || data[property] === "") {
      return next({
        status: 400,
        message: `Reservation must include a ${property} property.`,
      });
    }
  }
  return next();
}

// date is valid

function validateDateFormat(req, res, next) {
  const {
    data: { reservation_date },
  } = req.body;

  const dateOnly = reservation_date.split("T")[0]

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  

  if (!reservation_date || !dateRegex.test(dateOnly)) {
    return next({
      status: 400,
      message:
        "Invalid reservation_date format. Please use the YYYY-MM-DD format.",
    });
  }

  return next();
}

function validateFutureDate(req, res, next) {
  const {
    data: { reservation_date, reservation_time },
  } = req.body;

  let selectedDate = new Date(reservation_date);
  let currentDate = new Date();
  const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();
  const selectedTimeMinutes = parseInt(reservation_time.split(":")[0]) * 60 + parseInt(reservation_time.split(":")[1]);

  // Adjust the selected date by considering the time zone offset
  const timeZoneOffset = currentDate.getTimezoneOffset();
  selectedDate = new Date(selectedDate.getTime() + timeZoneOffset * 60 * 1000);
  
  // Reset the time components to midnight for accurate date comparison
  selectedDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  if (selectedDate.toISOString().split("T")[0] < currentDate.toISOString().split("T")[0] || (selectedDate.toISOString().split("T")[0] === currentDate.toISOString().split("T")[0] && selectedTimeMinutes < currentTime)) {
    return next({
      status: 400,
      message: "Reservation date must be in the future.",
    });
  }

  return next();
}

function validateIsNotTuesday(req, res, next) {
  const {
    data: { reservation_date },
  } = req.body;

  const selectedDate = new Date(reservation_date);
  const currentDate = new Date();

  // Get the time zone offset in minutes
  const timeZoneOffset = currentDate.getTimezoneOffset();

  // Adjust the selected date by adding the time zone offset
  const adjustedSelectedDate = new Date(selectedDate.getTime() + timeZoneOffset * 60 * 1000);

  if (adjustedSelectedDate.getDay() === 2) {
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesdays.",
    });
  }

  return next();
}

// time is valid

function validateTime(req, res, next) {
  const {
    data: { reservation_time },
  } = req.body;

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  const timeRegexSeconds = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

  if (!reservation_time) {
    return next({
      status: 400,
      message: "Must have a reservation_time property.",
    });
  } else if ((reservation_time.length === 5 && !timeRegex.test(reservation_time)) || (reservation_time.length === 8 && !timeRegexSeconds.test(reservation_time)) || (reservation_time.length !== 5 && reservation_time.length !== 8)) {
      return next({
        status: 400,
        message: "Invalid reservation_time format. Please use the HH:mm or HH:mm:ss format.",
      });
  }
  return next();
}

// validate reservation time is between 10:30 AM and 9:30 PM

function validateReservationTime(req, res, next) {
  const {
    data: { reservation_time },
  } = req.body;

  const isValidTime = isTimeValid(reservation_time);

  if (!isValidTime) {
    return next({
      status: 400,
      message: "Invalid reservation_time. Please select a time between 10:30 AM and 9:30 PM.",
    });
  }

  return next();
}

function isTimeValid(reservation_time) {
  const openingTime = new Date("2023-01-01T10:30:00");
  const closingTime = new Date("2023-01-01T21:30:00");
  const reservationTime = new Date("2023-01-01T" + reservation_time);

  return (
    reservationTime >= openingTime &&
    reservationTime <= closingTime
  );
}

// people is a number over 0

function validatePeople(req, res, next) {
  const {
    data: { people },
  } = req.body;

  if (typeof people !== "number" || people <= 0) {
    return next({
      status: 400,
      message: "Property 'people' must be a number greater than 0.",
    });
  }

  return next();
}

function validateReservationMobileNumber(req, res, next) {
  const {
    data: { mobile_number },
  } = req.body;
  const mobileNumberRegex = /^[\d()-]+$/;
   if (mobileNumberRegex.test(mobile_number)) {
    // If mobile_number matches the regex, move to the next middleware
    return next();
  } else {
    return next({
      status: 400,
      message: "Invalid mobile_number. It should only include (,),-, and numbers.",
    });
  }
}

// VALIDATION FOR US-05 RESERVATION STATUS

function validateStatusIsNotSeatedOrFinished(req, res, next) {
  const {
    data: { status },
  } = req.body;
   if (status === "seated" || status === "finished") {
    return next({
      status: 400,
      message: `New reservation cannot have a ${status} status.`,
    });
  }
  return next();
}

function validateStatusIsUnknown(req, res, next) {
  const {
    data: { status },
  } = req.body;
  const validStatuses = ["booked", "seated", "finished", "cancelled"];

  if (!validStatuses.includes(status)) {
    return next({
      status: 400,
      message: `Reservation cannot have a ${status} status. Valid statuses are: ${validStatuses.join(", ")}.`,
    });
  }
  return next();
}

function validateIsNotCurrentlyFinished(req, res, next) {
  const reservation = res.locals.reservation;
  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: "This reservation is already finished and cannot be updated.",
    });
  }
  return next();
}

function validateMobileNumber(req, res, next) {
  const mobile_number = req.query.mobile_number;
  const mobileNumberRegex = /^[\d()-]+$/;

  if (!mobile_number) {
    // If mobile_number is not provided, move to the next middleware
    return next();
  } else if (mobileNumberRegex.test(mobile_number)) {
    // If mobile_number matches the regex, move to the next middleware
    return next();
  } else {
    // If mobile_number is provided but doesn't match the regex, return an error
    return next({
      status: 400,
      message: "Invalid mobile_number. It should only include (,),-, and numbers.",
    });
  }
}

// CRUD operations

async function create(req, res) {
  const { data } = req.body;
  const newReservation = await reservationsService.create(data);
  res.status(201).json({ data: newReservation[0] });
}

function read(req, res) {
  const { reservation: data } = res.locals;
  res.json({ data });
}

/**
 * List handler for reservation resources
 */

async function list(req, res) {
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;
  if (date) {
    const data = await reservationsService.listByDate(date);
    data.sort((A, B) => {
      const timeA = A.reservation_time;
      const timeB = B.reservation_time;
      return timeA.localeCompare(timeB);
    });
    res.json({
      data,
    });
    

  } if (mobile_number) {
    const data = await reservationsService.listByMobileNumber(mobile_number);
    res.json({
      data,
    });
  }
}

async function update(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await reservationsService.update(updatedReservation);
  res.status(200).json({ data: data[0] });
}

module.exports = {
  create: [
    validateReservationData,
    validateReservationProperties,
    validateDateFormat,
    validateFutureDate,
    validateIsNotTuesday,
    validateTime,
    validateReservationTime,
    validateReservationMobileNumber,
    validatePeople,
    validateStatusIsNotSeatedOrFinished,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  list: [validateMobileNumber, asyncErrorBoundary(list)],
  update: [asyncErrorBoundary(reservationExists),
    validateStatusIsUnknown,
    validateIsNotCurrentlyFinished,
    asyncErrorBoundary(update)],
  updateInfo: [
    asyncErrorBoundary(reservationExists),
    validateReservationData,
    validateReservationProperties,
    validateDateFormat,
    validateFutureDate,
    validateIsNotTuesday,
    validateTime,
    validateReservationTime,
    validateReservationMobileNumber,
    validatePeople,
    asyncErrorBoundary(update)
  ]
};
