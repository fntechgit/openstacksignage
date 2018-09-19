<template>
    <div class="event next pb-5">
        <div class="pt-5">
            <div class="container-fluid pl-5 pr-5">
                <div class="row pb-3">
      	            <div class="col-md-12">
  		                <h1 class="text-uppercase upcoming">
			                Upcoming Sessions:
   		                </h1>
	                </div>
                </div>
                <Slider
                        ref="slider"
                        :asyncData="events"
                        :performance-mode="false"
                        :pagination-visible="false"
                        :pagination-clickable="false"
                        :mousewheel-control="false"
                        :dragEnable="false"
                        :auto="true"
                        :loop="true"
                        :interval="7000"
                        :speed="500">
                    <div v-for="event in events">
                        <div>
                            <div class="row">
                                <div class="col-md-12">
                                    <h1 class="text-primary name">
                                        {{ event.title }}
                                    </h1>
                                </div>
                            </div>
                            <div class="row pb-3">
                                <div class="col-md-12">
                                    <h1 class="text-uppercase time">
                                        {{ time(event) }}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </Slider>
            </div>
        </div>
    </div>
</template>

<script>
    import Slider from 'vue-plain-slider'

    export default {
        props: ['events', 'schedule'],
        watch: {
            events: function (newValue, oldValue) {
                this.$refs.slider.setPage(1)
            }
        },
        computed: {
            starttime() {
                return event => event && this.schedule.getDate(event.start_date).format('HH:mm') || 'N/A'
            }, 
            time() {
                return event => event && [
                    this.schedule.getDate(event.start_date).format('h:mm A'),
                    this.schedule.getDate(event.end_date).format('h:mm A')
                ].join(' - ') || 'N/A'
            }
        },
        components: { Slider }
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
    .event .time,
    .next .time {
        font-family: Franklin;
        color: #333794;
        text-rendering: geometricPrecision;
	    -webkit-font-smoothing: antialiased;
    }
    .event .time {
        font-size: 46px;
    }
    .event .name,
    .next .name {
        font-family: Nexa;
        color: #fff!important;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
    }
    .event .name {
        font-size: 80px;
        line-height: 1.33;
        padding-bottom: 10px;	
    }
    .event .speaker-list {
        list-style: none;
    }
    .speaker-list li {
        display:flex;
    }
    .event .speaker,
    .event .speaker-info {
        font-family: Franklin;
        font-size: 38px;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
    }
    .event .speaker {
        color: #fff;
    }
    event .speaker-info {
        padding-top: 5px;
        padding-left: 30px;
    }
    .speaker-info:before {
        content: "//  ";
        color: rgb(52,56,149);
    }
    .next {
        position: relative;
        top: 450px;
        font-size: 42px !important;
    }
    .next .upcoming {
        font-size: 33px;
        letter-spacing: 3px;
        color: rgb(52,56,149);
        font-family: "Nexa";
        font-weight: bold;
    }
    .next .time {
        font-size: 38px;
    }
    .next .name {
        font-size: 56px;
        padding-bottom: 5px;
        line-height: 1.25;
    }
    .next .speaker,
    .next .speaker-info {
        font-family: Franklin;
        font-size: 34px;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
    }
    .next .speaker {
        color: #fff;
    }
    .next .speaker-info {
        color: rgb(52,56,149);
    }
    .slider {
        height: 400px;
    }
</style>
