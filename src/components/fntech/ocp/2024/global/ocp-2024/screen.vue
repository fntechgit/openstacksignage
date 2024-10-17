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
        <div class="container-fluid py-2 track" v-if="schedule.state.track" v-bind:style="trackStyle">
            <div class="row">
                <div class="col">
                    <div class="text-uppercase">{{ formatTrackName(schedule.state.track.name) }}</div>
                </div>
            </div>
            <img
                class="track-image"
                :src="trackIconUrl"
            >
        </div>

        <!-- Room and Time Information -->
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

        <!-- Primary Banner -->
        <banner :banner="schedule.state.scheduled_banners.curr"
               v-if="schedule.state.scheduled_banners.curr && schedule.state.scheduled_banners.curr.type == 'Primary'"></banner>

        <!-- Current Event -->
        <event :schedule="schedule" :event="schedule.state.events.curr"
        v-if="schedule.state.events.curr"></event>
        
        <!-- Next Event -->
        <event :schedule="schedule" :event="schedule.state.events.next" :next=true v-if="schedule.state.events.next && schedule.isToday(schedule.state.events.next.start_date)" v-bind:class="{ 'fixed-bottom': schedule.state.events.curr }" style="bottom: 27rem;"></event>

        <!-- No Presentations Message -->
        <div v-else-if="!schedule.state.events.curr" class="no-presentations-fullscreen">
            <img class="fullscreen-placeholder-image" src="assets/images/ocp-2024/OCP24G_FNSIGN_Placeholder.png" alt="No Presentations Placeholder">
        </div>

        <!-- QR Code and Static Banner -->
        <div v-if="schedule.state.events.curr">
            <qr-code class="fixed-bottom qr-code" :size="122" color="#ffffff" bg-color="transparent" :text="virtualSessionUrl"></qr-code>
            <span class="fixed-bottom qr-code-message">Scan here to view on the summit platform</span>
        </div>
        <banner class="fixed-bottom" :banner="schedule.state.static_banner" v-if="schedule.state.static_banner"></banner>
        <banner class="fixed-bottom" :banner="schedule.state.scheduled_banners.curr" v-if="schedule.state.scheduled_banners.curr"></banner>
    </div>
</template>

<script>
import 'assets/css/ocp/2019/global/theme.scss'

import Event from './event.vue'
import Banner from './banner.vue'
import moment from 'moment'

import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            trackIconUrl: '', // Will be set in mounted or watcher
            attemptedExtensions: [] // To keep track of tried extensions
        }
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
            return 'https://2024ocpglobal.fnvirtual.app/a/schedule'
        },
        virtualSessionUrl() {
            let url = 'https://2024ocpglobal.fnvirtual.app';
            let curr = this.schedule.state.events.curr
            if (curr) url = `${url}/a/event/${curr.id}`
            return url
        },
        getDefaultIcon() {
            return 'assets/images/ocp-2024/icons/DEFAULT.png';
        }
    },
    watch: {
        'schedule.state.track': {
            immediate: true,
            handler(newTrack) {
                if (newTrack && newTrack.id) {
                    this.attemptedExtensions = [];
                    this.setTrackIcon(newTrack.id);
                } else {
                    this.trackIconUrl = this.getDefaultIcon;
                }
            }
        }
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
        setTrackIcon(trackId) {
            const baseUrl = `https://spaces.fnvirtual.app/OCPGlobalSummitandSymposium2024/Creative/CategoryIconsSigns/${trackId}`;
            const extensions = ['png', 'jpg'];

            const tryLoadImage = (index) => {
                if (index >= extensions.length) {
                    // All attempts failed, set to default
                    this.trackIconUrl = this.getDefaultIcon;
                    return;
                }
                const url = `${baseUrl}.${extensions[index]}`;
                // Create a new Image to test if it exists
                const img = new Image();
                img.onload = () => {
                    this.trackIconUrl = url;
                };
                img.onerror = () => {
                    tryLoadImage(index + 1);
                };
                img.src = url;
            };

            tryLoadImage(0);
        }
    },
    mounted() {
        // Initialize trackIconUrl
        if (this.schedule.state.track && this.schedule.state.track.id) {
            this.setTrackIcon(this.schedule.state.track.id);
        } else {
            this.trackIconUrl = this.getDefaultIcon;
        }
    },
    components: { Event, Banner }
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
        font-size: 3.25rem;
        font-weight: 500;
        color: #191A4F;
        text-align: center;
    }

    .track-image {
        position: absolute;
        width: 200px;
        top: 1464px;
        left: 828px;
    }

    .no-presentations-fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .fullscreen-placeholder-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
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
        left: 57rem;
    }

    .qr-code-message {
        bottom: 6rem;
        left: 46rem;
        color: #FFFFFF;
        font-size: 1.8rem;
        font-weight: 500;
        line-height: 1.2;
        letter-spacing: 0px;
        width: 150px;
        text-align: right;
    }
</style>
