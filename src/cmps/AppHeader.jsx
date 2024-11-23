import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import logoImg from '../assets/img/logo/only-logo.png'
import { Avatar, Button } from 'monday-ui-react-core'
import { useEffect } from 'react'
import { login } from '../store/actions/user.actions'
import { STORAGE_KEY_LOGGEDIN_USER } from '../services/user/user.service.local'

export function AppHeader() {
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()
    
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

    async function onLogout() {
        try {
            await logout()
            navigate('/board')
            showSuccessMsg(`Bye now`)
        } catch (err) {
            showErrorMsg('Cannot logout')
        }
    }

    async function onLogin(credentials) {
        await login(credentials)
        navigate('/board')
    }

    return (
        <header className='app-header full flex space-between'>
            <div className='logo'>
                <NavLink to='/board'>
                    <div className='headline'>
                        <img src={logoImg} alt='logo' className='logo-img' />
                        <h4 className='company-name bold'>
                            AvivaDay <span className='app-name light'>work management</span>
                        </h4>
                    </div>
                </NavLink>
            </div>

            <div className='login-link '>
                {user?.isAdmin && <NavLink to='/admin'>Admin</NavLink>}

                {!user && <NavLink to='login'>Login</NavLink>}
                {user && (
                    <div className='user-info'>
                        <Button kind={Button.kinds.TERTIARY} onClick={onLogout}>
                            {' '}
                            logout
                        </Button>
                        <Button kind={Button.kinds.TERTIARY}>
                            <img
                                className='app-logo'
                                src='https://res.cloudinary.com/dkykllpf5/image/upload/v1721653904/wzvg1pialo9mpvjavwx1.png'
                                alt='logo'
                            />
                            <Avatar
                                ariaLabel={user.fullname}
                                size={Avatar.sizes.MEDIUM}
                                src={user.imgUrl}
                                type={Avatar.types.IMG}
                                className='custom-avatar'
                                aria-hidden='true'
                            />
                        </Button>
                    </div>
                )}
            </div>
        </header>
    )
}
