import { httpService } from '../http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    getLoggedinUser,
    saveLoggedinUser,
}

function getUsers() {
    return httpService.get(`user`)
}

async function getById(userId) {
    const user = await httpService.get(`user/${userId}`)
    return user
}

function remove(userId) {
    return httpService.delete(`user/${userId}`)
}

async function update(_id) {
    const user = await httpService.put(`user/${_id}`, { _id })

    const loggedinUser = getLoggedinUser()
    if (loggedinUser && loggedinUser._id === user._id) saveLoggedinUser(user)

    return user
}

async function login(userCred) {
    const user = await httpService.post('auth/login', { email: userCred.email, password: userCred.password })
    if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'

    const user = await httpService.post('auth/signup', {
        email: userCred.email,
        password: userCred.password,
        fullname: userCred.fullname,
        imgUrl: userCred.imgUrl,
    })
    return saveLoggedinUser(user)
}
async function logout() {
    localStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    return await httpService.post('auth/logout')
}

function getLoggedinUser() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_LOGGEDIN_USER));
}

function saveLoggedinUser(user) {
    user = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        imgUrl: user.imgUrl,
        isAdmin: user.isAdmin,
    }
    localStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));
    return user
}
