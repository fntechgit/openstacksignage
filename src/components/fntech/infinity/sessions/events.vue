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
                            <span class="room" v-if="room(event)">{{ room(event) }}</span><span v-if="room(event)"> &nbsp;| &nbsp;</span><span class="time">{{ startTime(event) }} - {{ endTime(event) }}</span>
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
                return event => event && this.schedule.getDate(event.start_date).format('h:mm A') || 'N/A'
            },
            endTime() {
                return event => event && this.schedule.getDate(event.end_date).format('h:mm A') || 'N/A'
            },
            room() {
                return event => {
                    var location = event.location.name
                    if (!(event && location)) return null
                    switch (location) {
                      case 'MONETIZATION STAGE @ Dream Hotel 2nd Floor Rorschach Room':
                        location = 'MONETIZATION STAGE'
                        break
                      case 'MINI SUMMIT STAGE @ Dream Hotel 2nd Floor Think Tank Room':
                        location = 'MINI SUMMIT STAGE'
                        break
                      case 'FESTIVAL HUB @ Goya Studios Central Lot':
                        location = 'FESTIVAL HUB'
                        break
                      case 'CREATIVE STAGE @ GOYA Studios Stage B':
                        location = 'CREATIVE STAGE'
                        break
                      case 'AWS MAIN STAGE @ GOYA Studios Stage A':
                        location = 'AWS MAIN STAGE'
                        break
                      case 'The Dolby Cinema at the Vine':
                        location = 'Dolby Vine Theatre'
                        break
                    }
                    return location
                }
            }
        }
    }
</script>
