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
      // After gate is assigned, move on to add passengers + baggage
      router.push(`/add-passengers-baggage/${flight_id}`);
    } catch (error) {
      console.error("Error assigning gate:", error.response?.data || error);
      alert("Failed to assign gate. Check console for details.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Assigning Gate to Flight {flight_id}...</h1>
      <p>Check console for logs. You will be redirected shortly.</p>
    </div>
  );
}
