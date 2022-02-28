import React, { useEffect, useState } from 'react'

import queryString from 'query-string'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import EventCard from '../../../../components/EventCard'
import { EventBusy as EventBusyIcon, EventRepeat as EventRepeatIcon } from '@mui/icons-material'
import { Grid, Box, Alert, Link, CircularProgress } from '@mui/material'

import { useSnackbar } from '../../../../HOCs/SnackbarContext'
import authAtom from '../../../../recoil/auth'
import useEventAction from '../../../../recoil/event/action'

const EventsList = () => {
    const auth = useRecoilValue(authAtom)
    const { search: queries } = useLocation()
    const { search, upcoming } = queryString.parse(queries)
    const eventAction = useEventAction()
    const [events, setEvents] = useState([])
    const [eventsNumber, setEventsNumber] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [hasMore, setHasMore] = useState(true)
    const showSnackbar = useSnackbar()
    let lastEventId
    const isFilter = !!search

    const Loading = () => (
        <Box display="flex" justifyContent="center" my={20}>
            <CircularProgress thickness={4} color="secondary" />
        </Box>
    )

    // const loadMoreHandler = () => {
    //     let params = '?resultCount=6&'
    //     params += 'lastEventID=' + lastEventId

    //     eventAction
    //         .getEvents(params)
    //         .then((res) => {
    //             setTimeout(() => {
    //                 setEvents(events.concat(res.data.data.listEvents))
    //                 setHasMore(res.data.data.canLoadMore)
    //             }, 1600)
    //         })
    //         .catch(() => {
    //             showSnackbar({
    //                 severity: 'error',
    //                 children: 'Something went wrong, please try again later.',
    //             })
    //         })
    // }

    useEffect(() => {
        setIsLoading(true)

        let filterString = '?resultCount=6'
        if (search && search.trim() !== '') {
            filterString += '&search=' + search
        }
        if (upcoming !== undefined) {
            if (upcoming === 'true') {
                filterString += '&upcoming=true'
            } else if (upcoming === 'false') {
                filterString += '&upcoming=false'
            }
        }

        eventAction
            .getMyEvents()
            .then((res) => {
                setEvents(res.data.data.events)
                // setEventsNumber(res.data.data.count)
                // setHasMore(res.data.data.canLoadMore)
                // console.log(res.data.data.listEvents)
                setIsLoading(false)
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong, please try again later.',
                })
                setIsLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, upcoming])

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center
            "
            alignItems="center"
            width="100%"
        >
            {/* <Box display="flex" flexDirection="column" alignItems="flex-end" width="100%" mb={5}>
                <Typography>{eventsNumber} results</Typography>
                <Divider sx={{ width: '30%', height: '5px', backgroundColor: 'grey' }} />
            </Box> */}
            {isLoading ? (
                <Loading />
            ) : events.length ? (
                <InfiniteScroll
                    dataLength={events.length}
                    loader={<Loading />}
                    // next={loadMoreHandler}
                    hasMore={hasMore}
                    endMessage={
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Alert icon={<EventRepeatIcon />} variant="outlined" severity="warning">
                                There are no more events to load
                            </Alert>
                        </Box>
                    }
                >
                    <Grid container rowGap={4}>
                        {events.map(
                            (
                                {
                                    id,
                                    eventTitle,
                                    eventDescription,
                                    startDate,
                                    imageUrl,
                                    organization,
                                },
                                i,
                                { length }
                            ) => {
                                if (i + 1 === length) {
                                    lastEventId = id
                                }

                                return (
                                    <Grid item xs={12} key={id}>
                                        <EventCard
                                            id={id}
                                            title={eventTitle}
                                            description={eventDescription}
                                            startDate={startDate}
                                            imageUrl={imageUrl}
                                            organizer={organization.name}
                                        />
                                    </Grid>
                                )
                            }
                        )}
                    </Grid>
                </InfiniteScroll>
            ) : isFilter ? (
                <Box display="flex" justifyContent="center">
                    <Alert icon={<EventBusyIcon />} variant="outlined" severity="warning">
                        Cannot find any events
                    </Alert>
                </Box>
            ) : (
                <Box display="flex" justifyContent="center">
                    <Alert icon={<EventBusyIcon />} variant="outlined" severity="warning">
                        {auth.role === 'Organizer' ? (
                            <React.Fragment>
                                There is not any events here, let&apos;s{' '}
                                <RouterLink to="/events/create">
                                    <Link component="span">create one!</Link>
                                </RouterLink>{' '}
                            </React.Fragment>
                        ) : (
                            'There is not any events here, please come back later!'
                        )}
                    </Alert>
                </Box>
            )}
        </Box>
    )
}

export default EventsList