<template>
    <div class="event" :class="{ next }">
        <div v-if="next" class="upcoming">
            Upcoming
        </div>
        <div class="name">
            {{ event.title }}
        </div>
        <div class="when">
            {{ time(event) }}
        </div>
    </div>
</template>

<script>
export default {
    props: ['event', 'next', 'schedule'],
    computed: {
        room() {
            return event => event && this.$store.getters.room(event.location_id) || { name: 'N/A' };
        },
        time() {
            return event => event && [
                this.schedule.getDate(event.start_date).format('h:mma'),
                this.schedule.getDate(event.end_date).format('h:mma')
            ].join(' - ') || 'N/A';
        }
    }
}
</script>

<style>
.event {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 70px;
}
.event.next {
    padding-top: 50px;
}

.name {
    padding-bottom: 48px;
    color: #FFF;
    font-family: "Builder Sans";
    font-size: 135px;
    font-style: normal;
    font-weight: 600;
    line-height: 110%; /* 148.5px */
}

.when {
    color: #489FF8;
    font-family: "Builder Sans";
    font-size: 68px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}

.upcoming {
    display: flex;
    justify-content: flex-start;
    margin-left: 9px;
    margin-bottom: 11px;
    color: #818181;
    font-family: "Builder Extended";
    font-size: 36px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 3.6px;
    text-transform: uppercase;
}
</style>
