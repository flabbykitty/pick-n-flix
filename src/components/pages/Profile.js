import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { ListContext } from '../../contexts/ListContext'
import MovieItem from '../MovieItem'
import SearchBar from '../SearchBar'

// TODO:
// Edit list
// If the list doesn't have any movies, prompt the user to add movies

const Profile = () => {
    const { currentUser } = useContext(AuthContext)
    const { lists, getLists, loading } = useContext(ListContext)

    useEffect(() => {
        getLists()
    }, [])

    return (
        <div id="profile">
        {loading ? (
            <p>Loading...</p>
        ) : (
            <>
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
                                            <MovieItem movie={m} list={l.list_name} type='edit'/>
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
                    <div className="text-center">
                        <p>You have no lists yet, let's start with finding a good movie</p>
                        <SearchBar/>
                    </div>
                )}
            </>
        )}
        </div>
    )
}

export default Profile
