<template>
    <pre v-if="error"><b>ERROR</b><br>{{ error }}</pre>

    <pre v-else-if="! schedule"
    style="width: 100%; text-align: center; margin-top: 50px">Loading...</pre>

    <div v-else>
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
