import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { createPost, fetchPostById } from '../../redux/slices/Post';
import { AppDispatch, RootState } from '../../redux/store';
import { useNavigate, useParams } from 'react-router-dom';

const CreatePost = () => {
    const { postId } = useParams<{ postId?: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.currentUser);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const isEditing = postId !== undefined; 
    const navigate = useNavigate();
    
    useEffect(() => {
        if (isEditing && postId) {
            dispatch(fetchPostById(parseInt(postId))).then((action) => {
                if (action.meta.requestStatus === 'fulfilled') {
                    const post = action.payload;
                    setTitle(post.Title);
                    setText(post.Text);
                }
            });
        }
    }, [dispatch, postId, isEditing]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]); 
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (user && image) {
            const formData = new FormData();
            formData.append('UserId', String(user.Id));
            formData.append('Title', title);
            formData.append('Text', text);
            formData.append('photo', image);
    
            dispatch(createPost(formData));
            setTitle('');
            setText('');
            setImage(null);
    
            setTimeout(() => {
                navigate('/myaccount');
            }, 3000); 
        }
    };
    

     

    return (
        <Container maxWidth="sm" style={{ marginTop: '20px' }}>
            <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '20px' }}>
                Creare Post
            </Typography>
            <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Titlu Postare"
                        variant="outlined"
                        autoComplete="off"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Text Postare"
                        variant="outlined"
                        multiline
                        rows={4}
                        required
                        autoComplete="off"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Crează
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default CreatePost;
