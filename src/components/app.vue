<template>
    <pre v-if="error"><b>ERROR</b><br>{{ error }}</pre>

    <pre v-else-if="! ready"
    style="width: 100%; text-align: center; margin-top: 50px">Loading...</pre>

    <div v-else>
        <screen></screen>
    </div>
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
