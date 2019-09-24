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
        </table>
        <div class="container-fluid" v-if="schedule.state.events.curr || schedule.state.events.upcoming">
            <div class="row">
                <div class="col-12 text-uppercase room"v-bind:style="roomStyle">
                    {{ formatRoomName(schedule.room) }}
                </div>
            </div>
        </div>
        <event :schedule="schedule" :event="schedule.state.events.curr" v-if="schedule.state.events.curr"></event>
        <event :next="true" :schedule="schedule" :event="schedule.state.events.upcoming[0]"
               v-if="schedule.state.events.upcoming && schedule.state.events.upcoming.length == 1">
        </event>
        <events-carousel :schedule="schedule" :upcoming="schedule.state.events.upcoming"
                v-if="schedule.state.events.upcoming && schedule.state.events.upcoming.length > 1">
        </events-carousel>
        <div class="container h-100 mw-100" v-if="!schedule.state.events.upcoming && !schedule.state.events.curr">
            <div class="row h-100 p-5 align-items-center justify-content-center">
                <div class="col-10 text-center text-uppercase no-presentations">
                    All presentations are finished for today
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import 'assets/css/oculus/oc6/theme.scss'

    import Event from './event.vue'
    import EventsCarousel from './events-carousel.vue'
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
            getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
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
            formatRoomName(room) {
                let roomName = room.name;
                if (roomName != null) {
                    return roomName.replace(' - Demo Hall', '')
                }
                return '';
            }
        },
        mounted() {
            var backgrounds = new Array(6);
            backgrounds[0] = 'assets/images/oc6-oculus/backgrounds/violet.png';
            backgrounds[1] = 'assets/images/oc6-oculus/backgrounds/cyan.png';
            backgrounds[2] = 'assets/images/oc6-oculus/backgrounds/green.png';
            backgrounds[3] = 'assets/images/oc6-oculus/backgrounds/yellow.png';
            backgrounds[4] = 'assets/images/oc6-oculus/backgrounds/orange-2.png';
            backgrounds[5] = 'assets/images/oc6-oculus/backgrounds/orange.png';
            var background = backgrounds[0]
            switch (this.schedule.room.name) {
              case 'Breakout 220B':
                background = backgrounds[0]
                break;
              case 'Breakout 220C':
                background = backgrounds[1]
                break;
              case 'Classroom 210F':
                background = backgrounds[2]
                break;
              case 'Classroom 210H':
                background = backgrounds[3]
                break;
              case 'Table Talk - Demo Hall':
                background = backgrounds[4]
                break;
              case 'Tech Talk - Demo Hall':
                background = backgrounds[5]
                break;
              case 'Lower Level':
              case 'Concourse':
              default:
                background = backgrounds[this.getRandomInt(0, backgrounds.length - 1)];
                break;
            }
            const el = document.body
            el.style.backgroundImage = background ? 'url(' + background + ')' : null
        },
        components: { Event, EventsCarousel }
    }

</script>

<style>
    
    #app {
        color: white;
        font-family: "basis-grotesque-regular-pro";
        font-weight: 500;
        height: 100%;
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
    .no-presentations {
        font-family: MonumentExtended-Bold;
        font-size: 4rem;
        line-height: 1;
    }
    .room {
        font-family: MonumentExtended-Bold;
        margin-top: 6em;
        font-size: 4.95rem;
        text-align: left;
        line-height: 1;
        margin-left: 61px;
    }
    .name {
        padding-top: 0.1em;
        font-size: 3.3em;
        line-height: 1.2em;
        letter-spacing: 0.8px;
    }
    .title {
        font-size: 2.7em;
        letter-spacing: 1.5px;
        color: #5d5e61;
    }
    .speaker {
        font-size: 2.7em;
        letter-spacing: 1px;
    }
    .speaker .affiliation {
        font-size: 0.85em;
        line-height: 0.85em;
        color: #5d5e61;
    }
    .time {
        padding-top: 0.7em;
        font-size: 2em;
        letter-spacing: 1.2px;
        color: #f856f8;
    }
    .delimiter-top:before {
        content: "";
        position: absolute;
        left: 15px;
        top: -22px;
        width: 97%;
        border-color: #5d5e61;
        border-style: solid;
        border-width: 3px 0 0 0;
    }
    .delimiter-bottom:before {
        content: "";
        position: absolute;
        width: 97%;
        left: 15px;
        bottom: -40px;
        border-color: #5d5e61;
        border-style: solid;
        border-width: 3px 0 0 0;
    }
</style>
