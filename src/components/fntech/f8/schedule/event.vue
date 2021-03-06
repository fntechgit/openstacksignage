<template>
    <div class="container-fluid p-10 event">
        <div class="row">
            <div class="col-12 when">
                {{ time(event) }}
            </div>
        </div>
        <div class="row">
            <div class="col-12 pt-5 name">
                {{ event.title }}
            </div>
        </div>
        <div class="row" v-if="event && event.speakers.length">
            <div class="col-12 pt-6 text-uppercase speakers">
                <div class="pt-3" v-for="speaker in event.speakers"> 
                    {{ speakerName(speaker) }} <span v-if="speakerInfo(speaker)"> / {{ speakerInfo(speaker) }}</span>
                </div>
            </div>
        </div>
        <div class="row" v-if="next && schedule.isToday(next.start_date)">
            <div class="col-12 pt-7 next">
                <span class="text-uppercase">Up Next:</span> {{ next.title }}
            </div>
        </div>
        <div class="row" v-else-if="(next && !schedule.isToday(next.start_date)) || !upcoming">
            <div class="col-12 pt-7 next">
                <span class="text-uppercase">Up Next:</span> {{ endOfDayMessage }}
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['event', 'next', 'upcoming', 'schedule'],
        computed: {
            time() {
                return event => event && [
                    this.schedule.getDate(event.start_date).format('h:mm'),
                    this.schedule.getDate(event.end_date).format('h:mma')
                ].join(' - ') || 'N/A'
            },
            speakerName() {
                return speaker => speaker && [
                    speaker.first_name,
                    speaker.last_name
                ].join(' ') || 'N/A'
            },
            speakerInfo() {
                return speaker => speaker && (speaker.position && speaker.company) && [
                    speaker.position,
                    speaker.company
                ].join(', ') || speaker.company
            },
            endOfDayMessage: function() {
                let date = this.schedule.todayDate()

                // April 30
                if (date === 30) return "After Party today from 6-9pm in Hall 3"

                // May 1
                if (date === 1) return "Happy Hour 4-6pm today on the Lower Level"

                return "All presentations are finished for today"
            }
        }
    }

</script>

<style>
    
    .event {
        color: white;
    }

    .event .when {
        font-size: 3.3rem;
        line-height: 0.9;
    }

    .event .name {
        font-size: 7rem !important;
        line-height: 1.2;
    }

    .event .next {
        font-size: 1.8rem;
    }

    .event .speakers {
        font-size: 2.2rem;
        line-height: 1;
        letter-spacing: 2.2px;
    }
</style>
