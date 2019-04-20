<template>
    <div id="app" :class="'room-' + schedule.room.name.replace(' ','')">

        <table v-if="schedule.debug" border="1" width="100%" class="debug">
            <tr>
                <td align="center" colspan="3" v-html="schedule.format(schedule.state.now)"></td>
            </tr>
            <tr>
                <td align="center" width="33%">
                    <a v-if="schedule.state.events.prev" href="" @click.prevent="syncStart(schedule.state.events.prev)">[start-5s]</a>
                    Previous Event
                    <a v-if="schedule.state.events.prev" href="" @click.prevent="syncEnd(schedule.state.events.prev)">[end-5s]</a>
                </td>
                <td align="center" width="33%">
                    <a v-if="schedule.state.events.curr" href="" @click.prevent="syncStart(schedule.state.events.curr)">[start-5s]</a>
                    Current Event
                    <a v-if="schedule.state.events.curr" href="" @click.prevent="syncEnd(schedule.state.events.curr)">[end-5s]</a>
                </td>
                <td align="center" width="33%">
                    <a v-if="schedule.state.events.next" href="" @click.prevent="syncStart(schedule.state.events.next)">[start-5s]</a>
                    Next Event
                    <a v-if="schedule.state.events.next" href="" @click.prevent="syncEnd(schedule.state.events.next)">[end-5s]</a>
                </td>
            </tr>
            <tr>
                <td align="center" width="33%">
                    {{ schedule.state.events.prev && schedule.state.events.prev.title || 'N/A' }}
                </td>
                <td align="center" width="33%">
                    {{ schedule.state.events.curr && schedule.state.events.curr.title || 'N/A' }}
                </td>
                <td align="center" width="33%">
                    {{ schedule.state.events.next && schedule.state.events.next.title || 'N/A' }}
                </td>
            </tr>
            <tr>
                <td align="center" width="33%">
                    <a v-if="schedule.state.scheduled_banners.prev" href="" @click.prevent="syncStart(schedule.state.scheduled_banners.prev)">[start-5s]</a>
                    Previous Banner
                    <a v-if="schedule.state.scheduled_banners.prev" href="" @click.prevent="syncEnd(schedule.state.scheduled_banners.prev)">[end-5s]</a>
                </td>
                <td align="center" width="33%">
                    <a v-if="schedule.state.scheduled_banners.curr" href="" @click.prevent="syncStart(schedule.state.scheduled_banners.curr)">[start-5s]</a>
                    Current Banner
                    <a v-if="schedule.state.scheduled_banners.curr" href="" @click.prevent="syncEnd(schedule.state.scheduled_banners.curr)">[end-5s]</a>
                </td>
                <td align="center" width="33%">
                    <a v-if="schedule.state.scheduled_banners.next" href="" @click.prevent="syncStart(schedule.state.scheduled_banners.next)">[start-5s]</a>
                    Next Banner
                    <a v-if="schedule.state.scheduled_banners.next" href="" @click.prevent="syncEnd(schedule.state.scheduled_banners.next)">[end-5s]</a>
                </td>
            </tr>
            <tr>
                <td align="center" width="33%">
                    {{ schedule.state.scheduled_banners.prev && schedule.state.scheduled_banners.prev.title || 'N/A' }}
                </td>
                <td align="center" width="33%">
                    {{ schedule.state.scheduled_banners.curr && schedule.state.scheduled_banners.curr.title || 'N/A' }}
                </td>
                <td align="center" width="33%">
                    {{ schedule.state.scheduled_banners.next && schedule.state.scheduled_banners.next.title || 'N/A' }}
                </td>
            </tr>
            <tr>
                <td align="center" colspan="3">
                    Static Banner: {{ schedule.state.static_banner && schedule.state.static_banner.content || 'N/A' }}
                </td>
            </tr>
        </table>

        <div class="location">
            <div class="text-uppercase">
                {{ schedule.room.name }}
            </div>
        </div>

        <div class="time">
            <div class="text-uppercase">
                {{ schedule.getDate(schedule.state.now).format('hh:mm') }}
            </div>
        </div>


        <div class="container-events">
            <li class="event-list" v-for="evt in schedule.state.events.all">
                <div class="event-time">{{ schedule.getDate(evt.start_date).format('HH:mm') }} - {{ schedule.getDate(evt.end_date).format('HH:mm') }} </div>
                <div class="event-title">{{ evt.title }} </div>
                <div class="event-speakers" v-for="speaker in evt.speakers">{{ speaker.first_name }} {{ speaker.last_name }}</div>
            </li>
        </div>

        <banner :banner="schedule.state.scheduled_banners.curr"
               v-if="schedule.state.scheduled_banners.curr && schedule.state.scheduled_banners.curr.type == 'Primary'"></banner>

        <event :schedule="schedule" :event="schedule.state.events.curr"
        v-if="schedule.state.events.curr && !schedule.state.scheduled_banners.curr"></event>

        <div v-else-if="! schedule.state.events.all" class="no-events">
            <h1 class="text-center font-weight-bold">
                All presentations are finished for today
            </h1>
        </div>

        <banner :banner="schedule.state.scheduled_banners.curr"
                v-if="schedule.state.scheduled_banners.curr && schedule.state.scheduled_banners.curr.type == 'Secondary'"></banner>
    </div>
</template>

<script>
    import Event from './event.vue'
    import Banner from './banner.vue'
    import moment from 'moment'
    import { mapGetters } from 'vuex'
    export default {
        computed: {
            ...mapGetters({
                schedule: 'schedule'
            }),
        },
        methods: {
            syncStart(item) {
                this.schedule.setOffset(
                    item.start_date - moment.utc().unix() - 5
                )
            },
            syncEnd(item) {
                this.schedule.setOffset(
                    item.end_date - moment.utc().unix() - 5
                )
            },
        },
        components: { Event, Banner }
    }
</script>

<style>
    .logo {
        padding-top: 150px;
    }
    .time {
        position: relative;
        top: 1800px;
        float: right;
        color: #000;
        font-size: 60px;
        line-height: 60px;
        font-family: Frutiger55 Roman;
        width: 300px;
        height: 70px;
    }
    .location {
        position: relative;
        top: 170px;
        left: 60px;
        right: 40px;
        color: #fff;
        font-size: 63px;
        line-height: 40px;
        font-family: Frutiger55 Roman;
        width: 300px;
        float: left;
        text-align: center;
    }
    .location .label {
        font-size: 1.5rem;
        font-weight: bold;
    }
    .location .value {
        font-size: 3rem;
    }
    .empty {
        padding: 6rem 0;
        color: #fff;
        font-size: 112px;
        font-family: "Graphik Web";
        font-weight: bold;
        height: 1030px;
    }
    .event {
        display: none;
    }
    .debug {
        background: rgba(0, 0, 0, 0.5);
        color:white;
        position: fixed;
        top: 0;
        z-index: 1;
    }
    .debug a {
        color: yellow;
    }
    .empty h1 {
        font-size: 110px;
    }	
    li.event-list {
        list-style: none;
	padding-bottom: 45px;
	text-align: center;
	color: #fff;
    }

    .container-events {
        top: 400px;
        position: absolute;
        width: 1080px;
        height: 1300px;
        overflow: hidden;
        font-size: 38px;
        line-height: 63px;
        font-family: "Myriad Pro";
    }
    .no-events {
        top: 600px;
        position: absolute;
        font-size: 88px;
        line-height: 63px;
        font-family: "Myriad Pro";
        width: 1080px;
        color: #fff;
    }
    h1.text-center.font-weight-bold {
        font-size: 86px;
    }

</style>
