<template>
    <div class="container-fluid px-7 pb-7 event" :class="{ next }">
        <div class="row" v-if="!next">
            <div class="col-12 pt-6 pb-2 text-uppercase">
                <span class="highlight">Current Time</span>
                <span class="time when">{{ schedule.getDate(schedule.state.now).format('h:mmA') }}</span>
            </div>
        </div>
        <div class="row" v-if="next">
            <div class="col-12 pt-5 pb-2 text-uppercase">
                <span class="highlight">Next Session</span>
            </div>
        </div>
        <div class="row">
            <div class="col-12 pt-4 name" v-bind:class="{ 'pb-2': next && !event.speakers.length }">
                {{ event.title }}
            </div>
        </div>
        <div class="row" v-if="event.speakers.length">
            <div class="col-12 text-uppercase speakers" v-bind:class="next ? 'pt-4' : 'pt-5'">
                <div class="pb-1" v-for="speaker in event.speakers">
                    {{ speaker.first_name }} {{ speaker.last_name }}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 text-uppercase when" v-bind:class="next ? 'pt-4' : 'pt-5'">
                {{ time(event) }}
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
                    this.schedule.getDate(event.start_date).format('h:mmA'),
                    this.schedule.getDate(event.end_date).format('h:mmA')
                ].join(' - ') || 'N/A'
            }
        }
    }

</script>

<style>

    .highlight {
        color: #343895;
        background-color: #36e1fd;
        padding: 7px 12px 3px 12px;
        font-size: 1.25rem;
        font-weight: 500;
        letter-spacing: -1px;
    }
    
    .event {
        color: white;
    }
    
    .event .time {
        display: inline-block;
        margin-left: 1rem;
        font-size: 2rem !important;
        line-height: 0.9;
    }

    .event .speakers {
        color: #00B189;
        font-size: 3rem;
        line-height: 1;
        letter-spacing: 2px;
    }
    
    .event.next .speakers {
        font-size: 2.2rem;
    }

    .event .name {
        font-size: 4rem;
        line-height: 1.18;
    }

    .event.next .name {
        font-size: 2.7rem;
    }

    .event .when {
        font-size: 2.6rem;
        font-weight: 400;
        line-height: 0.9;
        letter-spacing: 1px;
    }
    
    .event.next .when {
        font-size: 2rem;
    }
</style>
