<template>
    <div id="app">

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
        </table>

        <div class="room text-right" v-bind:style="roomStyle">{{ formatRoomName(schedule.room.name) }}</div>

        <banner :banner="schedule.state.scheduled_banners.curr" v-if="schedule.state.scheduled_banners.curr"></banner>

        <event :schedule="schedule" :event="schedule.state.events.curr" :current=true
            v-if="!schedule.state.scheduled_banners.curr && schedule.state.events.curr"></event>
        
        <event :schedule="schedule" :event="schedule.state.events.next" :next=true :current="schedule.state.events.curr != null" v-if="!schedule.state.scheduled_banners.curr && schedule.state.events.next && schedule.isToday(schedule.state.events.next.start_date)" v-bind:class="{ 'fixed-bottom': schedule.state.events.curr, 'pt-5': !schedule.state.events.curr }" style="bottom: 6rem;"></event>

        <div class="container-fluid" v-else-if="!schedule.state.scheduled_banners.curr && !schedule.state.events.curr">
            <div class="row p-7 mt-7 no-presentations">
                <div class="col-12 text-left">
                    All presentations are finished for today
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import 'assets/css/ocp/2019/ams/theme.scss'

    import Event from './event.vue'
    import Banner from './banner.vue'
    import moment from 'moment'
    import { mapGetters } from 'vuex'

    export default {
        computed: {
            ...mapGetters({
                schedule: 'schedule'
            }),
            roomStyle: function() {
                return {
                    //'font-size': this.schedule.room.name.startsWith('G') ? '6.5rem' : '5rem',
                    //'line-height': this.schedule.room.name.startsWith('G') ? '5.5rem' : '4rem',
                }
            },
        },
        methods: {
            formatRoomName(name) {
                return name.replace(' Theatre', '');
            },
            syncStart(item) {
                this.schedule.setOffset(
                    item.start_date - moment.utc().unix() - 165
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
    
    #app {
        color: white;
        font-family: raleway, sans-serif;
        font-weight: bold;
        -webkit-font-feature-settings: "lnum"; 
        -moz-font-feature-settings: "lnum"; 
        font-feature-settings: "lnum";
    }

    .debug {
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        z-index: 1;
    }

    .debug a {
        color: yellow;
    }

    .container-fluid {
        width: 62%;
        margin-left: 0px;
    }
    
    .room {
        position: absolute;
        right: 0.8em;
        top: 1em;
        width: 7em;
        color: #262673;
        font-weight: 700;
        font-size: 4em;
        text-align: center;
        line-height: 1.1em;
    }
    
    .time {
        font-size: 2.6rem;
        font-weight: 400;
    }

    .no-presentations {
        font-size: 5.3rem;
        line-height: 1.18;
        letter-spacing: 1px;
        padding-bottom: 6.5rem !important;
    }

</style>
