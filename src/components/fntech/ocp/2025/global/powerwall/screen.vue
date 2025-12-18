<template>
    <div id="powerwall">
        <!-- Top Header Bar -->
        <div class="header-bar">
            <div class="time-section">
                <span class="clock-icon">&#9201;</span>
                <span class="current-time">{{ currentTime }}</span>
            </div>
            <div class="date-banner">
                {{ schedule.state.displayDate }}
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="main-content">
            <!-- Schedule Grid -->
            <div class="schedule-section">
                <table class="schedule-grid" v-if="schedule.timeSlots.length > 0">
                    <thead>
                        <tr class="time-header-row">
                            <th class="room-header">Room</th>
                            <th
                                v-for="(slot, index) in visibleTimeSlots"
                                :key="slot.time"
                                class="time-header"
                                :class="{ 'current-slot': isCurrentSlot(slot) }"
                            >
                                <div class="time-header-content">
                                    {{ formatTimeSlot(slot.time) }}
                                </div>
                                <!-- Progress indicator line -->
                                <div
                                    v-if="isCurrentSlot(slot)"
                                    class="progress-indicator"
                                    :style="{ left: progressPosition + '%' }"
                                ></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="room in schedule.rooms" :key="room.id" class="room-row">
                            <td class="room-name">
                                <span class="room-venue">{{ getVenueName(room.name) }}</span>
                                <span class="room-label">{{ getRoomLabel(room.name) }}</span>
                            </td>
                            <td
                                v-for="slot in visibleTimeSlots"
                                :key="slot.time"
                                class="event-cell"
                                :class="getEventCellClass(room.id, slot)"
                            >
                                <div
                                    v-if="getEvent(room.id, slot.time)"
                                    class="event-content"
                                    :class="{
                                        'current': isEventCurrent(getEvent(room.id, slot.time)),
                                        'past': isEventPast(getEvent(room.id, slot.time))
                                    }"
                                >
                                    <span
                                        v-if="getEventTrack(room.id, slot.time)"
                                        class="track-badge"
                                        :style="getTrackStyle(getEventTrack(room.id, slot.time))"
                                    >{{ getTrackName(getEventTrack(room.id, slot.time)) }}</span>
                                    <span class="event-title">{{ truncateTitle(getEvent(room.id, slot.time).title) }}</span>
                                    <span class="event-id">[{{ getEvent(room.id, slot.time).id }}]</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-else class="no-events">
                    No events scheduled for today
                </div>
            </div>

            <!-- Right Column: Promotional Content -->
            <div class="right-column">
                <!-- Gear Up Section -->
                <div class="promo-section gear-section">
                    <div class="promo-content">
                        <div class="promo-header">Gear Up.</div>
                        <div class="promo-subheader">Go Green.</div>
                        <div class="promo-description">
                            Visit the Gear Store for the latest NVIDIA apparel, electronics, lifestyle items, and more.
                        </div>
                        <div class="promo-location">
                            <div class="location-title">SJCC Level 2</div>
                            <div class="location-hours">Monday, March 17-Thursday, March 20 | 7:00 a.m.-7:00 p.m. PDT</div>
                        </div>
                        <div class="promo-location">
                            <div class="location-title">Gear Store Truck, Cesar Chavez Park</div>
                            <div class="location-hours">Tuesday, March 18 | 4:00 p.m.-9:00 p.m.</div>
                        </div>
                    </div>
                    <div class="promo-image">
                        <qr-code
                            :size="120"
                            color="#ffffff"
                            bg-color="transparent"
                            error-level="L"
                            text="https://2025ocpglobal.fnvirtual.app/a/schedule/"
                        ></qr-code>
                    </div>
                </div>

                <!-- Sponsor Section -->
                <div class="sponsor-section">
                    <div class="sponsor-content">
                        <div class="sponsor-headline">The infrastructure AI demands.</div>
                        <div class="sponsor-headline">The security it requires.</div>
                        <div class="sponsor-cta">Attend our sessions. Visit booth 739.</div>
                        <div class="sponsor-sessions">
                            <div class="sponsor-session">
                                <div class="session-label">In-person</div>
                                <div class="session-title">Build the Future of AI Infrastructure: From Silicon to Secure Systems at Scale</div>
                            </div>
                            <div class="sponsor-session">
                                <div class="session-label">Video on-demand</div>
                                <div class="session-title">Unlock AI's Potential: A Roadmap to Get Started</div>
                            </div>
                        </div>
                    </div>
                    <div class="sponsor-logo">
                        <span class="cisco-logo">cisco</span>
                    </div>
                </div>

                <!-- Theater Talks Section -->
                <div class="theater-section">
                    <div class="theater-header">
                        <span class="theater-icon">&#127916;</span>
                        Theater Talks
                    </div>
                    <div class="theater-items">
                        <div class="theater-item">
                            <div class="theater-meta">
                                <div class="theater-location">Hall 3 Theater</div>
                                <div class="theater-time">2:00 p.m.-2:15 p.m.</div>
                            </div>
                            <div class="theater-title">Accelerating Physics Using Quantum Computing and Synergies With Machine Learning...</div>
                        </div>
                        <div class="theater-item">
                            <div class="theater-meta">
                                <div class="theater-location">Grand Ballroom Theater</div>
                                <div class="theater-time">2:00 p.m.-2:15 p.m.</div>
                            </div>
                            <div class="theater-title">Meta's Llama Ecosystem: Unlocking New Possibilities (Presented by Meta)</div>
                        </div>
                        <div class="theater-item">
                            <div class="theater-meta">
                                <div class="theater-location">Hall 3 Theater</div>
                                <div class="theater-time">2:20 p.m.-2:35 p.m.</div>
                            </div>
                            <div class="theater-title">Developing Solutions for and With BlueField-3: A Network Telemetry for AI Clusters Case...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            maxVisibleSlots: 6
        }
    },
    computed: {
        ...mapGetters({
            schedule: 'schedule'
        }),
        currentTime() {
            if (!this.schedule) return '';
            return this.schedule.getCurrentTime();
        },
        visibleTimeSlots() {
            if (!this.schedule || !this.schedule.timeSlots) return [];

            const now = this.schedule.state.now;
            let currentIndex = 0;

            for (let i = 0; i < this.schedule.timeSlots.length; i++) {
                if (this.schedule.timeSlots[i].unix <= now) {
                    currentIndex = i;
                }
            }

            const startIndex = Math.max(0, currentIndex - 1);
            const endIndex = Math.min(
                this.schedule.timeSlots.length,
                startIndex + this.maxVisibleSlots
            );

            return this.schedule.timeSlots.slice(startIndex, endIndex);
        },
        progressPosition() {
            if (!this.schedule || !this.schedule.state.now) return 0;

            const now = this.schedule.state.now;
            const currentSlot = this.visibleTimeSlots.find(slot => this.isCurrentSlot(slot));

            if (!currentSlot) return 0;

            const slotStart = currentSlot.unix;
            const slotDuration = 30 * 60; // 30 minutes in seconds
            const elapsed = now - slotStart;

            return Math.min(100, Math.max(0, (elapsed / slotDuration) * 100));
        }
    },
    methods: {
        formatTimeSlot(time) {
            return time.replace(/ (am|pm)/i, '');
        },
        getVenueName(roomName) {
            const parts = roomName.split(' ');
            if (parts.length > 1) {
                return parts[0];
            }
            return '';
        },
        getRoomLabel(roomName) {
            const parts = roomName.split(' ');
            if (parts.length > 1) {
                return parts.slice(1).join(' ');
            }
            return roomName;
        },
        getEvent(roomId, slotTime) {
            if (!this.schedule.eventsByRoomAndTime[roomId]) return null;
            const slotData = this.schedule.eventsByRoomAndTime[roomId][slotTime];
            return slotData ? slotData.event : null;
        },
        getEventTrack(roomId, slotTime) {
            const event = this.getEvent(roomId, slotTime);
            return event ? event.track : null;
        },
        getTrackStyle(track) {
            if (!track) return {};
            return {
                backgroundColor: track.color || '#666666',
                color: track.text_color || '#ffffff'
            };
        },
        getTrackName(track) {
            if (!track) return '';
            // Shorten track name for badge
            let name = track.name || '';
            name = name.replace('EW: ', '');
            if (name.length > 20) {
                return name.substring(0, 18) + '...';
            }
            return name;
        },
        getEventCellClass(roomId, slot) {
            const slotData = this.schedule.eventsByRoomAndTime[roomId]?.[slot.time];

            return {
                'has-event': slotData && !!slotData.event,
                'event-start': slotData && slotData.isStart
            };
        },
        isCurrentSlot(slot) {
            if (!this.schedule || !this.schedule.state.now) return false;

            const slotStart = slot.unix;
            const slotEnd = slot.unix + (30 * 60);

            return this.schedule.state.now >= slotStart && this.schedule.state.now < slotEnd;
        },
        isEventCurrent(event) {
            return this.schedule.isEventCurrent(event);
        },
        isEventPast(event) {
            return this.schedule.isEventPast(event);
        },
        truncateTitle(title) {
            const maxLength = 65;
            if (title.length > maxLength) {
                return title.substring(0, maxLength) + '...';
            }
            return title;
        }
    }
}
</script>

