<template>
    <div id="app">
        <table v-if="schedule.debug" border="1" width="100%" class="debug">
            <tr>
                <td align="center" colspan="3" v-html="schedule.format(schedule.state.now)"></td>
            </tr>
        </table>
        <events :schedule="schedule" :events="schedule.state.events.upcoming"
               v-if="schedule.state.events.upcoming && schedule.state.events.upcoming.length <= 4">
        </events>
        <events-carousel :schedule="schedule" :upcoming="schedule.state.events.upcoming"
                v-else-if="schedule.state.events.upcoming && schedule.state.events.upcoming.length > 4">
        </events-carousel>
        <div class="container-fluid" v-else-if="!schedule.state.events.upcoming">
            <div class="row pt-5 pl-8 pr-8 no-presentations">
                <div class="col-12 text-left">
                    All events are finished for today
                </div>
            </div>
        </div>
        <div class="row fixed-bottom" style="bottom: 10em;">
            <div class="col-12 delimiter-bottom"></div>
        </div>
    </div>
</template>

<script>

    import 'assets/css/infinity/theme.scss'
    
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
        /*mounted() {
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
        },*/
        components: { Events, EventsCarousel }
    }

</script>

<style>
    
    #app {
        color: white;
        font-family: 'Montserrat', sans-serif;
        font-weight: 400;
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
        font-size: 4.25rem;
        line-height: 1.18;
        letter-spacing: 1px;
        padding-top: 6.5em !important;
        font-weight: 700;
    }

    .todays-sessions {
        padding: 0 4em;
        margin-top: 7em;
        font-size: 4rem;
        text-align: center;
        line-height: 1;
        font-weight: 700;
    }

    .event {
        padding-top: 15px;
        padding-bottom: 30px;
        padding-left: 20px;
    }

    .event .name {
        padding-left: 1.9em;
        padding-right: 2em;
        font-size: 2.3rem;
        line-height: 1.2;
    }

    .event .location {
        padding-left: 1.9em;
        padding-right: 2em;
        font-size: 2.3rem;
        font-weight: 400;
    }

    .event .room {
        margin-top: 15px;
        display: inline-block;
        color: #e62227;
        line-height: 1.1;
    }

    .delimiter-bottom:before {
        content: "";
        position: absolute;
        width: 82%;
        left: 6.5em;
        bottom: -40px;
        border-color: #666666;
        border-style: solid;
        border-width: 3px 0 0 0;
    }
</style>
