<template>
    <div class="event pb-5" :class="{ next }">
        <div class="pt-5">
            <div class="container-fluid pl-5 pr-5">
                <div class="row pb-3">
                    <div class="col-md-12">
                        <h1 class="text-uppercase text-secondary">
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
                            {{ event.class_name }}
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
                    this.schedule.getDate(event.start_date).format('h:mm A'),
                    this.schedule.getDate(event.end_date).format('h:mm A')
                ].join(' - ') || 'N/A'
            }
        }
    }

</script>

<style>

    .event {
        background: white;
        border-top: 3px solid gray;
    }

    .event h1 {
        font-weight: bold;
    }

    .event .name {
        font-size: 4.3rem;
    }

    .event .type {
        color: gray;
    }

    .event.next {
        background: rgba(255,255,255,0.7)
    }

</style>
