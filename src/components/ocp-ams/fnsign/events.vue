<template>
    <div class="event next pb-5">
        <div class="pt-5">
            <div class="container-fluid pl-5 pr-5" v-bind:class="{standalone : current == null}">
                <div class="row pb-3">
      	            <div class="col-md-12">
  		                <h1 class="text-uppercase upcoming">
			                Upcoming:
   		                </h1>
	                </div>
                </div>
                <div class="events-wrapper">
                    <swiper ref="slider" :options="swiperOption">
                        <swiper-slide v-for="event in events" :key="event.id">
                            <div class="row pb-3">
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
                                <div class="speaker-list">
                                    <li v-for="speaker in event.speakers">
                                        <h1 class="col-md-5 text-uppercase speaker">
                                            {{ speakername(speaker) }}
                                        </h1>
                                        <h1 class="col-md-8 speaker-info">
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
          height: 380,
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
        width: 880px;
        margin-left: 49px;
        position: absolute;
        top: 610px;
        height: 640px;
    }
    .event .time,
    .next .time {
        font-family: Franklin;
        color: #343895;
        text-rendering: geometricPrecision;
	    -webkit-font-smoothing: antialiased;
    }
    .event .time {
        font-size: 46px;
    }
    .event .name,
    .next .name {
        font-family: Nexa;
        color: #fff!important;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
    }
    .event .name {
        font-size: 80px;
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
        font-size: 38px;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
    }
    .event .speaker {
        color: #fff;
    }
    .event .speaker-info {
        padding-top: 5px;
        padding-left: 30px;
    }
    .speaker-info:before {
        content: "//  ";
        color: rgb(52,56,149);
    }
    .next {
        position: absolute;
        top: 1300px;
        font-size: 42px !important;
        width: 990px;
    }
    .next .upcoming {
        font-size: 33px;
        letter-spacing: 3px;
        color: rgb(52,56,149);
        font-family: "Nexa";
        font-weight: bold;
    }
    .next .time {
        font-size: 38px;
    }
    .next .name {
        font-size: 56px;
        padding-bottom: 5px;
        line-height: 1.25;
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
        width: 590px;
    }
    .next .speaker-list li {
        padding-bottom: 35px;
    }
    .events-wrapper {
        height: 298px;
        overflow: hidden;
    }
    .swiper-wrapper {
        -webkit-transition-timing-function: linear!important;
        -o-transition-timing-function: linear!important;
        transition-timing-function: linear!important;
    }
</style>
