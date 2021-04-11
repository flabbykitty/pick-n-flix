import React, { useEffect, useState, useContext, useRef } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { AuthContext } from '../../contexts/AuthContext'
import { ListContext } from '../../contexts/ListContext'
import { useQuery } from 'react-query'


import firebase, { db } from '../../firebase/index'

// TODO:
// add rating
// add new list
// check that checkedList is not empty
// error

const Edit = () => {
    let navigate = useNavigate()
    const { currentUser } = useContext(AuthContext)
    const { listNames, getArrayOfLists, removeMovieFromList } = useContext(ListContext)
    const apiKey = process.env.REACT_APP_THE_MOVIE_DB_API_KEY
    const { id } = useParams()
    const [seen, setSeen] = useState(false)
    const [own, setOwn] = useState(false)
    const [dateSeen, setDateSeen] = useState(null)
    const [format, setFormat] = useState("DVD")
    const [checkedLists, setCheckedLists] = useState([])
    const [showAddListInput, setShowAddListInput] = useState(false)
    const addListRef = useRef()

    const getMovie = async () => {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=videos,similar`)
        return res.data
    }

    const { data, error, isLoading } = useQuery(
        ['movie'],
        () => getMovie(id, apiKey)
    )

    const handleAddList = (e) => {
        db.collection("lists").add({
            list_name: addListRef.current.value,
            user_id: currentUser.uid
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            getLists()
            setShowAddListInput(false)
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }

    useEffect(() => {
        getArrayOfLists()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        // go through all the lists that the user has
        // if the current list is not checked, remove movie from that list
        // if the current list is checked, update the movie
        listNames.forEach(list => {
            if(checkedLists.includes(list)) {
                // update the movie
                db.collection("lists").where("user_id", "==", currentUser.uid).get()
                .then((snap) => {
                    console.log(snap)
                    // for each list, check if the movie exists in there
                    snap.forEach(doc => {
                        let updatedMovie = doc.data().movies.find(m => m.id == id)
                        if(updatedMovie) {
                            updatedMovie.own = own
                            updatedMovie.format = format
                            updatedMovie.seen = seen
                            updatedMovie.date_seen = dateSeen
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
                                    {...data, 
                                    own, 
                                    seen, 
                                    date_seen: dateSeen, 
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
                // remove movie from list
                removeMovieFromList(list, id)
            }
        })
    }

    if(isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div id="add">
            {/* {console.log(data)} */}
            <div className="add-info-container d-md-flex">
                <img src={`https://image.tmdb.org/t/p/w200${data.poster_path}`}></img>
                <div>
                    <div className="add-header">
                        <h1>{data.title}</h1>
                        {data.release_date}
                    </div>
                    <div className="add-body">
                        <p>{data.overview}</p>

                    </div>

                </div>
            </div>

            <Form onSubmit={handleSubmit} className="add-form-container">
                <div className="add-form-input-container">
                    <div>
                        <Form.Group controlId="formSeenCheckbox">
                            <Form.Label>Seen this movie?</Form.Label>
                            <Form.Check type="checkbox" label="Seen" onChange={e => {e.target.checked ? setSeen(true) : setSeen(false)}} />
                        </Form.Group>

                        {seen && 
                            <>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Date seen:</Form.Label>
                                        <Form.Control type="date" onChange={e => {setDateSeen(e.target.value)}}/>
                                </Form.Group>

                                Here will be rating
                            </>
                        }
                    </div>

                    <div>
                        <Form.Group controlId="formOwnCheckbox">
                            <Form.Label>Own this movie?</Form.Label>
                            <Form.Check type="checkbox" label="Own" onChange={e => {e.target.checked ? setOwn(true) : setOwn(false)}} />
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
                <Button variant="primary" type="submit">Add</Button>
            </Form>

        </div>
    )
}

export default Edit
