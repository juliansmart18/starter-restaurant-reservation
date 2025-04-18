const tables = [
{
  "table_name": "Bar #1",
  "capacity": 1
},
{
  "table_name": "Bar #2",
  "capacity": 1
},
{
  "table_name": "#1",
  "capacity": 6
},
{
  "table_name": "#2",
  "capacity": 6
},
]


exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
    .then(function () {
      // Inserts seed entries
      return knex("tables").insert(tables);
    });
};
