import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Search } from 'monday-ui-react-core/next'

import {
    MenuItem,
    Menu,
    MenuDivider,
    DialogContentContainer,
    MenuTitle,
    Dialog,
    IconButton,
} from 'monday-ui-react-core'
import {
    Favorite,
    Home,
    NavigationChevronDown,
    NavigationChevronUp,
    DropdownChevronDown,
    Board,
    Add,
} from 'monday-ui-react-core/icons'

import { AddBoard } from './AddBoard'

export function Sidebar() {
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false)
    const [filteredBoards, setFilteredBoards] = useState([])
    const starredBoards = boards.filter(board => board.isStarred)
    const navigate = useNavigate()

    useEffect(() => {
        setFilteredBoards(boards)
    }, [boards])

    function handleOnClick(route) {
        navigate(route)
    }

    function toggleCollapse() {
        setIsCollapsed(!isCollapsed)
    }

    function toggleAddBoard() {
        setIsAddBoardModalOpen(!isAddBoardModalOpen)
    }

    function handleSearchClick({ target }) {
        const value = target.value.toLowerCase()

        if (value.trim() === '') {
            setFilteredBoards(boards)
        } else {
            const filtered = boards.filter(board => board.title.toLowerCase().includes(value))
            setFilteredBoards(filtered)
        }
    }

    return (
        <div className='sidebar main-container'>
            <DialogContentContainer>
                <Menu className='side-bar-menu'>
                    <MenuItem icon={Home} title='Home' onClick={() => handleOnClick('/board')} />
                    <MenuDivider />
                    <MenuItem
                        icon={Favorite}
                        title='Favorite'
                        onClick={() => toggleCollapse()}
                        rightIcon={
                            isCollapsed ? <NavigationChevronDown icon={DropdownChevronDown} /> : <NavigationChevronUp />
                        }
                    />
                    {!isCollapsed &&
                        starredBoards.map(board => (
                            <MenuItem
                                icon={Board}
                                key={board._id}
                                title={board.title}
                                onClick={() => handleOnClick(`/board/${board._id}`)}
                            />
                        ))}
                    <MenuDivider />
                </Menu>
                <div className='menu-title'>
                    <MenuTitle caption='Main workspace' captionPosition='top' type='text2' weight='bold' />
                </div>
                <div className='sidebar-search-add-container'>
                    <div className='search-container'>
                        <Search
                            placeholder='Search'
                            size='medium'
                            onChange={handleSearchClick}
                            className='search-input'
                        />
                    </div>
                    <div className='add-button-dialog'>
                        <Dialog
                            content={
                                <DialogContentContainer>
                                    <Menu>
                                        <MenuTitle caption='Add new' />
                                        <MenuItem icon={Board} title='New Board' onClick={toggleAddBoard} />
                                    </Menu>
                                </DialogContentContainer>
                            }
                            hideTrigger={['clickoutside', 'onContentClick']}
                            isOpen
                            modifiers={[
                                {
                                    name: 'preventOverflow',
                                    options: {
                                        mainAxis: false,
                                    },
                                },
                            ]}
                            position='right-start'
                            showTrigger={['click']}
                        >
                            <IconButton icon={Add} kind='primary' />
                        </Dialog>
                    </div>
                </div>
                <Menu className='side-bar-menu'>
                    {filteredBoards.map(board => (
                        <MenuItem
                            icon={Board}
                            key={board._id}
                            title={board.title}
                            onClick={() => handleOnClick(`/board/${board._id}`)}
                        />
                    ))}
                </Menu>
            </DialogContentContainer>

            {isAddBoardModalOpen && <AddBoard isOpen={isAddBoardModalOpen} onClose={toggleAddBoard} />}
        </div>
    )
}
