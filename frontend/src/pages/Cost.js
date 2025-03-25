import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, onValue, set, push } from "firebase/database";

const Cost = () => {
  const [electricity, setElectricity] = useState({ power: "", price: "", total: 0 });
  const [fertilizer, setFertilizer] = useState({ amount: "", price: "", total: 0 });
  const [water, setWater] = useState({ volume: "", price: "", total: 0 });
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(() => {
    const notesRef = ref(database, "notes");
    onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSavedNotes(Object.values(data));
      }
    });
  }, []);

  const handleCalculate = (type) => {
    if (type === "electricity") {
      const total = (parseFloat(electricity.power) || 0) * (parseFloat(electricity.price) || 0);
      setElectricity({ ...electricity, total });
    } else if (type === "fertilizer") {
      const total = (parseFloat(fertilizer.amount) || 0) * (parseFloat(fertilizer.price) || 0);
      setFertilizer({ ...fertilizer, total });
    } else if (type === "water") {
      const total = (parseFloat(water.volume) || 0) * (parseFloat(water.price) || 0);
      setWater({ ...water, total });
    }
  };

  const handleSaveNote = () => {
    if (notes.trim()) {
      const newNote = { text: notes, timestamp: new Date().toLocaleString() };
      const notesRef = ref(database, "notes");
      push(notesRef, newNote);
      setNotes("");
    }
  };

  return (
    <div className="container">
      <h1>Cost Monitoring</h1>
      <div className="content">
        <div className="cost-sections">
          <div className="cost-section">
            <h2>Electricity Cost</h2>
            <input type="number" placeholder="Power (kWh)" value={electricity.power} onChange={(e) => setElectricity({ ...electricity, power: e.target.value })} />
            <input type="number" placeholder="Price per kWh" value={electricity.price} onChange={(e) => setElectricity({ ...electricity, price: e.target.value })} />
            <button onClick={() => handleCalculate("electricity")}>Calculate</button>
            <p>Total Cost: ${electricity.total.toFixed(2)}</p>
          </div>

          <div className="cost-section">
            <h2>Fertilizer Cost</h2>
            <input type="number" placeholder="Amount (kg)" value={fertilizer.amount} onChange={(e) => setFertilizer({ ...fertilizer, amount: e.target.value })} />
            <input type="number" placeholder="Price per kg" value={fertilizer.price} onChange={(e) => setFertilizer({ ...fertilizer, price: e.target.value })} />
            <button onClick={() => handleCalculate("fertilizer")}>Calculate</button>
            <p>Total Cost: ${fertilizer.total.toFixed(2)}</p>
          </div>

          <div className="cost-section">
            <h2>Water Cost</h2>
            <input type="number" placeholder="Volume (m³)" value={water.volume} onChange={(e) => setWater({ ...water, volume: e.target.value })} />
            <input type="number" placeholder="Price per m³" value={water.price} onChange={(e) => setWater({ ...water, price: e.target.value })} />
            <button onClick={() => handleCalculate("water")}>Calculate</button>
            <p>Total Cost: ${water.total.toFixed(2)}</p>
          </div>
        </div>

        <div className="notes-section">
          <h2>Notes</h2>
          <textarea placeholder="Enter your notes here..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
          <button onClick={handleSaveNote}>Save Note</button>
          <div className="saved-notes">
            <h3>Saved Notes</h3>
            <ul>
              {savedNotes.map((note, index) => (
                <li key={index}><strong>{note.timestamp}:</strong> {note.text}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: auto;
          text-align: center;
          font-family: Arial, sans-serif;
          color: #333;
          background: #f5f5f5;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }
        .content {
          display: flex;
          justify-content: space-between;
        }
        .cost-sections {
          flex: 2;
        }
        .cost-section, .notes-section {
          background: white;
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }
        .notes-section {
          flex: 1;
          margin-left: 20px;
        }
        .saved-notes {
          margin-top: 10px;
          text-align: left;
        }
        .saved-notes ul {
          list-style: none;
          padding: 0;
        }
        .saved-notes li {
          padding: 5px 0;
        }
        h1 {
          color: #2c3e50;
        }
        h2 {
          color: #2980b9;
        }
        input, textarea {
          width: 90%;
          padding: 8px;
          margin: 5px 0;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        textarea {
          height: 100px;
          resize: none;
        }
        button {
          background: #27ae60;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: 0.3s;
        }
        button:hover {
          background: #2ecc71;
        }
        p {
          font-weight: bold;
          color: #e74c3c;
        }
      `}</style>
    </div>
  );
};

export default Cost;