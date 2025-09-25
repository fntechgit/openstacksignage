<template>
    <div class="qr-wrapper" :style="wrapperStyle">
        <div class="qr-container" ref="qrCode"></div>
    </div>
</template>

<script>
import QRCodeStyling from 'qr-code-styling'

export default {
    name: 'QRCodeStyled',
    props: {
        text: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            default: 200
        },
        color: {
            type: String,
            default: '#000000'
        },
        bgColor: {
            type: String,
            default: '#ffffff'
        },
        'bg-color': {
            type: String,
            default: null
        },
        errorLevel: {
            type: String,
            default: 'Q',
            validator: value => ['L', 'M', 'Q', 'H'].includes(value)
        },
        'error-level': {
            type: String,
            default: null,
            validator: value => !value || ['L', 'M', 'Q', 'H'].includes(value)
        },
        image: {
            type: String,
            default: null
        },
        dotsType: {
            type: String,
            default: 'square'
        },
        cornersSquareType: {
            type: String,
            default: 'square'
        },
        cornersDotType: {
            type: String,
            default: 'square'
        }
    },
    data() {
        return {
            qrCode: null
        }
    },
    computed: {
        backgroundColor() {
            return this['bg-color'] || this.bgColor
        },
        errorCorrectionLevel() {
            return this['error-level'] || this.errorLevel
        },
        wrapperStyle() {
            return {
                width: `${this.size}px`,
                height: `${this.size}px`,
                display: 'inline-block',
                overflow: 'hidden'
            }
        }
    },
    mounted() {
        this.generateQRCode()
    },
    watch: {
        text() {
            this.updateQRCode()
        },
        size() {
            this.regenerateQRCode()
        },
        color() {
            this.updateQRCode()
        },
        backgroundColor() {
            this.updateQRCode()
        },
        errorCorrectionLevel() {
            this.updateQRCode()
        },
        image() {
            this.updateQRCode()
        }
    },
    methods: {
        getQROptions() {
            const options = {
                width: this.size,
                height: this.size,
                type: 'svg',
                data: this.text,
                dotsOptions: {
                    color: this.color,
                    type: this.dotsType,
                    // roundSize must be false to prevent QR code size reduction on dense patterns
                    // Without this, dense QR codes become smaller than the specified size
                    // See: https://github.com/kozakdenys/qr-code-styling/issues/255
                    roundSize: false
                },
                backgroundOptions: {
                    color: this.backgroundColor === 'transparent' ? 'rgba(0,0,0,0)' : this.backgroundColor
                },
                cornersSquareOptions: {
                    color: this.color,
                    type: this.cornersSquareType
                },
                cornersDotOptions: {
                    color: this.color,
                    type: this.cornersDotType
                },
                qrOptions: {
                    errorCorrectionLevel: this.errorCorrectionLevel,
                    margin: 0
                }
            }

            // Add image options if image prop is provided
            if (this.image) {
                options.image = this.image
                options.imageOptions = {
                    crossOrigin: 'anonymous',
                    margin: 2,
                    imageSize: this.getImageSize(),
                    hideBackgroundDots: true
                }
            }

            return options
        },
        generateQRCode() {
            try {
                const options = this.getQROptions()
                this.qrCode = new QRCodeStyling(options)
                this.qrCode.append(this.$refs.qrCode)
                
                // Apply scaling after QR code is generated
                this.$nextTick(() => {
                    this.scaleToFit()
                })
            } catch (error) {
                console.error('QR Code generation failed:', error)
            }
        },
        updateQRCode() {
            if (this.qrCode) {
                // Clear existing QR code and regenerate
                this.$refs.qrCode.innerHTML = ''
                this.qrCode = null
                this.generateQRCode()
            }
        },
        
        scaleToFit() {
            const container = this.$refs.qrCode
            const svg = container.querySelector('svg')
            if (!svg) return
            
            // Force the SVG to be exactly our target size
            svg.setAttribute('width', this.size)
            svg.setAttribute('height', this.size)
            svg.style.width = `${this.size}px`
            svg.style.height = `${this.size}px`
            
            // The viewBox should already be set to 400x400 by the library
            // This ensures the content scales to fit our target size
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
        },
        
        getImageSize() {
            // Adjust image size based on error correction level
            // Higher error correction allows for larger logos
            const imageSizeMap = {
                'L': 0.3,  // 30% of QR size
                'M': 0.4,  // 40% of QR size
                'Q': 0.5,  // 50% of QR size
                'H': 0.6   // 60% of QR size
            }
            return imageSizeMap[this.errorCorrectionLevel] || 0.4
        }
    },
    beforeDestroy() {
        if (this.$refs.qrCode) {
            this.$refs.qrCode.innerHTML = ''
        }
    }
}
</script>

<style scoped>
.qr-container {
    overflow: hidden;
}

/* Ensure SVG fills container */
.qr-container >>> svg {
    display: block !important;
}
</style>