<template>
    <div class="event pb-5" :class="{ next }">
        <div class="pt-5">
            <div class="container-fluid pl-5 pr-5">
                <div class="row pb-3">
                    <div class="col-md-12">
                        <h1 class="text-uppercase time">
                            {{ time(event) }}
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
                    this.schedule.getDate(event.start_date).format('h:mm A'),
                    this.schedule.getDate(event.end_date).format('h:mm A')
                ].join(' - ') || 'N/A'
            }
        }
    }

</script>

<style>

    .event {
        height: 1030px;
        width: 1200px;
        margin-left: 120px;
	top: 85px;
    }

    .event h1 {
    }

    .event .time {
        font-size: 50px;
        font-family: "Trim Mono";
        height: 100px;
        margin-top: 90px;
    }
    
    .room-210E .event .time{
        color: #8ACFE6;
    }

     .room-210G .event .time{
        color: #5E4D80;
    }


    .event .name {
        font-size: 106px;
        font-family: "Graphik Semibold";
        font-weight: bold;
        padding-bottom: 150px;	
        color: #fff !important;
    }

    .event .type {
        display: none;
    }

    .event.next {
    }

</style>

