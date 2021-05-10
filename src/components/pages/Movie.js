import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { Button } from 'react-bootstrap'

const Movie = () => {
    const apiKey = process.env.REACT_APP_THE_MOVIE_DB_API_KEY
    const { id } = useParams()
    const { currentUser } = useAuth()
    let poster = null
    let backdrop = null

    const getMovie = async (apiKey, id) => {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`)
        console.log(res.data)
        return res.data
    }

    const { isLoading, data, error } = useQuery('movie', () => getMovie(apiKey, id))
    console.log('data', data)

    if(!isLoading && data.poster_path) {
        poster = `https://image.tmdb.org/t/p/w200${data.poster_path}`
    }

    if(!isLoading && data.backdrop_path) {
        backdrop = `https://image.tmdb.org/t/p/w200${data.backdrop_path}`
    }

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
        <div id="movie">
            <div className="float-left movie-poster">
                {poster ? <img src={poster}/> : <img src="https://via.placeholder.com/200x250"/>}
                {currentUser && <Link to={`/profile/add/${id}`}><Button>Add</Button></Link>}
                <div className="movie-card">
                {data.original_title && (<p>Original title: {data.original_title}</p>)}
                {data.original_language && (<p>Original language: {data.original_language}</p>)}
                {data.budget > 0 && (<p>Budget: {data.budget}</p>)}
                {data.runtime > 0 && (<p>Runtime: {data.runtime} min</p>)}
                {data.genres.length > 0 && (<ul>Genres:{data.genres.map(g => {
                    return (<li>{g.name}</li>)
                })}</ul>)}
                </div>
            </div>

            <div className="movie-info">
                <h1>{data.title}</h1>
                <p>{data.release_date}</p>
                <p>{data.overview}</p>
                {backdrop ? <img src={backdrop}/> : <img src="https://via.placeholder.com/200x250"/>}

            </div>




        </div>

    )
}

export default Movie
