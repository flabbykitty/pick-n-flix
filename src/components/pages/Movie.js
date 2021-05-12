import React, {useEffect} from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { Button } from 'react-bootstrap'

const Movie = () => {
    const apiKey = process.env.REACT_APP_THE_MOVIE_DB_API_KEY
    const { id } = useParams()
    const { currentUser } = useAuth()

    const getMovie = async (apiKey, id) => {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=videos,similar`)
        return res.data
    }

    const getCast = async (apiKey, id) => {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-US`)
        return res.data
    }

    const { data: movie, error: movieError, isLoading: movieLoading } = useQuery(
        ['movie', id],
        () => getMovie(apiKey, id)
    )

    const { data: cast, error: castError, isLoading: castLoading } = useQuery(
        ['cast', id],
        () => getCast(apiKey, id)
    )

    if (movieLoading || castLoading) {
		return (
			<h1>Loading...</h1>
		)
	}

    if (movieError) {
		return (
			<div className="alert alert-warning">
				<p><strong>Error message:</strong> {movieError.message}</p>
			</div>
		)
    }

	if (castError) {
		return (
			<div className="alert alert-warning">
				<p><strong>Error message:</strong> {castError.message}</p>
			</div>
		)
    }

    return (
        <div id="movie">
            <div className="row">
                <div className="col-6 col-md-3">
                    <div className="movie-poster">
                        {movie.poster_path ? <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/> : <img src="https://via.placeholder.com/200x250"/>}
                    </div>

                    {currentUser && <Link to={`/profile/add/${id}`}><Button>Add</Button></Link>}

                    <div className="movie-card">
                        {movie.original_title && (<p>Original title: {movie.original_title}</p>)}
                        {movie.original_language && (<p>Original language: {movie.original_language}</p>)}
                        {movie.budget > 0 && (<p>Budget: {movie.budget}</p>)}
                        {movie.runtime > 0 && (<p>Runtime: {movie.runtime} min</p>)}
                        {movie.release_date && (<p>Release date: {movie.release_date}</p>)}
                        {movie.genres && (<ul>Genres:{movie.genres.map(g => 
                            (<li>{g.name}</li>)
                        )}</ul>)}
                        {movie.homepage && (<a href={movie.homepage}>Homepage</a>)}
                    </div>
                </div>

                <div className="col-6">
                    <div className="movie-info">
                        {movie.title && (<h1>{movie.title}</h1>)}
                        {movie.release_date && (<p>{movie.release_date.slice(0, 4)}</p>)}
                        {movie.overview && (<p>{movie.overview}</p>)}

                        <div className="backdrop-container">
                            {movie.backdrop_path ? <img src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}/> : <img src="https://via.placeholder.com/200x250"/>}
                            {movie.tagline && (<p className="backdrop-tagline d-none d-md-block">{movie.tagline}</p>)}
                        </div>

                        <div className="movie-trailer">
                            {movie.videos.results[0] && (
                                <iframe src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`} frameBorder="0" allowFullScreen></iframe>
                            )}
                        </div>
                    </div>
                </div>


                <div className="col-md-3">
                    {movie.similar.results.length > 0 && (
                        <div className="movie-similar">
                            <p>You might also like</p>
                            <div className="movie-similar-grid">
                            {movie.similar.results.slice(0, 10).map(s => (
                                <>
                                    {s.poster_path ? <Link to={`/movie/${s.id}`}><img src={`https://image.tmdb.org/t/p/w200${s.poster_path}`}/></Link> : <img src="https://via.placeholder.com/200x250"/>}
                                    
                                </>
                            ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="movie-cast-crew">

                <div className="row">
                    <div className="col-12 movie-cast">
                        <h2>Cast:</h2>
                        {cast.cast && (<ul className="movie-cast-list">{cast.cast.map(c => 
                            (
                                <>
                                    {c.profile_path && (
                                        <li className="movie-cast-item">
                                            {c.profile_path && <img src={`https://image.tmdb.org/t/p/w200${c.profile_path}`}/>}
                                            {c.profile_path && (<p className="movie-cast-item-name">{c.name}</p>)}
                                            {c.profile_path && (<p className="movie-cast-item-character">{c.character}</p>)}
                                        </li>
                                    )}
                                </>
                            )
                        )}</ul>)}
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 movie-cast">
                        <h2>Crew:</h2>
                        {cast.crew && (<ul className="movie-cast-list">{cast.crew.map(c => 
                            (
                                <>
                                    {c.profile_path && (
                                        <li className="movie-cast-item">
                                            {c.profile_path && <img src={`https://image.tmdb.org/t/p/w200${c.profile_path}`}/>}
                                            {c.profile_path && (<p className="movie-cast-item-name">{c.name}</p>)}
                                            {c.profile_path && (<p className="movie-cast-item-character">{c.job}</p>)}
                                        </li>
                                    )}
                                </>
                            )
                        )}</ul>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Movie
