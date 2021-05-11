import React from 'react'
import SearchBar from '../SearchBar'
import MovieItem from '../MovieItem'
import axios from 'axios'
import { useQuery } from 'react-query'

const Home = () => {
    const apiKey = process.env.REACT_APP_THE_MOVIE_DB_API_KEY

    const getMovies = async (apiKey, query, page) => {
        const res = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`)
        return res.data
    }

    const { isLoading, data, error } = useQuery('movie', () => getMovies(apiKey))

    if (isLoading) {
		return (
			<h1>Loading...</h1>
		);
	}

	if (error) {
		return (
			<div className="alert alert-warning">
				<p><strong>Error message:</strong> {error.message}</p>
			</div>
		)
    }

    return (
        <div id="home">
            <SearchBar/>

            <h1>Trending this week</h1>
            <div className="movie-list-trending">
            {data.results ? (
                <>
                {data.results.slice(0, 10).map((movie, index) => (
                    <MovieItem key={index} movie={movie} type='trending' />
                ))}
                </>
            ) : (
                <p>Loading...</p>
            )}
            </div>
        </div>
    )
}

export default Home
