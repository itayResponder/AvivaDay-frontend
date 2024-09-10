import React, { useState } from 'react'
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
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    const colorOptions = ['#579bfc', '#34d1bf', '#f39c12', '#e74c3c', '#8e44ad', '#2ecc71'];


    const handleTitleChange = value => {
        setUpdatedGroupTitle(value)
    }

    const handleTitleBlur = () => {
        if (updatedGroupTitle !== group.title) {
            onUpdateGroup(board._id, group._id, { ...group, title: updatedGroupTitle })
        }
        setIsEditingTitle(false)
    }

    const handleColorSelect = (color) => {
        setGroupColor(color);
        setIsColorPickerOpen(false); 
      };

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
                                onClick={() => {
                                    toggleCollapse()
                                }}
                            />
                        ) : (
                            <DropdownChevronDown
                                size={30}
                                style={{ color: groupColor }}
                                onClick={() => {
                                    toggleCollapse()
                                }}
                            />
                        )}

                        <EditableHeading
                            type='h2'
                            value={updatedGroupTitle}
                            onChange={handleTitleChange}
                            onFinishEditing={handleTitleBlur}
                            onStartEditing={() => setIsEditingTitle(true)}
                            style={{ color: groupColor }}
                            id='editable-group-title'
                        />
                        <div className="color-circle-wrapper">
              <div
                className="color-circle"
                style={{ backgroundColor: groupColor, width: '20px', height: '20px', borderRadius: '50%', cursor: 'pointer', marginLeft: '10px' }}
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
              ></div>
              {isColorPickerOpen && (
                <div className="color-options">
                  {colorOptions.map((color) => (
                    <div
                      key={color}
                      className="color-option"
                      style={{ backgroundColor: color, width: '20px', height: '20px', borderRadius: '50%', cursor: 'pointer', margin: '5px' }}
                      onClick={() => handleColorSelect(color)}
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
            <style jsx>{`
        .color-circle-wrapper {
          position: relative;
        }
        .color-options {
          display: flex;
          position: absolute;
          top: 30px;
          left: 0;
          z-index: 10;
          background-color: white;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .color-option {
          transition: transform 0.2s;
        }
        .color-option:hover {
          transform: scale(1.2);
        }
      `}</style>
        </>
    )
}

export default GroupPreview
