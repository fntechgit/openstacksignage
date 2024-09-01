<template>
    <div class="event" :class="{ next }">
        <div v-if="next" class="upcoming">
            Upcoming
        </div>
        <div class="name">
            {{ event.title }}
        </div>
        <div v-if="!next && sortedSpeakers.length" class="speakers">
            <div class="speakers-title">
                {{ sortedSpeakers.length === 1 ? 'Speaker' : 'Speakers' }}
            </div>
            <div class="speaker-list">
                <div class="column" v-for="(columnSpeakers, columnIndex) in speakerColumns" :key="columnIndex">
                    <div v-for="(speaker, index) in columnSpeakers" :key="index" class="speaker" :style="{ height: `${maxHeights[index] || 65}px` }">
                        <div class="speaker-name">{{ formatSpeakerName(speaker) }}</div>
                        <div v-if="getSpeakerAffiliation(speaker)" class="speaker-affiliation">{{ getSpeakerAffiliation(speaker) }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="when">
            {{ time(event) }}
        </div>
    </div>
</template>

<script>
export default {
    props: ['event', 'next', 'schedule'],
    computed: {
        sortedSpeakers() {
            if (!this.event.speakers || this.event.speakers.length === 0) {
                return [];
            }

            let validSpeakers = this.event.speakers.filter(speaker => {
                return speaker.first_name && speaker.last_name;
            });
            return validSpeakers.sort((a, b) => {
                const aHasAffiliation = this.hasAffiliation(a);
                const bHasAffiliation = this.hasAffiliation(b);
                return bHasAffiliation - aHasAffiliation;
            });
        },
        speakerColumns() {
            if (!this.sortedSpeakers.length) {
                return [[], []];
            }

            const columns = [];
            const speakersPerColumn = 3;

            this.sortedSpeakers.forEach((speaker, index) => {
                const columnIndex = Math.floor(index / speakersPerColumn) % 2; // Mod 2 for alternating columns
                if (!columns[columnIndex]) {
                    columns[columnIndex] = [];
                }
                columns[columnIndex].push(speaker);
            });

            return columns;
        },
        speakerHeights() {
            if (!this.sortedSpeakers.length) {
                return [];
            }

            const heights = [];

            this.sortedSpeakers.forEach(speaker => {
                if (this.hasAffiliation(speaker)) {
                    heights.push(110);
                } else {
                    heights.push(65);
                }
            });

            return heights;
        },
        maxHeights() {
            if (!this.speakerColumns.length || !this.speakerColumns[0].length) {
                return [];
            }

            const columnHeights = [[], []];
            this.speakerColumns.forEach((column, colIndex) => {
                column.forEach((_, rowIndex) => {
                    columnHeights[colIndex][rowIndex] = this.speakerHeights[this.sortedSpeakers.indexOf(column[rowIndex])] || 0;
                });
            });

            const maxHeights = [];
            columnHeights[0].forEach((height, index) => {
                maxHeights[index] = Math.max(height, columnHeights[1][index] || 0);
            });

            return maxHeights;
        },
        room() {
            return event => event && this.$store.getters.room(event.location_id) || { name: 'N/A' };
        },
        time() {
            return event => event && [
                this.schedule.getDate(event.start_date).format('h:mma'),
                this.schedule.getDate(event.end_date).format('h:mma')
            ].join(' - ') || 'N/A';
        }
    },
    methods: {
        formatSpeakerName(speaker) {
            return `${speaker.first_name} ${speaker.last_name !== '-' ? speaker.last_name : ''}`.trim();
        },
        getSpeakerAffiliation(speaker) {
            if (speaker.company) {
                return speaker.company;
            }
            const activeAffiliation = speaker.affiliations.find(aff => aff.active);
            if (activeAffiliation) {
                return activeAffiliation.name;
            }
            return null;
        },
        hasAffiliation(speaker) {
            return !!(speaker.company || speaker.affiliations.some(aff => aff.active));
        }
    }
}
</script>

<style>
.event {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.name {
    color: #FFF;
    font-family: "Builder Sans";
    font-size: 52px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin-bottom: 28px;
}

.when {
    color: #489FF8;
    font-family: "Builder Sans";
    font-size: 36px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.upcoming {
    display: flex;
    justify-content: flex-start;
    padding-top: 5px;
    padding-bottom: 2px;
    margin-top: 20px;
    margin-bottom: 11px;
    color: #818181;
    font-family: "Builder Extended";
    font-size: 36px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 3.6px;
    text-transform: uppercase;
}

.speakers-title {
    color: #818181;
    font-family: "Builder Extended";
    font-size: 36px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 3.6px;
    text-transform: uppercase;
    margin: 5px 0;
}

.speakers {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

.speaker-list {
    display: flex;
    justify-content: space-between;
    margin-bottom: 13px;
}

.column {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.speaker {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    margin-bottom: 7px;
}

.speaker-name {
    color: #FFF;
    font-family: "Builder Sans";
    font-size: 44px;
    font-style: normal;
    font-weight: 400;
}

.speaker-affiliation {
    color: #818181;
    font-family: "Builder Sans";
    font-size: 40px;
    font-style: normal;
    font-weight: 400;
    margin-top: -15px;
    flex-grow: 1;
}
</style>
