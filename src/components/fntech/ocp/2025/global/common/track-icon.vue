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
export default {
    props: {
        trackId: {
            type: [String, Number],
            required: true
        },
        size: {
            type: Number,
            default: 200
        },
        borderRadius: {
            type: String,
            default: '50%'  // Default to circular
        },
        position: {
            type: Object,
            default: () => ({
                bottom: '10.5rem',
                right: '6rem'
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
            const baseUrl = `https://spaces.fnvirtual.app/OCPGlobalSummitandSymposium2024/Creative/CategoryIconsSigns/${trackId}`;
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