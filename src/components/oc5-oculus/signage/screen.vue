<template>
    <div id="app" :class="'room-' + schedule.room.id">

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

        <div class="room">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-4">
                        <div class="label">
                            Session
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="text-uppercase value">
                            {{ schedule.room.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <banner :banner="schedule.state.scheduled_banners.curr"
               v-if="schedule.state.scheduled_banners.curr && schedule.state.scheduled_banners.curr.type == 'Primary'"></banner>

        <event :schedule="schedule" :event="schedule.state.events.curr" v-if="schedule.state.events.curr"></event>

        <event :next="true" :schedule="schedule" :event="schedule.state.events.upcoming[0]"
               v-if="schedule.state.events.upcoming && schedule.state.events.upcoming.length == 1">
        </event>

        <events :current="schedule.state.events.curr" :schedule="schedule" :events="schedule.state.events.upcoming"
                v-else-if="schedule.state.events.upcoming && schedule.state.events.upcoming.length > 1">
        </events>

        <div v-else-if="! schedule.state.events.curr" class="empty">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="display-4 text-center font-weight-bold">
                            All presentations are finished for today.
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
    import Events from './events.vue'
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
        components: { Event, Events, Banner }
    }

</script>

<style>

    .location .label {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .empty {
        padding: 6rem 0;
        position: relative;
        top: 700px;
        width: 880px;
        left: 100px;
    }

    .empty h1 {
        font-family: "Oculus Sans";
        color: #fff;
        font-size: 80px;
    } 

    .room {
        position: relative;
        top: 558px;
        padding-left: 65px;
        padding-right: 65px;
    }
    
    .room .label {
        font-size: 80px;
        letter-spacing: 2px;
        color: #000;
        font-family: "Oculus Sans";
    }

    .room .value {
        font-size: 80px;
        letter-spacing: 2px;
        color: #000;
        font-family: "Oculus Sans";
        font-weight: bold;
        text-align: right;
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

    #app {
        width: 1080px;
        height: 1920px;
        background-image: url("~/assets/images/oc5-oculus/FN1_220B_Bkgd.png");
    }    

    .room-671 {
        background-image: url("~/assets/images/oc5-oculus/FN1_220B_Bkgd.png")!important;
    }
    .room-671 h1.time {
        color: rgb(186,1,255);
    }
    .room-670 {
        background-image: url("~/assets/images/oc5-oculus/FN2_220C_Bkgd.png")!important;
    }
    .room-670 h1.time {
        color: rgb(20,138,255);
    }
    .room-667 {
        background-image: url("~/assets/images/oc5-oculus/FN3_210E_Bkgd.png")!important;
    }
    .room-667 h1.time {
        color: rgb(183,236,0);
    }
    .room-668 {
        background-image: url("~/assets/images/oc5-oculus/FN4_210G_Bkgd.png")!important;
    }
    .room-668 h1.time {
        color: rgb(255,186,0);
    }
</style>
