import React, { useEffect, useState } from 'react';
import { fetchSubscribedStories, createStory } from '../../redux/slices/Story';
import StoryCard from './StoryCard';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { selectCurrentUser, selectIsAuthenticated } from '../../redux/slices/User';
import { Box, Card, CardActionArea, CircularProgress, TextField, Typography  } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CircleIcon from '@mui/icons-material/Circle';
import StoryDialog from './StoryDialog';

interface RoundButtonProps {
    selected: boolean;
    onClick: () => void;
}

const StoryList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentUser = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const subscribedStories = useSelector((state: RootState) => state.stories.subscribedStories);
    const isStoryLoading = useSelector((state: RootState) => state.stories.status === 'loading');
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [storyText, setStoryText] = useState('');
    const storiesPerPage = 6;
    const totalPages = Math.ceil(subscribedStories.length / storiesPerPage);
    const [currentPage, setCurrentPage] = useState(0);
    const indexOfLastStory = (currentPage + 1) * storiesPerPage;
    const indexOfFirstStory = indexOfLastStory - storiesPerPage;
    const currentStories = subscribedStories.slice(indexOfFirstStory, indexOfLastStory);
    const [openStoryDialog, setOpenStoryDialog] = useState(false);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

    useEffect(() => {
        if (isAuthenticated && currentUser?.Id) {
            dispatch(fetchSubscribedStories(currentUser.Id));
        }
    }, [dispatch, isAuthenticated, currentUser]);

    if (isStoryLoading) {
        return (
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    const RoundButton: React.FC<RoundButtonProps> = ({ selected, onClick }) => (
        <IconButton onClick={onClick} size="small" sx={{ margin: '0 5px', padding: 0 }}>
            <CircleIcon fontSize="small" color={selected ? "primary" : "disabled"} />
        </IconButton>
    );
    
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedImage(null);
        setStoryText('');
    };

    const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImage(file); 
            const imagePreviewUrl = URL.createObjectURL(file);
            setSelectedImage(imagePreviewUrl); 
        }
    };
    
    const handleRemoveSelectedImage = () => {
        setSelectedImage(null);
    };

    const handleCreateStory = async () => {
        if (image && currentUser) {
            const formData = new FormData();
            formData.append('photo', image);
            formData.append('UserId', String(currentUser.Id));
            formData.append('Text', storyText);
    
            dispatch(createStory(formData));
            handleCloseDialog();
        }
    };

    const handleOpenStoryDialog = (localIndex: number) => {
        const globalIndex = indexOfFirstStory + localIndex;
        setSelectedStoryIndex(globalIndex);
        setOpenStoryDialog(true);
    };
    

    const handleCloseStoryDialog = () => {
        setOpenStoryDialog(false);
        setSelectedStoryIndex(null);
    };

    const handlePreviousStory = () => {
        if (selectedStoryIndex !== null && selectedStoryIndex > 0) {
            setSelectedStoryIndex(selectedStoryIndex - 1);
        }
    };

    const handleNextStory = () => {
        if (selectedStoryIndex !== null && selectedStoryIndex < subscribedStories.length - 1) {
            setSelectedStoryIndex(selectedStoryIndex + 1);
        }
    };
    

    return (
        <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>

            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                {/* Контейнер для кнопки добавления и сторисов */}
                <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
                    {/* Кнопка добавления сториса */}
                    <Box width={150} height={170} m={1} boxShadow={3} sx={{ borderRadius: '24px' }}>
                        <Card sx={{ width: '100%', height: '100%', borderRadius: '16px' }}>
                            <CardActionArea onClick={handleOpenDialog} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <AddIcon fontSize="large" />
                            </CardActionArea>
                        </Card>
                    </Box>

                    {/* Отображение текущих сторисов */}
                    {currentStories.map((story, localIndex) => (
                        <StoryCard key={story.Id} story={story} onClick={() => handleOpenStoryDialog(localIndex)} />
                    ))}

                    <StoryDialog
                        story={selectedStoryIndex !== null ? subscribedStories[selectedStoryIndex] : null}
                        open={openStoryDialog}
                        onClose={handleCloseStoryDialog}
                        onPrevious={handlePreviousStory}
                        onNext={handleNextStory}
                    />
                </Box>

                {/* Контейнер для круглых кнопок-индикаторов */}
                <Box display="flex" justifyContent="center" mt={2}>
                    {[...Array(totalPages)].map((_, index) => (
                        <RoundButton
                            key={index}
                            selected={index === currentPage}
                            onClick={() => setCurrentPage(index)}
                        />
                    ))}
                </Box>
            </Box>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                PaperProps={{
                    style: {
                        width: '80%',
                        height: '80vh',
                    },
                }}
            >
                <DialogTitle>
                    <Typography variant="h4">Creare Story</Typography>
                    <IconButton onClick={handleCloseDialog} style={{ position: 'absolute', right: 8, top: 8 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%' }}>
                    <Box 
                        display="flex" 
                        justifyContent="center" 
                        alignItems="center" 
                        width="70%" 
                        height="80%" 
                        m={1} 
                        boxShadow={3} 
                        sx={{ borderRadius: '16px', backgroundColor: 'lightgray' }}
                    >
                        {selectedImage ? (
                            <Box position="relative" width="100%" height="100%">
                                <img src={selectedImage} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' }} />
                                <IconButton 
                                    onClick={handleRemoveSelectedImage} 
                                    style={{ position: 'absolute', right: 0, top: 0, color: 'white' }}
                                    aria-label="remove picture"
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        ) : (
                            <>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="upload-photo"
                                    type="file"
                                    onChange={handlePhotoSelect}
                                />
                                <label htmlFor="upload-photo">
                                    <IconButton color="primary" aria-label="upload picture" component="span">
                                        <AddAPhotoIcon fontSize="large" />
                                    </IconButton>
                                </label>
                            </>
                        )}
                    </Box>
                    <TextField
                        label="Text"
                        fullWidth
                        margin="normal"
                        value={storyText}
                        onChange={(e) => setStoryText(e.target.value)}
                        style={{ width: '70%' }} 
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Anuleaza
                    </Button>
                    <Button onClick={handleCreateStory} color="primary" variant="contained">
                        Creaza
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default StoryList;
