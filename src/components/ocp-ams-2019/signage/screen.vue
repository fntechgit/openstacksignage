<template>
    <div id="app" :class="'room-' + schedule.room.name.replace(' ','')">

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

        <div class="location">
            <div class="text-uppercase label">
                {{ schedule.floor.name }}
            </div>
            <div class="text-uppercase value">Floor</div>
        </div>

        <div class="room">
            <div class="text-uppercase label">
                {{ schedule.room.name }}
            </div>
            <div class="text-uppercase value">Room</div>
        </div>

        <div class="footer">
            <div class="text-uppercase label">You are in Convention Centre</div>
            <div class="text-uppercase value">
                {{ schedule.getDate(schedule.state.now).format('hh:mm') }}
            </div>
        </div>



        <banner :banner="schedule.state.scheduled_banners.curr"
               v-if="schedule.state.scheduled_banners.curr && schedule.state.scheduled_banners.curr.type == 'Primary'"></banner>

        <event :schedule="schedule" :event="schedule.state.events.curr"
        v-if="schedule.state.events.curr && !schedule.state.scheduled_banners.curr"></event>

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

        <banner :banner="schedule.state.scheduled_banners.curr"
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
        padding-top: 150px;
    }
    .footer{
        padding: 40px 30px;
        color: #000;
        top: 70px;
        position: relative;
        display: flex;
    }
    .footer .label {
        font-size: 50px;
        font-family: "Myriad Pro";
        width: 900px;
        padding-top: 10px;
    }
    .footer .value {
        font-size: 60px;
        font-family: "Myriad Pro";
        width: 100px;
        padding-left: 220px;
    }

    .room {
        border-bottom: 1px solid #fff;
        padding-bottom: 80px;
        padding-right: 100px;
        color: #fff;
        width: 1349px;
        position: relative;
        text-align: right;
    }
    .room .label {
        font-size: 80px;
        font-family: "Myriad Pro";
    }
    .room .value {
        font-size: 50px;
        font-family: "Myriad Pro";
    }
    .location {
        border-bottom: 1px solid #fff;
        padding: 40px 30px;
        color: #fff;
        width: 1349px;
    }
    .location .label {
        font-size: 80px;
        font-family: "Myriad Pro";
    }
    .location .value {
        font-size: 50px;
        font-family: "Myriad Pro";
    }
    .empty {
        padding: 6rem 0;
        color: #fff;
        font-size: 112px;
        font-family: "Graphik Web";
        font-weight: bold;
        height: 1030px;
        display: none;
    }
    .event {
        display: none;
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
    .empty h1 {
        font-size: 110px;
    }	
</style>
