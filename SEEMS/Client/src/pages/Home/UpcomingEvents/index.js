import React from 'react'

import EventPoster from '../../../components/EventPoster'
import { Grid, Card, Typography } from '@mui/material'

import EventSummaryInfo from './EventSummaryInfo'

const UpComingEvents = ({ upComingEvents }) => {
    return (
        <React.Fragment>
            <Typography variant="h3" color="primary" align="center" mb={2} mt={3} fontWeight={700}>
                Upcoming events
            </Typography>
            <Grid container rowGap={5}>
                {upComingEvents.map((upComingEvent) => (
                    <Grid
                        item
                        xs={12}
                        container
                        key={upComingEvent.id}
                        component={Card}
                        elevation={2}
                    >
                        <Grid item sm={12} xs={12} md={4}>
                            <EventPoster poster={upComingEvent.poster} />
                        </Grid>
                        <Grid item sm={12} xs={12} md={8}>
                            <EventSummaryInfo
                                title={upComingEvent.title}
                                content={upComingEvent.content}
                                time={upComingEvent.time}
                                mode={upComingEvent.mode}
                                eventId={upComingEvent.id}
                            />
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </React.Fragment>
    )
}

export default UpComingEvents
