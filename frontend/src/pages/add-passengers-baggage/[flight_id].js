import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function AddPassengersBaggage() {
  const router = useRouter();
  const { flight_id } = router.query;

  const [passengerCount, setPassengerCount] = useState(0);
  const [passengers, setPassengers] = useState([]);

  const handlePassengerCountChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setPassengerCount(count);
    const newPassengers = [];
    for (let i = 0; i < count; i++) {
      newPassengers.push({
        name: "",
        seat_no: "",
        age: "",
        baggageWeight: "",
        baggageLost: false,
        baggageCustoms: false,
        baggageTransfer: false
      });
    }
    setPassengers(newPassengers);
  };

  const handleChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSubmitAll = async () => {
    try {
      for (let i = 0; i < passengers.length; i++) {
        const p = passengers[i];
        const passengerRes = await axios.post(
          `http://localhost:5000/flights/${flight_id}/passengers`,
          {
            name: p.name,
            seat_no: p.seat_no,
            age: p.age
          }
        );
        console.log("Passenger created:", passengerRes.data);
        const passenger_id = passengerRes.data.passenger_id;
        if (!passenger_id) {
          alert("No passenger_id returned for passenger " + (i + 1));
          return;
        }
        await axios.post(`http://localhost:5000/passengers/${passenger_id}/baggage`, {
          weight: p.baggageWeight,
          lost: p.baggageLost,
          customs: p.baggageCustoms,
          transfer: p.baggageTransfer
        });
        console.log("Baggage added for passenger:", passenger_id);
      }
      alert("All passengers and baggage added successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error adding passengers/baggage:", error.response?.data || error);
      alert("Failed to add passengers/baggage. Check console for details.");
    }
  };

  return (
    <div className="container">
      <h1>Add Passengers & Baggage</h1>
      <label>
        Number of Passengers:
        <input
          className="input"
          type="number"
          value={passengerCount}
          onChange={handlePassengerCountChange}
          style={{ marginLeft: "8px" }}
        />
      </label>
      {passengers.map((pass, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            padding: 5,
            margin: "10px 0",
            borderRadius: 4
          }}
        >
          <h3>Passenger #{index + 1}</h3>
          <input
            className="input"
            type="text"
            placeholder="Name"
            value={pass.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
          />
          <input
            className="input"
            type="text"
            placeholder="Seat No"
            value={pass.seat_no}
            onChange={(e) => handleChange(index, "seat_no", e.target.value)}
          />
          <input
            className="input"
            type="number"
            placeholder="Age"
            value={pass.age}
            onChange={(e) => handleChange(index, "age", e.target.value)}
          />
          <h4>Baggage Info</h4>
          <input
            className="input"
            type="number"
            placeholder="Weight"
            value={pass.baggageWeight}
            onChange={(e) => handleChange(index, "baggageWeight", e.target.value)}
          />
          <label>
            Lost?
            <input
              type="checkbox"
              checked={pass.baggageLost}
              onChange={(e) => handleChange(index, "baggageLost", e.target.checked)}
              style={{ marginLeft: "8px" }}
            />
          </label>
          <label>
            Customs?
            <input
              type="checkbox"
              checked={pass.baggageCustoms}
              onChange={(e) => handleChange(index, "baggageCustoms", e.target.checked)}
              style={{ marginLeft: "8px" }}
            />
          </label>
          <label>
            Transfer?
            <input
              type="checkbox"
              checked={pass.baggageTransfer}
              onChange={(e) => handleChange(index, "baggageTransfer", e.target.checked)}
              style={{ marginLeft: "8px" }}
            />
          </label>
        </div>
      ))}
      {passengers.length > 0 && (
        <button className="button" onClick={handleSubmitAll}>
          Submit All Passengers & Baggage
        </button>
      )}
    </div>
  );
}
