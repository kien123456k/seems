import React, { useRef, useState, useEffect } from 'react'

import { useRecoilValue } from 'recoil'

import { ModeComment } from '@mui/icons-material'
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    OutlinedInput,
    Typography,
} from '@mui/material'
import { grey } from '@mui/material/colors'

import { useSnackbar } from '../../../HOCs/SnackbarContext'
import authAtom from '../../../recoil/auth'
import { useCommentsAction } from '../../../recoil/comment'
import CommentSection from './Comment'

const CommentsSection = ({ eventId: EventId, numberComments }) => {
    const commentsActions = useCommentsAction()
    const showSnackBar = useSnackbar()
    const auth = useRecoilValue(authAtom)
    const commentContent = useRef(null)
    const initialLoadingComments = useRef(true)
    const [isLoading, setIsLoading] = useState(false)
    // const [likeComment, setLikeComment] = useState({
    //     isLike:
    // })
    const [comments, setComments] = useState([])
    const [hasMoreComments, setHasMoreComments] = useState(false)
    const [openCommentField, setOpenCommentField] = useState(false)
    const [loadMoreCommentsConfig, setLoadMoreCommentsConfig] = useState({
        action: 'load',
        numberComments: 4,
        lastCommentId: null,
    })
    const loadCommentsHandler = () => {
        setIsLoading(true)
        if (initialLoadingComments.current) {
            setOpenCommentField(true)
        }
        commentsActions
            .loadComments(loadMoreCommentsConfig, EventId)
            .then((response) => {
                console.log(response)
                initialLoadingComments.current = false
                const { listResponseComments: loadedComments, hasMoreComment: isHasMoreComments } =
                    response.data.data
                setComments((prevComments) => [...prevComments, ...loadedComments])
                setHasMoreComments(isHasMoreComments)
                setIsLoading(false)
            })
            .catch(() => {
                showSnackBar({
                    severity: 'error',
                    children: 'Something went wrong, please try again later.',
                })
                initialLoadingComments.current = false
                setIsLoading(false)
            })
    }
    const createCommentHandler = (event) => {
        if (commentContent.current.value.trim().length !== 0 && event.key === 'Enter') {
            setIsLoading(true)
            const commentData = {
                EventId: EventId,
                CommentContent: commentContent.current.value,
                ParentCommentId: null,
            }
            commentsActions
                .createComment(commentData)
                .then((response) => {
                    const newComment = response.data.data
                    setComments((previousComments) => [newComment, ...previousComments])
                    commentContent.current.value = ''
                })
                .then(() => {
                    setIsLoading(false)
                })
                .catch(() => {
                    showSnackBar({
                        severity: 'error',
                        children: 'Something went wrong, please try again later.',
                    })
                })
        }
    }

    const deleteCommentHandler = (commentId) => {
        commentsActions
            .deleteComment(commentId)
            .then(() => {
                setComments((prevComments) =>
                    prevComments.filter((comment) => comment.id !== commentId)
                )
            })
            .catch(() => {
                showSnackBar({
                    severity: 'error',
                    children: 'Something went wrong, please try again.',
                })
            })
    }
    const editCommentHandler = (commentId, commentContent) => {
        commentsActions
            .editComment(commentId, commentContent)
            .then((response) => {
                const positionIndexComment = comments.findIndex(
                    (comment) => comment.id === commentId
                )
                const newComments = [...comments]
                newComments.splice(positionIndexComment, 1, response.data.data)
                setComments(newComments)
            })
            .catch(() => {
                showSnackBar({
                    severity: 'error',
                    children: 'Something went wrong, please try again.',
                })
            })
    }
    useEffect(() => {
        hasMoreComments &&
            setLoadMoreCommentsConfig((previousValue) => ({
                ...previousValue,
                lastCommentId: comments[comments.length - 1].id,
            }))
    }, [hasMoreComments, comments])
    return (
        <React.Fragment>
            <Box sx={{ mb: 2 }}>
                <Divider sx={{ mb: 1 }} />
                <Button
                    startIcon={<ModeComment />}
                    color="primary"
                    onClick={loadCommentsHandler}
                    disabled={!initialLoadingComments.current}
                >
                    Comment
                </Button>
                <Divider sx={{ mt: 1 }} />
            </Box>
            {openCommentField && (
                <Box sx={{ display: 'flex' }}>
                    <Avatar alt="avatar" src={auth.image} />
                    <FormControl fullWidth sx={{ ml: 2 }}>
                        <OutlinedInput
                            placeholder="Write your comment..."
                            size="small"
                            sx={{
                                borderRadius: 8,
                            }}
                            autoFocus
                            inputRef={commentContent}
                            onKeyDown={createCommentHandler}
                        />
                    </FormControl>
                </Box>
            )}
            {isLoading && initialLoadingComments.current && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress disableShrink />
                </Box>
            )}
            {isLoading &&
                !initialLoadingComments.current &&
                !!commentContent.current?.value.trim() && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress disableShrink />
                    </Box>
                )}
            {comments.length !== 0 &&
                comments.map((comment) => (
                    <CommentSection
                        key={comment.id}
                        onDeleteComment={deleteCommentHandler}
                        editCommentHandler={editCommentHandler}
                        comment={comment}
                        EventId={EventId}
                    />
                ))}
            {hasMoreComments && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                            variant="body2"
                            sx={{
                                cursor: 'pointer',
                                '&:hover': { textDecoration: 'underline' },
                                color: grey[800],
                                mr: 1,
                            }}
                            fontWeight={500}
                            onClick={loadCommentsHandler}
                        >
                            Watch more comments
                        </Typography>
                        {isLoading && <CircularProgress disableShrink size={20} />}
                    </Box>
                    {!!comments && (
                        <Typography sx={{ color: grey[500] }}>
                            {comments.length}/{numberComments}
                        </Typography>
                    )}
                </Box>
            )}
        </React.Fragment>
    )
}

export default CommentsSection
