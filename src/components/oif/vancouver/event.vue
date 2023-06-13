<template>
    <div class="container-fluid px-7 event" :class="{ next }">
        <div class="row" v-if="next">
            <div class="col-11 pb-2 text-uppercase">
                <span class="highlight">Next Session</span>
            </div>
        </div>
        <div class="row">
            <div class="name" v-bind:class="{ 'pb-2': next && !event.speakers.length, 'col-10 pt-4' : next, 'col-12': !next }">
                {{ event.title }}
            </div>
        </div>
        <div class="row" v-if="event.speakers.length">
            <div class="col-12 pt-4 text-uppercase speakers">
                <div class="pb-2 by">By</div>
                <div class="pb-1" v-for="speaker in event.speakers"> 
                    {{ speaker.first_name }} {{ speaker.last_name }}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 pt-4 text-uppercase when">
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
        color: #FFFFFF;
        background-color: #000000;
        border-radius: 100px;
        padding: 5px 13px;
        font-size: 1rem;
        line-height: 1.25rem;
        height: 40px;
        letter-spacing: 0.1em;
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }
    
    .event {
        color: #FEFEFE;
    }

    .event .by {
        font-size: 2rem;
    }

    .event .speakers {
        color: #000000;
        font-size: 3rem;
        line-height: 1;        
    }
    
    .event.next .speakers {
        font-size: 2.2rem;
    }

    .event .name {
        font-size: 4.5rem;
        line-height: 1.2;
    }

    .event.next .name {
        font-size: 3.15rem;
    }

    .event .when {
        font-size: 2.6rem;
        line-height: 1.2;
    }
    
    .event.next .when {
        font-size: 2rem;
    }
</style>
