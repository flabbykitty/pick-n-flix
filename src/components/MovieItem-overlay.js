import React, { useState, useRef } from 'react'
import {Button, Overlay} from 'react-bootstrap'
import {useAuth} from '../contexts/AuthContext'
import AddOverlay from '../components/pages/Add-overlay'

const MovieItem = (props) => {
    const {title, overview, release_date, poster_path, id} = props.movie
    let poster = null
    const {currentUser} = useAuth()
    const [show, setShow] = useState(false);
    const target = useRef(null);
    
    if(poster_path) {
        poster = `https://image.tmdb.org/t/p/w200${poster_path}`
    }

    return (
        <div className="movie-item">
            <div className="float-left">
                {poster ? <img src={poster}/> : <img src="https://via.placeholder.com/200x250"/>}

                {currentUser && (
                    <>
                    <Button variant="danger" ref={target} onClick={() => setShow(!show)}>
                        Add
                    </Button>
                    <Overlay target={target.current} show={show} placement="right">
                        {({ placement, arrowProps, show: _show, popper, ...props }) => (
                        <div className="overlay"
                            {...props}
                        >
                            <AddOverlay id={id}/>
                        </div>
                        )}
                    </Overlay>
                    </>
                )}
                
            </div>
            <div>
                <h1>{title}</h1>
                <span>{release_date}</span>
                <p>{overview}</p>
            </div>
        </div>
    )
}

export default MovieItem
