<template>
    <div>
        <div class="pt-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="text-center text-uppercase text-secondary">
                            {{ title }}
                        </h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="display-1 text-center text-uppercase">
                            {{ event.title }}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
        <div class="pt-3 pb-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="display-3 text-center text-uppercase text-secondary">
                            {{ room(event).name }}
                        </h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="display-3 text-center text-lowercase text-secondary">
                            {{ time(event) }}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['title', 'event', 'schedule'],
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
