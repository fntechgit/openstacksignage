<template>
    <div class="clock-container" :style="{ borderColor: accentColor }">
        <div class="clock-label text-uppercase" :style="{ backgroundColor: accentColor }">Current Time</div>
        <div class="clock-time">{{ formattedTime }}</div>
    </div>
</template>

<script>
export default {
    props: {
        schedule: {
            type: Object,
            required: true
        },
        accentColor: {
            type: String,
            default: '#8DC63F'
        }
    },
    computed: {
        formattedTime() {
            return this.schedule.getDate(this.schedule.state.now).format('h:mmA');
        }
    }
}
</script>

<style scoped>
.clock-container {
    display: inline-block;
    border: 2px solid;
}

.clock-label {
    color: #191A4F;
    padding: 0.2rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: -1px;
    text-align: center;
}

.clock-time {
    color: #FFFFFF;
    font-size: 2rem;
    font-weight: 400;
    padding: 0 1rem;
    text-align: center;
}
</style>