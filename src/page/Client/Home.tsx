import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, CircularProgress } from '@mui/material';
import PostMaket from '../../components/post/PostMaket';
import { fetchAllPosts, fetchSubscribedPosts, selectIsPostLoading } from '../../redux/slices/Post';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { selectCurrentUser, selectIsAuthenticated } from '../../redux/slices/User';
import StoryList from '../../components/story/StoryList';


interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box style={{ width: '100%' }}>
          <Typography component="div">{children}</Typography> 
        </Box>
      )}
    </Box>
  );
}

const Home = () => {
  const [value, setValue] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const subscribedPosts = useSelector((state: RootState) => state.posts.subscribedPosts);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isPostLoading = useSelector(selectIsPostLoading);

  useEffect(() => {
    if (value === 0) {
      dispatch(fetchAllPosts());
    } else if (value === 1 && isAuthenticated && currentUser && currentUser.Id) {
      dispatch(fetchSubscribedPosts(currentUser.Id));
    }
  }, [dispatch, value, isAuthenticated, currentUser]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  if (isPostLoading && (isAuthenticated)) {
    return <CircularProgress />;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">

      {isAuthenticated && (
        <Box height="20%" my={2} width="100%">
          <StoryList/>
        </Box>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label={<Typography variant='h5' component='div'>Recomandari</Typography>} />
          <Tab 
            label={<Typography variant='h5' component='div'>Abonari</Typography>} 
            disabled={!isAuthenticated}
          />
        </Tabs>
      </Box>


      <TabPanel value={value} index={0}>
        {
          posts.map((post) => (
            <Box key={post.Id} width="100%" my={2} display="flex" justifyContent="center">
              <PostMaket post={post} />
            </Box>
          ))
        }
      </TabPanel>

      <TabPanel value={value} index={1}>
        {subscribedPosts && subscribedPosts.length > 0 ? (
          subscribedPosts.map((post) => (
            <Box key={post.Id} width="100%" my={2} display="flex" justifyContent="center">
              <PostMaket post={post} />
            </Box>
          ))
        ) : (
          <Typography variant="h5" align="center" style={{ marginTop: '20px' }}>
            Nu sunt posturi disponibile sau nu sunteti abonat pe alti utilizatori
          </Typography>
        )}
      </TabPanel>
    </Box>
  );
};

export default Home;
