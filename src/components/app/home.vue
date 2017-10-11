<template>
    <div>
        <pre>
            <table width="50%" border="1" cellpadding="5">
                <tr>
                    <th colspan="2">Clock ({{ schedule.events.length }} Events)</th>
                </tr>
                <tr>
                    <th>UTC</th>
                    <td align="center" v-html="schedule.format(schedule.state.now, true)"></td>
                </tr>
                <tr>
                    <th>Summit</th>
                    <td align="center" v-html="schedule.format(schedule.state.now)"></td>
                </tr>
                <tr>
                    <th>Time Offset</th>
                    <td align="center" v-html="schedule.offset + ' seconds'"></td>
                </tr>
                <tr>
                    <td align="center" colspan="2"><a href="" @click.prevent="schedule.setOffset(0)">Reset</a></td>
                </tr>
            </table>
            <table width="50%" border="1" cellpadding="10">
                <tr>
                    <th>Previous</th>
                    <td><event :schedule="schedule" :event="schedule.state.prev" /></td>
                </tr>
                <tr bgcolor="#7DCEA0">
                    <th>Current</th>
                    <td><event :schedule="schedule" :event="schedule.state.curr" /></td>
                </tr>
                <tr>
                    <th>Next</th>
                    <td><event :schedule="schedule" :event="schedule.state.next" /></td>
                </tr>
            </table>
        </pre>
    </div>
</template>

<script>

    import moment from 'moment'
    import { mapGetters } from 'vuex'

    import Event from './event.vue'

    export default {
        computed: mapGetters({ schedule: 'schedule' }),
        components: { Event }
    }

</script>
