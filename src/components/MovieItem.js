import React from 'react'
import { Button } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useList } from '../contexts/ListContext'
import { Link } from 'react-router-dom'
import { BsPencil, BsTrash } from "react-icons/bs";

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
            {props.type === 'edit' && (
                <li>
                {poster ? <img src={poster}/> : <img src="https://via.placeholder.com/200x250"/>}
                    <Link to={`/movie/${id}`}>{title}</Link> ({release_date.substring(0,4)})
                    <div className="edit-buttons">
                        {currentUser && <Link to={`/profile/edit/${id}`}>
                        <Button>
                            <BsPencil/>
                        </Button></Link>}
                        <Button className="ml-2" onClick={()=> {removeMovieFromList(props.list, id)}}>
                            <BsTrash/>
                        </Button>
                    </div>
                </li>
            )}

            {props.type === 'trending' && (
                <div className="movie-item-trending">
                    <Link to={`/movie/${id}`}>{poster ? <img src={poster}/> : <img src="https://via.placeholder.com/200x250"/>}</Link>
                    
                </div>
            )}

            {!props.type && (
                <div className="movie-item-add">
                    <div className="float-left">
                        {poster ? <img src={poster}/> : <img src="https://via.placeholder.com/200x250"/>}
                        {currentUser && <Link to={`/profile/add/${id}`}><Button>Add</Button></Link>}
                        
                    </div>
                    <div>
                        <Link to={`/movie/${id}`}><h1>{title}</h1></Link>
                        <span>{release_date}</span>
                        <p>{overview}</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default MovieItem
