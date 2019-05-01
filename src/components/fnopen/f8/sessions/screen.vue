<template>
    <div id="app">
        <table v-if="schedule.debug" border="1" width="100%" class="debug">
            <tr>
                <td align="center" colspan="3" v-html="schedule.format(schedule.state.now)"></td>
            </tr>
        </table>
        <events :schedule="schedule" :events="schedule.state.events.upcoming"
               v-if="schedule.state.events.upcoming && schedule.state.events.upcoming.length <= 5">
        </events>
        <events-carousel :schedule="schedule" :upcoming="schedule.state.events.upcoming"
                v-else-if="schedule.state.events.upcoming && schedule.state.events.upcoming.length > 5">
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
