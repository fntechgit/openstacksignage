<template>
    <div>
        <pre>
            Now: {{ format(schedule.state.now) }}
            Unix: {{ schedule.state.now }}
            <button @click="reset">Reset</button>
        </pre>
        <pre v-if="schedule.state.prev">
            <b>PREVIOUS:</b> {{ schedule.state.prev.title }}
            Starts in: {{ schedule.state.prev._ds }}
            Start: {{ format(schedule.state.prev.start_date) }}
            End: {{ format(schedule.state.prev.end_date )}}
            <button @click="sync(schedule.state.prev)">5 seconds before</button>
        </pre>
        <pre v-if="schedule.state.curr">
            <b>CURRENT:</b> {{ schedule.state.curr.title }}
            Starts in: {{ schedule.state.curr._ds }}
            Start: {{ format(schedule.state.curr.start_date) }}
            End: {{ format(schedule.state.curr.end_date )}}
            <button @click="sync(schedule.state.curr)">5 seconds before</button>
        </pre>
        <pre v-if="schedule.state.next">
            <b>NEXT:</b> {{ schedule.state.next.title }}
            Starts in: {{ schedule.state.next._ds }}
            Start: {{ format(schedule.state.next.start_date) }}
            End: {{ format(schedule.state.next.end_date )}}
            <button @click="sync(schedule.state.next)">5 seconds before</button>
        </pre>
    </div>
</template>

<script>

    import moment from 'moment'
    import { mapGetters } from 'vuex'

    export default {
        computed: mapGetters({ schedule: 'schedule' }),
        methods: {
            format(date) {
                return moment.unix(date).utc().format()
            },
            sync(event) {
                this.schedule.offset = event.start_date - moment.utc().unix() - 5
                this.schedule.update()
            },
            reset() {
                this.schedule.offset = 0
                this.schedule.update()
            }
        }
    }

</script>
