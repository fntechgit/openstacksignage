<template>
    <div id="app">
        <banner :banner="banner.state.static_banner"></banner>
    </div>
</template>

<script>

    import '../../../assets/css/theme.scss'
    
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