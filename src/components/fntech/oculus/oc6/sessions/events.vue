<template>   
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 text-uppercase todays-sessions">
                {{ todaysDayName }} Schedule
            </div>
        </div>
        <div class="row pt-5">
            <div class="col-12">
                <div class="event" v-for="event in events" :key="event.id">
                    <div class="row">
                        <div class="col-12 name">
                            {{ event.title }}
                        </div>
                        <div class="col-12 location">
                            <span class="room" v-if="room(event)">{{ room(event) }}</span><span v-if="room(event)"> &nbsp;| &nbsp;</span>{{ startTime(event) }} - {{ endTime(event) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['schedule', 'events'],
        computed: {
            todaysDayName() {
                var weekday = new Array(7);
                weekday[0] = "Sunday";
                weekday[1] = "Monday";
                weekday[2] = "Tuesday";
                weekday[3] = "Wednesday";
                weekday[4] = "Thursday";
                weekday[5] = "Friday";
                weekday[6] = "Saturday";
                return weekday[this.schedule.now().format('d')];
            },
            startTime() {
                return event => event && this.schedule.getDate(event.start_date).format('HH:mm A') || 'N/A'
            },
            endTime() {
                return event => event && this.schedule.getDate(event.end_date).format('HH:mm A') || 'N/A'
            },
            room() {
                return event => event && event.location.name || null
            }
        }
    }
</script>
