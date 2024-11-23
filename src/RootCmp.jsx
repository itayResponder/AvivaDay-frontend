import {React, useEffect} from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { UserDetails } from './pages/UserDetails'
import { AppHeader } from './cmps/AppHeader'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { Login } from './pages/Login.jsx'
import { BoardIndex } from './pages/BoardIndex.jsx'
import { BoardDetails } from './cmps/BoardDetails.jsx'
import { loadBoards } from './store/actions/board.action'
import { Sidebar } from './cmps/Sidebar.jsx'
import { RootActivityModal } from './cmps/group/task/RootActivityModal.jsx'
import { login } from './store/actions/user.actions'
import { STORAGE_KEY_LOGGEDIN_USER } from './services/user/user.service.local'

export function RootCmp() {
    const location = useLocation()
    const navigate = useNavigate()
    const user = useSelector(storeState => storeState.userModule.user)
    
    
    useEffect(() => {
        if(location.pathname === '/') {
            navigate('/board')
        }
    },[location])

    useEffect(() => {
        if(!user) {
            const credentials = JSON.parse(localStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
            if(!credentials) {
                navigate('/login')
            } else {
                onLogin(credentials)
            }
        }
    },[user])

    async function onLogin(credentials) {
        await login(credentials)
        loadBoards()
        navigate('/board')
    }

    return (
        <>
            { (
                <div className='main-container'>
                    <AppHeader />
                    <RootActivityModal />
                    <Sidebar />
                    <Routes>
                        <Route path='/board' element={<BoardIndex />} />
                        <Route path='/board/:boardId' element={<BoardDetails />} />
                        <Route path='/user/:id' element={<UserDetails />} />
                        <Route path='/login' element={<LoginSignup />}>
                            <Route index element={<Login />} />
                        </Route>
                    </Routes>
                </div>
            )}
        </>
    )
}
