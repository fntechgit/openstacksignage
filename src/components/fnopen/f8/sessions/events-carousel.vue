<template>   
    <div class="container-fluid">
        <div class="row pt-7 pl-5">
            <div class="col-3 todays-sessions">
                Today´s Sessions
            </div>
            <div class="col-9 events-wrapper" :class="{ long }">
                <swiper ref="slider" :options="swiperOption">
                    <swiper-slide class="event" v-for="event in events" :key="event.id">
                        <div class="row">
                            <div class="col-2 text-right time">
                                {{ startTime(event) }}
                            </div>
                            <div class="col-10 text-left">
                                <div class="row">
                                    <div class="col-12 name">
                                        {{ event.title }}
                                    </div>
                                    <div class="col-12 room" v-if="room(event)">
                                        Location: {{ room(event) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
    </div>
</template>

<script>

    import 'swiper/dist/css/swiper.css'

    import { swiper, swiperSlide } from 'vue-awesome-swiper'

    export default {
        props: ['schedule', 'events', 'long'],
        data() {
            return {
                swiperOption: {
                    direction: 'vertical',
                    allowTouchMove: false,
                    height: 1,
                    spaceBetween: 0,
                    slidesPerView: 'auto',
                    loop: true,
                    loopedSlides: this.events.length * 2,
                    speed: 7000,
                    autoplay: {
                        delay: 0
                    }
                }
            }
        },
        beforeUpdate: function () {
            this.$refs.slider.swiper.detachEvents()
            this.$refs.slider.swiper.destroy()
        },
        updated: function () {
            this.$refs.slider.mountInstance()
        },
        computed: {
            startTime() {
                return event => event && this.schedule.getDate(event.start_date).format('h:mm') || 'N/A'
            },
            room() {
                return event => event && event.location.name || null
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
    }
    .events-wrapper {
        overflow: hidden;
        height: 800px;
        margin-top: 15px;
    }
    .long {
        height: 870px !important;
    }
</style>
