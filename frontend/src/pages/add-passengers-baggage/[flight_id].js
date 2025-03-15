import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function AddPassengersBaggage() {
  const router = useRouter();
  const { flight_id } = router.query;

  // Number of passengers to add
  const [passengerCount, setPassengerCount] = useState(0);

  // Array of passenger + baggage data
  // Each item will look like: {
  //   name: "", seat_no: "", age: "",
  //   baggageWeight: "", baggageLost: false, baggageCustoms: false, baggageTransfer: false
  // }
  const [passengers, setPassengers] = useState([]);

  // Handle the "number of passengers" input
  const handlePassengerCountChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setPassengerCount(count);
    // Initialize an array with 'count' blank entries
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

  // Handle changes to each passenger's form fields
  const handleChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  // Submit all passengers + baggage in a loop
  const handleSubmitAll = async () => {
    try {
      for (let i = 0; i < passengers.length; i++) {
        const p = passengers[i];

        // 1) Create the passenger
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
          alert("No passenger_id returned for passenger " + i);
          return;
        }

        // 2) Create the baggage for that passenger
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
    <div style={{ padding: 20 }}>
      <h1>Add Passengers & Baggage to Flight {flight_id}</h1>

      <label style={{ display: "block", marginBottom: 8 }}>
        Number of Passengers:
        <input
          type="number"
          value={passengerCount}
          onChange={handlePassengerCountChange}
          style={{ marginLeft: 8 }}
        />
      </label>

      {/* Render forms for each passenger */}
      {passengers.map((pass, index) => (
        <div key={index} style={{ border: "1px solid #ccc", margin: "10px 0", padding: 10 }}>
          <h3>Passenger #{index + 1}</h3>
          <div style={{ display: "flex", flexDirection: "column", width: 300 }}>
            <input
              type="text"
              placeholder="Name"
              value={pass.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <input
              type="text"
              placeholder="Seat No"
              value={pass.seat_no}
              onChange={(e) => handleChange(index, "seat_no", e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <input
              type="number"
              placeholder="Age"
              value={pass.age}
              onChange={(e) => handleChange(index, "age", e.target.value)}
              style={{ marginBottom: 8 }}
            />

            <h4>Baggage Info</h4>
            <input
              type="number"
              placeholder="Weight"
              value={pass.baggageWeight}
              onChange={(e) => handleChange(index, "baggageWeight", e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <label style={{ marginBottom: 8 }}>
              Lost?
              <input
                type="checkbox"
                checked={pass.baggageLost}
                onChange={(e) => handleChange(index, "baggageLost", e.target.checked)}
                style={{ marginLeft: 8 }}
              />
            </label>
            <label style={{ marginBottom: 8 }}>
              Customs?
              <input
                type="checkbox"
                checked={pass.baggageCustoms}
                onChange={(e) => handleChange(index, "baggageCustoms", e.target.checked)}
                style={{ marginLeft: 8 }}
              />
            </label>
            <label style={{ marginBottom: 8 }}>
              Transfer?
              <input
                type="checkbox"
                checked={pass.baggageTransfer}
                onChange={(e) => handleChange(index, "baggageTransfer", e.target.checked)}
                style={{ marginLeft: 8 }}
              />
            </label>
          </div>
        </div>
      ))}

      {/* Submit all passengers + baggage */}
      {passengers.length > 0 && (
        <button onClick={handleSubmitAll}>Submit All Passengers & Baggage</button>
      )}
    </div>
  );
}
