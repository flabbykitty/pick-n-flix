import React, { useEffect, useState, useRef } from 'react'
import {Button, Overlay} from 'react-bootstrap'
import {useAuth} from '../contexts/AuthContext'
import {Link} from 'react-router-dom'
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
                {/* {currentUser && <Link to={`/profile/add/${id}`}><Button >Add to list</Button></Link>} */}
                {/* {currentUser && <Button type="button" className="btn btn-lg btn-danger" data-bs-toggle="popover" title="Popover title" data-bs-content="And here's some amazing content. It's very engaging. Right?">Add to list</Button>} */}


                {currentUser && (
                    <>
                    <Button variant="danger" ref={target} onClick={() => setShow(!show)}>
                        Click me to see
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