<style scoped>
#powerwall {
    display: flex;
    flex-direction: column;
    width: 3840px;
    height: 2160px;
    background-color: rgb(27, 27, 91);
    color: white;
    font-family: "franklin-gothic-urw", sans-serif;
    font-weight: 600;
}

/* Top Header Bar */
.header-bar {
    display: flex;
    align-items: stretch;
    height: 120px;
    flex-shrink: 0;
}

.time-section {
    background-color: #1a472a;
    padding: 0 40px;
    display: flex;
    align-items: center;
    gap: 20px;
    min-width: 320px;
}

.clock-icon {
    font-size: 48px;
    color: #8DC63F;
}

.current-time {
    font-size: 56px;
    font-weight: 700;
    color: white;
}

.date-banner {
    background-color: #8DC63F;
    color: rgb(27, 27, 91);
    font-size: 52px;
    font-weight: 700;
    padding: 0 50px;
    display: flex;
    align-items: center;
    flex: 1;
    overflow: hidden;
}

/* Main Content */
.main-content {
    display: flex;
    flex: 1;
    overflow: hidden;
}

/* Schedule Section */
.schedule-section {
    flex: 1;
    padding: 15px 20px;
    overflow: hidden;
    min-width: 0; /* Allow flex item to shrink below content size */
}

