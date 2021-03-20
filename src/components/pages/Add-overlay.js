import React, { useEffect, useState, useContext, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Form, Button } from 'react-bootstrap'
import { AuthContext } from '../../contexts/AuthContext'

import firebase, { db } from '../../firebase/index'

// TODO:
// add rating
// add new list
// check that checkedList is not empty
// error

const Add = (props) => {
    let navigate = useNavigate()
    const apiKey = process.env.REACT_APP_THE_MOVIE_DB_API_KEY
    const { currentUser } = useContext(AuthContext)
    const [seen, setSeen] = useState(false)
    const [own, setOwn] = useState(false)
    const [dateSeen, setDateSeen] = useState(null)
    const [format, setFormat] = useState("DVD")
    const [checkedLists, setCheckedLists] = useState([])
    const [lists, setLists] = useState([])
    const [showAddListInput, setShowAddListInput] = useState(false)
    const addListRef = useRef()

    const getMovie = async () => {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${props.id}?api_key=${apiKey}&language=en-US&append_to_response=videos,similar`)
        return res.data
    }

    const { data, error, isLoading } = useQuery(
        ['movie'],
        () => getMovie(props.id, apiKey)
      )

    const getLists = () => {
        setLists([])
        db.collection("lists").where("user_id", "==", currentUser.uid)
        .get()
        .then((snap) => {
            snap.forEach((doc) => {
                setLists(o => [...o, doc.data().list_name])
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }


    useEffect(() => {
        getLists()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        checkedLists.forEach(m => {
            db.collection("lists").where("list_name", "==", m).where("user_id", "==", currentUser.uid)
            .get()
            .then((snap) => {
                snap.forEach(doc => {
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
                        // Maybe not navigate? Just close the overlay?
                        navigate('/profile')
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                })
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        })
    }

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

    if(isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div id="add">

        <h1>Add movie</h1>

        <div className="add-form-container">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formSeenCheckbox">
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

                <Form.Group controlId="formOwnCheckbox">
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

                <Form.Group controlId="selectList">
                    <Form.Label>Add to list/s</Form.Label>
                    {lists.map(list => (
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

                <Button variant="primary" type="submit">Add</Button>
            </Form>

        </div>
            {/* {data.genres}
            {data.runtime}
            {data.tagline}
            {data.budget}
            {data.revenue}
            {data.homepage}
            {data.imdb_id} */}
        </div>
    )
}

export default Add
