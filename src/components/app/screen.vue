<template>
    <div id="app">
        <div class="py-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <img class="img-fluid d-block mx-auto" src="assets/images/RoomDisplay_logo.png">
                    </div>
                </div>
            </div>
        </div>
        <div class="pt-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="text-center text-uppercase text-secondary">
                            Now
                        </h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="display-1 text-center text-uppercase">
                            {{ schedule.state.curr ? schedule.state.curr.title : 'None' }}
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
                            {{ room(schedule.state.curr).name }}
                        </h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="display-3 text-center text-lowercase text-secondary">
                            {{ time(schedule.state.curr) }}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
        <div class="py-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="text-secondary text-uppercase text-center">
                            Next
                        </h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="text-center text-uppercase">
                            {{ schedule.state.next ? schedule.state.next.title : 'None' }}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import { mapGetters } from 'vuex'

    export default {
        computed: {
            ...mapGetters({
                schedule: 'schedule'
            }),
            room() {
                return event => event && this.$store.getters.room(
                    event.location_id
                ) || { name: 'N/A' }
            },
            time() {
                return event => event && [
                    this.schedule.format(event.start_date),
                    this.schedule.format(event.end_date)
                ].join(' - ') || 'N/A'
            }
        }
    }

</script>
