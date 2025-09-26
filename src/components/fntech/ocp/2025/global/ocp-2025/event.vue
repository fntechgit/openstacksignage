<template>
    <div class="container-fluid px-7 pb-7 event" :class="{ next, 'pt-5': !next }">
        <div class="row" v-if="next">
            <div class="col-12 pt-5 pb-2 text-uppercase">
                <div class="next-session-border" v-if="hasCurrent"></div>
                <span class="next-session-label">Next Session</span>
            </div>
        </div>
        <div class="row">
            <div class="col-12 pt-4 name" v-bind:class="{ 'pb-2': next && (!showSpeakers || !event.speakers.length) }">
                {{ event.title }}
            </div>
        </div>
        <div class="row" v-if="showSpeakers && event?.speakers?.length">
            <div class="col-12 speakers" v-bind:class="next ? 'pt-4' : 'pt-5'">
                <div class="pb-1" v-for="speaker in event.speakers" :key="speaker.id">
                    {{ speaker.first_name }} {{ speaker.last_name }}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 text-uppercase when" v-bind:class="next ? 'pt-4' : 'pt-5'">
                <span class="highlight">{{ time(event) }}</span>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: {
            event: Object,
            next: Boolean,
            schedule: Object,
            showSpeakers: {
                type: Boolean,
                default: true
            },
            hasCurrent: {
                type: Boolean,
                default: false
            }
        },
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
        color: #191A4F;
        background-color: #8DC63F;
        padding: 5px 13px;
        font-size: 1.5rem;
        font-weight: 500;
        letter-spacing: -1px;
    }
    
    .event {
        color: white;
    }

    .event.next {
        /* Remove full-width border */
    }

    .event .speakers {
        color: #8DC63F;
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

    .next-session-label {
        color: #8DC63F;
        font-size: 24pt;
        font-weight: 500;
        letter-spacing: 0.1em;
    }

    .next-session-border {
        width: 100%;
        height: 3px;
        background-color: #8DC63F;
        margin-bottom: 2rem;
    }
</style>
