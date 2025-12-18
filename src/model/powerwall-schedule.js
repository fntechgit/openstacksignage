import {$store} from '../store'
import AbstractEventsModel from './abstract-events-model';
import moment from 'moment';

export default class PowerwallSchedule extends AbstractEventsModel {

    constructor() {
        super();
        this.rooms = [];
        this.allEvents = [];
        this.timeSlots = [];
        this.eventsByRoomAndTime = {};
        this.state = {
            now: null,
            currentDate: null,
            displayDate: null,
        }
    }

    setup() {
        super.setup();

        return new Promise((resolve, reject) => {
            this.loadSummit().then(summit => {
                // Get rooms from URL params or load all
                const params = new URLSearchParams(window.location.href.split('?')[1]);
                const roomIds = params.get('rooms');

                if (roomIds) {
                    this.roomIds = roomIds.split(',').map(id => parseInt(id));
                }

                return this.loadAllEvents().then(() => {
                    return this.syncTime().then(() => {
                        this.organizeEvents();
                        this.update();
                        resolve();
                    });
                });
            }).catch(reject);

            this.setupClock();
        });
    }

    loadAllEvents() {
        const params = new URLSearchParams(window.location.href.split('?')[1]);
        const summit_id = parseInt(params.get('summit'));

        return $store.dispatch('loadAllEvents').then(payload => {
            this.allEvents = payload.data.data || [];

            // Extract unique rooms from events
            const roomsMap = new Map();
            this.allEvents.forEach(event => {
                if (event.location && event.location.id) {
                    roomsMap.set(event.location.id, event.location);
                }
            });

            // Filter by roomIds if specified
            if (this.roomIds && this.roomIds.length > 0) {
                this.rooms = Array.from(roomsMap.values())
                    .filter(room => this.roomIds.includes(room.id))
                    .sort((a, b) => {
                        // Sort by order in roomIds param
                        return this.roomIds.indexOf(a.id) - this.roomIds.indexOf(b.id);
                    });
            } else {
                this.rooms = Array.from(roomsMap.values())
                    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            }

            return this;
        });
    }

    organizeEvents() {
        // Use the timezone offset from summit (same approach as other models)
        const now = this.getDate(this.state.now);

        this.state.currentDate = now.format('dddd, MMMM D');
        this.state.displayDate = now.format('dddd, MMMM D');

        // Filter events for today
        const startOfDay = now.clone().startOf('day').unix();
        const endOfDay = now.clone().endOf('day').unix();

        const todayEvents = this.allEvents.filter(event => {
            const eventDate = this.getDate(event.start_date);
            return eventDate.isSame(now, 'day');
        });

        // Generate time slots (30-minute intervals from first to last event)
        this.generateTimeSlots(todayEvents);

        // Organize events by room and time slot
        this.eventsByRoomAndTime = {};

        this.rooms.forEach(room => {
            this.eventsByRoomAndTime[room.id] = {};

            this.timeSlots.forEach(slot => {
                this.eventsByRoomAndTime[room.id][slot.time] = null;
            });
        });

        todayEvents.forEach(event => {
            if (!event.location) return;

            const roomId = event.location.id;
            if (!this.eventsByRoomAndTime[roomId]) return;

            // Find which time slots this event spans
            this.timeSlots.forEach(slot => {
                const slotStart = slot.unix;
                const slotEnd = slot.unix + (30 * 60);

                // Event overlaps with this slot
                if (event.start_date < slotEnd && event.end_date > slotStart) {
                    if (!this.eventsByRoomAndTime[roomId][slot.time]) {
                        this.eventsByRoomAndTime[roomId][slot.time] = {
                            event: event,
                            isStart: event.start_date >= slotStart && event.start_date < slotEnd,
                            spanSlots: Math.ceil((event.end_date - event.start_date) / (30 * 60))
                        };
                    }
                }
            });
        });
    }

    generateTimeSlots(events) {
        if (events.length === 0) {
            this.timeSlots = [];
            return;
        }

        // Find earliest and latest times
        let earliest = Math.min(...events.map(e => e.start_date));
        let latest = Math.max(...events.map(e => e.end_date));

        // Round to 30-minute intervals
        const earliestMoment = this.getDate(earliest);
        earliestMoment.minutes(Math.floor(earliestMoment.minutes() / 30) * 30);
        earliestMoment.seconds(0);

        // Calculate the unix timestamp for the slot start
        let slotUnix = earliest - (earliest % (30 * 60));

        this.timeSlots = [];
        let current = earliestMoment.clone();

        while (slotUnix < latest) {
            this.timeSlots.push({
                time: current.format('h:mm a'),
                unix: slotUnix
            });
            current.add(30, 'minutes');
            slotUnix += 30 * 60;
        }
    }

    update(newState = {}) {
        this.tick();
        super.update(newState);

        // Re-organize events when time updates (for current event highlighting)
        if (this.allEvents.length > 0) {
            this.organizeEvents();
        }

        // Update every minute
        this.setTimeout(60 * 1000);
    }

    getCurrentTime() {
        return this.getDate(this.state.now).format('h:mm a');
    }

    isEventCurrent(event) {
        if (!event) return false;
        return this.state.now >= event.start_date && this.state.now < event.end_date;
    }

    isEventPast(event) {
        if (!event) return false;
        return this.state.now >= event.end_date;
    }
}
