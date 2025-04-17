import { useState } from 'react';

function PredictionForm() {
  const [form, setForm] = useState({
    'min-temp': 8.0, // Default value
    'max-temp': 17.0, // Default value
    niederschlag: 0.1, // Default value
    sonnenstunden: 6.0, // Default value
    wochentag: 2, // Default: Wednesday
    monat: 4, // Default: April
  });

  const [prediction, setPrediction] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: parseFloat(value) }); // 👈 convert string to number!
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the request payload with parsed numbers
    const requestData = {
      features: Object.fromEntries(Object.entries(form).map(([key, value]) => [key, parseFloat(value)])),
    };

    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await res.json();
      setPrediction(data.prediction); // Store the prediction result
    } catch (error) {
      console.error('Error during prediction:', error);
      alert('Error fetching prediction. Please try again.');
    }
  };

  return (
    <div>
      <h1>Bike Traffic Prediction</h1>

      <div>
        <label htmlFor="min-temp">Min Temp (°C): {form['min-temp']}°C</label>
        <input
          type="range"
          id="min-temp"
          name="min-temp"
          min="-10"
          max="30"
          value={form['min-temp']}
          onChange={handleChange}
          step="0.1"
        />
      </div>

      <div>
        <label htmlFor="max-temp">Max Temp (°C): {form['max-temp']}°C</label>
        <input
          type="range"
          id="max-temp"
          name="max-temp"
          min="-10"
          max="40"
          value={form['max-temp']}
          onChange={handleChange}
          step="0.1"
        />
      </div>

      <div>
        <label htmlFor="niederschlag">Precipitation (mm): {form['niederschlag']}mm</label>
        <input
          type="range"
          id="niederschlag"
          name="niederschlag"
          min="0"
          max="100"
          value={form['niederschlag']}
          onChange={handleChange}
          step="0.1"
        />
      </div>

      <div>
        <label htmlFor="sonnenstunden">Sun Hours: {form['sonnenstunden']} hrs</label>
        <input
          type="range"
          id="sonnenstunden"
          name="sonnenstunden"
          min="0"
          max="12"
          value={form['sonnenstunden']}
          onChange={handleChange}
          step="0.1"
        />
      </div>

      <div>
        <label htmlFor="wochentag">Day of the Week:</label>
        <select
          id="wochentag"
          name="wochentag"
          value={form['wochentag']}
          onChange={handleChange}
        >
          <option value="0">Monday</option>
          <option value="1">Tuesday</option>
          <option value="2">Wednesday</option>
          <option value="3">Thursday</option>
          <option value="4">Friday</option>
          <option value="5">Saturday</option>
          <option value="6">Sunday</option>
        </select>
      </div>

      <div>
        <label htmlFor="monat">Month:</label>
        <select
          id="monat"
          name="monat"
          value={form['monat']}
          onChange={handleChange}
        >
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>

      <button onClick={handleSubmit}>Predict</button>

      {prediction !== null && (
        <h2>📈 Predicted Bikes: <strong>{prediction}</strong></h2>
      )}
    </div>
  );
}

export default PredictionForm;
