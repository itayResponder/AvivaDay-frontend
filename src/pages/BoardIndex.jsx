import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { NavigationChevronDown, NavigationChevronRight } from 'monday-ui-react-core/icons'
import { addBoard, loadBoards, removeBoard } from '../store/actions/board.action'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { BoardList } from '../cmps/BoardList'
import { Button, DialogContentContainer, Flex, Text } from 'monday-ui-react-core'
import { login } from '../store/actions/user.actions'
import { useNavigate } from 'react-router'

import boardIndexBanner from '../assets/img/monday-banners/monday-banner-index.jpeg'
import {
    SOCKET_EMIT_SET_TOPIC,
    SOCKET_EVENT_BOARD_ADDED,
    SOCKET_EVENT_BOARD_REMOVED,
    socketService,
} from '../services/socket.service'
import { useDispatch } from 'react-redux'
import { Dashboard } from './Dashboard'

export function BoardIndex() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const prevBoardsCount = useRef(boards.length)
    const isLoading = useSelector(storeState => storeState.boardModule.flag.isLoading)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
        loadBoards()
        socketService.emit(SOCKET_EMIT_SET_TOPIC, 'board')
        
    }, [])

    useEffect(() => {
        socketService.on(SOCKET_EVENT_BOARD_ADDED, addedBoards)
        socketService.on(SOCKET_EVENT_BOARD_REMOVED, removeBoard)
        return () => {
            socketService.off(SOCKET_EVENT_BOARD_ADDED, addedBoards)
            socketService.off(SOCKET_EVENT_BOARD_REMOVED, removeBoard)
        }
    }, [])

    useEffect(() => {
        prevBoardsCount.current = boards.length
    }, [boards.length])

async function loadUser() {
    const credentials = JSON.parse(sessionStorage.getItem('loggedinUser'))
    if(!credentials)
    navigate('/login')
}

    async function onRemoveBoard(boardId) {
        try {
            await removeBoard(boardId)
            showSuccessMsg('board removed')
        } catch (err) {
            showErrorMsg('Cannot remove board')
        }
    }
    async function addedBoards(board) {
        if (boards.length === prevBoardsCount.current + 1 && !boards.some(b => b._id === board._id)) {
            dispatch(addBoard(board))
        }
    }

    function toggleCollapse() {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <section className='board-index'>
            <DialogContentContainer
                size='large'
                type='modal'
                className='border-index-body'
                style={{ display: 'flex', flexGrow: '1', flexDirection: 'column' }}
            >
                <Flex
                    direction={Flex.directions.ROW}
                    align={Flex.align.START}
                    justify={Flex.justify.SPACE_BETWEEN}
                    gap={Flex.gaps.MEDIUM}
                    wrap={false}
                >
                    <DialogContentContainer
                        className='board-list-dialog'
                        size={DialogContentContainer.sizes.MEDIUM}
                        type={DialogContentContainer.types.MODAL}
                        style={{ minHeight: '700px' }}
                    >
                        <div className='collapsible-header flex align-center' onClick={toggleCollapse}>
                            {isCollapsed ? (
                                <NavigationChevronRight size={'15'} lable='Expand list' />
                            ) : (
                                <NavigationChevronDown size={'15'} lable='Collapse list' />
                            )}
                            <h1 className='bold collapsible-title'>Recently visited</h1>
                        </div>
                        {!isCollapsed &&
                            (isLoading ? (
                                <img className='loader-gif' src='/img/board-loader.gif' alt='Loading...' />
                            ) : (
                                <BoardList boards={boards} onRemoveBoard={onRemoveBoard} />
                            ))}
                    </DialogContentContainer>
                    <DialogContentContainer
                        size={DialogContentContainer.sizes.LARGE}
                        type={DialogContentContainer.types.MODAL}
                        className='board-index-template'
                    >
                        <Flex
                            direction={Flex.directions.COLUMN}
                            align={Flex.align.CENTER}
                            justify={Flex.justify.SPACE_BETWEEN}
                            gap={Flex.gaps.SMALL}
                            wrap={false}
                        >
                            <img src={boardIndexBanner} className='board-index-banner' />
                            <Flex
                                className='banner-section-content-wrapper'
                                direction={Flex.directions.COLUMN}
                                align={Flex.align.CENTER}
                                justify={Flex.justify.SPACE_AROUND}
                                wrap={true}
                            >
                                <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.SMALL} align={Flex.align.START}>
                                    <Text
                                        align={Text.align.START}
                                        type={Text.types.TEXT1}
                                        weight={Text.weights.NORMAL}
                                        className='text-line'
                                    >
                                        Boost your workflow in minutes
                                    </Text>
                                    <Text align={Text.align.START} type={Text.types.TEXT1} weight={Text.weights.NORMAL}>
                                        with ready-made templates
                                    </Text>
                                </Flex>
                                <Button
                                    onClick={function noRefCheck() {}}
                                    kind={Button.kinds.SECONDARY}
                                    marginLeft
                                    marginRight
                                    size='large'
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                    }}
                                >
                                    Explore templates
                                </Button>
                            </Flex>
                        </Flex>
                    </DialogContentContainer>
                </Flex>
            </DialogContentContainer>
        </section>
    )
}
