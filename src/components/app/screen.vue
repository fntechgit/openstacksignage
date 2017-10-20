<template>
    <div id="app">

        <table v-if="schedule.debug" border="1" width="100%" class="debug">
            <tr>
                <td align="center" colspan="3" v-html="schedule.format(schedule.state.now)"></td>
            </tr>
            <tr>
                <td align="center" width="33%">
                    <a v-if="schedule.state.prev" href="" @click.prevent="syncStart(schedule.state.prev)">[start-5s]</a>
                    Previous
                    <a v-if="schedule.state.prev" href="" @click.prevent="syncEnd(schedule.state.prev)">[end-5s]</a>
                </td>
                <td align="center" width="33%">
                    <a v-if="schedule.state.curr" href="" @click.prevent="syncStart(schedule.state.curr)">[start-5s]</a>
                    Current
                    <a v-if="schedule.state.curr" href="" @click.prevent="syncEnd(schedule.state.curr)">[end-5s]</a>
                </td>
                <td align="center" width="33%">
                    <a v-if="schedule.state.next" href="" @click.prevent="syncStart(schedule.state.next)">[start-5s]</a>
                    Next
                    <a v-if="schedule.state.next" href="" @click.prevent="syncEnd(schedule.state.next)">[end-5s]</a>
                </td>
            </tr>
            <tr>
                <td align="center" width="33%">
                    {{ schedule.state.prev && schedule.state.prev.title || 'N/A' }}
                </td>
                <td align="center" width="33%">
                    {{ schedule.state.curr && schedule.state.curr.title || 'N/A' }}
                </td>
                <td align="center" width="33%">
                    {{ schedule.state.next && schedule.state.next.title || 'N/A' }}
                </td>
            </tr>
        </table>

        <div class="py-5">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-12">
                        <img class="img-fluid d-block mx-auto logo" src="assets/images/OpenStack_Sydney.svg">
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

        <main-event v-if="schedule.state.curr" :schedule="schedule"
        :event="schedule.state.curr"></main-event>

        <main-event v-if="schedule.state.next && schedule.isToday(schedule.state.next.start_date)" :schedule="schedule"
        :event="schedule.state.next" :next=true></main-event>

        <div v-else-if="! schedule.state.curr" class="empty">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="display-4 text-center text-uppercase font-weight-bold">
                            All presentations are finished for today
                        </h1>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

    import moment from 'moment'
    import MainEvent from './event/main.vue'
    import { mapGetters } from 'vuex'

    export default {
        computed: {
            ...mapGetters({
                schedule: 'schedule'
            }),
        },
        methods: {
            syncStart(event) {
                this.schedule.setOffset(
                    event.start_date - moment.utc().unix() - 5
                )
            },
            syncEnd(event) {
                this.schedule.setOffset(
                    event.end_date - moment.utc().unix() - 5
                )
            },
        },
        components: { MainEvent }
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
        color: white;
        background: rgba(0,0,0,0.4);
        padding: 12rem 0;
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
