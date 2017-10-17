<template>
    <div id="app">

        <table border="1" width="100%" class="debug">
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

        <div class="info">
            <div class="info-item">
                {{ schedule.getDate(schedule.state.now).format('h:mm a') }}
            </div>
            <div class="info-item" v-if="schedule.room">
                {{ schedule.room.name }}
            </div>
        </div>

        <div class="py-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <img class="img-fluid d-block mx-auto" src="assets/images/RoomDisplay_logo.png">
                    </div>
                </div>
            </div>
        </div>

        <template v-if="schedule.state.curr">
            <main-event :schedule="schedule"
            :event="schedule.state.curr" title="Now"></main-event>

            <div class="py-5" v-if="schedule.state.next">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <h1 class="text-secondary text-uppercase text-center">
                                Next
                            </h1>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <h1 class="text-center text-uppercase">
                                {{ schedule.state.next && schedule.state.next.title || 'None' }}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <main-event v-else-if="schedule.state.next" :schedule="schedule"
        :event="schedule.state.next" title="Next"></main-event>

        <div v-else class="pt-3 pb-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="display-3 text-center text-uppercase">
                            No more events for the day
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
            }
        },
        components: { MainEvent }
    }

</script>

<style>

    .info {
        display: flex;
        position: absolute;
        right: 20px;
        top: 20px;
        flex-direction: column;
    }

    .info-item {
        border: 2px solid white;
        color: white;
        font-size: 4ex;
        margin-bottom: 10px;
        padding: 15px;
        text-align: center;
        border-radius: 10px;
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
