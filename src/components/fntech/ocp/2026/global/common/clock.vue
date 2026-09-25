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
/* Figma: 228x106 box, 36px label bar, 48px time. The border is 3px rather than
   the drawn 2px: at 2px it loses saturation whenever the screen is downscaled
   and reads as a darker green than the label bar it meets. */
.clock-container {
    display: inline-block;
    box-sizing: border-box;
    width: 228px;
    border: 3px solid;
    border-radius: 1px;
}

.clock-label {
    height: 36px;
    line-height: 36px;
    color: #0D0930;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.18px;
    text-align: center;
}

.clock-time {
    height: 64px;
    line-height: 64px;
    color: #FFFFFF;
    font-size: 48px;
    font-weight: 400;
    letter-spacing: -0.48px;
    text-align: center;
}
</style>
