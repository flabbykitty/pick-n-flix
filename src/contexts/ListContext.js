import { createContext, useContext, useState } from 'react'
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
	const [listsThatContainMovie, setListsThatContainMovie] = useState([])
	const [movie, setMovie] = useState(null)
	const [seen, setSeen] = useState(false)
	const [rating, setRating] = useState(null)
    const [own, setOwn] = useState(false)
    const [dateSeen, setDateSeen] = useState(null)
    const [format, setFormat] = useState("DVD")
    const [checkedLists, setCheckedLists] = useState(listNames)

	// get all the lists of a user
	const getLists = () => {
		setLists([])
		db.collection("lists").where("user_id", "==", currentUser.uid).get()
        .then((snap) => {
            snap.forEach((doc) => {
                setLists(o => [...o, {...doc.data()}])
            });
			setLoading(false)
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
	}

	// get an array of the lists of that user that contain a specific movie
	const getWhatListsContainsMovie = (movie) => {
		setListsThatContainMovie([])
		if(currentUser.uid) {
			db.collection('lists').where("user_id", "==", currentUser.uid)
			.get()
			.then((snap) => {
				let tempListArray = []
				snap.forEach((doc) => {
					if(doc.data().movies) {
						if(doc.data().movies.find(m => m.id == movie)) {
							tempListArray.push(doc.data().list_name)
						}
					}
				});
				setCheckedLists(tempListArray)
				setListsThatContainMovie(tempListArray)
				getMovieFromList(movie, tempListArray[0])
			})
			.catch((error) => {
				console.log("Error getting documents: ", error);
			});
		}
	}

	const getMovieFromList = (movie, list) => {
		db.collection("lists").where("list_name", "==", list).get()
        .then((snap) => {
            snap.forEach(doc => {
				const tempMovie = doc.data().movies.find(m => m.id == movie)
				setMovie(tempMovie)
				setSeen(tempMovie.seen)
				setOwn(tempMovie.own)
				setDateSeen(tempMovie.date_seen)
				setFormat(tempMovie.format || "DVD")
				setRating(tempMovie.rating)
			})
        }).catch((error) => {
            console.log("Error getting document:", error);
        })
	}

	// get only the list names of the lists of a user
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

	const removeMovieFromList = (list, movie) => {
		db.collection("lists").where("list_name", "==", list).get()
        .then((snap) => {
            snap.forEach(doc => {
                db.collection("lists").doc(doc.id).update({
                    movies: doc.data().movies.filter(m => m.id != movie)
                }).then(() => {
					getLists()
				}).catch((error) => {
					console.log("Error updating document:", error);
				})
            })
        }).catch((error) => {
            console.log("Error getting document:", error);
        })
	}

	const contextValues = {
		lists,
		setLists,
		movie,
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
		listNames,
		loading,
		getLists,
		getWhatListsContainsMovie,
		listsThatContainMovie,
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
