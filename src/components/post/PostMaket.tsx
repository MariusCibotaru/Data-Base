import React, { useEffect, useState } from 'react';
import { Post } from '../../redux/slices/Post';
import { Box, Divider, Typography, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Avatar, CircularProgress } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CommentIcon from '@mui/icons-material/Comment';
import { createLike, deleteLike } from '../../redux/slices/Post';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { createComment } from '../../redux/slices/Post';
import AddIcon from '@mui/icons-material/Add';
import ReplyIcon from '@mui/icons-material/Reply';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { selectSubscriptions, createSubscription, deleteSubscription } from '../../redux/slices/Subscriptions';
import { selectIsAuthenticated } from '../../redux/slices/User';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

interface PostMaketProps {
    post: Post;
  }
  
  const PostMaket: React.FC<PostMaketProps> = ({ post }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.currentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const subscriptions = useSelector(selectSubscriptions);
    const [likesCount, setLikesCount] = useState(Number(post.LikesCount) || 0);
    const [userLiked, setUserLiked] = useState(false);
    const [userLikeId, setUserLikeId] = useState<number | null>(null);
    const [showComments, setShowComments] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState(post.Comments || []);
    const [commentsCount, setCommentsCount] = useState(post.Comments?.length || 0);
    const [openReplyDialog, setOpenReplyDialog] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const isCurrentUserPost = user && Number(user.Id) === Number(post.UserId) ? true : false;
    const baseUrl = "http://localhost/React-TS-DB_Proiect/server/";
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setUserLiked(false);
            setUserLikeId(null);
            return;
        }
    
        const userLike = post.Likes?.find(like => like.UserId === Number(user.Id));
        if (userLike) {
            setUserLiked(true);
            setUserLikeId(userLike.Id);
        } else {
            setUserLiked(false);
            setUserLikeId(null);
        }
    }, [post, user]);

    useEffect(() => {
        if (user && subscriptions.length > 0) {
            const isSubscribedCheck = subscriptions.some(sub => 
                String(sub.subscriberId) === String(user.Id) && String(sub.subscribedToId) === String(post.UserId)
            );
            setIsSubscribed(isSubscribedCheck);
        } else {
            setIsSubscribed(false);
        }
        setIsLoading(false);
    }, [subscriptions, user, post.UserId]);

    const stringToColor = (string: string): string => {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
          const value = (hash >> (i * 8)) & 0xFF;
          color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    };

    const firstLetter = post.username ? post.username.charAt(0).toUpperCase() : '';
    const avatarColor = stringToColor(post.username || '');

    const iconStyle = {
        cursor: 'pointer',
        '&:hover': {
            transform: 'scale(1.2)',
            transition: 'transform 0.3s ease-in-out'
        }
    };

    const handleLikeClick = () => {
        if (user && user.Id) {
            if (userLiked && userLikeId) {
                dispatch(deleteLike(userLikeId))
                    .then((action) => {
                        if (action.meta.requestStatus === 'fulfilled') {
                            setLikesCount(prevCount => prevCount - 1);
                            setUserLiked(false);
                            setUserLikeId(null);
                        }
                    });
            } else {
                const likeData = { UserId: user.Id, PostId: post.Id };
                dispatch(createLike(likeData))
                .then((action) => {
                    if (action.meta.requestStatus === 'fulfilled') {
                        setLikesCount(prevCount => prevCount + 1);
                        setUserLiked(true);
                        const newLikeId = action.payload.like.Id; 
                        setUserLikeId(newLikeId);
                    }
                });
            }
        } else {
            console.log("Пользователь не аутентифицирован");
        }
    };

    const handleCommentClick = () => {
        setShowComments(prevShowComments => !prevShowComments);
    };
    
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCommentText(''); 
    };

    const handleCommentChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setCommentText(event.target.value);
    };

    const handleAddComment = () => {
        if (user && user.Id && commentText.trim()) {
            const newCommentData = {
                UserId: user.Id,
                PostId: post.Id,
                Text: commentText
            };

            dispatch(createComment(newCommentData))
                .then((action) => {
                    if (action.meta.requestStatus === 'fulfilled') {
                        setComments(prevComments => [...prevComments, action.payload.comment]);
                        handleCloseDialog();
                    }
                })
                .catch((error) => {
                    console.error('Error adding comment:', error);
                });
        }
        setCommentsCount(prevCount => prevCount + 1);
    };

    const handleOpenReplyDialog = (commentId: number) => {
        setOpenReplyDialog(true);
        setReplyToCommentId(commentId);
    };

    const handleCloseReplyDialog = () => {
        setOpenReplyDialog(false);
        setReplyText('');
        setReplyToCommentId(null);
    };

    const handleReplyTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReplyText(event.target.value);
    };

    const handleAddReply = () => {
        if (user && user.Id && replyText.trim() && replyToCommentId) {
            const replyData = {
                UserId: user.Id,
                PostId: post.Id,
                Text: replyText,
                IsAnswer: true,
                AnswerId: replyToCommentId
            };
    
            dispatch(createComment(replyData))
                .then((action) => {
                    if (action.meta.requestStatus === 'fulfilled') {
                        // Добавляем ответ в список комментариев
                        setComments(prevComments => [...prevComments, action.payload.comment]);
                        handleCloseReplyDialog(); 
                    }
                })
                .catch((error) => {
                    console.error('Error adding reply:', error);
                });
        }
        setCommentsCount(prevCount => prevCount + 1); 
    };

    const handleSubscribe = () => {
        if (user && isAuthenticated) {
            dispatch(createSubscription({ subscriberId: user.Id, subscribedToId: post.UserId }));
        }
    };

    const handleUnsubscribe = () => {
        if (user && isAuthenticated) {
            const subscription = subscriptions.find(sub => 
                String(sub.subscriberId) === String(user.Id) && String(sub.subscribedToId) === String(post.UserId)
            );
    
            if (subscription) {
                dispatch(deleteSubscription(subscription.id));
            }
        }
    };
    
    const handleEdit = () => {
        navigate(`/create/${post.Id}`);
    };

    if (isLoading) {
        return <CircularProgress />;
    }
    
    
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%', 
                margin: 'auto',
                padding: '20px',
                borderRadius: '10px', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                overflow: 'hidden' 
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 2
                }}
            >
                {/* Левая часть: Аватар и ID пользователя */}
                <Box display="flex" alignItems="center">
                    <Avatar sx={{ marginRight: 2, bgcolor: avatarColor }}>{firstLetter}</Avatar>
                    <Typography variant="h5">{post.username}</Typography>
                </Box>

                {/* Правая часть: Кнопка подписки */}
                {isCurrentUserPost ? (
                   <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={handleEdit}>
                        Editeaza
                    </Button>
                ) : (
                    isSubscribed ? (
                        <Button variant="contained" color="secondary" onClick={handleUnsubscribe} disabled={!isAuthenticated}>
                            Abonat
                        </Button>
                    ) : (
                        <Button variant="contained" startIcon={<FavoriteIcon />} endIcon={<NotificationsIcon />} onClick={handleSubscribe} disabled={!isAuthenticated}>
                            Aboneazate
                        </Button>
                    )
                )}
            </Box>

            <Box
                sx={{
                    width: 'calc(100% - 40px)', 
                    margin: 'auto',
                    padding: '20px', 
                    borderRadius: '10px',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', 
                    '&:hover': {
                        boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
                    }
                }}
            >
                <Typography variant="h5">
                    {post.Title}
                </Typography>
                <Divider style={{ margin: '10px 0' }} />

                {post.ImageUrl && (
                    <>
                        <Box
                            sx={{
                                width: '100%',
                                height: 600,
                                overflow: 'hidden',
                                marginTop: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: 600,
                                    overflow: 'hidden',
                                    backgroundImage: `url(${baseUrl + post.ImageUrl})`,
                                    backgroundSize: 'contain', 
                                    backgroundPosition: 'center', 
                                    backgroundRepeat: 'no-repeat', 
                                }}
                            />

                        </Box>
                        <Divider style={{ margin: '10px 0' }} />
                    </>
                )}

                <Typography variant="body1">
                {post.Text}
                </Typography>
                <Divider style={{ margin: '10px 0' }} />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <IconButton onClick={handleCommentClick}>
                        <CommentIcon />
                        <Typography variant="body2" style={{ marginLeft: '5px' }}>
                            {commentsCount} 
                        </Typography>
                    </IconButton>
                    <IconButton onClick={handleLikeClick} disabled={isCurrentUserPost}>
                        <ThumbUpAltIcon style={{ color: userLiked ? 'blue' : 'inherit' }} />
                        <Typography variant="body2" style={{ marginLeft: '5px' }}>
                            {likesCount}
                        </Typography>
                    </IconButton>
                </Box>

                {showComments && (
                    <Box sx={{ paddingTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ textAlign: 'center', paddingBottom: '10px' }}>
                            <IconButton sx={iconStyle} onClick={handleOpenDialog}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                        {comments.filter(comment => !comment.IsAnswer).map((comment) => (
                            <Box 
                            key={comment.Id} 
                            sx={{ 
                                padding: '10px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'start', 
                                maxWidth: '90%', 
                                width: '100%', 
                                marginBottom: '10px', 
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
                            }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {comment.username}:
                                    </Typography>
                                    <Typography variant="h6">
                                    {comment.Text}
                                    </Typography>
                                </Box>
                                <IconButton onClick={() => handleOpenReplyDialog(comment.Id)}>
                                    <ReplyIcon />
                                </IconButton>
                                </Box>

                                {/* Показываем ответы на этот комментарий, если они есть */}
                                {comments.filter(reply => reply.AnswerId === comment.Id).map(reply => (
                                    <Box key={reply.Id} sx={{ marginTop: '10px', marginLeft: '20px', paddingLeft: '10px', borderLeft: '2px solid grey' }}>
                                    <Typography variant="body1">
                                    {reply.username}: {reply.Text}
                                    </Typography>
                                </Box>
                                ))}
                            </Box>
                        ))}
                    </Box>
                )}


                <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                    <DialogTitle>Aduaga Comentariu</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {/* Текст или другое содержимое */}
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="comment"
                            label="Comentariu"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            value={commentText}
                            onChange={handleCommentChange}
                            />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} variant="outlined" color="secondary">Anuleaza</Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            disabled={!commentText.trim()}
                            onClick={handleAddComment}
                            >
                            Adauga
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openReplyDialog} onClose={handleCloseReplyDialog} fullWidth maxWidth="md">
                    <DialogTitle>Aduaga Raspuns La Comentariu</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {/* Текст или другое содержимое */}
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="reply"
                            label="Raspuns"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            value={replyText}
                            onChange={handleReplyTextChange}
                            />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseReplyDialog} variant="outlined" color="secondary">Anuleaza</Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            disabled={!replyText.trim()}
                            onClick={handleAddReply}
                            >
                            Adauga
                        </Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </Box>
    );
  };  
  
  export default PostMaket;
  
  