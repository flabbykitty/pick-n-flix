import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../firebase'
import { AuthContext } from './AuthContext'

const ListContext = createContext()

const useList = () => {
	return useContext(ListContext)
}

const ListContextProvider = (props) => {
	const { currentUser } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
	const [lists, setLists] = useState([])
	const [listNames, setListNames] = useState([])

	const getLists = () => {
		setLists([])
		db.collection("lists").where("user_id", "==", currentUser.uid).get()
        .then((snap) => {
            snap.forEach((doc) => {
				console.log(doc.data())
                setLists(o => [...o, {...doc.data()}])
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
	}

	const getArrayOfLists = () => {
		setListNames([])
		db.collection("lists").where("user_id", "==", currentUser.uid)
        .get()
        .then((snap) => {
            snap.forEach((doc) => {
                setListNames(o => [...o, doc.data().list_name])
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
	}

	const getList = (userId, listName) => {}

	const addMovieToList = (lists, movie) => {
		// check if the movie already exists in the list
		console.log(list, movie)
		// lists.forEach(list => {
		// 	add movie to list
		// })
	}

	const addList = (list) => {

	}

	const removeList = (list) => {

	}

	const removeMovieFromList = (list, movie) => {
		console.log(list, movie)
		db.collection("lists").where("list_name", "==", list).get()
        .then((snap) => {
            snap.forEach(doc => {
                db.collection("lists").doc(doc.id).set({
                    ...doc.data(), movies: doc.data().movies.filter(m => m.id != movie)
                })
            })
			getLists()
        }).catch((error) => {
            console.log("Error getting document:", error);
        })
	}

	const contextValues = {
		lists,
		listNames,
		getLists,
		removeMovieFromList,
		getArrayOfLists
	}

	return (
		<ListContext.Provider value={contextValues}>
			{props.children}
			{/* {loading && (<div>Loading...</div>)} */}
			{/* {!loading && props.children} */}
		</ListContext.Provider>
	)
}

export { ListContext, useList, ListContextProvider as default }
