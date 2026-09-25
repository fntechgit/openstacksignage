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
                <div class="room-title text-uppercase" v-bind:style="roomStyle">Expo Hall</div>
                <clock :schedule="schedule"></clock>
            </div>
        </div>

        <!-- Room and Time Information - Overflow Mode -->
        <div class="room-overflow-container" v-if="(hasEvents || isEndOfDay) && isOverflowEvent">
            <div class="room-overflow-wrapper">
                <div class="room-overflow-text">
                    <div class="room-name text-uppercase" v-bind:style="roomStyle">Expo Hall</div>
                    <div class="room-full-text">This room is full</div>
                </div>
                <stream-qr :url="virtualSessionUrl"></stream-qr>
            </div>
        </div>

        <!-- Primary Banner -->
        <banner :banner="schedule.state.scheduled_banners.curr"
               v-if="schedule.state.scheduled_banners.curr && schedule.state.scheduled_banners.curr.type == 'Primary'"></banner>

        <!-- Current Event -->
        <event :schedule="schedule" :event="schedule.state.events.curr"
        v-if="schedule.state.events.curr"></event>
        
        <!-- Next Event -->
        <event
            :schedule="schedule"
            :event="schedule.state.events.next"
            :next=true v-if="schedule.state.events.next && schedule.isToday(schedule.state.events.next.start_date)"
            :showSpeakers="!schedule.state.events.curr"
            :hasCurrent="!!schedule.state.events.curr"
            v-bind:class="{ 'fixed-bottom': schedule.state.events.curr }"
            style="bottom: 24.5rem;">
        </event>

        <!-- No Presentations Message -->
        <div class="container-fluid" v-if="isEndOfDay">
            <div class="row p-7 no-presentations">
                <div class="col-12 text-left">
                    All presentations are finished for today
                </div>
            </div>
        </div>

        <!-- App Promo and Static Banner -->
        <fnapp-promo v-if="hasEvents || isEndOfDay"></fnapp-promo>
        <banner class="fixed-bottom" :banner="schedule.state.static_banner" v-if="schedule.state.static_banner"></banner>
        <banner class="fixed-bottom" :banner="schedule.state.scheduled_banners.curr" v-if="schedule.state.scheduled_banners.curr"></banner>
    </div>
</template>

<script>
import 'assets/css/ocp/2019/global/theme.scss'

import Event from './event.vue'
import Banner from './banner.vue'
import Clock from '../common/clock.vue'
import TrackIcon from '../common/track-icon.vue'
import FnappPromo from '../common/fnapp-promo.vue'
import StreamQr from '../common/stream-qr.vue'
import moment from 'moment'

import { mapGetters } from 'vuex'

export default {
    data() {
        return {}
    },
    computed: {
        ...mapGetters({
            schedule: 'schedule'
        }),
        roomStyle() {
            return {
                'font-size': '160px',
                'line-height': '120px',
                'letter-spacing': '-0.02em',
                'white-space': 'nowrap',
            }
        },
        trackStyle() {
            const defaultStyles = {
                backgroundColor: "#ffffff",
                color: "#191A4F",
                fontSize: "48px"
            };
            const track = this.schedule.state.track || {};
            const trackName = track.name || "";
            if (trackName.length > 32) {
                defaultStyles.fontSize = "40px";
            }
            if (track.color) {
                defaultStyles.backgroundColor = track.color;
            }
            if (track.text_color) {
                defaultStyles.color = track.text_color;
            }
            return defaultStyles;
        },
        virtualSessionUrl() {
            let curr = this.schedule.state.events.curr
            
            if (curr && curr.overflow_url) {
                return curr.overflow_url
            }
            
            let url = 'https://2026ocpglobal.fnvirtual.app'
            if (curr) url = `${url}/a/event/${curr.id}`
            return url
        },
        isOverflowEvent() {
            const curr = this.schedule.state.events.curr;
            return !!(curr && curr.overflow_url);
        },
        hasEvents() {
            const hasCurrentEvent = !!this.schedule.state.events.curr;
            const hasUpcomingToday = this.schedule.state.events.next && this.schedule.isToday(this.schedule.state.events.next.start_date);
            return hasCurrentEvent || hasUpcomingToday;
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
        },
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
        }
    },
    mounted() {
        // Initialize background image
        this.updateBackgroundImage();
    },
    components: { Event, Banner, Clock, TrackIcon, FnappPromo, StreamQr }
}
</script>

<style>
    #app {
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




    .no-presentations {
        font-size: 4.25rem;
        line-height: 1.18;
        letter-spacing: 1px;
        padding-bottom: 6.5rem !important;
    }

    /* Figma puts the room name at x=81 and the clock's right edge at x=989. */
    .room-bar {
        padding: 84px 91px 16px 81px;
    }

    .room-header {
        display: flex;
        justify-content: space-between;
        /* Figma bottom-aligns the clock with the room name. */
        align-items: flex-end;
    }

    .room-title {
        flex: 1;
        max-width: 620px;
    }

    /* Room overflow header styling */
    .room-overflow-container {
        position: relative;
        width: 100vw;
        margin-left: calc(-50vw + 50%);
        background-color: rgb(192, 47, 29);
        /* The track bar ends at y=88 and the band starts at 139. Its height comes
           from the room name, which takes two lines in the longer rooms. */
        margin-top: 51px;
    }

    .room-overflow-wrapper {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 35px 14px 24px 81px;
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
        max-width: 620px;
        /* Inherits roomStyle computed property for consistent sizing */
    }

    .room-overflow-wrapper .room-full-text {
        color: #FFFFFF;
        margin-top: 24px;
        margin-left: 10px;
        font-size: 44px;
        font-weight: 700;
        line-height: 33px;
        text-transform: uppercase;
        white-space: nowrap;
    }
</style>
