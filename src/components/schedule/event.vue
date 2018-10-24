<template>
    <div class="container-fluid p-5 event" :class="{ next, standalone }">
        <div class="row">
            <div class="col-12 text-uppercase font-weight-bold text-danger when">
                {{ next ? 'Next' : 'Now' }}: {{ time(event) }}
            </div>
        </div>
        <div class="row">
            <div class="col-12 pt-4 font-weight-bold text-primary name">
                {{ event.title }}
            </div>
        </div>
        <div class="row">
            <div class="col-12 pt-4 text-uppercase text-secondary type">
                {{ event.track.name }}
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['next', 'standalone', 'event', 'schedule'],
        computed: {
            room() {
                return event => event && this.$store.getters.room(
                    event.location_id
                ) || { name: 'N/A' }
            },
            time() {
                return event => event && [
                    this.schedule.getDate(event.start_date).format('H:mm'),
                    this.schedule.getDate(event.end_date).format('H:mm')
                ].join(' - ') || 'N/A'
            }
        }
    }

</script>

<style>

    .event {
        background-color: white;
    }

    .event.next {
        background-color: #ccccff;

    }

    .event.standalone {
        border-top: 6px solid #666666;
    }

    .event .when {
        font-size: 3rem;
        line-height: 0.8;
        letter-spacing: 1px;
    }

    .event .name {
        font-size: 4.25rem;
        line-height: 1.18;
    }

    .event.next .name {
        font-size: 3rem;
        line-height: 1.18;
    }

    .event .type {
        font-size: 2.25rem;
        line-height: 1;
        letter-spacing: 2px;
    }

</style>
