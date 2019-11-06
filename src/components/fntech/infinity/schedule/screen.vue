<template>
    <div id="app">

        <table v-if="schedule.debug" border="1" width="100%" class="debug">
            <tr>
                <td align="center" colspan="3" v-html="schedule.format(schedule.state.now)"></td>
            </tr>
            <tr>
                <td align="center" width="33%">
                    <a v-if="schedule.state.events.prev" href="" @click.prevent="syncStart(schedule.state.events.prev)">[start-5s]</a>
                    Previous Event
                    <a v-if="schedule.state.events.prev" href="" @click.prevent="syncEnd(schedule.state.events.prev)">[end-5s]</a>
                </td>
                <td align="center" width="33%">
                    <a v-if="schedule.state.events.curr" href="" @click.prevent="syncStart(schedule.state.events.curr)">[start-5s]</a>
                    Current Event
                    <a v-if="schedule.state.events.curr" href="" @click.prevent="syncEnd(schedule.state.events.curr)">[end-5s]</a>
                </td>
                <td align="center" width="33%">
                    <a v-if="schedule.state.events.next" href="" @click.prevent="syncStart(schedule.state.events.next)">[start-5s]</a>
                    Next Event
                    <a v-if="schedule.state.events.next" href="" @click.prevent="syncEnd(schedule.state.events.next)">[end-5s]</a>
                </td>
            </tr>
            <tr>
                <td align="center" width="33%">
                    {{ schedule.state.events.prev && schedule.state.events.prev.title || 'N/A' }}
                </td>
                <td align="center" width="33%">
                    {{ schedule.state.events.curr && schedule.state.events.curr.title || 'N/A' }}
                </td>
                <td align="center" width="33%">
                    {{ schedule.state.events.next && schedule.state.events.next.title || 'N/A' }}
                </td>
            </tr>
        </table>

        <div class="container-fluid pl-8 stage" v-if="getLocation(schedule.room.name)" :style="{ backgroundColor: getColor(schedule.room.name) }">
            <div class="row">
                <div class="col">
                    <div class="text-uppercase">{{ getLocation(schedule.room.name) }}</div>
                </div>
            </div>
        </div>

        <div class="container-fluid px-8 pt-6 pb-3">
            <div class="row">
                <div class="col-9">
                    <div class="text-uppercase" style="width: 20em" v-bind:style="roomStyle">{{ getRoom(schedule.room.name) }}</div>
                </div>
                <div class="col-3 text-right" style="margin-top: -7px;">
                    <div class="text-uppercase">
                        <span class="highlight" :style="{ color: getHighlightTextColor(schedule.room.name), backgroundColor: getColor(schedule.room.name) }">Current Time</span>
                    </div>
                    <div class="time">{{ schedule.getDate(schedule.state.now).format('h:mmA') }}</div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12 delimiter-top"></div>
        </div>

        <event ref="current" :overlapping="this.overlapping" :schedule="schedule" :event="schedule.state.events.curr"
        v-if="schedule.state.events.curr"></event>
        
        <event ref="next" :overlapping="this.overlapping" :schedule="schedule" :event="schedule.state.events.next" :next=true  v-if="schedule.state.events.next && schedule.isToday(schedule.state.events.next.start_date)" v-bind:class="{ 'fixed-bottom': schedule.state.events.curr, 'pt-5': !schedule.state.events.curr }" style="bottom: 19em;"></event>

        <div class="container-fluid" v-else-if="!schedule.state.events.curr">
            <div class="row pt-5 pl-8 pr-8 no-presentations">
                <div class="col-12 text-left">
                    All events are finished for today
                </div>
            </div>
        </div>

        <div class="row fixed-bottom" style="bottom: 26.5em;">
            <div class="col-12 delimiter-bottom"></div>
        </div>

    </div>
</template>

