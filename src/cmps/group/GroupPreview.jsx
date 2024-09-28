import React, { useState, useEffect, useRef } from 'react'
import 'monday-ui-react-core/dist/main.css'
import { MenuButton, Menu, MenuItem, EditableHeading } from 'monday-ui-react-core'
import TasksList from './task/TaskList'
import { Collapse, Delete, DropdownChevronDown, DropdownChevronRight } from 'monday-ui-react-core/icons'

function GroupPreview({
    group,
    members,
    labels,
    board,
    openModal,
    onUpdateGroup,
    onSort,
    sorting,
    isCollapsed,
    toggleCollapse,
    onRemoveGroup,
    onAddGroup,
    dragHandleProps,
}) {
    const [updatedGroupTitle, setUpdatedGroupTitle] = useState(group.title)
    const [groupColor, setGroupColor] = useState(group.style?.backgroundColor || '#579bfc')
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
    const colorPickerRef = useRef(null) // Ref for color picker
    const colorOptions = ['#579bfc', '#34d1bf', '#f39c12', '#e74c3c', '#8e44ad', '#2ecc71']

    useEffect(() => {
        const handleGroupUpdated = (groupData) => {
            setGroupColor(groupData.style.backgroundColor)
        };
        socketService.on('group-updated', handleGroupUpdated);
        return () => {
            socketService.off('group-updated', handleGroupUpdated);
        };
    },[])

    const handleTitleChange = value => {
        setUpdatedGroupTitle(value)
    }

    const handleTitleBlur = () => {
        if (updatedGroupTitle !== group.title) {
            onUpdateGroup(board._id, group._id, { ...group, title: updatedGroupTitle })
        }
    }

    const handleColorSelect = (color) => {
        setGroupColor(color)
        
        onUpdateGroup(board._id, group._id, {
            ...group,
            style: {
                ...group.style,
                backgroundColor: color 
            }
        })
        setIsColorPickerOpen(false) // Close after selecting a color
    }

    // Close color picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
                setIsColorPickerOpen(false)
            }
        }
        if (isColorPickerOpen) {
            document.addEventListener('click', handleClickOutside)
        }
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [isColorPickerOpen])

    return (
        <>
            <div
                className={`group-preview ${isCollapsed ? 'collapsed' : ''}`}
                style={{
                    borderInlineStart: isCollapsed ? `6px solid ${groupColor}` : 'none',
                }}
            >
                <div className='group-header' {...dragHandleProps}>
                    <MenuButton className='group-preview-menu-btn'>
                        <Menu id='menu' size='medium'>
                            <MenuItem onClick={() => onRemoveGroup(group._id)} icon={Delete} title='Delete' />
                        </Menu>
                    </MenuButton>
                    <div className='flex align-center justify-center' style={{ position: 'sticky', left: '0' }}>
                        {isCollapsed ? (
                            <DropdownChevronRight
                                size={30}
                                style={{ color: groupColor }}
                                onClick={() => toggleCollapse()}
                            />
                        ) : (
                            <DropdownChevronDown
                                size={30}
                                style={{ color: groupColor }}
                                onClick={() => toggleCollapse()}
                            />
                        )}

                        <EditableHeading
                            type='h2'
                            value={updatedGroupTitle}
                            onChange={handleTitleChange}
                            onFinishEditing={handleTitleBlur}
                            style={{ color: groupColor }}
                            id='editable-group-title'
                        />
                        <div className="color-circle-wrapper" ref={colorPickerRef}>
                            <div
                                className="color-circle"
                                style={{
                                    backgroundColor: groupColor,
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    marginLeft: '10px'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsColorPickerOpen(prev => !prev); // Use functional update
                                }}
                            ></div>
                            {isColorPickerOpen && (
                                <div className="color-options">
                                    {colorOptions.map((color) => (
                                        <div
                                            key={color}
                                            className="color-option"
                                            style={{
                                                backgroundColor: color,
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                margin: '5px'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleColorSelect(color)
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {!isCollapsed && (
                    <div className='table-wrapper'>
                        <TasksList
                            tasks={group.tasks}
                            members={members}
                            labels={labels}
                            board={board}
                            group={group}
                            openModal={openModal}
                            onSort={onSort}
                            sorting={sorting}
                            onAddGroup={onAddGroup}
                        />
                    </div>
                )}
            </div>
        </>
    )
}

export default GroupPreview