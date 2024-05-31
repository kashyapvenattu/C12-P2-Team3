import { createContext, useContext, useState } from "react"

const LoginContext = createContext()


export function LoginProvider({ logoutCallback, children }) {
    const [loggedInUser, setLoggedInUser] = useState()

    async function doLogout() {
        await logoutCallback()
        setLoggedInUser(undefined)
    }

    return (
        <LoginContext.Provider value={ {loggedInUser, setLoggedInUser, logout: doLogout} }>
            { children }
        </LoginContext.Provider>
    )
}

export function IfLoggedIn({ children }) {
    const context = useContext(LoginContext)
    return (context.loggedInUser !== undefined) && children 
}

export function IfNotLoggedIn({ children }) {
    const context = useContext(LoginContext)
    return (context.loggedInUser === undefined) && children 
}

export default LoginContext