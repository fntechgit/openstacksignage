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
        <div :class="['background', backgroundClass]"></div>
        <div :class="['events-wrapper', { 'justify-content': !hasCurrentAndNext }]" v-if="!endOfDay">
            <div
                :class="['next-wrapper', { 'margin-top': hasCurrentAndNext }]"
                v-if="schedule.state.events.next && schedule.isToday(schedule.state.events.next.start_date)"
            >
                <event :schedule="schedule" :event="schedule.state.events.next" :next=true></event>
            </div>
            <div class="current-wrapper" v-if="schedule.state.events.curr">
                <event :schedule="schedule" :event="schedule.state.events.curr">
                </event>
            </div>
            <div class="title-room-wrapper">
                <div class="title">Lounge</div>
                <div class="room-label">{{ formatRoomName(schedule.room.name) || 'LL21C' }}</div>
            </div>
        </div>
        <div class="end-of-day" v-if="endOfDay">
            <span class="message">Presentations are over for today</span>
            <span class="track">Lounge</span>
            <span class="room">{{ formatRoomName(schedule.room.name) }}</span>
        </div>
    </div>
</template>

<script>

    import 'assets/css/rdc/theme.scss'

    import Event from './event.vue'
    import moment from 'moment'
    import { mapGetters } from 'vuex'

    const getters = mapGetters({ schedule: 'schedule' });

    export default {
        computed: {
            ...getters,
            hasCurrentAndNext() {
                return this.schedule.state.events.curr && this.schedule.state.events.next;
            },
            endOfDay() {
                return !this.schedule.state.events.curr && 
                       !(this.schedule.state.events.next && this.schedule.isToday(this.schedule.state.events.next.start_date));
            },
            backgroundClass() {
                return this.endOfDay ? 'end-of-day-background' : 'track-background';
            }
        },
        methods: {
            formatRoomName(name) {
                return name.match(/^\d/) ? name.replace(/\s/g, '') : name;
            },
            syncStart(item) {
                this.schedule.setOffset(
                    item.start_date - moment.utc().unix() - 65
                );
            },
            syncEnd(item) {
                this.schedule.setOffset(
                    item.end_date - moment.utc().unix() - 5
                );
            }
        },
        components: { Event }
    }
</script>

<style scoped>
    #app {
        color: white;
        font-family: "Builder Sans", sans-serif;
        font-weight: 500;
        height: 100vh;
    }

    .debug {
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        z-index: 10;
    }

    .debug a {
        color: yellow;
    }

    .background {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
    }

    .track-background {
        background-image: url('~/assets/images/rdc/rdc24/RDC24_FNTechScreens_Digital_Assets-Demo_Booths_1080x1920.png');
    }

    .end-of-day-background {
        background-image: url('~/assets/images/rdc/rdc24/RDC24_FNTechScreens_Static_FN-154_Create.png');
    }

    .title-room-wrapper {
        position: relative;
        display: flex;
        align-items: flex-end;
        padding: 536px 0 100px;
        justify-content: space-between;
        .title {
            color: #FFF;
            font-family: "Builder Sans";
            font-size: 112px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
        }

        .room-label {
            color: #FFF;
            text-align: right;
            font-family: "Builder Sans";
            font-size: 84px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            margin-bottom: 5px;
        }
    }

    .events-wrapper {
        position: relative;
        display: flex;
        flex-direction: column-reverse;
        justify-content: space-between;
        padding: 0 80px 135px;
        box-sizing: border-box;
        height: 100%;

        .current-wrapper {
            display: flex;
            flex-grow: 2;
        }

        .next-wrapper {
            max-width: 600px;
        }
        .next-wrapper.margin-top {
            margin-top: 135px;
        }
    }

    .events-wrapper.justify-content {
        justify-content: flex-end;
    }

    .end-of-day {
        margin-top: 92px;
        margin-left: 76px;
        display: flex;
        width: 803px;
        height: 753px;
        flex-direction: column;
        align-items: flex-start;
        z-index: 1;

        .message {
            color: #FFF;
            font-family: "Builder Sans";
            font-size: 120px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            z-index: 2;
        }

        .track {
            color: #FFF;
            font-family: "Builder Sans";
            font-size: 104px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            margin-top: 210px;
            padding-bottom: 25px;
            z-index: 2;
        }

        .room {
            color: #FFF;
            font-family: "Builder Sans";
            font-size: 64px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            z-index: 2;
        }
    }
</style>
