<template>
    <div id="app">
        <div class="container h-100 mw-100" v-if="banner.state.static_banner">
            <div class="row h-100 p-10 align-items-center justify-content-center banner">
                <div class="col-9 text-center">
                    {{ banner.state.static_banner.content }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import '../../../assets/css/f8-2019/theme.scss'
    import { mapGetters } from 'vuex'

    export default {
        computed: {
            ...mapGetters({
                banner: 'banner'
            }),
        },
        mounted() {
            const el = document.body
            this.$store.watch(
                (state, getters) => getters.background,
                (newValue, oldValue) => {
                    el.style.backgroundImage = "url(assets/images/OCP19R_FNSign_BKGD_VERT.png)"
                },
            );
            el.style.backgroundImage = "url(assets/images/OCP19R_FNSign_BKGD_VERT.png)"
        }
    }

</script>

<style>

    #app {
        color: white;
        font-family: "Graphik Web";
        font-weight: 500;
        height: 100%;
    }

    .banner {
        font-size: 7rem;
        line-height: 1.18;
    }

</style>
