<template>
    <div class="container event" :class="{next, fixed}">
        <div class="row">
            <div class="col-12 delimiter-top"></div>
            <div class="col-12 text-uppercase title" style="padding-top: 0.2em" v-if="!next">
                Current <template v-if="event.speakers.length">Session</template><template v-else>Event</template>
            </div>
            <div class="col-12 text-uppercase title" style="padding-top: 0.2em" v-if="next">
                Upcoming <template v-if="event.speakers.length">Sessions</template><template v-else>Events</template>
            </div>
        </div>
        <div class="row">
            <div class="col-12 name">
                {{ event.title }}
            </div>
        </div>
        <div class="row" v-if="!next && event.speakers.length">
            <div class="col-12 text-uppercase title" style="padding-top: 0.7em">
                Speakers
            </div>
            <div class="col-12 speaker">
                <div class="pt-2 pb-2" v-for="speaker in event.speakers">
                    {{ speakerName(speaker) }}
                    <div class="affiliation" v-if="affliatedToOrganization(speaker)">
                        {{ speakerInfo(speaker) }}
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 time">
                {{ time(event) }}
            </div>
        </div>
        <div class="row" v-if="next">
            <div class="col-12 delimiter-bottom"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['next', 'event', 'schedule', 'fixed'],
        computed: {
            speakerName() {
                return speaker => speaker && [
                    speaker.first_name,
                    speaker.last_name
                ].join(' ') || 'N/A'
            },
            speakerInfo() {
                return speaker => (speaker.affiliations[0].job_title && speaker.affiliations[0].organization.name) && [
                    speaker.affiliations[0].job_title,
                    speaker.affiliations[0].organization.name
                ].join(', ') || speaker.affiliations[0].organization.name
            },
            time() {
                return event => event && [
                    this.schedule.getDate(event.start_date).format('HH:mma'),
                    this.schedule.getDate(event.end_date).format('HH:mma')
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
    .event {
        padding-top: 5.42em;
    }
    .name {
        padding-top: 0.1em;
        font-size: 3.3em;
        line-height: 1.2em;
        letter-spacing: 0.8px;
    }
    .title {
        font-size: 2.7em;
        letter-spacing: 1.5px;
        color: #5d5e61;
    }
    .speaker {
        font-size: 2.7em;
        letter-spacing: 1px;
    }
    .speaker .affiliation {
        font-size: 0.85em;
        line-height: 0.85em;
        color: #5d5e61;
    }
    .time {
        padding-top: 0.7em;
        font-size: 2em;
        letter-spacing: 1.2px;
        color: #f856f8;
    }
    .delimiter-top:before {
        content: "";
        position: absolute;
        left: 15px;
        top: -22px;
        width: 97%;
        border-color: #5d5e61;
        border-style: solid;
        border-width: 3px 0 0 0;
    }
    .delimiter-bottom:before {
        content: "";
        position: absolute;
        width: 97%;
        left: 15px;
        bottom: -40px;
        border-color: #5d5e61;
        border-style: solid;
        border-width: 3px 0 0 0;
    }
</style>
