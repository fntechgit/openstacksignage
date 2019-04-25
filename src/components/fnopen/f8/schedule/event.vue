<template>
    <div class="container-fluid p-10 event">
        <div class="row">
            <div class="col-12 when">
                {{ time(event) }}
            </div>
        </div>
        <div class="row">
            <div class="col-12 pt-5 name">
                {{ event.title }}
            </div>
        </div>
        <div class="row" v-if="event && event.speakers.length">
            <div class="col-12 pt-6 text-uppercase speakers">
                <div class="pt-3" v-for="speaker in event.speakers"> 
                    {{ speaker.first_name }} {{ speaker.last_name }} <span v-if="speaker.title"> / {{ speaker.title }}</span>
                </div>
            </div>
        </div>
        <div class="row" v-if="next">
            <div class="col-12 pt-7 next" v-bind:class="{ name: event == null }">
                <span class="text-uppercase">Up Next:</span> {{ next.title }}
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['event', 'next', 'schedule'],
        computed: {
            room() {
                return event => event && this.$store.getters.room(
                    event.location_id
                ) || { name: 'N/A' }
            },
            time() {
                return event => event && [
                    this.schedule.getDate(event.start_date).format('h:mm'),
                    this.schedule.getDate(event.end_date).format('h:mma')
                ].join(' - ') || 'N/A'
            }
        }
    }

</script>

<style>
    
    .event {
        color: white;
    }

    .event .when {
        font-size: 3.3rem;
        line-height: 0.9;
    }

    .event .name {
        font-size: 7rem !important;
        line-height: 1.2;
    }

    .event .next {
        font-size: 1.8rem;
    }

    .event .speakers {
        font-size: 2.2rem;
        line-height: 1;
        letter-spacing: 2.2px;
    }
</style>
