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
      setCrewmate({ name: "", role: "" });
    } catch (error) {
      console.error("Error creating crewmate:", error.response?.data || error);
      alert("Failed to create crewmate. Check console for details.");
    }
  };

  return (
    <div className="container">
      <h1>Add Crewmate</h1>
      <input
        className="input"
        type="text"
        placeholder="Name"
        value={crewmate.name}
        onChange={(e) => setCrewmate({ ...crewmate, name: e.target.value })}
      />
      <input
        className="input"
        type="text"
        placeholder="Role"
        value={crewmate.role}
        onChange={(e) => setCrewmate({ ...crewmate, role: e.target.value })}
      />
      <button className="button" onClick={createCrewmate}>
        Add Crewmate
      </button>
    </div>
  );
}
