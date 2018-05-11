<template>
    <div id="app">

        <img class="logo" src="assets/images/opendev-logo.svg">

        <banner :banner="banner.state.static_banner"></banner>
    </div>
</template>

<script>

    import Banner from './banner.vue'
    import { mapGetters } from 'vuex'

    export default {
        computed: {
            ...mapGetters({
                banner: 'banner'
            }),
        },
        components: { Banner }
    }

</script>

<style>

    .logo {
        padding-top: 150px;
        border-bottom: 5px solid #D31366;
    }

</style>
