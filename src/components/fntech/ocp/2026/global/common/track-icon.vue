<template>
    <img 
        v-if="imageLoaded && !imageError"
        class="track-icon"
        :src="iconUrl"
        :style="iconStyle"
        @error="handleError"
        @load="handleLoad"
    >
</template>

<script>
// Track icons are uploaded per show. The folder mirrors the 2025 one; confirm it
// with whoever loads the artwork before the show, since a wrong name just means
// no icon renders.
const ICON_BASE_URL = 'https://spaces.fnvirtual.app/OCPGlobalSummitandSymposium2026/Creative/CategoryIconsSigns'

export default {
    props: {
        trackId: {
            type: [String, Number],
            required: true
        },
        size: {
            type: Number,
            default: 184
        },
        borderRadius: {
            type: String,
            default: '50%'  // Default to circular
        },
        position: {
            type: Object,
            default: () => ({
                bottom: '177px',
                right: '88px'
            })
        }
    },
    data() {
        return {
            imageLoaded: false,
            imageError: false,
            iconUrl: '',
            attemptedExtensions: []
        }
    },
    computed: {
        iconStyle() {
            return {
                width: `${this.size}px`,
                height: `${this.size}px`,
                borderRadius: this.borderRadius,
                ...this.position
            }
        }
    },
    watch: {
        trackId: {
            immediate: true,
            handler(newTrackId) {
                if (newTrackId) {
                    this.resetState();
                    this.loadTrackIcon(newTrackId);
                }
            }
        }
    },
    methods: {
        resetState() {
            this.imageLoaded = false;
            this.imageError = false;
            this.attemptedExtensions = [];
            this.iconUrl = '';
        },
        loadTrackIcon(trackId) {
            const baseUrl = `${ICON_BASE_URL}/${trackId}`;
            const extensions = ['png', 'jpg'];
            
            this.tryLoadImage(baseUrl, extensions, 0);
        },
        tryLoadImage(baseUrl, extensions, index) {
            if (index >= extensions.length) {
                // All attempts failed, don't show the image
                this.imageError = true;
                console.warn(`Failed to load track icon for ID: ${this.trackId}`);
                return;
            }

            const url = `${baseUrl}.${extensions[index]}`;
            const img = new Image();
            
            img.onload = () => {
                this.iconUrl = url;
                this.imageLoaded = true;
                this.imageError = false;
            };
            
            img.onerror = () => {
                this.attemptedExtensions.push(extensions[index]);
                this.tryLoadImage(baseUrl, extensions, index + 1);
            };
            
            img.src = url;
        },
        handleError() {
            // Additional error handling if the image fails after being set
            this.imageError = true;
            this.imageLoaded = false;
        },
        handleLoad() {
            // Confirm the image has loaded successfully
            this.imageLoaded = true;
            this.imageError = false;
        }
    }
}
</script>

<style scoped>
.track-icon {
    position: fixed;
    object-fit: contain;
}
</style>