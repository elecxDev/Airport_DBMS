import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreateFlight() {
  const [flight, setFlight] = useState({
    flight_name: "",
    from_airport: "",
    to_airport: "",
    ETA: "",
    Dep_time: ""
  });

  const router = useRouter();

  const createFlight = async () => {
    try {
      const res = await axios.post("http://localhost:5000/flights", flight);
      console.log("Flight created:", res.data);
      if (res.data && res.data.flight_id) {
        // Redirect to the next step (e.g., assign gate) or back to dashboard.
        router.push(`/add-gates/${res.data.flight_id}`);
      } else {
        alert("Flight created but no flight_id returned.");
      }
    } catch (error) {
      console.error("Error creating flight:", error.response?.data || error);
      alert("Failed to create flight. Check console for details.");
    }
  };

  return (
    <div className="container">
      <h1>Create a Flight</h1>
      <input
        className="input"
        type="text"
        placeholder="Flight Name"
        value={flight.flight_name}
        onChange={(e) => setFlight({ ...flight, flight_name: e.target.value })}
      />
      <input
        className="input"
        type="text"
        placeholder="From Airport"
        value={flight.from_airport}
        onChange={(e) => setFlight({ ...flight, from_airport: e.target.value })}
      />
      <input
        className="input"
        type="text"
        placeholder="To Airport"
        value={flight.to_airport}
        onChange={(e) => setFlight({ ...flight, to_airport: e.target.value })}
      />
      <label>
        ETA:
        <input
          className="input"
          type="datetime-local"
          onChange={(e) => setFlight({ ...flight, ETA: e.target.value })}
        />
      </label>
      <label>
        Departure Time:
        <input
          className="input"
          type="datetime-local"
          onChange={(e) => setFlight({ ...flight, Dep_time: e.target.value })}
        />
      </label>
      <button className="button" onClick={createFlight}>
        Submit
      </button>
    </div>
  );
}
