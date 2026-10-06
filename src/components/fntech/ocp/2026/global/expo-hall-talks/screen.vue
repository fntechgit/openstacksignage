<template>
    <div id="app">

        <!-- Debug Table -->
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

        <!-- Track Information -->
        <div class="container-fluid track" v-if="hasEvents && schedule.state.track" v-bind:style="trackStyle">
            <div class="row">
                <div class="col">
                    <div class="text-uppercase">{{ formatTrackName(schedule.state.track.name) }}</div>
                </div>
            </div>
        </div>
        
        <!-- Track Icon -->
        <track-icon 
            v-if="hasEvents && schedule.state.track && schedule.state.track.id"
            :track-id="schedule.state.track.id"
            :size="184"
            :border-radius="'50%'"
        ></track-icon>

        <!-- Room and Time Information - Normal Mode -->
        <div class="container-fluid room-bar" v-if="(hasEvents || isEndOfDay) && !isOverflowEvent">
            <div class="room-header">
                <room-name class="room-title" :name="schedule.room.name"></room-name>
                <clock :schedule="schedule"></clock>
            </div>
        </div>

        <!-- Room and Time Information - Overflow Mode -->
        <div class="room-overflow-container" v-if="(hasEvents || isEndOfDay) && isOverflowEvent">
            <div class="room-overflow-wrapper">
                <div class="room-overflow-text">
                    <room-name class="room-name" :name="schedule.room.name"></room-name>
                    <div class="room-full-text">This room is full</div>
                </div>
                <stream-qr :url="virtualSessionUrl"></stream-qr>
            </div>
        </div>

        <now-and-next :schedule="schedule"></now-and-next>

        <!-- No Presentations Message -->
        <div class="container-fluid" v-if="isEndOfDay">
            <div class="row p-7 no-presentations">
                <div class="col-12 text-left">
                    All presentations are finished for today
                </div>
            </div>
        </div>

        <!-- App Promo and Banner -->
        <fnapp-promo v-if="hasEvents || isEndOfDay"></fnapp-promo>
        <banner class="fixed-bottom" :banner="bottomBanner" v-if="bottomBanner"></banner>
    </div>
</template>

<script>
import 'assets/css/ocp/2019/global/theme.scss'

import NowAndNext from '../common/now-and-next.vue'
import Banner from './banner.vue'
import Clock from '../common/clock.vue'
import RoomName from '../common/room-name.vue'
import TrackIcon from '../common/track-icon.vue'
import FnappPromo from '../common/fnapp-promo.vue'
import StreamQr from '../common/stream-qr.vue'

import { mapGetters } from 'vuex'
import signScreen from '../common/sign-screen'

export default {
    mixins: [signScreen],
    computed: {
        ...mapGetters({
            schedule: 'schedule'
        }),
        virtualSessionUrl() {
            let curr = this.schedule.state.events.curr
            
            if (curr && curr.overflow_url) {
                return curr.overflow_url
            }
            
            let url = 'https://2026ocpglobal.fnvirtual.app'
            if (curr) url = `${url}/a/event/${curr.id}`
            return url
        },
        isEndOfDay() {
            // Show "end of day" message only if:
            // 1. No current or upcoming events
            // 2. There was a previous event (so we know the day has started)
            return !this.hasEvents && this.schedule.state.events.prev;
        }
    },
    watch: {
        'schedule.state.events.curr': {
            handler() {
                this.updateBackgroundImage();
            }
        },
        'schedule.state.events.next': {
            handler() {
                this.updateBackgroundImage();
            }
        }
    },
    methods: {
        updateBackgroundImage() {
            const body = document.body;
            
            if (!this.hasEvents && !this.isEndOfDay) {
                // No events at all (start of day or no events scheduled) - show placeholder
                body.style.backgroundImage = "url('assets/images/ocp-2026/OCP26G_Placeholder.png')";
            } else {
                // Events are scheduled OR end of day - show regular background
                body.style.backgroundImage = "url('assets/images/ocp-2026/OCP26G_Background.png')";
            }
        }
    },
    mounted() {
        // Initialize background image
        this.updateBackgroundImage();
    },
    components: { RoomName, NowAndNext, Banner, Clock, TrackIcon, FnappPromo, StreamQr }
}
</script>

