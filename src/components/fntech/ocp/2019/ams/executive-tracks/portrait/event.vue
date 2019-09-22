<template>
    <div class="container-fluid px-7 pb-7 event" :class="{ next }">
        <div class="row" v-if="next && current">
            <div class="delimiter-top col-12"></div>
        </div>
        <div class="row" v-if="next" v-bind:style="[next && !current ? {'margin-top': '-3px'} : {}]">
            <div class="upcoming col-6 pb-2 text-uppercase" style="padding-top: 8px;">
                Upcoming:
            </div>
            <div class="col-6 text-uppercase text-right" v-if="!current">
                <span class="highlight">Current Time: {{ schedule.getDate(schedule.state.now).format('HH:mm') }}</span>
            </div>
        </div>
        <div class="row">
            <div class="col-6 text-uppercase when" v-bind:class="next ? 'pt-4' : 'pt-5'">
                {{ time(event) }}
            </div>
            <div class="col-6 text-uppercase text-right" style="padding-top: 2.82em;" v-if="!next && current">
                <span class="highlight">Current Time: {{ schedule.getDate(schedule.state.now).format('HH:mm') }}</span>
            </div>
        </div>
        <div class="row">
            <div class="col-12 pt-4 name" v-bind:style="eventTitleStyle" v-bind:class="{ 'pb-2': next && !event.speakers.length }">
                {{ event.title }}
            </div>
        </div>
        <div class="row" v-if="event.speakers.length">
            <div class="col-12 speakers" v-bind:class="next ? 'pt-4' : 'pt-5'">
                <div class="pb-1" v-for="speaker in event.speakers">
                    {{ speakerName(speaker) }} <span style="color: #f6b71c;" v-if="affliatedToOrganization(speaker)"> // {{ speakerInfo(speaker) }}</span>
                </div>
            </div>
        </div>
        <div class="row" v-if="next && current">
            <div class="delimiter-bottom col-12"></div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['event', 'next', 'current', 'schedule'],
        computed: {
            eventTitleStyle: function() {
                return  {
                    'font-size': this.next ?
                    (this.event.title.length < 70 ? '3.78em' : '3rem') : (this.event.title.length < 50 ? '5.3em' : '4.0rem'),
                }
            },
            speakerName() {
                return speaker => speaker && [
                    speaker.first_name,
                    speaker.last_name
                ].join(' ').toUpperCase() || 'N/A'
            },
            speakerInfo() {
                return speaker => (speaker.affiliations[0].job_title && speaker.affiliations[0].organization.name) && [
                    speaker.affiliations[0].job_title,
                    speaker.affiliations[0].organization.name
                ].join(', ') || speaker.affiliations[0].organization.name
            },
            time() {
                return event => event && [
                    this.schedule.getDate(event.start_date).format('HH:mm'),
                    this.schedule.getDate(event.end_date).format('HH:mm')
                ].join(' - ') || 'N/A'
            }
        },
        methods: {
            affliatedToOrganization(speaker) {
                if (!speaker.affiliations) return false;
                let affiliation = speaker.affiliations[0];
                if (affiliation == null) return false;
                return affiliation.organization != null;
            }
        }
    }

</script>

<style>
 
    .highlight {
        font-family: "franklin-gothic-urw",sans-serif;
        color: #333399;
        background-color: #f6b71c;
        padding: 2px 14px;
        font-size: 2.2rem;
        font-weight: 600;
        letter-spacing: -1px;
    }
    
    .event {
        color: white;
    }

    .event .speakers {
        font-family: "franklin-gothic-urw",sans-serif;
        font-weight: 500;
        font-size: 2.33rem;
        line-height: 1;
        letter-spacing: 2px;
    }
    
    .event.next .speakers {
        font-size: 2.05rem;
    }

    .event .name {
        font-size: 5.3rem;
        line-height: 1.18;
    }

    .event.next .name {
        font-size: 3.78rem;
    }

    .event .when {
        font-family: "franklin-gothic-urw",sans-serif;
        color: #f6b71c;
        font-size: 3.2rem;
        font-weight: 500;
        line-height: 0.9;
    }
    
    .event.next .when {
        font-size: 2.6rem;
    }

    .upcoming {
        font-size: 2.2rem;
        font-weight: 700;
        letter-spacing: 3.4px;
        color: #f6b71c;
        line-height: 0.8;
    }

    .delimiter-top:before {
        content: "";
        position: absolute;
        left: 15px;
        top: -22px;
        width: 96%;
        border-color: #f6b71c;
        border-style: solid;
        border-width: 5px 0 0 0;
    }

    .delimiter-bottom:before {
        content: "";
        position: absolute;
        width: 96%;
        left: 15px;
        bottom: -40px;
        border-color: #f6b71c;
        border-style: solid;
        border-width: 5px 0 0 0;
    }

</style>
