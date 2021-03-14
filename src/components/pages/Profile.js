import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { db } from '../../firebase/index'

const Profile = () => {
    const { currentUser } = useContext(AuthContext)
    const [lists, setLists] = useState([])

    const getLists = () => {
        db.collection("lists").where("user_id", "==", currentUser.uid)
        .get()
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
    

    return (
        <div id="profile">
            <h1>{currentUser.displayName ? currentUser.displayName : currentUser.email}</h1>
            {lists ? (
                <div className="grid-container">

                    {lists.map(l => (
                        <div key={l.list_name}>
                            <h1>{l.list_name}</h1>
                            <ul>
                            {l.movies && (
                                <>
                                    {l.movies.map(m => (
                                        <li key={m.id}>
                                        {m.poster_path ? <img src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}/> : <img src="https://via.placeholder.com/200x250"/>}
                                            {m.title} ({m.release_date.substring(0,4)})
                                        </li>
                                    ))}
                                </>

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
