import { useState } from 'react';

function PredictionForm() {
  const [form, setForm] = useState({
    'min-temp': 13.0,
    'max-temp': 25.0,
    niederschlag: 4,
    sonnenstunden: 7.0,
    wochentag: 4,
    monat: 7,
  });

  const [prediction, setPrediction] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = parseFloat(value);

    setForm(prevForm => {
      let updatedForm = { ...prevForm, [name]: newValue };

      if (name === 'min-temp' && newValue > prevForm['max-temp']) {
        updatedForm['max-temp'] = newValue;
      }

      if (name === 'max-temp' && newValue < prevForm['min-temp']) {
        updatedForm['min-temp'] = newValue;
      }

      return updatedForm;
    });
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the request payload with parsed numbers
    const requestData = {
      features: Object.fromEntries(Object.entries(form)),

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
      <h1 className="heading">Bike Traffic Prediction</h1>
      <div className="options flex-col space-y-1">
        <div className="flex justify-between">
          <label htmlFor="min-temp">Min Temp (°C)</label>
          <span>{form['min-temp']}°C</span>
        </div>
        <input
          className="input-width w-full"
          type="range"
          id="min-temp"
          name="min-temp"
          min="-31.6"
          max="37"
          value={form['min-temp']}
          onChange={handleChange}
          step="0.1"
        />
      </div>


      <div className='options flex-col space-y-1'>
        <div className="flex justify-between">
          <label htmlFor="max-temp">Max Temp (°C)</label>
          <span>{form['max-temp']}°C</span>
        </div>
        <input
          className="input-width w-full"
          type="range"
          id="max-temp"
          name="max-temp"
          min="-31.6"
          max="37"
          value={form['max-temp']}
          onChange={handleChange}
          step="0.1"
        />
      </div>

      <div className='options flex-col space-y-1'>
        <div className="flex justify-between">
          <label htmlFor="niederschlag">Precipitation (mm)</label>
          <span>{form['niederschlag']}mm</span>
        </div>
        <input
          className="input-width w-full"
          type="range"
          id="niederschlag"
          name="niederschlag"
          min="0"
          max="155"
          value={form['niederschlag']}
          onChange={handleChange}
          step="0.1"
        />
      </div>

      <div className='options flex-col space-y-1'>
        <div className="flex justify-between">
          <label htmlFor="sonnenstunden">Sun Hours</label>
          <span>{form['sonnenstunden']} hrs</span>
        </div>
        <input
          className="input-width w-full"
          type="range"
          id="sonnenstunden"
          name="sonnenstunden"
          min="0"
          max="15"
          value={form['sonnenstunden']}
          onChange={handleChange}
          step="0.1"
        />
      </div>


      <div className='options-2 flex justify-between'>
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

      <div className='options-2 flex justify-between'>
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
