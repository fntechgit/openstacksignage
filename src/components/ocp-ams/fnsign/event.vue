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
                <div class="row" v-if="event.speakers">
	                <div class="col-md-12 speaker-list">
                        <li v-for="speaker in event.speakers">
                            <h1 class="text-uppercase speaker">
                                {{ speakername(speaker) }}
                            </h1>
                            <h1 class="speaker-info">
                                {{ speakerinfo(speaker) }}
                            </h1>
                        </li>
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
            speakername() {
                return speaker => speaker && [
                    speaker.first_name,
                    speaker.last_name
                ].join(' ') || 'N/A'
            },
            speakerinfo() {
                return speaker => speaker && (speaker.position && speaker.company) && [
                    speaker.position,
                    speaker.company
                ].join(', ') 
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
</style>
