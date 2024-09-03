
import { store } from '../store'
import { ADD_COMMENT, REMOVE_COMMENT, SET_COMMENTS, UPDATE_COMMENT } from '../reducers/comment.reducer'
import { commentService } from '../../services/comment'

export function loadComments(boardId, groupId, taskId) {
    return async dispatch => {
        try {
            const comments = await commentService.getComments(boardId, groupId, taskId);
            dispatch({ type: SET_COMMENTS, comments, boardId, groupId, taskId });
        } catch (err) {
            console.log('commentActions: err in loadComments', err);
            throw err;
        }
    };
}

export async function addComment(boardId, groupId, taskId, comment) {
	try {
		const addedComment = await commentService.addComment(boardId, groupId, taskId, comment)
		store.dispatch(getActionAddComment(boardId, groupId, taskId, comment))
		return addedComment
	} catch (err) {
		console.log('CommentActions: err in addComment', err)
		throw err
	}
}

export async function removeComment(boardId, groupId, taskId, commentId) {
	try {
		const removedComment = await commentService.deleteComment(boardId, groupId, taskId, commentId)
		store.dispatch(getActionRemoveComment(boardId, groupId, taskId, commentId))
	} catch (err) {
		console.log('CommentActions: err in removeComment', err)
		throw err
	}
}

export async function updateComment(boardId, groupId, taskId, commentId, updatedComment) {
	try {
		const saveUpdateComment = await commentService.updateComment(boardId, groupId, taskId, commentId, updatedComment)
		store.dispatch(getActionUpdateComment(boardId, groupId, taskId, commentId, updatedComment))
		return saveUpdateComment
	} catch (err) {
		console.log('CommentActions: err in removeComment', err)
		throw err
	}
}
// Command Creators
export function getActionRemoveComment(boardId, groupId, taskId, commentId) {
	return { type: REMOVE_COMMENT, 
		payload: { boardId, groupId, taskId, commentId } }
}
export function getActionAddComment(boardId, groupId, taskId, comment) {
	return { type: ADD_COMMENT, payload: { boardId, groupId, taskId, comment } }
}
export function getActionUpdateComment(boardId, groupId, taskId, commentId, updatedComment) {
	return { type: ADD_COMMENT, payload: { boardId, groupId, taskId, commentId, updatedComment } }
}