.schedule-grid {
    width: 100%;
    border-collapse: separate;
    border-spacing: 1px;
    table-layout: fixed;
    background-color: rgba(255, 255, 255, 0.2);
}

.schedule-grid th,
.schedule-grid td {
    border: 1px solid rgba(255, 255, 255, 0.3);
    vertical-align: top;
}

.time-header-row {
    height: 70px;
}

.room-header {
    background-color: rgba(0, 0, 0, 0.4);
    font-size: 28px;
    font-weight: 600;
    text-align: left;
    padding: 15px 20px;
    width: 160px;
    min-width: 160px;
}

.time-header {
    background-color: rgba(0, 0, 0, 0.4);
    font-size: 32px;
    font-weight: 600;
    text-align: center;
    padding: 15px 12px;
    position: relative;
}

.time-header-content {
    position: relative;
    z-index: 1;
}

.time-header.current-slot {
    background-color: rgba(0, 0, 0, 0.4);
}

.progress-indicator {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: #8DC63F;
    z-index: 2;
}

.room-row {
    height: auto;
}

.room-name {
    background-color: rgba(0, 0, 0, 0.25);
    padding: 12px 15px;
    width: 160px;
    min-width: 160px;
}

.room-venue {
    display: block;
    font-size: 18px;
    color: #8DC63F;
    font-weight: 600;
    margin-bottom: 2px;
}

