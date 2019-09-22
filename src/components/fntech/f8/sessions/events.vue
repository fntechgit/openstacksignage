<template>   
    <div class="container-fluid">
        <div class="row pt-7 pl-5">
            <div class="col-3 todays-sessions">
                Today´s Sessions
            </div>
            <div class="col-9">
                <div class="event" v-for="event in events" :key="event.id">
                    <div class="row">
                        <div class="col-2 text-right time">
                            {{ startTime(event) }}
                        </div>
                        <div class="col-10 text-left">
                            <div class="row">
                                <div class="col-12 name">
                                    {{ event.title }}
                                </div>
                                <div class="col-12 room" v-if="room(event)">
                                    Location: {{ room(event) }}
                                </div>
                            </div>
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
            startTime() {
                return event => event && this.schedule.getDate(event.start_date).format('h:mm') || 'N/A'
            },
            room() {
                return event => event && event.location.name || null
            }
        }
    }
</script>
