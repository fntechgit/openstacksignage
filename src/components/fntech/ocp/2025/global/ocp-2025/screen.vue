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
            :size="200"
            :border-radius="'50%'"
        ></track-icon>

        <!-- Room and Time Information - Normal Mode -->
        <div class="container-fluid px-7 pt-6 pb-3" v-if="(hasEvents || isEndOfDay) && !isOverflowEvent">
            <div class="room-header">
                <div class="room-title text-uppercase" v-bind:style="roomStyle">{{ formatRoomName(schedule.room.name) }}</div>
                <clock :schedule="schedule"></clock>
            </div>
        </div>

        <!-- Room and Time Information - Overflow Mode -->
        <div class="room-overflow-container" v-if="(hasEvents || isEndOfDay) && isOverflowEvent">
            <div class="room-overflow-wrapper">
                <div class="room-name text-uppercase" v-bind:style="roomStyle">{{ formatRoomName(schedule.room.name) }}</div>
                <div class="room-full-text">
                    <div>THIS ROOM</div>
                    <div>IS FULL</div>
                </div>
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

        <!-- QR Code and Static Banner -->
        <div v-if="schedule.state.events.curr" class="qr-container" :class="{ 'overflow': isOverflowEvent }">
            <div class="qr-section">
                <qr-code 
                    :size="200" 
                    color="#ffffff" 
                    bg-color="transparent" 
                    :error-level="qrErrorLevel" 
                    :text="virtualSessionUrl" 
                    :image="qrImage"
                ></qr-code>
            </div>
            <div class="text-section">
                <div class="scan-to">Scan to</div>
                <div class="message-text">
                    {{ isOverflowEvent ? 
                       'WATCH THE LIVESTREAM' : 
                       'see the detailed event schedule' }}
                </div>
            </div>
        </div>
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
                'font-size': this.schedule.room.name.length >= 10 ? '4.5rem' : '10.5rem',
                'line-height': '4rem',
            }
        },
        trackStyle() {
            const defaultStyles = {
                backgroundColor: "#ffffff",
                color: "#191A4F",
                fontSize: "3.25rem"
            };
            const track = this.schedule.state.track || {};
            const trackName = track.name || "";
            if (trackName.length > 32) {
                defaultStyles.fontSize = "2.5rem";
            }
            if (track.color) {
                defaultStyles.backgroundColor = track.color;
            }
            if (track.text_color) {
                defaultStyles.color = track.text_color;
            }
            return defaultStyles;
        },
        summitScheduleUrl() {
            return 'https://2025ocpglobal.fnvirtual.app/a/schedule'
        },
        virtualSessionUrl() {
            let curr = this.schedule.state.events.curr
            
            if (curr && curr.overflow_url) {
                return curr.overflow_url
            }
            
            // For regular events, always use the schedule URL
            return 'https://2025ocpglobal.fnvirtual.app/a/schedule/'
        },
        playIconDataUrl() {
            // Play button as white ring with triangular cutout
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                <defs>
                    <mask id="play-mask">
                        <rect x="0" y="0" width="100" height="100" fill="white"/>
                        <path d="M38 30L70 50L38 70V30Z" fill="black"/>
                    </mask>
                </defs>
                <circle cx="50" cy="50" r="48" fill="white" mask="url(#play-mask)"/>
            </svg>`;
            return 'data:image/svg+xml;base64,' + btoa(svg);
        },
        qrErrorLevel() {
            // Use medium error correction when showing image, low when not
            return this.isOverflowEvent ? 'M' : 'L';
        },
        qrImage() {
            // Only show play icon for overflow events
            return this.isOverflowEvent ? this.playIconDataUrl : null;
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
                body.style.backgroundImage = "url('assets/images/ocp-2025/OCP25G_FNSIGN_Placeholder.png')";
            } else {
                // Events are scheduled OR end of day - show regular background
                body.style.backgroundImage = "url('assets/images/ocp-2025/OCP25G_Background.png')";
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
    components: { Event, Banner, Clock, TrackIcon }
}
</script>

<style>
    #app {
        color: white;
        font-family: "franklin-gothic-urw", sans-serif;
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
        font-size: 2.5rem;
        font-weight: 500;
        color: #191A4F;
        text-align: center;
    }




    .no-presentations {
        font-size: 4.25rem;
        line-height: 1.18;
        letter-spacing: 1px;
        padding-bottom: 6.5rem !important;
    }

    .room-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .room-title {
        flex: 1;
    }

    /* QR Container - absolutely positioned wrapper */
    .qr-container {
        position: fixed;
        bottom: 10.5rem;
        left: 5.8rem;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
    }

    /* QR Section - contains the QR code */
    .qr-section {
        width: 200px;
        height: 200px;
        flex-shrink: 0;
    }

    /* Text Section - contains the message */
    .text-section {
        margin-left: 2rem; /* Gap between QR and text */
        color: #FFFFFF;
        padding-bottom: 2.5rem; /* Align text baseline with QR bottom */
    }

    .text-section .scan-to {
        font-size: 2rem;
        font-weight: 400;
        color: #8DC63F;
    }

    .text-section .message-text {
        font-size: 2rem;
        font-weight: 500;
        line-height: 1.2;
        width: 250px;
    }

    /* Overflow mode styling */
    .qr-container.overflow {
        background-color: rgb(192, 47, 29);
        padding: 0.6rem 0.6rem 0.75rem 0.6rem; /* top right bottom left */
        /* Adjust position to account for padding */
        left: 5.2rem;
        bottom: 9.75rem;
    }

    .qr-container.overflow .scan-to {
        color: #FFFFFF;
    }

    .qr-container.overflow .message-text {
        font-size: 2.3rem;
        font-weight: 700;
    }

    .qr-container.overflow .scan-to {
        font-size: 2rem;
        font-weight: 500;
    }

    /* Room overflow header styling */
    .room-overflow-container {
        position: relative;
        width: 100vw;
        margin-left: calc(-50vw + 50%);
        background-color: rgb(192, 47, 29);
        padding: 2.5rem 0 3rem 0;
        margin-top: 1.5rem;
    }

    .room-overflow-wrapper {
        padding: 0 5.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .room-overflow-wrapper .room-name {
        color: #FFFFFF;
        /* Inherits roomStyle computed property for consistent sizing */
    }

    .room-overflow-wrapper .room-full-text {
        color: #FFFFFF;
        font-size: 2.8rem;
        font-weight: 700;
        text-align: right;
        line-height: 1.1;
        text-transform: uppercase;
    }
</style>
