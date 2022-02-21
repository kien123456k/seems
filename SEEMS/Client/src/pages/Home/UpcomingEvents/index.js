import React, { useEffect, useState } from 'react'

import { useHistory } from 'react-router-dom'

import EventPoster from '../../../components/EventPoster'
import SearchField from '../../../components/SearchField'
import { Grid, Card, Typography, Box, Button, useMediaQuery, useTheme } from '@mui/material'

import useEventAction from '../../../recoil/event/action'
import EventSummaryInfo from './EventSummaryInfo'

const UpComingEvents = () => {
    const history = useHistory()
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('sm'))
    const eventAction = useEventAction()
    const [upcomingEvents, setUpcomingEvents] = useState([])

    useEffect(() => {
        eventAction.getUpcomingEvents().then((res) => {
            setUpcomingEvents(res.data.data.events)
            // console.log(res.data.data.events)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <React.Fragment>
            <Typography variant="h3" color="primary" align="center" mt={2} fontWeight={700}>
                Upcoming Events
            </Typography>
            <Box display="flex" flexDirection="column" sx={{ maxWidth: 1000, m: '0 auto' }}>
                <Box my={5}>
                    <SearchField />
                </Box>
                <Grid container rowGap={6} display="flex" justifyContent="center">
                    {upcomingEvents.map(
                        ({ id, eventTitle, eventDescription, startDate, imageUrl }) => (
                            <Card
                                key={id}
                                elevation={3}
                                sx={{
                                    position: 'relative',
                                    mx: { sx: 2, width: '100%' },
                                }}
                            >
                                <Box px={{ xs: 2, sm: 4 }} mb={{ xs: 8, md: 4, lg: 0 }}>
                                    <Grid item xs={12} container>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <EventPoster src={imageUrl} size="contain" />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={8}>
                                            <EventSummaryInfo
                                                title={eventTitle}
                                                content={eventDescription}
                                                startTime={startDate}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box
                                    position="absolute"
                                    bottom={30}
                                    right={matches ? 50 : 10}
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => history.push(`/events/register/${id}`)}
                                        sx={{ mx: 1 }}
                                    >
                                        Register
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        onClick={() => history.push(`/events/${id}`)}
                                        sx={{ mx: 1 }}
                                    >
                                        Read More
                                    </Button>
                                </Box>
                            </Card>
                        )
                    )}
                </Grid>
            </Box>
            <Box display="flex" justifyContent="center" mt={6}>
                <Button variant="contained" size="large" onClick={() => history.push('/events')}>
                    See All Events
                </Button>
            </Box>
        </React.Fragment>
    )
}

export default UpComingEvents
