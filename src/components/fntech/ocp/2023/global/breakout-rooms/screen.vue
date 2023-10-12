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
            <tr>
                <td align="center" colspan="3">
                    Static Banner: {{ schedule.state.static_banner && schedule.state.static_banner.content || 'N/A' }}
                </td>
            </tr>
        </table>

        <div class="container-fluid pl-7 py-2 track" v-if="schedule.state.track" v-bind:style="trackStyle">
            <div class="row">
                <div class="col">
                    <div class="text-uppercase">{{ formatTrackName(schedule.state.track.name) }}</div>
                </div>
            </div>
            <img class="track-image" v-if="schedule.state.track.icon_url" :src="schedule.state.track.icon_url">
        </div>

        <div class="container-fluid px-7 pt-6 pb-3">
            <div class="row">
                <div class="col-9">
                    <div class="text-uppercase" v-bind:style="roomStyle">{{ formatRoomName(schedule.room.name) }}</div>
                </div>
                <div class="col-3 pt-2 text-right">
                    <div class="text-uppercase"><span class="highlight">Current Time</span></div>
                    <div class="time">{{ schedule.getDate(schedule.state.now).format('h:mmA') }}</div>
                </div>
            </div>
        </div>

        <banner :banner="schedule.state.scheduled_banners.curr"
               v-if="schedule.state.scheduled_banners.curr && schedule.state.scheduled_banners.curr.type == 'Primary'"></banner>

        <event :schedule="schedule" :event="schedule.state.events.curr"
        v-if="schedule.state.events.curr"></event>
        
        <event :schedule="schedule" :event="schedule.state.events.next" :next=true v-if="schedule.state.events.next && schedule.isToday(schedule.state.events.next.start_date)" v-bind:class="{ 'fixed-bottom': schedule.state.events.curr }" style="bottom: 26rem;"></event>

        <div class="container-fluid" v-else-if="!schedule.state.events.curr">
            <div class="row p-7 no-presentations">
                <div class="col-12 text-left">
                    All presentations are finished for today asdasdas
                </div>
            </div>
            <img class="track-image" :src="getDefaultIcon">
        </div>
        <!--
        <div v-if="schedule.state.events.curr">
            <qr-code class="fixed-bottom qr-code" :size="170" color="#181a4a" :text="summitScheduleUrl"></qr-code>
            <span class="fixed-bottom qr-code-message">Scan code <br> to view summit schedule.</span>
        </div>
        -->
        <banner class="fixed-bottom" :banner="schedule.state.static_banner" v-if="schedule.state.static_banner"></banner>
    </div>
</template>

<script>

    import 'assets/css/ocp/2019/global/theme.scss'

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
                    'font-size': this.schedule.room.name.length >= 10 ? '4.5rem' : '10.5rem',
                    'line-height': '4rem',
                }
            },
            trackStyle: function() {
                var color = '#ffffff';
                console.log(this.schedule.state.track)
                if (this.schedule.state.track &&
                    this.schedule.state.track.color) {
                    color = this.schedule.state.track.color;
                }
                return { 'backgroundColor': color }
            },
            summitScheduleUrl: function() {
                return 'https://2023ocpglobal.fnvirtual.app/a/schedule'
            },
            getDefaultIcon: function() {
                var url = 'assets/images/ocp-2023/icons/OCP23_Activity_Icon_GLOLogo.svg';
                return url;
            },
        },
        methods: {
            formatTrackName(name) {
                return name.replace('EW: ', '');
            },
            formatRoomName(name) {
                if (name.match(/^\d/)) {
                    return name.replace(/\s/g, '');
                }
                if (name.startsWith('Marriott')) {
                    return name.replace('Marriott ', '');
                }
                return name
            },
            syncStart(item) {
                this.schedule.setOffset(
                    item.start_date - moment.utc().unix() - 65
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
        font-family: "franklin-gothic-urw",sans-serif;
        font-weight: 500;
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
    
    .highlight {
        color: #191A4F;
        background-color: #8DC63F;
        padding: 4px 12px;
        font-size: 1.25rem;
        font-weight: 500;
        letter-spacing: -1px;
    }
    
    .track {
        font-size: 3.25rem;
        font-weight: 500;
        color: #191A4F;
    }

    .track-image {
        position: absolute;
        width: 200px;
        top: 1400px;
        left: 850px;
    }

    .time {
        font-size: 2.6rem;
        font-weight: 400;
    }

    .no-presentations {
        font-size: 4.25rem;
        line-height: 1.18;
        letter-spacing: 1px;
        padding-bottom: 6.5rem !important;
    }

    .qr-code {
        bottom: 6.5rem;
        left: 6rem;
    }

    .qr-code-message {
        bottom: 6.3rem;
        left: 18.5rem;
        color: #00B189;
        font-size: 2.3rem;
        font-weight: 500;
        line-height: 1.2;
        letter-spacing: 0px;
        width: 230px;
    }

</style>
