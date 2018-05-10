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

        <div class="location">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-8">
            <!--            <div class="text-uppercase label">Room</div>
                        <div class="text-uppercase value">
                            {{ banner.floor.name }}
                            ({{ banner.room.name }})
                        </div>
                    </div> -->
                    <div class="col-md-4 text-center">
                        <div class="text-uppercase label">Current Time</div>
                        <div class="text-uppercase value">
                            {{ banner.getDate(banner.state.now).format('h:mm a') }}
                        </div>
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

    .empty {
        background: white;
        padding: 6rem 0;
        border-bottom: 3px solid gray;
    }

    .debug {
        background: rgba(0, 0, 0, 0.5);
        color:white;
        position: fixed;
        top: 0;
        z-index: 1;
    }

    .debug a {
        color: yellow;
    }

</style>