<style>

    #app {
        display: flex;
        flex-direction: column;
        height: 100vh;
        /* The app promo is fixed over the lower part of the screen; this keeps
           the sessions clear of it. */
        padding-bottom: 392px;
        color: white;
        font-family: "Libre Franklin", "franklin-gothic-urw", sans-serif;
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

    .track {
        font-size: 48px;
        font-weight: 600;
        color: #191A4F;
        text-align: left;
        height: 88px;
        line-height: 88px;
        /* Bootstrap's own gutters go, so the 88px indent is the only one. */
        padding-left: 0;
        padding-right: 0;
    }

    .track .row {
        margin: 0;
    }

    .track .col {
        padding-left: 88px;
        padding-right: 88px;
    }

    /* Line this up with the session content column rather than the row's own
       96px padding. */
    .no-presentations {
        padding-left: 88px !important;
        padding-right: 88px !important;
    }

    .no-presentations > [class*="col"] {
        padding-left: 0;
        padding-right: 0;
    }

    .no-presentations {
        font-size: 4.25rem;
        line-height: 1.18;
        letter-spacing: 1px;
        padding-bottom: 6.5rem !important;
    }

    /* Figma puts the room name at x=81 and the clock's right edge at x=989. */
    .room-bar {
        /* Same gutter either side, so the clock sits as far from the right edge
           as the room name does from the left. */
        padding: 84px 81px 16px 81px;
    }

    .room-header {
        display: flex;
        justify-content: space-between;
        /* Figma bottom-aligns the clock with the room name, but a name that
           wraps would then drag the clock down the screen. Aligning to the top
           of the row keeps it at the same place whatever the name does. */
        align-items: flex-start;
    }

    /* Trim the line box down to the capitals so its top edge is the ink edge,
       not the font's ascent. The header row aligns to the top, so this is what
       puts the room name level with the clock at any size or line count. */
    .room-title {
        text-box: trim-both cap alphabetic;
        flex: 1;
        max-width: 650px;
    }

    /* Room overflow header styling */
    .room-overflow-container {
        position: relative;
        width: 100vw;
        margin-left: calc(-50vw + 50%);
        background-color: rgb(192, 47, 29);
        /* Sits clear of the track bar above it. Its own height comes from the
           room name, which runs to two lines in the longer rooms. */
        margin-top: 51px;
    }

    .room-overflow-wrapper {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        /* Both text boxes are trimmed to their ink, so these are the distances
           actually seen: the name sits as far from the top as "this room is
           full" sits from the bottom. */
        padding: 35px 14px 35px 81px;
    }

    .room-overflow-text {
        flex: 1;
        min-width: 0;
    }

    .room-overflow-wrapper .stream-qr {
        flex: none;
    }

    .room-overflow-wrapper .room-name {
        color: #F5F5F5;
        /* Narrower than the normal header's cap on purpose: the stream QR
           starts at x=738 where the clock starts at 771, so the name has to
           stop earlier to leave the same gap beside it. */
        max-width: 620px;
        /* Trim the line box to the capitals, as the normal header does, so the
           name starts level with the QR beside it at any size. */
        text-box: trim-both cap alphabetic;
    }

    .room-overflow-wrapper .room-full-text {
        color: #FFFFFF;
        text-box: trim-both cap alphabetic;
        margin-top: 24px;
        margin-left: 10px;
        font-size: 44px;
        font-weight: 700;
        line-height: 33px;
        text-transform: uppercase;
        white-space: nowrap;
    }
</style>
