<template>
    <div class="event pb-5" :class="{ next }">
        <div class="pt-5">
            <div class="container-fluid pl-5 pr-5">
                <div class="row pb-3" v-if="next">
      	            <div class="col-md-12">
  		        <h1 class="text-uppercase upcoming">
			    Upcoming:
   		        </h1>
	            </div>
                </div>
                <div class="row pb-3" v-if="!next">
                    <div class="col-md-12">
                        <h1 class="text-uppercase time">
                            {{ time(event) }}
                        </h1>
                    </div>
                </div>
                <div class="row pb-3" v-if="next">
                    <div class="col-md-12">
                        <h1 class="text-uppercase time">
                            {{ starttime(event) }}
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
                    this.schedule.getDate(event.start_date).format('HH:mm'),
                    this.schedule.getDate(event.end_date).format('HH:mm')
                ].join(' - ') || 'N/A'
            },
            starttime() {
                return event => event && this.schedule.getDate(event.start_date).format('HH:mm') || 'N/A'
            }

        }
    }
</script>

<style>
    .event {
        width: 880px;
        margin-left: 49px;
        position: relative;
        top: 400px;
        height: 640px;

    }
    .event h1 {
    }
    .event .time {
        font-family: Franklin;
        font-size: 50px;
        color: #333794;
    }
    .event .name {
        font-family: Franklin;
        font-size: 50px;
        padding-bottom: 150px;	
        color: #fff !important;
    }
    .event .type {
        display: none;
    }
    .next {
        position: relative;
        top: 450px;
        font-size: 42px !important;
    }
    .next .upcoming {
        color: #333794;
        font-size: 33px;
        letter-spacing: 3px;
        color: rgb(52,56,149);
        font-family: "Nexa";
        font-weight: bold;
    }
    .next .time {
        font-family: Franklin;
        font-size: 42px;
        color: #333794;
    }
    .next .name {
        font-family: Franklin;
        font-size: 42px;
        padding-bottom: 150px;
        color: #fff !important;
    }

</style>
