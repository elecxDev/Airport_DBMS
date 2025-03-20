import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function Dashboard() {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    async function fetchFlights() {
      try {
        const res = await axios.get("http://localhost:5000/flights");
        setFlights(res.data);
      } catch (error) {
        console.error("Error fetching flights:", error.response?.data || error);
      }
    }
    fetchFlights();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Flights Dashboard</h1>
        <Link href="/create-flight" className="button">
            Create Flight
        </Link>
      </header>
      {flights.length === 0 ? (
        <p>No flights available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Flight Name</th>
              <th>From</th>
              <th>To</th>
              <th>ETA</th>
              <th>Departure</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight.flight_id}>
                <td>{flight.flight_name}</td>
                <td>{flight.from_airport}</td>
                <td>{flight.to_airport}</td>
                <td>{new Date(flight.ETA).toLocaleString()}</td>
                <td>{new Date(flight.Dep_time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
