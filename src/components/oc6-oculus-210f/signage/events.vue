<template>
    <div class="next pb-5">
        <div class="pt-5">
            <div class="container-fluid pl-5 pr-5" v-bind:class="{standalone : current == null}">
                <div class="events-wrapper">
                    <swiper ref="slider" :options="swiperOption">
                        <swiper-slide v-for="event in events" :key="event.id">
                            <div class="row">
                                <div class="col-md-12">
                                    <h1 class="text-primary name">
                                        {{ event.title }}
                                    </h1>
                                </div>
                            </div>
                            <div class="row pb-3">
                                <div class="col-md-12">
                                    <h1 class="time">
                                        {{ time(event) }}
                                    </h1>
                                </div>
                            </div>
                        </swiper-slide>
                    </swiper>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

  import 'swiper/dist/css/swiper.css'

  import { swiper, swiperSlide } from 'vue-awesome-swiper'

  export default {
    props: ['current', 'events', 'schedule'],
    data() {
      return {
        swiperOption: {
          direction: 'vertical',
          allowTouchMove: false,
          autoHeight: true,
          height: 220,
          spaceBetween: 10,
          loop: true,
          speed: 4000,
          autoplay: {
            delay: 0
          },
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
      time() {
        return event => event && [
          this.schedule.getDate(event.start_date).format('hh:mm A'),
          this.schedule.getDate(event.end_date).format('hh:mm A')
        ].join(' - ') || 'N/A'
      },
      starttime() {
        return event => event && this.schedule.getDate(event.start_date).format('HH:mm') || 'N/A'
      }
    },
    components: {
      swiper,
      swiperSlide
    }
  }
</script>

<style>
    .next .time {
        font-size: 32px;
        letter-spacing: 1px;
        color: rgb(186,1,255);
        font-family: "Oculus Sans";
        font-weight: bold;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
    }
    .next .name {
        font-family: Oculus Sans;
        color: #fff!important;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
    }
    .next {
        position: relative;
        top: 700px;
    }
    .next .upcoming {
        font-size: 33px;
        letter-spacing: 3px;
        color: rgb(52,56,149);
        font-family: "Nexa";
        font-weight: bold;
    }
    .next .name {
        font-size: 50px;
        padding-bottom: 5px;
        letter-spacing: 1px;
    }
    .next .speaker,
    .next .speaker-info {
        font-family: Franklin;
        font-size: 34px;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
    }
    .next .speaker {
        color: #fff;
    }
    .next .speaker-info {
        color: rgb(52,56,149);
    }
    .standalone {
        margin-top: 700px;
    }
    .events-wrapper {
        height: 220px;
        overflow: hidden;
        margin-left: 36px;
        width: 890px;
    }
    .swiper-wrapper {
        -webkit-transition-timing-function: linear!important;
        -o-transition-timing-function: linear!important;
        transition-timing-function: linear!important;
    }
</style>