.room-label {
    display: block;
    font-size: 22px;
    font-weight: 600;
}

.event-cell {
    background-color: rgb(24, 24, 82);
    padding: 10px 12px;
    vertical-align: top;
    min-height: 120px;
}



.event-content {
    font-size: 18px;
    line-height: 1.3;
}

.event-content.current {
    color: #8DC63F;
}


.track-badge {
    display: inline-block;
    font-size: 14px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 3px;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.event-title {
    display: block;
    margin-bottom: 4px;
}

.event-id {
    display: block;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
}

.no-events {
    font-size: 72px;
    text-align: center;
    padding-top: 200px;
    color: rgba(255, 255, 255, 0.5);
}

/* Right Column */
.right-column {
    width: 700px;
    flex-shrink: 0;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* Gear Up Section */
.promo-section.gear-section {
    background-color: #000000;
    padding: 20px;
    border-radius: 0;
    display: flex;
    gap: 15px;
}

.promo-content {
    flex: 1;
}

.promo-header {
    font-size: 40px;
    font-weight: 700;
    color: #8DC63F;
    line-height: 1;
}

.promo-subheader {
    font-size: 40px;
    font-weight: 700;
    color: #8DC63F;
    margin-bottom: 12px;
    line-height: 1;
}

.promo-description {
    font-size: 16px;
    color: #cccccc;
    margin-bottom: 15px;
    line-height: 1.4;
}

.promo-location {
    margin-bottom: 10px;
}

.location-title {
    font-size: 18px;
    font-weight: 700;
    color: #8DC63F;
}

.location-hours {
    font-size: 14px;
    color: #999999;
}

.promo-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/* Sponsor Section */
.sponsor-section {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    padding: 20px;
    position: relative;
    min-height: 200px;
}

.sponsor-content {
    position: relative;
    z-index: 1;
}

.sponsor-headline {
    font-size: 28px;
    font-weight: 300;
    color: white;
    line-height: 1.2;
}

.sponsor-cta {
    font-size: 16px;
    color: #cccccc;
    margin: 12px 0 15px 0;
}

.sponsor-sessions {
    display: flex;
    gap: 12px;
}

.sponsor-session {
    flex: 1;
    background-color: rgba(0, 0, 0, 0.4);
    padding: 12px;
    border-left: 3px solid #8DC63F;
}

.session-label {
    font-size: 11px;
    color: #8DC63F;
    text-transform: uppercase;
    margin-bottom: 6px;
}

.session-title {
    font-size: 14px;
    color: white;
    line-height: 1.3;
}

.sponsor-logo {
    position: absolute;
    bottom: 15px;
    right: 20px;
}

.cisco-logo {
    font-size: 36px;
    font-weight: 700;
    color: #049fd9;
    font-family: Arial, sans-serif;
}

/* Theater Talks Section */
.theater-section {
    background-color: #1a1a1a;
    padding: 15px;
    flex: 1;
}

.theater-header {
    font-size: 32px;
    font-weight: 700;
    color: white;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.theater-icon {
    font-size: 28px;
}

.theater-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.theater-item {
    padding: 12px;
    background-color: rgba(255, 255, 255, 0.05);
    border-left: 3px solid #8DC63F;
}

.theater-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
}

.theater-location {
    font-size: 18px;
    color: #8DC63F;
    font-weight: 600;
}

.theater-time {
    font-size: 14px;
    color: #888888;
}

.theater-title {
    font-size: 18px;
    color: white;
    line-height: 1.3;
}
</style>
