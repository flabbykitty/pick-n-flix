import React, { useEffect, useState, useContext, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { AuthContext } from '../../contexts/AuthContext'
import { ListContext } from '../../contexts/ListContext'
import { BsStar, BsStarFill } from "react-icons/bs";
import Rating from 'react-rating'

import firebase, { db } from '../../firebase/index'

const Edit = () => {
    let navigate = useNavigate()
    const { currentUser } = useContext(AuthContext)
    const { movie,
            listNames,
            seen,
            setSeen,
            own,
            setOwn,
            dateSeen,
            setDateSeen,
            format,
            setFormat,
            rating,
            setRating,
            checkedLists,
            setCheckedLists,
            listsThatContainMovie,
            getLists,
            getArrayOfLists, 
            removeMovieFromList,
            getWhatListsContainsMovie,
            } = useContext(ListContext)
    const { id } = useParams()
    const [showAddListInput, setShowAddListInput] = useState(false)
    const addListRef = useRef()

    const handleAddList = () => {
        db.collection("lists").add({
            list_name: addListRef.current.value,
            user_id: currentUser.uid
        })
        .then(() => {
            getLists()
            setShowAddListInput(false)
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }

    useEffect(() => {
        getArrayOfLists()
        getWhatListsContainsMovie(id)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        // go through all the lists that the user has
        // if the current list is not checked, remove movie from that list
        // if the current list is checked, update the movie
        listNames.forEach(list => {
            if(checkedLists.includes(list)) {
                // update the movie
                db.collection("lists").where("user_id", "==", currentUser.uid).where("list_name", "==", list).get()
                .then((snap) => {
                    // for each list, check if the movie exists in there and if the current checked list is
                    snap.forEach(doc => {
                        let updatedMovie = doc.data().movies.find(m => m.id == id)
                        if(updatedMovie) {
                            updatedMovie.own = own
                            updatedMovie.format = format
                            updatedMovie.seen = seen
                            updatedMovie.date_seen = dateSeen
                            updatedMovie.rating = rating
                            const newMoviesArray = doc.data().movies.filter(m => m.id != id)
                            newMoviesArray.push(updatedMovie)
                            db.collection("lists").doc(doc.id).set({
                                ...doc.data(), movies: newMoviesArray
                            })
                            .then(() => {
                                navigate('/profile')
                            })
                            .catch(error => {
                                // TODO: ERROR 
                            })
                        } else {
                            // add the movie to the list?
                            db.collection("lists").doc(doc.id).update({
                                movies: firebase.firestore.FieldValue.arrayUnion(
                                    {...movie, 
                                    own, 
                                    seen, 
                                    date_seen: dateSeen,
                                    rating,
                                    ...(own && { format })
                                    })
                            })
                            .then(() => {
                                navigate('/profile')
                            })
                            .catch(error => {
                                // TODO: ERROR
                            })
                        }
                    })
                })
                .catch(error => {
                    // TODO: ERROR
                })
            } else {
                // remove movie from list and then navigate
                removeMovieFromList(list, id)
				navigate('/profile')
            }
        })
    }

    if(!movie || listsThatContainMovie.length <= 0) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div id="add">
            <div className="add-info-container d-md-flex">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}></img>
                <div>
                    <div className="add-header">
                        <h1>{movie.title}</h1>
                        {movie.release_date}
                    </div>
                    <div className="add-body">
                        <p>{movie.overview}</p>
                    </div>

                </div>
            </div>

            <Form onSubmit={handleSubmit} className="add-form-container">
                <div className="add-form-input-container">
                    <div>
                        <Form.Group controlId="formSeenCheckbox">
                            <Form.Label>Seen this movie?</Form.Label>
                            <Form.Check defaultChecked={seen} type="checkbox" label="Seen" onChange={e => {e.target.checked ? setSeen(true) : setSeen(false)}} />
                        </Form.Group>

                        {seen && 
                            <>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Date seen:</Form.Label>
                                        <Form.Control defaultValue={dateSeen || ''} type="date" onChange={e => {setDateSeen(e.target.value)}}/>
                                </Form.Group>

                                <p>Rating:</p>
                                <Rating
                                    onClick={value => {setRating(value)}}
                                    initialRating={rating || 0}
                                    emptySymbol={<BsStar size={30} />}
                                    fullSymbol={<BsStarFill size={30} />}
                                />
                            </>
                        }
                    </div>

                    <div>
                        <Form.Group controlId="formOwnCheckbox">
                            <Form.Label>Own this movie?</Form.Label>
                            <Form.Check defaultChecked={own} type="checkbox" label="Own" onChange={e => {e.target.checked ? setOwn(true) : setOwn(false)}} />
                        </Form.Group>

                        {own && 
                            <Form.Group controlId="selectFormat" onChange={e => {setFormat(e.target.value)}}>
                                <Form.Label>Format</Form.Label>
                                <Form.Control as="select" custom>
                                    <option>DVD</option>
                                    <option>Blu-Ray</option>
                                    <option>VHS</option>
                                    <option>HDD</option>
                                    <option>Other</option>
                                </Form.Control>
                            </Form.Group>
                        }
                    </div>

                    <div>
                        <Form.Group controlId="selectList">
                            <Form.Label>Add to list/s</Form.Label>
                            {listNames.map(list => (
                                <Form.Check
                                    defaultChecked={listsThatContainMovie.includes(list)}
                                    type="checkbox" 
                                    label={list} 
                                    value={list} 
                                    onChange={e => {e.target.checked ? 
                                        setCheckedLists(o => [...o, e.target.value]) : 
                                        setCheckedLists(checkedLists.filter(l => l !== e.target.value))}}/>
                            ))}
                            {!showAddListInput && <Button className="add-list-button" onClick={() => setShowAddListInput(true)}>+ Add list</Button>}
                            {showAddListInput && 
                                (
                                    <div className="add-list-container">
                                        <Form.Control className="add-list-input" type="text" placeholder="Enter name of list" ref={addListRef} />
                                        <Button onClick={handleAddList}>Save</Button>
                                        <Button onClick={() => setShowAddListInput(false)}>Cancel</Button>
                                    </div>
                                )
                            }
                        </Form.Group>
                    </div>

                </div>

                <div className="d-flex justify-content-between p-0">
                    <Button variant="primary" type="submit">Save</Button>
                    <Button variant="primary" type="button" onClick={() => navigate('/profile')}>Cancel</Button>
                </div>
            </Form>

        </div>
    )
}

export default Edit
