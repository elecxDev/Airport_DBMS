import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function AddPassengers() {
  const [passenger, setPassenger] = useState({
    name: "",
    seat_no: "",
    age: ""
  });
  const router = useRouter();
  const { flight_id } = router.query; // from the URL

  const addPassenger = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/flights/${flight_id}/passengers`,
        passenger
      );
      console.log("Passenger added:", res.data);
      if (res.data && res.data.passenger_id) {
        // Next step: add baggage for this passenger
        router.push(`/add-baggage/${res.data.passenger_id}`);
      } else {
        alert("Passenger added but no passenger_id returned.");
      }
    } catch (error) {
      console.error("Error adding passenger:", error.response?.data || error);
      alert("Failed to add passenger. Check console for details.");
    }
  };

  return (
    <div className="container">
      <h1>Add Passenger to Flight {flight_id}</h1>
      <input
        className="input"
        type="text"
        placeholder="Name"
        value={passenger.name}
        onChange={(e) =>
          setPassenger({ ...passenger, name: e.target.value })
        }
      />
      <input
        className="input"
        type="text"
        placeholder="Seat No"
        value={passenger.seat_no}
        onChange={(e) =>
          setPassenger({ ...passenger, seat_no: e.target.value })
        }
      />
      <input
        className="input"
        type="number"
        placeholder="Age"
        value={passenger.age}
        onChange={(e) =>
          setPassenger({ ...passenger, age: e.target.value })
        }
      />
      <button className="button" onClick={addPassenger}>
        Next (Add Baggage)
      </button>
    </div>
  );
}
