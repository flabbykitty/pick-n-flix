import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Form, Button } from 'react-bootstrap'
import { AuthContext } from '../../contexts/AuthContext'
import { ListContext } from '../../contexts/ListContext'

import firebase, { db } from '../../firebase/index'

// TODO:
// add rating
// check that checkedList is not empty
// error

const Add = () => {
    let navigate = useNavigate()
    const apiKey = process.env.REACT_APP_THE_MOVIE_DB_API_KEY
    const { id } = useParams()
    const { currentUser } = useContext(AuthContext)
    const { listNames, getArrayOfLists } = useContext(ListContext)
    const [seen, setSeen] = useState(false)
    const [own, setOwn] = useState(false)
    const [dateSeen, setDateSeen] = useState(null)
    const [format, setFormat] = useState("DVD")
    const [checkedLists, setCheckedLists] = useState([])

    const getMovie = async () => {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=videos,similar`)
        return res.data
    }

    const { data, error, isLoading } = useQuery(
        ['movie'],
        () => getMovie(id, apiKey)
    )

    useEffect(() => {
        getArrayOfLists()
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

    if(isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div id="add">
        {/* {console.log(data)} */}
        <div className="add-info-container">
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
                    {listNames.map(list => (
                        <Form.Check 
                            type="checkbox" 
                            label={list} 
                            value={list} 
                            onChange={e => {e.target.checked ? 
                                setCheckedLists(o => [...o, e.target.value]) : 
                                setCheckedLists(checkedLists.filter(l => l !== e.target.value))}}/>
                    ))}
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
