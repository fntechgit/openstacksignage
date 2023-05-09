import {$store} from "../store";
import moment from "moment/moment";

export default class AbstractEventsModel{

    constructor() {
        this.events = [];
        this.idx_events = {};
        this.location = null;
        this.offset = 0;
        this.timezone = 0;
        this.timeout = null;
        this.debug_timestamp = null;
        this.debug = false;
        this.state = {
            now: null,
        }
    }

    setup(){
        let params = new URLSearchParams(window.location.href.split('?')[1])
        this.debug = !!params.get('debug')
        // added manual time stamp debug
        this.debug_timestamp = params.has('time') ? parseInt(params.get('time')): null;
    }

    update(newState = {}) {

        let {eventsData , allIDXEvents, summit } = newState;

        // sets new state
        if(eventsData){
            console.log('AbstractEventsModel::update setting new state', eventsData)
            this.events = eventsData;
        }

        // sets new state
        if(allIDXEvents){
            console.log('AbstractEventsModel::update setting new state', allIDXEvents)
            this.idx_events = allIDXEvents;
        }

        if(summit){
            $store.commit('setSummit', summit);
        }
    }

    syncTime() {
        return $store.dispatch('loadDate').then(timestamp => {
            // set de debug offset
            if(this.debug_timestamp)
                timestamp = this.debug_timestamp;
            this.offset = moment.unix(timestamp).diff(
                moment.utc(), 'seconds'
            );
            return this;
        })
    }

    tick() {
        this.state.now = moment.utc().unix() + parseInt(this.offset)
    }

    now() {
        return this.getDate(this.state.now)
    }

    getLocation() {
        return $store.dispatch('getLocation').then(location => {
            this.location = location; return this
        })
    }

    loadSummit() {
        return $store.dispatch('loadSummit').then(summit => {
            this.timezone = summit.time_zone.offset; return this
        })
    }

    getDate(ts, raw) {
        return moment.unix(
            ts + ( ! raw ? parseInt(this.timezone) : 0)
        ).utc()
    }

    format(ts, raw) {
        return this.getDate(ts, raw).format(
            raw ? 'Y-MM-DD h:mm:ss A' : 'Y-MM-DD <b>h:mm:ss A</b>'
        )
    }

    todayDate() {
        return this.now().date()
    }

    isToday(timestamp) {
        return this.getDate(timestamp).isSame(this.now(), 'd')
    }

    isWithinHour(timestamp) {
        return this.getDate(timestamp).diff(this.now(), 'h');
    }

    isWithin45Minutes(timestamp) {
        return this.getDate(timestamp).diff(this.now() - (15 * 60 * 1000), 'h');
    }

    setOffset(offset) {
        this.offset = offset;
        this.update();
    }

    getEvents(){
        return this.events;
    }

    getEventsIdx(){
        return this.idx_events;
    }

    setTimeout(interval) {
        this.timeout && clearTimeout(this.timeout)
        const msOffset = new Date().getTime() % 1000
        this.timeout = setTimeout(() => this.update(),
            Math.min(interval, (5 * 60 * 1000)) - msOffset
        )
    }

    setupClock() {
        setTimeout(() => { // Start at .0000
            setInterval(() => this.tick(), 1000); this.update()
        }, 1000 - new Date().getTime() % 1000)
    }

}