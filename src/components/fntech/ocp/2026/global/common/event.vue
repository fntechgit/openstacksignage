<template>
    <div class="container-fluid event" :class="{ next }">
        <div class="row" v-if="next">
            <div class="col-12 pb-2 text-uppercase next-session-heading">
                <span class="next-session-label">Next Session</span>
            </div>
        </div>
        <div class="row name-row">
            <div class="col-12 name" v-bind:class="{ 'pt-4': !next, 'pb-2': next && (!showSpeakers || !speakerNames.length) }">
                <text-fit v-if="next" :max="44" :min="24">{{ event.title }}</text-fit>
                <template v-else>{{ event.title }}</template>
            </div>
        </div>
        <div class="row" v-if="showSpeakers && speakerNames.length">
            <div class="col-12 speakers">
                <div class="pb-1" v-for="name in speakerNames" :key="name">
                    {{ name }}
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

    import TextFit from './text-fit.vue'

    // A panel session runs to 25 speakers, which is taller than the whole sign.
    // Four names fit the space design drew and still say who is on stage.
    const SPEAKER_LIMIT = 4

    export default {
        components: { TextFit },
        props: {
            event: Object,
            next: Boolean,
            schedule: Object,
            showSpeakers: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            speakerNames() {
                const speakers = this.event && this.event.speakers || []
                const names = speakers.map(
                    speaker => `${speaker.first_name || ''} ${speaker.last_name || ''}`.trim()
                )

                if (names.length <= SPEAKER_LIMIT) {
                    return names
                }

                return names.slice(0, SPEAKER_LIMIT).concat(
                    [`and ${names.length - SPEAKER_LIMIT} more`]
                )
            },
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

    /* Debug only: shows how many speakers the session carries against how many
       the block renders, so a missing name is visible at a glance. */

    .event {
        color: white;
        /* Spacing lives here rather than on utility classes, so now-and-next
           can set its own without having to outrank them. */
        padding-top: 48px;
        padding-bottom: 96px;
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

    /* The next block is given a height by now-and-next. Its heading and time
       keep their own size and the title takes what is left, which is what
       text-fit measures against. */
    .event.next {
        padding-top: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .event.next .name-row {
        flex: 1 1 auto;
        min-height: 0;
    }

    .event.next .name-row .name {
        height: 100%;
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
    .next-session-heading {
        padding-top: 48px;
    }

    .next-session-label {
        color: #8DC63F;
        font-size: 30px;
        font-weight: 500;
        line-height: 1.25;
        letter-spacing: 3px;
    }

</style>
