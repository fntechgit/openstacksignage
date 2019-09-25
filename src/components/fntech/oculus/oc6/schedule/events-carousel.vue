<template>
    <div class="container event" style="padding-top: 5.42em">
        <div class="row">
            <div class="col-12 delimiter-top"></div>
            <div class="col-12 text-uppercase title" style="padding-top: 0.2em; padding-bottom: 0.34em;">
                Upcoming Sessions
            </div>
        </div>
        <div class="events-wrapper">
            <swiper ref="slider" :options="swiperOption">
                <swiper-slide v-for="event in events" :key="event.id">
                    <div class="row" style="padding-top: 3em">
                        <div class="col-12 name">
                            {{ event.title }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 time">
                            {{ time(event) }}
                        </div>
                    </div>
                </swiper-slide>
            </swiper>
        </div>
        <div class="row">
            <div class="col-12 delimiter-bottom"></div>
        </div>
    </div>
</template>

<script>

    import 'swiper/dist/css/swiper.css'

    import { swiper, swiperSlide } from 'vue-awesome-swiper'

    export default {
        props: ['schedule', 'upcoming'],
        data() {
            return {
                eventsCache: null,
                swiperOption: {
                    direction: 'vertical',
                    allowTouchMove: false,
                    height: 1,
                    spaceBetween: 0,
                    slidesPerView: 'auto',
                    loop: true,
                    speed: 10000,
                    autoplay: {
                        delay: 0
                    },
                }
            }
        },
        updated: function () {
            let vm = this;
            vm.$nextTick(function () {
                vm.swiperRestart()
            });
        },
        methods: {
            swiperRestart: function () {
                this.swiper.detachEvents()
                this.swiper.destroy()
                this.$refs.slider.mountInstance()
            }
        },
        computed: {
            events() {
                return this.upcoming
            },
            swiper() {
                return this.$refs.slider.swiper
            },
            time() {
                return event => event && [
                    this.schedule.getDate(event.start_date).format('h:mma'),
                    this.schedule.getDate(event.end_date).format('h:mma')
                ].join(' - ') || 'N/A'
            }
        },
        components: {
            swiper,
            swiperSlide
        }
    }
</script>

<style>
    .swiper-wrapper {
        -webkit-transition-timing-function: linear!important;
        -o-transition-timing-function: linear!important;
        transition-timing-function: linear!important;
        transform: translate3d(0px, 200px, 0px);
    }
    .events-wrapper {
        overflow: hidden;
        height: 200px;
    }
</style>
