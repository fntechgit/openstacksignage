<template>
    <div id="app">

        <div class="py-5">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-12">
                        <img class="img-fluid d-block mx-auto logo" src="assets/images/dispaly-yvr-title.svg">
                    </div>
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
        components: { Banner }
    }

</script>

<style>

    .logo {
        width: 60%;
    }

    .location {
        color: white;
        border-top: 5px solid white;
        border-bottom: 15px solid red;
        padding: 40px 30px;
    }

    .location .label {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .location .value {
        font-size: 3rem;
    }

</style>
