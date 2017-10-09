<template>
    <pre v-if="error">{{ error }}</pre>
    <div v-else-if="schedule">
        <pre>{{ schedule.date }}</pre>
        <router-view></router-view>
    </div>
</template>

<script>

    import { mapGetters } from 'vuex'

    export default {
        computed: mapGetters({
            error: 'error',
            schedule: 'schedule',
        })
    }

</script>
