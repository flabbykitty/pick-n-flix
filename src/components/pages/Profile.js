import React, { useEffect, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { ListContext } from '../../contexts/ListContext'
import SearchBar from '../SearchBar'
import List from '../List'

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
                            <List list={l}/>
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
