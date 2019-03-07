<template>
    <div id="app">

        <div class="container-fluid">
            <div class="row">
                <div class="col">
                    <img src="assets/images/open-infrastructure-logo.svg" class="img-fluid w-100 p-5">
                </div>
            </div>
        </div>

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
        mounted() {
            const el = document.body
            el.style.backgroundImage = "url(/assets/images/background-" + Math.floor(Math.random() * 3 + 1) + ".svg)"
        },
        components: { Banner }
    }

</script>

<style>

    .logo {
        width: 80%;
    }

</style>
