import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Home() {
  const [flight, setFlight] = useState({
    flight_name: "",
    from_airport: "",
    to_airport: "",
    ETA: "",
    Dep_time: "",
    crewmate_id: "" // Foreign key referencing Crewmates
  });

  const router = useRouter();

  const createFlight = async () => {
    try {
      const res = await axios.post("http://localhost:5000/flights", flight);
      console.log("Flight created:", res.data);
      if (res.data && res.data.flight_id) {
        // After creating flight, assign a gate
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
    <div style={{ padding: 20 }}>
      <h1>Create a Flight</h1>
      <div style={{ display: "flex", flexDirection: "column", width: 300 }}>
        <input
          type="text"
          placeholder="Flight Name"
          value={flight.flight_name}
          onChange={(e) => setFlight({ ...flight, flight_name: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <input
          type="text"
          placeholder="From Airport"
          value={flight.from_airport}
          onChange={(e) => setFlight({ ...flight, from_airport: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <input
          type="text"
          placeholder="To Airport"
          value={flight.to_airport}
          onChange={(e) => setFlight({ ...flight, to_airport: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <label style={{ marginBottom: 8 }}>
          ETA:
          <input
            type="datetime-local"
            onChange={(e) => setFlight({ ...flight, ETA: e.target.value })}
          />
        </label>
        <label style={{ marginBottom: 8 }}>
          Departure Time:
          <input
            type="datetime-local"
            onChange={(e) => setFlight({ ...flight, Dep_time: e.target.value })}
          />
        </label>
        <input
          type="text"
          placeholder="Crewmate ID"
          value={flight.crewmate_id}
          onChange={(e) => setFlight({ ...flight, crewmate_id: e.target.value })}
          style={{ marginBottom: 8 }}
        />
      </div>
      <button onClick={createFlight}>Submit</button>
    </div>
  );
}
