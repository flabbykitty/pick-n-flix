import React from 'react'
import { Button } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useList } from '../contexts/ListContext'
import { Link } from 'react-router-dom'

const MovieItem = (props) => {
    const {title, overview, release_date, poster_path, id} = props.movie
    let poster = null
    const {currentUser} = useAuth()
    const { removeMovieFromList } = useList()
    
    if(poster_path) {
        poster = `https://image.tmdb.org/t/p/w200${poster_path}`
    }

    return (
        <>
            {props.type === 'edit' ? (
                <li key={id}>
                {poster ? <img src={poster}/> : <img src="https://via.placeholder.com/200x250"/>}
                    {title} ({release_date.substring(0,4)})
                    <div className="edit-buttons">
                        {/* <Button onClick={handleEditMovie}>🖋</Button> */}
                        {currentUser && <Link to={`/profile/edit/${id}`}><Button>🖋</Button></Link>}
                        <Button onClick={()=> {removeMovieFromList(props.list, id)}}>🗑</Button>
                    </div>
                </li>
            ) : (
                <div className="movie-item-add">
                    <div className="float-left">
                        {poster ? <img src={poster}/> : <img src="https://via.placeholder.com/200x250"/>}
                        {currentUser && <Link to={`/profile/add/${id}`}><Button>Add to list</Button></Link>}
                        
                    </div>
                    <div>
                        <h1>{title}</h1>
                        <span>{release_date}</span>
                        <p>{overview}</p>
                    </div>
                </div>

            )}
        </>
    )
}

export default MovieItem
