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

        <div class="py-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <img class="img-fluid d-block mx-auto" src="assets/images/RoomDisplay_logo.png">
                    </div>
                </div>
            </div>
        </div>
        <div class="pt-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="text-center text-uppercase text-secondary">
                            Now
                        </h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="display-1 text-center text-uppercase">
                            {{ schedule.state.curr && schedule.state.curr.title || 'None' }}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
        <div class="pt-3 pb-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="display-3 text-center text-uppercase text-secondary">
                            {{ room(schedule.state.curr).name }}
                        </h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="display-3 text-center text-lowercase text-secondary">
                            {{ time(schedule.state.curr) }}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
        <div class="py-5">
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
                        <h1 class="text-center text-uppercase" style="color: black;">
                            {{ schedule.state.next && schedule.state.next.title || 'None' }}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import moment from 'moment'
    import { mapGetters } from 'vuex'

    export default {
        computed: {
            ...mapGetters({
                schedule: 'schedule'
            }),
            room() {
                return event => event && this.$store.getters.room(
                    event.location_id
                ) || { name: 'N/A' }
            },
            time() {
                return event => event && [
                    this.schedule.getDate(event.start_date).format('h:mm A'),
                    this.schedule.getDate(event.end_date).format('h:mm A')
                ].join(' - ') || 'N/A'
            }
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
        }
    }

</script>

<style>

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
