import React from 'react'

const MovieItem = (props) => {
    const {title, overview, release_date, poster_path} = props.movie
    let poster = null
    
    if(poster_path) {
        poster = `https://image.tmdb.org/t/p/w200${poster_path}`
    }

    return (
        <div className="movie-item">
            {poster ? <img src={poster}/> : <img src="https://via.placeholder.com/200x250"/>}
            <div>
                <h1>{title}</h1>
                <p>{release_date}</p>
                <p>{overview}</p>
            </div>
        </div>
    )
}

export default MovieItem
