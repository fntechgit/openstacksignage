<template>
    <div class="container event" :class="{next}" style="padding-top: 5.42em">
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
            <div class="col-12 time" v-bind:style="timeStyle">
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
        props: ['next', 'event', 'schedule', 'timeStyle'],
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
                    this.schedule.getDate(event.start_date).format('h:mma'),
                    this.schedule.getDate(event.end_date).format('h:mma')
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
