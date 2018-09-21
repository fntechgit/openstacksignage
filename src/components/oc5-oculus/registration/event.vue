<template>
    <div class="event pb-5" :class="{ next }">
        <div class="pt-5">
            <div class="container-fluid pl-5 pr-5">
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="text-primary name">
                            {{ event.title }}
                        </h1>
                    </div>
                </div>
                <div class="row pb-3">
                    <div>
                        <h1 class="venue">
                            {{ event.location.name }}
                        </h1>
                    </div>
                    <div>
                        <h1 class="time">
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
    .event .time,
    .next .time {
        font-size: 32px;
        letter-spacing: 1px;
        color: #fff;
        font-family: "Oculus Sans";
        text-rendering: geometricPrecision;
	-webkit-font-smoothing: antialiased;
    }

    .event .venue,
    .next .venue {
        font-size: 32px;
        letter-spacing: 1px;
        color: #148aff;
        font-family: "Oculus Sans";
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
        padding-right: 15px;
        padding-left: 17px;
    }


    .event .name,
    .next .name {
        font-family: Oculus Sans;
        color: #fff!important;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
    }
    .event .name {
        font-size: 40px;
        letter-spacing: 1px;
        padding-bottom: 10px;	
    }
    .event .speaker-list {
        list-style: none;
    }
    .speaker-list li {
        display:block;
    }
    .speaker-list-label h1{
        font-size: 40px;
        letter-spacing: 1px;
        color: rgb(93,94,97);
        font-family: Oculus Sans;
        padding-bottom: 10px;
    }
    .event .speaker{
        font-family: Oculus Sans;
        font-size: 40px;
        letter-spacing: 1px;
        color: #fff;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
    }
    .event .speaker-info {
        font-family: Oculus Sans;
        font-size: 20px;
        letter-spacing: 1px;
        color: rgb(93,94,97);
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;

    }
    .speaker-info:before {
        content: "//  ";
    }
    .next {
        position: relative;
        top: 200px;
        width: 1000px;
        margin-left: 36px;
        padding-bottom: 0px!important;
    }
    .next .upcoming {
        font-size: 33px;
        letter-spacing: 3px;
        color: rgb(52,56,149);
        font-family: "Nexa";
        font-weight: bold;
    }
    .next .name {
        font-size: 40px;
        padding-bottom: 5px;
        letter-spacing: 1px;
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
