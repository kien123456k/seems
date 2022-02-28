import moment from 'moment'

import { CalendarToday } from '@mui/icons-material'
import { Typography } from '@mui/material'
import { blueGrey } from '@mui/material/colors'
import { Box } from '@mui/system'

const EventDate = ({ startDate, endDate }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <CalendarToday color="primary" />
            <Typography
                variant="h5"
                fontWeight={500}
                color="primary"
                sx={{ ml: 1.5, color: blueGrey[900] }}
            >
                {moment(startDate).format('MMM Do YYYY, HH:mm A')} -{' '}
                {moment(endDate).format('MMM Do YYYY, HH:mm A')}
            </Typography>
        </Box>
    )
}

export default EventDate