<script>

    import 'assets/css/infinity/theme.scss'

    import Event from './event.vue'
    import moment from 'moment'
    import { mapGetters } from 'vuex'

    export default {
        data: function () {
          return {
            overlapping: false,
            pair: null
          }
        },
        updated: function () {
            if (this.$refs.current && this.$refs.next) {
                let pair = this.schedule.state.events.curr.id + ',' + this.schedule.state.events.next.id
                let overlaps = this.overlaps(this.$refs.current.$el, this.$refs.next.$el)
                if (this.pair != pair) {
                    if (overlaps) this.pair = pair
                    this.overlapping = overlaps
                }
            } else {
                this.pair = null
                this.overlapping = false
            }
        },
        computed: {
            ...mapGetters({
                schedule: 'schedule'
            }),
            roomStyle: function() {
                var fontSize = '7.78rem'
                var paddingTop = '0'
                switch (this.schedule.room.name) {
                  case 'MONETIZATION STAGE @ Dream Hotel 2nd Floor Rorschach Room':
                  case 'MINI SUMMIT STAGE @ Dream Hotel 2nd Floor Think Tank Room':
                    fontSize = '3.8rem'
                    paddingTop = '1rem'
                    break
                }

                return {
                    'padding-top': paddingTop,
                    'font-size': fontSize,
                    'line-height': '4rem',
                    'color': this.getColor(this.schedule.room.name)
                }
            },
        },
        methods: {
            overlaps(element1, element2) {
                var rect1 = element1.getBoundingClientRect()
                var rect2 = element2.getBoundingClientRect()
                return !(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom - 70 < rect2.top || 
                rect1.top > rect2.bottom)
            },
            getLocation(venue) {
                var location = null
                switch (venue) {
                  case 'MONETIZATION STAGE @ Dream Hotel 2nd Floor Rorschach Room':
                    location = 'MONETIZATION STAGE'
                    break
                  case 'MAIN STAGE @ GOYA Studios Stage A':
                    location = 'MAIN STAGE'
                    break
                  case 'MINI SUMMIT STAGE @ Dream Hotel 2nd Floor Think Tank Room':
                    location = 'MINI SUMMIT STAGE'
                    break
                  case 'FESTIVAL HUB @ Goya Studios Central Lot':
                    location = 'FESTIVAL HUB'
                    break
                  case 'CREATIVE STAGE @ GOYA Studios Stage B':
                    location = 'CREATIVE STAGE'
                    break
                  case 'AWS MAIN STAGE @ GOYA Studios Stage A':
                    location = 'AWS MAIN STAGE'
                    break
                }
                return location
            },
            getRoom(venue) {
                var room = null
                switch (venue) {
                  case 'MONETIZATION STAGE @ Dream Hotel 2nd Floor Rorschach Room':
                    room = 'Rorschach Room'
                    break
                  case 'MAIN STAGE @ GOYA Studios Stage A':
                    room = 'Stage A'
                    break
                  case 'MINI SUMMIT STAGE @ Dream Hotel 2nd Floor Think Tank Room':
                    room = 'Meeting Room'
                    break
                  case 'FESTIVAL HUB @ Goya Studios Central Lot':
                    room = 'Central Lot'
                    break
                  case 'CREATIVE STAGE @ GOYA Studios Stage B':
                    room = 'Stage B'
                    break
                  case 'AWS MAIN STAGE @ GOYA Studios Stage A':
                    room = 'Stage A'
                    break
                }
                return room;
            },
            getColor(venue) {
                var color = '#8a54a2'
                switch (venue) {
                  case 'MONETIZATION STAGE @ Dream Hotel 2nd Floor Rorschach Room':
                    color = '#80bde7'
                    break
                  case 'MINI SUMMIT STAGE @ Dream Hotel 2nd Floor Think Tank Room':
                    color = '#cb0079'
                    break
                  case 'CREATIVE STAGE @ GOYA Studios Stage B':
                    color = '#e62227'
                    break
                  case 'AWS MAIN STAGE @ GOYA Studios Stage A':
                    color = '#8a54a2'
                    break
                }
                return color;
            },
            getHighlightTextColor(venue) {
                var color = '#FFFFFF'
                switch (venue) {
                  case 'MONETIZATION STAGE @ Dream Hotel 2nd Floor Rorschach Room':
                    color = '#000000'
                    break
                }
                return color;
            },
            syncStart(item) {
                this.schedule.setOffset(
                    item.start_date - moment.utc().unix() - 65
                )
            },
            syncEnd(item) {
                this.schedule.setOffset(
                    item.end_date - moment.utc().unix() - 5
                )
            },
        },
        components: { Event }
    }

</script>

<style>
    
    #app {
        color: white;
        font-family: 'Montserrat', sans-serif;
        font-weight: 700;
    }

    .debug {
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        z-index: 1;
    }

    .debug a {
        color: yellow;
    }
    
    .highlight {
        padding: 9px 12px 6px 12px;
        font-size: 1.25rem;
        font-weight: 500;
        letter-spacing: -1px;
    }
    
    .stage {
        padding-top: 9px;
        font-size: 3.55rem;
        color: #FFFFFF;
        line-height: 1.4;
        letter-spacing: 1.7px;
    }
    
    .time {
        font-size: 2.35rem;
        font-weight: 400;
        margin-top: 9px;
    }

    .no-presentations {
        font-size: 4.25rem;
        line-height: 1.18;
        letter-spacing: 1px;
        padding-bottom: 6.5rem !important;
    }

    .delimiter-top:before {
        content: "";
        position: absolute;
        top: 7px;
        width: 77%;
        left: 8.05em;
        border-color: #666666;
        border-style: solid;
        border-width: 3px 0 0 0;
    }

    .delimiter-bottom:before {
        content: "";
        position: absolute;
        width: 77%;
        left: 8.05em;
        bottom: -40px;
        border-color: #666666;
        border-style: solid;
        border-width: 3px 0 0 0;
    }
</style>
