import { useState } from "react";
import axios from "axios";

export default function AddCrewmates() {
  const [crewmate, setCrewmate] = useState({
    name: "",
    role: ""
  });

  const createCrewmate = async () => {
    try {
      const res = await axios.post("http://localhost:5000/crewmates", crewmate);
      console.log("Crewmate created:", res.data);
      alert("Crewmate added successfully!");
      // Clear form
      setCrewmate({ name: "", role: "" });
    } catch (error) {
      console.error("Error creating crewmate:", error.response?.data || error);
      alert("Failed to create crewmate. Check console for details.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Add Crewmate</h1>
      <div style={{ display: "flex", flexDirection: "column", width: 300 }}>
        <input
          type="text"
          placeholder="Name"
          value={crewmate.name}
          onChange={(e) => setCrewmate({ ...crewmate, name: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <input
          type="text"
          placeholder="Role"
          value={crewmate.role}
          onChange={(e) => setCrewmate({ ...crewmate, role: e.target.value })}
          style={{ marginBottom: 8 }}
        />
      </div>
      <button onClick={createCrewmate}>Add Crewmate</button>
    </div>
  );
}
