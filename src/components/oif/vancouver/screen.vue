<template>
    <div id="app" class="background-image">

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
            <tr>
                <td align="center" width="33%">
                    <a v-if="schedule.state.scheduled_banners.prev" href="" @click.prevent="syncStart(schedule.state.scheduled_banners.prev)">[start-5s]</a>
                    Previous Banner
                    <a v-if="schedule.state.scheduled_banners.prev" href="" @click.prevent="syncEnd(schedule.state.scheduled_banners.prev)">[end-5s]</a>
                </td>
                <td align="center" width="33%">
                    <a v-if="schedule.state.scheduled_banners.curr" href="" @click.prevent="syncStart(schedule.state.scheduled_banners.curr)">[start-5s]</a>
                    Current Banner
                    <a v-if="schedule.state.scheduled_banners.curr" href="" @click.prevent="syncEnd(schedule.state.scheduled_banners.curr)">[end-5s]</a>
                </td>
                <td align="center" width="33%">
                    <a v-if="schedule.state.scheduled_banners.next" href="" @click.prevent="syncStart(schedule.state.scheduled_banners.next)">[start-5s]</a>
                    Next Banner
                    <a v-if="schedule.state.scheduled_banners.next" href="" @click.prevent="syncEnd(schedule.state.scheduled_banners.next)">[end-5s]</a>
                </td>
            </tr>
            <tr>
                <td align="center" width="33%">
                    {{ schedule.state.scheduled_banners.prev && schedule.state.scheduled_banners.prev.title || 'N/A' }}
                </td>
                <td align="center" width="33%">
                    {{ schedule.state.scheduled_banners.curr && schedule.state.scheduled_banners.curr.title || 'N/A' }}
                </td>
                <td align="center" width="33%">
                    {{ schedule.state.scheduled_banners.next && schedule.state.scheduled_banners.next.title || 'N/A' }}
                </td>
            </tr>
            <tr>
                <td align="center" colspan="3">
                    Static Banner: {{ schedule.state.static_banner && schedule.state.static_banner.content || 'N/A' }}
                </td>
            </tr>
        </table>

        <div class="header">
            <div class="container-fluid px-7 pt-6 track" v-if="schedule.state.track" v-bind:style="trackStyle">
                <div class="row">
                    <div class="col-9">
                        <div class="text-uppercase">{{ schedule.state.track.name }}</div>
                    </div>
                    <div class="col-3 text-right">                    
                        <div class="time">{{ schedule.getDate(schedule.state.now).format('h:mmA') }}</div>
                    </div>
                </div>            
            </div>                    
            <div class="container-fluid px-7" v-bind:class="schedule.state.events.curr ? 'pt-3' : 'pt-6'">
                <div class="row">
                    <div class="col-9">
                        <div class="text-uppercase" v-bind:style="roomStyle">{{ formatRoomName(schedule.room.name) }}</div>
                    </div>
                </div>
            </div>
        </div>


        <event :schedule="schedule" :event="schedule.state.events.curr" v-if="schedule.state.events.curr"></event>
        
        <event :schedule="schedule" :event="schedule.state.events.next" :next=true 
            v-if="schedule.state.events.next && schedule.isToday(schedule.state.events.next.start_date)" 
            v-bind:class="{ '': schedule.state.events.curr }"></event>

        <div class="container-fluid" v-else-if="!schedule.state.events.curr">
            <div class="row p-7 no-presentations">
                <div class="col-12 text-left">
                    All presentations are finished for today
                </div>
            </div>
        </div>        

    </div>
</template>

<script>    

    import 'assets/css/ocp/2019/global/theme.scss'

    import Event from './event.vue'
    import moment from 'moment'

    import { mapGetters } from 'vuex'    


    export default {
        computed: {
            ...mapGetters({
                schedule: 'schedule'
            }),
            roomStyle: function() {
                return {
                    'font-size': this.schedule.room.name.length >= 10 ? '3.5rem' : '4.5rem',
                    'line-height': this.schedule.room.name.length >= 10 ? '3.5rem' : '4.5rem',                    
                }
            },
            trackStyle: function() {
                var color = '#ffffff';
                if (this.schedule.state.track &&
                    this.schedule.state.track.color) {
                    color = this.schedule.state.track.color;
                }
                return { 'color': color, 'font-size': this.schedule.room.name.length >= 15 ? '2.5rem' : '2rem' }
            },
            scheduleIsOver: function() {
                return !this.schedule.state.events.curr;
            }
        },
        watch: {
            scheduleIsOver (newValue, oldValue) {
                if(newValue) {
                    this.toggleBodyClass('addClass', 'background-no-events');
                } else {
                this.toggleBodyClass('removeClass', 'background-no-events');
                this.setRandomBackground();
                }
            }
        },
        methods: {
            formatRoomName(name) {
                if (name.match(/^\d/)) {
                    return name.replace(/\s/g, '');
                }
                return name
            },
            setRandomBackground() {
                const el = document.body;
                const random_letter = String.fromCharCode(Math.floor(Math.random() * 4) + 65).toUpperCase();
                const previousBackground = Array.from(el.classList).find(className => className.startsWith('background-'));
                if (previousBackground) {
                    el.classList.remove(previousBackground);
                }
                el.classList.add(`background-${random_letter}`);
            },
            toggleBodyClass(addRemoveClass, className) {
                const el = document.body;
                if (addRemoveClass === 'addClass') {
                    const previousBackground = Array.from(el.classList).find(className => className.startsWith('background-'));
                    el.classList.remove(previousBackground);
                    el.classList.add(className);
                } else {
                el.classList.remove(className);
                }
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
        mounted() {

            if(this.scheduleIsOver) {
                this.toggleBodyClass('addClass', 'background-no-events');
            } else {
                this.toggleBodyClass('removeClass', 'background-no-events');
                this.setRandomBackground();
            }
        },
        components: { Event }
    }

</script>

<style>
    
    #app {
        color: #FFFFFF;
        font-family: "roboto",sans-serif;
        font-weight: 700;
    }

    .background-A {
        background-image: url('assets/images/oif-vancouver/PNG/A/OI_Vancouver-Digital-Signage-WhitLogo-A.png');
    }
    .background-B {
        background-image: url('assets/images/oif-vancouver/PNG/B/OI_Vancouver-Digital-Signage-WhitLogo-B.png');
    }
    .background-C {
        background-image: url('assets/images/oif-vancouver/PNG/C/OI_Vancouver-Digital-Signage-WhitLogo-C.png');
    }
    .background-D {
        background-image: url('assets/images/oif-vancouver/PNG/D/OI_Vancouver-Digital-Signage-WhitLogo-D.png');
    }
    .background-no-events {
        background-image: url('assets/images/infinity-festival/ryot-schedule-background.png');
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

    .header {
        height: 285px;
    }
    
    .track {        
        font-weight: 700;
        color: #FFFFFF;
        font-size: 40px;
        line-height: 47px;        
        letter-spacing: 0.1em;
    }

    .track-image {
        position: absolute;
        width: 311px;
        top: 1540px;
        left: 656px;
    }

    .time {
        font-size: 40px;
        color: #FFFFFF;
        letter-spacing: 0;
    }

    .no-presentations {                
        padding-bottom: 7.5rem !important;
        font-size: 75px;
        line-height: 88px;
        color: #161616;
    }    

</style>
