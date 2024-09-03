import io from 'socket.io-client'
import { userService } from './user'

export const SOCKET_EVENT_ADD_MSG = 'chat-add-msg'
export const SOCKET_EMIT_SEND_MSG = 'chat-send-msg'
export const SOCKET_EMIT_SET_TOPIC = 'set-topic'
export const SOCKET_EMIT_USER_WATCH = 'user-watch'
export const SOCKET_EVENT_USER_UPDATED = 'user-updated'
export const SOCKET_EVENT_COMMENT_ADDED = 'comment-added'
export const SOCKET_EVENT_COMMENT_REMOVED = 'comment-removed'
export const SOCKET_EVENT_COMMENT_ABOUT_YOU = 'comment-about-you'
export const SOCKET_EVENT_BOARD_ADDED = 'board-added'
export const SOCKET_EVENT_BOARD_UPDATED = 'board-updated'
export const SOCKET_EVENT_BOARD_REMOVED = 'board-removed'
export const SOCKET_EVENT_GROUP_ADDED = 'group-added'
export const SOCKET_EVENT_GROUP_UPDATED = 'group-updated'
export const SOCKET_EVENT_GROUP_REMOVED = 'group-removed'
export const SOCKET_EVENT_TASK_ADDED = 'task-added'
export const SOCKET_EVENT_TASK_UPDATED = 'task-updated'
export const SOCKET_EVENT_TASK_REMOVED = 'task-removed'

const SOCKET_EMIT_LOGIN = 'set-user-socket'
const SOCKET_EMIT_LOGOUT = 'unset-user-socket'

const baseUrl = process.env.NODE_ENV === 'production' ? '' : '//localhost:3030'
export const socketService = createSocketService()

window.socketService = socketService

socketService.setup()

function createSocketService() {
    var socket = null
    const socketService = {
        setup() {
            socket = io(baseUrl, {
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                timeout: 20000,
                transports: ['websocket'],
            })
            const user = userService.getLoggedinUser()
            if (user) this.login(user._id)
        },
        on(eventName, cb) {
            socket.on(eventName, cb)
        },
        off(eventName, cb = null) {
            if (!socket) return
            if (!cb) socket.removeAllListeners(eventName)
            else socket.off(eventName, cb)
        },
        emit(eventName, data) {
            socket.emit(eventName, data)
        },
        login(userId) {
            socket.emit(SOCKET_EMIT_LOGIN, userId)
        },
        logout() {
            socket.emit(SOCKET_EMIT_LOGOUT)
        },
        terminate() {
            socket = null
        },
    }
    return socketService
}

function createDummySocketService() {
    var listenersMap = {}
    const socketService = {
        listenersMap,
        setup() {
            listenersMap = {}
        },
        terminate() {
            this.setup()
        },
        login() {
            console.log('Dummy socket service here, login - got it')
        },
        logout() {
            console.log('Dummy socket service here, logout - got it')
        },
        on(eventName, cb) {
            listenersMap[eventName] = [...(listenersMap[eventName] || []), cb]
        },
        off(eventName, cb) {
            if (!listenersMap[eventName]) return
            if (!cb) delete listenersMap[eventName]
            else listenersMap[eventName] = listenersMap[eventName].filter(l => l !== cb)
        },
        emit(eventName, data) {
            var listeners = listenersMap[eventName]
            if (eventName === SOCKET_EMIT_SEND_MSG) {
                listeners = listenersMap[SOCKET_EVENT_ADD_MSG]
            }

            if (!listeners) return

            listeners.forEach(listener => {
                listener(data)
            })
        },
        testChatMsg() {
            this.emit(SOCKET_EVENT_ADD_MSG, { from: 'Someone', txt: 'Aha it worked!' })
        },
        testUserUpdate() {
            this.emit(SOCKET_EVENT_USER_UPDATED, { ...userService.getLoggedinUser(), score: 555 })
        },
    }
    window.listenersMap = listenersMap
    return socketService
}
