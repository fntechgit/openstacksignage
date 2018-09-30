<template>
    <div class="event pb-5" :class="{ next }">
        <div class="pt-5">
            <div class="container-fluid pl-5 pr-5">
                <div class="row pb-3" v-if="!next">
                    <div class="col-md-12">
                        <h1 class="text-uppercase time">
                            {{ time(event) }}
                        </h1>
                    </div>
                </div>
                <div class="row" v-if="next">
                    <div class="col-md-12">
                        <h1 class="text-uppercase time">
                            {{ starttime(event) }}
                        </h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <h1 :class="'text-primary name session-' + event.id">
                            {{ event.title }}
                        </h1>
                    </div>
                </div>
                <div class="row" v-if="event.speakers">
	                <div class="speaker-list">
                        <li v-for="speaker in event.speakers">
                            <h1 class="col-md-5 text-uppercase speaker">
                                {{ speakername(speaker) }}
                            </h1>
                            <h1 class="col-md-9 speaker-info">
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
        width: 1150px;
        margin-left: 50px;
        position: absolute;
        height: 640px;
        top: 34px;
    }
    .event .time,
    .next .time {
        font-family: Franklin;
        color: #333794;
        text-rendering: geometricPrecision;
	    -webkit-font-smoothing: antialiased;
    }
    .event .time {
        font-size: 50px;
    }
    .event .name,
    .next .name {
        font-family: Franklin;
        color: #fff!important;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
    }
    .event .name {
        font-size: 83px;
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
        font-size: 37px;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
    }
    .event .speaker {
        color: #fff;
        padding-right: 2px;
        width: 600px;
    }
    event .speaker-info {
        padding-left: 30px;
    }
    .speaker-info:before {
        content: "//  ";
        color: rgb(52,56,149);
    }
    .next {
        position: absolute;
        top: 580px;
        font-size: 42px !important;
        width: 900px !important;
    }
    .next .time {
        font-size: 41px;
    }
    .next .name {
        font-size: 58px;
    }
    .next .speaker,
    .next .speaker-info {
        font-family: Franklin;
        font-size: 33px;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
    }
    .next .speaker {
        color: #fff;
        padding-right: 2px;
    }
    .next .speaker-info {
        color: rgb(52,56,149);
    }

    .name.session-24792 {
        font-size: 59px;
    }
</style>
