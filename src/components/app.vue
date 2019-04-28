<template>
    <pre v-if="error"><b>ERROR</b><br>{{ error }}</pre>

    <pre class="loading" v-else-if="! ready"
    style="color: white; position: absolute; left: 50%; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);">Loading...</pre>

    <router-view v-else></router-view>
</template>

<script>

    import { mapGetters } from 'vuex'

    export default {
        computed: mapGetters({
            error: 'error',
            ready: 'ready',
        })
    }

</script>
