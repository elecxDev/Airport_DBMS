require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/*
  FLIGHTS TABLE
  - flight_id (uuid, PK)
  - flight_name (varchar)
  - from_airport (varchar)
  - to_airport (varchar)
  - ETA (timestamp)
  - Dep_time (timestamp)
  - crewmate_id (uuid, FK to Crewmates)
*/
app.post("/flights", async (req, res) => {
  try {
    const { flight_name, from_airport, to_airport, ETA, Dep_time, crewmate_id } = req.body;
    const { data, error } = await supabase
      .from("Flights")
      .insert([{ flight_name, from_airport, to_airport, ETA, Dep_time, crewmate_id }])
      .select();

    if (error) throw error;
    return res.status(200).json(data[0]);
  } catch (err) {
    console.error("Error creating flight:", err);
    return res.status(400).json({ error: err.message });
  }
});

/*
  GATES TABLE
  - gate_id (uuid, PK)
  - flight_id (uuid, FK)
*/
app.post("/flights/:flight_id/gates", async (req, res) => {
  const { flight_id } = req.params;
  try {
    // Insert a new gate referencing flight_id
    const { data, error } = await supabase
      .from("Gates")
      .insert([{ flight_id }])
      .select();

    if (error) throw error;
    return res.status(200).json(data[0]);
  } catch (err) {
    console.error("Error creating gate:", err);
    return res.status(400).json({ error: err.message });
  }
});

/*
  PASSENGERS TABLE
  - passenger_id (uuid, PK)
  - name (varchar)
  - seat_no (varchar)
  - flight_id (uuid, FK)
  - age (int)
*/
app.post("/flights/:flight_id/passengers", async (req, res) => {
  const { flight_id } = req.params;
  const { name, seat_no, age } = req.body;
  try {
    const { data, error } = await supabase
      .from("Passengers")
      .insert([{ name, seat_no, age, flight_id }])
      .select();

    if (error) throw error;
    return res.status(200).json(data[0]);
  } catch (err) {
    console.error("Error adding passenger:", err);
    return res.status(400).json({ error: err.message });
  }
});

/*
  BAGGAGE TABLE
  - bag_id (uuid, PK)
  - passenger_id (uuid, FK)
  - weight (int)
  - lost (bool)
  - customs (bool)
  - transfer (bool)
*/
app.post("/passengers/:passenger_id/baggage", async (req, res) => {
  const { passenger_id } = req.params;
  const { weight, lost, customs, transfer } = req.body;
  try {
    const { data, error } = await supabase
      .from("Baggage")
      .insert([{ passenger_id, weight, lost, customs, transfer }])
      .select();

    if (error) throw error;
    return res.status(200).json(data[0]);
  } catch (err) {
    console.error("Error adding baggage:", err);
    return res.status(400).json({ error: err.message });
  }
});

/*
  CREWMATES TABLE
  - crewmate_id (uuid, PK)
  - name (varchar)
  - role (varchar)
*/
app.post("/crewmates", async (req, res) => {
  const { name, role } = req.body;
  try {
    const { data, error } = await supabase
      .from("Crewmates")
      .insert([{ name, role }])
      .select();

    if (error) throw error;
    return res.status(200).json(data[0]);
  } catch (err) {
    console.error("Error creating crewmate:", err);
    return res.status(400).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));
