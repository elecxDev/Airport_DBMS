import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AddGate() {
  const router = useRouter();
  const { flight_id } = router.query;

  useEffect(() => {
    if (flight_id) {
      assignGate();
    }
  }, [flight_id]);

  const assignGate = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/flights/${flight_id}/gates`);
      console.log("Gate assigned:", res.data);
      router.push(`/add-passengers-baggage/${flight_id}`);
    } catch (error) {
      console.error("Error assigning gate:", error.response?.data || error);
      alert("Failed to assign gate. Check console for details.");
    }
  };

  return (
    <div className="container">
      <h1>Assigning Gate</h1>
      <p>Assigning gate to Flight {flight_id}... Please wait.</p>
    </div>
  );
}
