<template>
    <div class="event pb-5" :class="{ next }">
        <div class="pt-5">
            <div class="container-fluid pl-5 pr-5">
                <div class="row pb-3">
                    <div class="col-md-12">
                        <h1 class="text-uppercase text-secondary when">
                            {{ next ? 'Next' : 'Now' }}: {{ time(event) }}
                        </h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="text-primary name">
                            {{ event.title }}
                        </h1>
                    </div>
                </div>
                <div class="row pt-4">
                    <div class="col-md-12">
                        <h1 class="text-uppercase type">
                            {{ event.track.name }}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['next', 'event', 'schedule'],
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
        background: white;
    }

    .event h1 {
        font-weight: bold;
        line-height: 1.3;
    }

    .event h1.when {
        font-size: 2.7rem;
    }

    .event .name {
        font-size: 4rem;
    }

    .event.next .name {
        font-size: 3rem;
    }

    .event .type {
        color: gray;
        font-size: 2.5rem;
    }

    .event.next {
        background: rgba(255, 255, 255, 0.7);
        border-top: 3px solid gray;
    }

</style>
