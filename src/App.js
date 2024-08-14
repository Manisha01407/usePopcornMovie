import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { clear } from "@testing-library/user-event/dist/clear";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const Key = "127ad434";
// const tempquery = "interstellar";
// const query = "instellar";


export default function App() {

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [error, seterror] = useState("");
  const [selectid, setselectid] = useState(null);

  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(() => {
    const storedValue = localStorage.getItem("watched");
    // return JSON.parse(storedValue);
    return storedValue ? JSON.parse(storedValue) : [];
  });


  function handileselecmovie(id) {
    setselectid((selectid) => (selectid === id) ? null : id);
  }

  function handileclosemovie(id) {
    setselectid(null);
  }

  function handleaddwatched(movie) {
    setWatched((watched) => [...watched, movie])
  }

  function handildeletewatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(function () {
    function watchedlocalstorage() {
      localStorage.setItem("watched", JSON.stringify(watched));
    }
    watchedlocalstorage();
  }, [watched]);

  useEffect(function () {

    const controller = new AbortController();

    async function fetchMovie() {
      try {
        setisLoading(true);
        seterror('');
        const res = await fetch(`https://www.omdbapi.com/?apikey=${Key}&s=${query}`, { signal: controller.signal });

        if (!res.ok) throw new Error("something went wrong with fetching movie")

        const data = await res.json()
        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search)
        seterror('');

      } catch (err) {
        console.log(err.message);
        if (err.name !== "AbortError") {
          seterror(err.message);
        }
      } finally {
        setisLoading(false);
      }
    }

    if (!query.length) {
      seterror("");
      setMovies([]);
      return;
    }
    handileclosemovie();
    fetchMovie();
    return function () {
      controller.abort();
    }
  }, [query]);

  // fetch(`http://www.omdbapi.com/?apikey=${Key}&s=interstellar`).then((res) => res.json()).then((data) => console.log(data));

  return (
    <>
      <Navbar>
        <Logo />
        <Input query={query} setQuery={setQuery} />
        <Result movies={movies} />
      </Navbar>
      <Main >
        <Box>
          {/* {isLoading ? <Loading /> : <Movielist movies={movies} />} */}
          {isLoading && <Loading />}
          {!isLoading && !error && <Movielist movies={movies} onselectmovie={handileselecmovie} />}
          {error && <Errormessage message={error} />}

        </Box>
        <Box>

          {
            selectid ? <Moviedeatils selectid={selectid} onclosemovie={handileclosemovie} onaddwatched={handleaddwatched} watched={watched} /> :
              <>
                <Watchedsummary watched={watched} />
                <Watchedmovielist watched={watched} ondeletewatched={handildeletewatched} />
              </>
          }
        </Box>
      </Main>
    </>
  );
}

function Loading() {
  return <p className="loader">Loading...</p>
}

function Errormessage({ message }) {
  return <p className="error">
    <span>😟</span>{message}
  </p>
}

function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Input({ query, setQuery }) {

  const inputEl = useRef(null);

  useEffect(function () {

    function callback(e) {
      if (document.activeElement === inputEl.current) return;

      if (e.code === "Enter") {
        inputEl.current.focus();
        setQuery("");
      }
    }

    document.addEventListener("keydown", callback);
    return () => document.addEventListener("keydown", callback);

  }, [setQuery]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function Result({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return (
    <main className="main">
      {children}
    </main>
  );
}

function Box({ children }) {

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// function Searchbox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);
//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <Watchedsummary watched={watched} />
//           <Watchedmovielist watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function Movielist({ movies, onselectmovie }) {

  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onselectmovie={onselectmovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onselectmovie }) {
  return (
    <li onClick={() => onselectmovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Moviedeatils({ selectid, onclosemovie, onaddwatched, watched }) {

  const [movie, setMovie] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [userRating, setuserrating] = useState('');
  const iswatched = watched.map(movie => movie.imdbID).includes(selectid);
  const watcheduserrating = watched.find((movie) => movie.imdbID === selectid)?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handileadd() {
    const newWacthedMovie = {
      imdbID: selectid,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: runtime.split(" ").at(0),
      userRating,
    };
    onaddwatched(newWacthedMovie);
    onclosemovie();
  }

  useEffect(function () {
    function callback(e) {
      if (e.code === "Escape") {
        onclosemovie();
      }
    }

    document.addEventListener('keydown', callback);
    return function () {
      document.removeEventListener('keydown', callback);
    }
  }, [onclosemovie])

  useEffect(function () {
    async function getMoviedetails() {
      setisLoading(true);
      const res = await fetch(`https://www.omdbapi.com/?apikey=${Key}&i=${selectid}`);
      const data = await res.json();
      setMovie(data);
      setisLoading(false);
    }
    getMoviedetails();
  }, [selectid]);

  useEffect(function () {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return function () {
      document.title = "usePopcorn";
    }

  }, [title])

  return (
    <div className="details">
      {isLoading ? <Loading /> :
        <>
          <header>
            <button className="btn-back" onClick={onclosemovie}>&larr;</button>
            <img src={poster} alt={`poster of ${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p><span>⭐</span>{imdbRating} IMDB rating</p>
            </div>
          </header>
          <section>
            <div className="rating">
              {
                !iswatched ?
                  <>
                    <StarRating maxrating={10} size={26} onsetrating={setuserrating} />
                    {userRating > 0 && (
                      <button className="btn-add" onClick={handileadd}> + Add to list</button>
                    )}
                  </>
                  : <p>You rated this movie with {watcheduserrating} <span>⭐</span></p>
              }
            </div>

            <p><em>{plot}</em></p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      }
    </div>
  );
}

function Watchedsummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(1)} min</span>
        </p>
      </div>
    </div>
  );
}

function Watchedmovielist({ watched, ondeletewatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <Watchedmovie movie={movie} key={movie.imdbID} ondeletewatched={ondeletewatched} />
      ))}
    </ul>
  );
}

function Watchedmovie({ movie, ondeletewatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime}</span>
        </p>
        <button className="btn-delete" onClick={() => ondeletewatched(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}