import React from 'react';
import { Box, Card, CardMedia} from '@mui/material';
import { Story } from '../../redux/slices/Story';

interface StoryCardProps {
    story: Story;
}

const StoryCard: React.FC<StoryCardProps & { onClick: () => void }> = ({ story, onClick }) => {
    const baseUrl = "http://localhost/React-TS-DB_Proiect/server/";



    return (
        <Box 
            onClick={onClick}
            sx={{
                width: 150,
                height: 170,
                m: 1,
                boxShadow: 3,
                borderRadius: '24px',
                border: '5px solid transparent',
                backgroundImage: 'linear-gradient(#f0f0f0, #f0f0f0), linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,154,0,1) 50%, rgba(0,255,220,1) 100%)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'content-box, border-box',
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center', 
                cursor: 'pointer'
            }}
        >
            <Box width={140} height={160} boxShadow={3} sx={{ borderRadius: '16px', backgroundColor: '#f0f0f0' }}>
                <Card sx={{ width: '100%', height: '100%', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {story.ImageUrl && (
                        <CardMedia 
                            component="img"
                            image={baseUrl + story.ImageUrl}
                            alt="Story"
                            sx={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }} 
                        />
                    )}
                </Card>
            </Box>

        </Box>
    );
}

export default StoryCard;
