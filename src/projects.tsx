import { Link } from 'react-router-dom';

export default function Boilerplate() {
  return (
    <>
      <div className='proj'>
        {/* <h1>L'eau</h1> */}
      </div>
      <div className="opts">
        {/* <div className="pt">
          <Link to="/prediction">München Bike Traffic Predictor</Link>
        </div> */}
        <div className="pt">
          <Link to="/editor">ChronoNote</Link>
        </div>
        {/* <div className="pt">
          <Link to="/page">Page</Link>
        </div> */}
      </div>
    </>

  );
}
