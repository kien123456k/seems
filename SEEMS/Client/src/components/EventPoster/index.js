import { Box } from '@mui/material'

const EventPoster = ({ src, size }) => {
    return (
        <Box
            width="100%"
            height="100%"
            minWidth="300px"
            sx={{
                aspectRatio: '1 / 1',
                backgroundImage: `url(${src})`,
                backgroundSize: size,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
            }}
        ></Box>
    )
}

export default EventPoster
