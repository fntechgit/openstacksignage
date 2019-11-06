<template>
    <div class="container-fluid px-8 pb-8 event" :class="{ next, overlapping }">
        <div class="row" v-if="next">
            <div class="col-12 pb-2 text-uppercase">
                <span class="highlight" :style="{ color: getHighlightTextColor(schedule.room.name), backgroundColor: getColor(schedule.room.name) }">Next Session</span>
            </div>
        </div>
        <div class="row">
            <div class="col-12 name" :style="{'padding-top': overlapping ? '1.5rem !important' : '2rem !important'}" v-bind:class="{ 'pb-2': next && !event.speakers.length }">
                {{ formatEventTitle(event.title) }}
            </div>
        </div>
        <div class="row" v-if="event.speakers.length">
            <div class="col-12 text-uppercase speakers" :style="{ color: getColor(schedule.room.name) }" v-bind:class="next ? (overlapping ? 'pt-3' : 'pt-4') : (overlapping ? 'pt-4' : 'pt-5')">
                <!--<div class="pb-1"> 
                    FIRST LAST
                </div>-->
                <div class="pb-1" v-for="speaker in event.speakers"> 
                    {{ speaker.first_name }} {{ speaker.last_name }}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 text-uppercase when" v-bind:class="next ? (overlapping ? 'pt-3' : 'pt-4') : (overlapping ? 'pt-4' : 'pt-5')">
                {{ time(event) }}
                <!--00:00PM - 00:00PM-->
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['event', 'next', 'overlapping', 'schedule'],
        methods: {
            getColor(venue) {
                var color = '#8a54a2'
                switch (venue) {
                  case 'MONETIZATION STAGE @ Dream Hotel 2nd Floor Rorschach Room':
                    color = '#80bde7'
                    break
                  case 'MINI SUMMIT STAGE @ Dream Hotel 2nd Floor Think Tank Room':
                    color = '#cc0066'
                    break
                  case 'CREATIVE STAGE @ GOYA Studios Stage B':
                    color = '#e62227'
                    break
                  case 'AWS MAIN STAGE @ GOYA Studios Stage A':
                    color = '#8a54a2'
                    break
                }
                return color;
            },
            getHighlightTextColor(venue) {
                var color = '#FFFFFF'
                switch (venue) {
                  case 'MONETIZATION STAGE @ Dream Hotel 2nd Floor Rorschach Room':
                    color = '#000000'
                    break
                }
                return color;
            },
            formatEventTitle(title) {
                title = title.replace('BLOCKCHAIN: ', '')
                return title
                //return title.length > 80 ? `${title.substring(0, 80)}...` : title;
            },
        },
        computed: {
            room() {
                return event => event && this.$store.getters.room(
                    event.location_id
                ) || { name: 'N/A' }
            },
            time() {
                return event => event && [
                    this.schedule.getDate(event.start_date).format('h:mmA'),
                    this.schedule.getDate(event.end_date).format('h:mmA')
                ].join(' - ') || 'N/A'
            }
        }
    }

</script>

<style>
    
    .event {
        color: white;
    }

    .event .speakers {
        font-size: 3.5rem;
        line-height: 1.2;
    }

    .event.overlapping .speakers {
        font-size: 2.94rem;
    }
    
    .event.next .speakers {
        font-size: 2.5rem;
    }

    .event.next.overlapping .speakers {
        font-size: 2.1rem;
    }

    .event .name {
        font-size: 4.2rem;
        line-height: 1.2;
    }

    .event.overlapping .name {
        font-size: 3.57rem;
    }

    .event.next .name {
        font-size: 3.3rem;
    }

    .event.next.overlapping .name {
        font-size: 2.8rem;
    }

    .event .when {
        font-size: 2.9rem;
        font-weight: 400;
        line-height: 0.9;
    }
    
    .event.next .when {
        font-size: 2.2rem;
    }

    .ddelimiter-top:before {
        content: "";
        position: absolute;
        left: 15px;
        top: 7px;
        width: 97%;
        border-color: #666666;
        border-style: solid;
        border-width: 3px 0 0 0;
    }
    .ddelimiter-bottom:before {
        content: "";
        position: absolute;
        width: 97%;
        left: 15px;
        bottom: -40px;
        border-color: #666666;
        border-style: solid;
        border-width: 3px 0 0 0;
    }
</style>
