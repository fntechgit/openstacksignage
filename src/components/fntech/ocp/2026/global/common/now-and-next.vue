<template>
    <div class="now-and-next" v-if="current || showNext">
        <event
            class="session-current"
            :schedule="schedule"
            :event="current"
            v-if="current"></event>

        <div class="session-divider" v-if="current && showNext"></div>

        <event
            class="session-next"
            :schedule="schedule"
            :event="next"
            :next=true
            v-if="showNext"
            :showSpeakers="!current"></event>
    </div>
</template>

<script>

    import Event from './event.vue'

    // Holds the two sessions between the room bar and the app promo. The
    // current one keeps its designed size and the next one gives up height
    // first, so neither can be positioned into the other.
    export default {
        components: { Event },
        props: {
            schedule: {
                type: Object,
                required: true
            }
        },
        computed: {
            current() {
                return this.schedule.state.events.curr
            },
            next() {
                return this.schedule.state.events.next
            },
            // A session on a later day is not what "next" means on a sign that
            // has already finished for today.
            showNext() {
                return !!(this.next && this.schedule.isToday(this.next.start_date))
            }
        }
    }

</script>

<style>

    /* Takes whatever is left between the room bar and the app promo. Following
       the bar in flow means it needs no measuring when the room name wraps and
       the bar grows. */
    .now-and-next {
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
    }

    .session-current {
        flex: 0 0 auto;
        /* The rule is measured from the text, so the block's own trailing
           padding must not land inside the gap. */
        padding-bottom: 0;
        /* Spare height collects here, above the rule, so the next session stays
           at the foot of the screen. */
        margin-bottom: auto;
    }

    /* Gives up height before the current session does; its title shrinks to
       whatever is left. */
    .session-next {
        flex: 0 1 auto;
        min-height: 0;
    }

    .session-divider + .session-next .next-session-heading {
        padding-top: 0;
    }

    /* On its own the next session leads with its small heading rather than a
       large title, so it needs more room under the room name than a current
       session does to sit at the same optical distance. */
    .session-next:first-child .next-session-heading {
        padding-top: 96px;
    }

    /* Sits the same distance from the current session above it as from the next
       session below it. Spare height goes above, never into these two gaps: once
       they are all that is left, the next session shrinks instead and its title
       follows. */
    .session-divider {
        flex: 0 0 2px;
        margin: 44px 88px;
        background-color: #8DC63F;
    }

</style>
