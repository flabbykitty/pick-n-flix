import {createContext, useContext, useEffect, useState} from 'react'
import {auth} from '../firebase'

const AuthContext = createContext()

const useAuth = () => {
	return useContext(AuthContext)
}

const AuthContextProvider = (props) => {
	const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    
    const signup = (email, password, username) => {
		return auth.createUserWithEmailAndPassword(email, password)
		.then((userCredential) => {
			let user = userCredential.user;
			user.updateProfile({
				displayName: username,
			})
		})
	}

	const login = (email, password) => {
		return auth.signInWithEmailAndPassword(email, password)
    }
    const logout = () => {
        return auth.signOut()
    }

    const resetPassword = (email) => {
		return auth.sendPasswordResetEmail(email)
	}

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			setCurrentUser(user)
			setLoading(false)
		})

		return unsubscribe
	}, [])

	const contextValues = {
		currentUser,
		loading,
        login,
        logout,
        signup,
        resetPassword
	}

	return (
		<AuthContext.Provider value={contextValues}>
			{loading && (<div>Loading...</div>)}
			{!loading && props.children}
		</AuthContext.Provider>
	)
}

export { AuthContext, useAuth, AuthContextProvider as default }
