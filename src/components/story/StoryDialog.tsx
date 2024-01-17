import React from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import { Story } from '../../redux/slices/Story';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface StoryDialogProps {
    story: Story | null;
    open: boolean;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
}

const StoryDialog: React.FC<StoryDialogProps> = ({ story, open, onClose, onPrevious, onNext }) => {
    if (!story) return null;
    const baseUrl = "http://localhost/React-TS-DB_Proiect/server/";

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                style: {
                    position: 'relative',
                    height: '80vh',
                },
            }}
        >
            <IconButton
                onClick={onClose}
                style={{ 
                    position: 'absolute', 
                    right: 8, 
                    top: 8,
                    zIndex: 1, 
                }}
            >
                <CloseIcon />
            </IconButton>

            <DialogContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <IconButton 
                    onClick={onPrevious} 
                    style={{ position: 'absolute', left: 0 }}
                >
                    <ArrowBackIosNewIcon />
                </IconButton>

                {story.ImageUrl && (
                    <img 
                        src={baseUrl + story.ImageUrl} 
                        alt="Story" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' }} 
                    />
                )}

                <IconButton 
                    onClick={onNext} 
                    style={{ position: 'absolute', right: 0 }}
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </DialogContent>
        </Dialog>
    );
};

export default StoryDialog;
