<template>
    <div v-if="event">
        <table width="100%" border="1" cellpadding="5">
            <tr>
                <th colspan="3">{{ event.title }}</th>
            </tr>
                <th colspan="2">Start</th>
                <th>End</th>
            <tr>
                <th>UTC</th>
                <td align="center" v-html="schedule.format(event.start_date, true)"></td>
                <td align="center" v-html="schedule.format(event.end_date, true)"></td>
            </tr>
            <tr>
                <th>Summit</th>
                <td align="center" v-html="schedule.format(event.start_date)"></td>
                <td align="center" v-html="schedule.format(event.end_date)"></td>
            </tr>
            <tr>
                <td align="center" colspan="3">
                    <a href="" @click.prevent="syncStart(event)">start -5 seconds</a>
                    <b>|</b>
                    <a href="" @click.prevent="syncEnd(event)">end -5 seconds</a>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>

    import moment from 'moment'

    export default {
        props: ['schedule', 'event'],
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
