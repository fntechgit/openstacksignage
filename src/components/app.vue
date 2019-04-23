<template>
    <pre v-if="error"><b>ERROR</b><br>{{ error }}</pre>

    <pre class="loading" v-else-if="! ready"
    style="width: 100px; text-align: center; margin-top: 500px; margin-left: 10px;">Loading...</pre>

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
