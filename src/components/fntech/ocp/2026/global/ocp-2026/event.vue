<template>
    <div class="container-fluid pb-7 event" :class="{ next, 'pt-5': !next }">
        <div class="row" v-if="next">
            <div class="col-12 pt-5 pb-2 text-uppercase">
                <div class="next-session-border" v-if="hasCurrent"></div>
                <span class="next-session-label">Next Session</span>
            </div>
        </div>
        <div class="row">
            <div class="col-12 name" v-bind:class="{ 'pt-4': !next, 'pb-2': next && (!showSpeakers || !event.speakers.length) }">
                {{ event.title }}
            </div>
        </div>
        <div class="row" v-if="showSpeakers && event?.speakers?.length">
            <div class="col-12 speakers">
                <div class="pb-1" v-for="speaker in event.speakers" :key="speaker.id">
                    {{ speaker.first_name }} {{ speaker.last_name }}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 text-uppercase when">
                <span class="highlight">{{ time(event) }}</span>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: {
            event: Object,
            next: Boolean,
            schedule: Object,
            showSpeakers: {
                type: Boolean,
                default: true
            },
            hasCurrent: {
                type: Boolean,
                default: false
            }
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

    /* Time pill. Figma draws this at 18px/190x36, which renders the session
       time at the same size as the clock's caption. Bumped to 24px so it sits
       level with the speaker names and reads as content. min-width rather than a
       hard width so a longer range grows instead of wrapping out of the pill. */
    .highlight {
        display: inline-block;
        box-sizing: border-box;
        min-width: 210px;
        height: 46px;
        line-height: 46px;
        padding: 0 13px;
        border-radius: 1px;
        background-color: #8DC63F;
        color: #0D0930;
        font-size: 24px;
        font-weight: 600;
        letter-spacing: 0.24px;
        text-align: center;
        white-space: nowrap;
    }

    .event {
        color: white;
        /* Figma content column: x=88, 904 wide. Bootstrap's row/col gutters are
           zeroed so this padding is the only one. */
        padding-left: 88px;
        padding-right: 88px;
    }

    .event .row {
        margin-left: 0;
        margin-right: 0;
    }

    .event [class*="col"] {
        padding-left: 0;
        padding-right: 0;
    }

    .event .name {
        color: #F5F5F5;
        font-size: 64px;
        font-weight: 600;
        line-height: 1.25;
        letter-spacing: -0.64px;
    }

    .event.next .name {
        font-size: 44px;
        line-height: 1.35;
        letter-spacing: 0.44px;
        /* Sit the title under its own heading rather than midway between the
           heading and the time. */
        padding-top: 14px;
    }

    /* The time sits a little further below the speakers than the speakers sit
       below the title, so it reads as its own line rather than part of them. */
    .event .when {
        padding-top: 40px;
    }

    .event.next .when {
        padding-top: 32px;
    }

    .event .speakers {
        /* Speakers belong to the title above them, not midway to the time. */
        padding-top: 32px;
        color: #8DC63F;
        font-size: 40px;
        font-weight: 700;
        line-height: 1.25;
        letter-spacing: 0.4px;
    }

    .event.next .speakers {
        padding-top: 24px;
        font-size: 28px;
        letter-spacing: 0.28px;
        text-transform: capitalize;
    }

    /* Figma draws this at 24px; lifted a step so the section heading carries. */
    .next-session-label {
        color: #8DC63F;
        font-size: 30px;
        font-weight: 500;
        line-height: 1.25;
        letter-spacing: 3px;
    }

    .next-session-border {
        width: 100%;
        height: 2px;
        background-color: #8DC63F;
        margin-bottom: 44px;
    }
</style>
