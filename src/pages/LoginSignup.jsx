import { Outlet } from 'react-router'
import { NavLink } from 'react-router-dom'

export function LoginSignup() {
    return (
        <div className="login-page">
            <nav>
                <NavLink to=".">Login</NavLink>
            </nav>
            <Outlet/>
        </div>
    )
}