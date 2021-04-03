import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { db } from '../../firebase/index'
import { Button } from 'react-bootstrap'

// TODO:
// Edit list
// If the list doesn't have any movies, prompt the user to add movies

const Profile = () => {
    const { currentUser } = useContext(AuthContext)
    const [lists, setLists] = useState([])

    const getLists = () => {
        setLists([])
        db.collection("lists").where("user_id", "==", currentUser.uid).get()
        .then((snap) => {
            snap.forEach((doc) => {
                setLists(o => [...o, {...doc.data()}])
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }

    useEffect(() => {
        getLists()
    }, [])

    const handleEditMovie = (e) => {
        console.log(e)
        // change seen/rating/own, in all the lists
    }

    const handleDeleteMovie = (e) => {
        const list_name = e.target.attributes.list_name.value
        const movie_id = e.target.attributes.movie_id.value

        db.collection("lists").where("list_name", "==", list_name).get()
        .then((snap) => {
            snap.forEach(doc => {
                db.collection("lists").doc(doc.id).set({
                    ...doc.data(), movies: doc.data().movies.filter(m => m.id != movie_id)
                })
            })
            getLists()
        }).catch((error) => {
            console.log("Error getting document:", error);
        })     
    }
    

    return (
        <div id="profile">
            <h1>{currentUser.displayName ? currentUser.displayName : currentUser.email}</h1>
            {lists.length > 0 ? (
                <div className="grid-container">

                    {lists.map(l => (
                        <div>
                            <h1>{l.list_name}</h1>
                            <ul>
                            {l.movies && l.movies.length > 0 ? (
                                <>
                                    {l.movies.map(m => (
                                        <li key={m.id}>
                                        {m.poster_path ? <img src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}/> : <img src="https://via.placeholder.com/200x250"/>}
                                            {m.title} ({m.release_date.substring(0,4)})
                                            <div className="edit-buttons">
                                                <Button onClick={handleEditMovie} movie_id={m.id} >🖋</Button>
                                                <Button onClick={handleDeleteMovie} movie_id={m.id} list_name={l.list_name}>🗑</Button>
                                            </div>
                                        </li>
                                    ))}
                                </>
                            ) : (
                                <p>Add some movies</p>
                            )}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have no lists yet, how about adding one?</p>
            )}
        </div>
    )
}

export default Profile
