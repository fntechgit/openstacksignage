<template>
    <div class="event next pb-5">
        <div class="pt-5">
            <div class="container-fluid pl-5 pr-5" v-bind:class="{standalone : current == null}">
                <div class="events-wrapper">
                    <swiper ref="slider" :options="swiperOption">
                        <swiper-slide v-for="event in events" :key="event.id">
                            <div class="row">
                                <div class="col-md-12">
                                    <h1 class="text-uppercase time">
                                        {{ starttime(event) }}
                                    </h1>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <h1 class="text-primary name">
                                        {{ event.title }}
                                    </h1>
                                </div>
                            </div>
                            <div class="row" v-if="event.speakers">
                                <div class="col-md-12 speaker-list">
                                    <li v-for="speaker in event.speakers">
                                        <h1 class="text-uppercase speaker">
                                            {{ speakername(speaker) }}
                                        </h1>
                                        <h1 class="speaker-info">
                                            {{ speakerinfo(speaker) }}
                                        </h1>
                                    </li>
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
          height: 180,
          spaceBetween: 100,
          loop: true,
          speed: 4000,
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
      speakername() {
        return speaker => speaker && [
          speaker.first_name,
          speaker.last_name
        ].join(' ') || 'N/A'
      },
      speakerinfo() {
        return speaker => speaker && (speaker.position && speaker.company) && [
          speaker.position,
          speaker.company
        ].join(', ')
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
    .event {
        width: 840px;
        margin-left: 20px;
        position: absolute;
        height: 640px;
        top: 5px;
    }
    .event .time,
    .next .time {
        font-family: Franklin;
        color: #333794;
        text-rendering: geometricPrecision;
	    -webkit-font-smoothing: antialiased;
    }
    .event .time {
        font-size: 32px;
    }
    .event .name,
    .next .name {
        font-family: Franklin;
        color: #fff!important;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
    }
    .event .name {
        font-size: 50px;
        line-height: 1.33;
        padding-bottom: 10px;	
    }
    .event .speaker-list {
        list-style: none;
    }
    .speaker-list li {
        display:flex;
    }
    .event .speaker,
    .event .speaker-info {
        font-family: Franklin;
        font-size: 26px;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
    }
    .event .speaker {
        color: #fff;
    }
    .event .speaker-info {
        padding-left: 30px;
    }
    .speaker-info:before {
        content: "//  ";
        color: rgb(52,56,149);
    }
    .next {
        position: absolute;
        top: 400px;
        font-size: 42px !important;
        width: 680px !important;
    }
    .next .time {
        font-size: 28px;
    }
    .next .name {
        font-size: 42px;
        padding-bottom: 5px;
        line-height: 1.25;
    }
    .next .speaker,
    .next .speaker-info {
        font-family: Franklin;
        font-size: 18px;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
    }
    .next .speaker {
        color: #fff;
        padding-right: 22;
    }
    .next .speaker-info {
        color: rgb(52,56,149);
    }
    .events-wrapper {
        height: 198px;
        overflow: hidden;
    }
    .swiper-wrapper {
        -webkit-transition-timing-function: linear!important;
        -o-transition-timing-function: linear!important;
        transition-timing-function: linear!important;
    }
</style>
