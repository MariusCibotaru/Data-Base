import React from 'react';
import { Post } from '../../redux/slices/Post';
import { Box, Typography, Card, CardContent, CardMedia, Tooltip, IconButton } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface PostMaketProps {
  post: Post;
}

const PostMaketUser: React.FC<PostMaketProps> = ({ post }) => {
  const baseUrl = "http://localhost/React-TS-DB_Proiect/server/";

  const tooltipStyles = {
    typography: {
      fontSize: '1rem', 
    },
  };

  return (
    <Card sx={{ width: 345, height: 400, mb: 2, display: 'flex', flexDirection: 'column' }}>
        {post.ImageUrl && (
            <CardMedia
                component="img"
                height="300"
                image={baseUrl + post.ImageUrl}
                alt={post.Title}
                sx={{ objectFit: 'contain', backgroundColor: 'rgba(0, 0, 0, 0.05)' }} 
            />
        )}
        <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <Tooltip title={<Typography sx={tooltipStyles.typography}>{post.Title}</Typography>} placement="top" arrow>
                <Typography gutterBottom variant="h5" component="div" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {post.Title}
                </Typography>
            </Tooltip>
            <Tooltip title={<Typography sx={tooltipStyles.typography}>{post.Text}</Typography>} placement="top" arrow>
                <Typography variant="h6" color="text.secondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {post.Text}
                </Typography>
            </Tooltip>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton size="small">
                        <CommentIcon />
                    </IconButton>
                    <Typography variant="subtitle1" sx={{ marginLeft: 1 }}>
                        {post.CommentsCount}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton size="small">
                        <FavoriteIcon />
                    </IconButton>
                    <Typography variant="subtitle1" sx={{ marginLeft: 1 }}>
                        {post.LikesCount}
                    </Typography>
                </Box>
            </Box>
        </CardContent>
    </Card>
  );
}

export default PostMaketUser;
