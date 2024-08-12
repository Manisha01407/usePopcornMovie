import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// import StarRating from './StarRating';


// function Test() {
//   const [movierate, setmovierate] = useState(0);

//   return (
//     <div>
//       <StarRating color='blue' maxrating={10} onsetmovie={setmovierate} />
//       <p>this movie was rated {movierate} strats</p>
//     </div>
//   );
// }


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />


    {/* <StarRating maxrating={5} message={["terrible", "bad", "okay", "good", "amazing"]} />
    <StarRating maxrating={10} size={36} color="purple" defaultrating={3} />
    <Test /> */}
  </React.StrictMode>
);
