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

        <div class="py-5">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-12">
                        <img class="img-fluid d-block mx-auto logo" src="assets/images/dispaly-yvr-title.svg">
                    </div>
                </div>
            </div>
        </div>

        <div class="location">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-8">
                        <div class="text-uppercase label">Room</div>
                        <div class="text-uppercase value">
                            {{ schedule.floor.name }}
                            ({{ schedule.room.name }})
                        </div>
                    </div>
                    <div class="col-md-4 text-center">
                        <div class="text-uppercase label">Current Time</div>
                        <div class="text-uppercase value">
                            {{ schedule.getDate(schedule.state.now).format('h:mm a') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <banner :schedule="schedule" :banner="schedule.state.scheduled_banners.curr"
               v-if="schedule.state.scheduled_banners.curr && schedule.state.scheduled_banners.curr.type == 'Primary'"></banner>

        <event :schedule="schedule" :event="schedule.state.events.curr"
        v-if="schedule.state.events.curr"></event>

        <event :schedule="schedule" :event="schedule.state.events.next" :next=true
        v-if="schedule.state.events.next && schedule.isToday(schedule.state.events.next.start_date)"></event>

        <div v-else-if="! schedule.state.events.curr" class="empty">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="display-4 text-center font-weight-bold">
                            All presentations are finished for today
                        </h1>
                    </div>
                </div>
            </div>
        </div>

        <banner :schedule="schedule" :banner="schedule.state.scheduled_banners.curr"
                v-if="schedule.state.scheduled_banners.curr && schedule.state.scheduled_banners.curr.type == 'Secondary'"></banner>
    </div>
</template>

<script>

    import Event from './event.vue'
    import Banner from './banner.vue'
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
                    item.start_date - moment.utc().unix() - 5
                )
            },
            syncEnd(item) {
                this.schedule.setOffset(
                    item.end_date - moment.utc().unix() - 5
                )
            },
        },
        components: { Event, Banner }
    }

</script>

<style>

    .logo {
        width: 60%;
    }

    .location {
        color: white;
        border-top: 5px solid white;
        border-bottom: 15px solid red;
        padding: 40px 30px;
    }

    .location .label {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .location .value {
        font-size: 3rem;
    }

    .empty {
        background: white;
        padding: 6rem 0;
        border-bottom: 3px solid gray;
    }

    .debug {
        background: rgba(0, 0, 0, 0.5);
        color:white;
        position: fixed;
        top: 0;
        z-index: 1;
    }

    .debug a {
        color: yellow;
    }

</style>
