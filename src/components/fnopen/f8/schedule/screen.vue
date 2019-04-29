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

        <event :schedule="schedule" :event="schedule.state.events.curr" :next="schedule.state.events.next"
        v-if="schedule.state.events.curr"></event>

        <event :schedule="schedule" :event="schedule.state.events.next" :upcoming="schedule.state.events.upcoming"
        v-else-if="schedule.state.events.next && schedule.isToday(schedule.state.events.next.start_date)
         && schedule.state.events.next.location.name !== '210F'
         && !schedule.isWithinHour(schedule.state.events.next.start_date)"></event>

        <event :schedule="schedule" :event="schedule.state.events.next" :upcoming="schedule.state.events.upcoming"
        v-else-if="schedule.state.events.next && schedule.isToday(schedule.state.events.next.start_date)
         && schedule.state.events.next.location.name === '210F'
         && !schedule.isWithin45Minutes(schedule.state.events.next.start_date)"></event>

        <div class="container h-100 mw-100"
        v-else-if="schedule.state.events.next && schedule.isToday(schedule.state.events.next.start_date)">
            <div class="row h-100 p-10 align-items-center justify-content-center no-presentations">
                <div class="col-9 text-center">
                    {{ schedule.room.name }}
                </div>
            </div>
        </div>

        <div class="container h-100 mw-100" v-else-if="true">
            <div class="row h-100 p-10 align-items-center justify-content-center no-presentations">
                <div class="col-9 text-center">
                    {{ endOfDayMessage }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import '../../../../../assets/css/f8-2019/theme.scss'
    import Event from './event.vue'
    import Banner from './banner.vue'
    import moment from 'moment'
    import { mapGetters } from 'vuex'

    export default {
        computed: {
            ...mapGetters({
                schedule: 'schedule'
            }),
            endOfDayMessage: function() {
                let date = this.schedule.todayDate()

                // April 30
                if (date === 30) return "After Party today from 6-9pm in Hall 3"

                // May 1
                if (date === 1) return "Happy Hour 4-6pm today on the Lower Level"

                return "All presentations are finished for today"
            }
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
            let background = this.$store.getters.background
            
            this.$store.watch(
                (state, getters) => getters.background,
                (newValue, oldValue) => {
                    const el = document.body
                    el.style.backgroundImage = newValue ? "url(" + newValue + ")" : null
                },
            );

            const el = document.body
            el.style.backgroundImage = background ? "url(" + background + ")" : null
        },
        components: { Event, Banner }
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

</style>
