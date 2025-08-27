import React, {useState , useEffect} from 'react'
import './App.css'
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";
import {getTrendingMovies, updateSearchCount} from "./appwrite.js";
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

function App() {
    const [searchTerm, setSearchTerm] = useState('')
    const[errorMessage, setErrorMessage] = useState('')
    const[movieList, setMovieList] = useState([]);
    const[trendingMovies,setTrendingMovies] = useState([])
    const[isLoading, setIsLoading] = useState(false);
    const[debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    //debounce to prevent too many api calls
    useDebounce(()=> setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    const fetchMovies = async(query = '') => {
        setIsLoading(true);
        setErrorMessage('');
        try{
        const endpoint=  query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                :  `${API_BASE_URL}/discover/movie?sort_by/popularity.desc`;
        const response = await fetch(endpoint, API_OPTIONS);
       if(!response.ok){
         throw new Error('failed to fetch movies');
        }
       const data = await response.json();
       if(data.response === 'false'){
           setErrorMessage(data.Error || 'failed to fetch movies');
           setMovieList( []);
           return;
       }
            const results = Array.isArray(data.results) ? data.results : [];
            setMovieList(results);

            if (query && results.length > 0){
           await updateSearchCount(query,results[0]);
       }
        } catch(error){
            console.error(`error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies try later.');
        }finally {
            setIsLoading(false);
        }
    }
    const loadTrendingMovies = async() => {
        try{
            const movies = await getTrendingMovies();
            setTrendingMovies(movies)
            }catch (error){
            console.error(`Error fetching trending movies: ${error}`);
        }
        }
    useEffect(()=>{
        fetchMovies(debouncedSearchTerm);
    },[debouncedSearchTerm ])

    useEffect(() => {
        loadTrendingMovies();
    }, []);

  return (
      <main>
          <div className="pattern"/>
          <div className="wrapper">
              <header>
                  <img src="./hero.png" alt="Hero Banner" />
                  <h1>Find <span className="text-gradient">Movies</span>You'll Enjoy without the Hassle</h1>
                  <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
              </header>
              {trendingMovies.length > 0 && (
                  <section className="trending">
                      <h2> Trending Movies</h2>
                      <ul>
                          {trendingMovies.map((movie , index) => (
                              <li key={movie.$id}>
                              <p>{index +1}</p>
                                  <img src={movie.poster_url} alt={movie.title} />
                              </li>
                          ))}
                      </ul>
                  </section>
              )}
              <section className="all-movies">

                  <h2 >All movies</h2>

                  {isLoading ? (
                      <Spinner />
                      ): errorMessage ? (
                      <p className="text-red-500">{errorMessage}</p>
                      ): (
                      <ul>
                          {movieList.map((movie) => (
                             <MovieCard key={movie.id} movie={movie}/>
                              ))}
                      </ul>
                  )}
              </section>
          </div>
      </main>
  )
}

export default App