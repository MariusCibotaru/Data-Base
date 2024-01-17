import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../../redux/slices/User';
import { AppDispatch, RootState } from '../../redux/store';
import { Box, Avatar, Typography, Divider } from '@mui/material';
import PostMaketUser from '../../components/post/PostMaketUser';
import { fetchUserPosts } from '../../redux/slices/Post';
import StoryUserList from '../../components/story/StoryUserList';

const MyAccount = () => {
    const dispatch = useDispatch<AppDispatch>();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentUser = useSelector(selectCurrentUser);
    const posts = useSelector((state: RootState) => state.posts.userPosts);

    useEffect(() => {
        if (isAuthenticated && currentUser?.Id) {
            dispatch(fetchUserPosts(currentUser.Id));
        }
    }, [dispatch, isAuthenticated, currentUser?.Id]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                <Avatar sx={{ width: 100, height: 100 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h4" sx={{ margin: 1 }}>
                        {currentUser?.username}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center', margin: 1 }}>
                        <Typography variant="h6">
                            Postari: {currentUser?.postsCount}
                        </Typography>
                        <Typography variant="h6">
                            Abonati: {currentUser?.subscribers}
                        </Typography>
                        <Typography variant="h6">
                            Abonari: {currentUser?.subscriptions}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Divider sx={{ width: '100%', marginY: 1 }} />

            <Box height="20%" my={2} width="100%">
                <StoryUserList/>
            </Box>
            <Divider sx={{ width: '100%', marginY: 1 }} />
            
           {/* Отображение постов пользователя */}
           <Box sx={{
              display: "flex",
              justifyContent: 'center', 
              flexWrap: "wrap",
              gap: "10px",
              overflow: "auto",
              mt: 2
            }}>
                {posts.map((post) => (
                    <Box key={post.Id}>
                        <PostMaketUser post={post} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default MyAccount;
