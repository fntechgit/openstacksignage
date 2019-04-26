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
        
        <events :schedule="schedule" :events="schedule.state.events.upcoming"
               v-if="schedule.state.events.upcoming && schedule.state.events.upcoming.length <= 3">
        </events>
        <events-carousel :schedule="schedule" :events="schedule.state.events.upcoming"
                v-else-if="schedule.state.events.upcoming && schedule.state.events.upcoming.length > 3">
        </events-carousel>
        <div class="container h-100 mw-100" v-else-if="!schedule.state.events.upcoming">
            <div class="row h-100 p-10 align-items-center justify-content-center">
                <div class="col-9 text-center no-presentations">
                    All presentations are finished for today
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import '../../../../../assets/css/f8-2019/theme.scss'
    import Events from './events.vue'
    import EventsCarousel from './events-carousel.vue'
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
                    item.start_date - moment.utc().unix() - 65
                )
            },
            syncEnd(item) {
                this.schedule.setOffset(
                    item.end_date - moment.utc().unix() - 5
                )
            },
        },
        mounted() {
            const el = document.body
            this.$store.watch(
                (state, getters) => getters.background,
                (newValue, oldValue) => {
                    el.style.backgroundImage = "url(" + newValue + ")"
                },
            );
            el.style.backgroundImage = "url(" + this.$store.getters.background + ")"
        },
        components: { Events, EventsCarousel }
    }

</script>

<style>
    
    #app {
        color: white;
        font-family: "Graphik Web";
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
        font-size: 7rem;
        line-height: 1.18;
    }

    .todays-sessions {
        padding-left: 30px !important;
        padding-right: 0px !important;
        font-size: 6rem;
        line-height: 1.18;
    }

    .event {
        padding-top: 15px;
        padding-bottom: 45px;
        padding-left: 20px;
    }

    .event .time {
        font-size: 2.6rem;
        font-weight: 400;
        line-height: 1.18;
    }

    .event .name {
        padding-left: 50px;
        padding-right: 70px;
        font-size: 2.6rem;
        line-height: 1.18;
    }

    .event .room {
        padding-left: 50px;
        padding-right: 70px;
        font-size: 2rem;
        font-weight: 400;
    }

</style>
