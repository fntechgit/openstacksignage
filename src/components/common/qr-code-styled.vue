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
            qrCode: null,
            minTypeNumber: 8, // Minimum typeNumber to ensure consistent size
            currentTypeNumber: 8 // Track the current typeNumber for retry logic
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
        // Approximate capacity check for QR codes (alphanumeric mode)
        getQRCapacity(typeNumber, errorLevel) {
            const capacityTable = {
                1: { L: 25, M: 20, Q: 16, H: 10 },
                2: { L: 47, M: 38, Q: 29, H: 20 },
                3: { L: 77, M: 61, Q: 47, H: 35 },
                4: { L: 114, M: 90, Q: 67, H: 50 },
                5: { L: 154, M: 122, Q: 87, H: 64 },
                6: { L: 195, M: 154, Q: 108, H: 84 },
                7: { L: 224, M: 178, Q: 125, H: 93 },
                8: { L: 279, M: 221, Q: 157, H: 122 },
                9: { L: 335, M: 262, Q: 189, H: 143 },
                10: { L: 395, M: 311, Q: 221, H: 174 },
                11: { L: 468, M: 366, Q: 259, H: 200 },
                12: { L: 535, M: 419, Q: 296, H: 227 },
                13: { L: 619, M: 483, Q: 352, H: 259 },
                14: { L: 667, M: 528, Q: 376, H: 283 },
                15: { L: 758, M: 600, Q: 426, H: 321 },
                16: { L: 854, M: 656, Q: 470, H: 365 },
                17: { L: 938, M: 734, Q: 531, H: 408 },
                18: { L: 1046, M: 816, Q: 574, H: 452 },
                19: { L: 1153, M: 909, Q: 644, H: 493 },
                20: { L: 1249, M: 970, Q: 702, H: 557 },
                21: { L: 1383, M: 1085, Q: 775, H: 611 },
                22: { L: 1520, M: 1156, Q: 876, H: 661 },
                23: { L: 1653, M: 1258, Q: 948, H: 715 },
                24: { L: 1812, M: 1364, Q: 1063, H: 751 },
                25: { L: 1914, M: 1474, Q: 1159, H: 805 },
                26: { L: 2132, M: 1588, Q: 1224, H: 868 },
                27: { L: 2223, M: 1706, Q: 1358, H: 908 },
                28: { L: 2369, M: 1828, Q: 1468, H: 960 },
                29: { L: 2520, M: 1921, Q: 1588, H: 1016 },
                30: { L: 2677, M: 2051, Q: 1718, H: 1080 },
                31: { L: 2840, M: 2185, Q: 1804, H: 1150 },
                32: { L: 3009, M: 2323, Q: 1933, H: 1226 },
                33: { L: 3183, M: 2465, Q: 2085, H: 1307 },
                34: { L: 3351, M: 2611, Q: 2181, H: 1394 },
                35: { L: 3537, M: 2761, Q: 2358, H: 1431 },
                36: { L: 3729, M: 2876, Q: 2473, H: 1530 },
                37: { L: 3927, M: 3034, Q: 2670, H: 1591 },
                38: { L: 4087, M: 3196, Q: 2805, H: 1658 },
                39: { L: 4296, M: 3362, Q: 2949, H: 1774 },
                40: { L: 4445, M: 3532, Q: 3081, H: 1852 }
            }
            
            return capacityTable[typeNumber] && capacityTable[typeNumber][errorLevel] || 0;
        },
        
        findOptimalTypeNumber() {
            const dataLength = this.text.length;
            const errorLevel = this.errorCorrectionLevel;
            
            
            // The capacities in our table are for alphanumeric mode
            // URLs often require byte mode which has lower capacity
            // Multiply by 2.5 as a rough estimate for byte mode encoding
            const estimatedEncodedLength = Math.ceil(dataLength * 2.5);
            
            // Start from minimum and increment until content fits
            for (let typeNumber = this.minTypeNumber; typeNumber <= 40; typeNumber++) {
                const capacity = this.getQRCapacity(typeNumber, errorLevel);
                // Use estimated encoded length instead of raw length
                if (capacity >= estimatedEncodedLength) {
                    return typeNumber;
                }
            }
            
            // If nothing fits, use typeNumber 40 and log warning
            console.warn(`QR Code: Content too large (${dataLength} chars, estimated ${estimatedEncodedLength})! Using maximum typeNumber 40`);
            return 40;
        },
        
        getQROptions() {
            const options = {
                width: this.size,
                height: this.size,
                type: 'svg',
                data: this.text,
                dotsOptions: {
                    color: this.color,
                    type: this.dotsType
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
                    typeNumber: this.findOptimalTypeNumber(), // Dynamically select based on content
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
            // Reset typeNumber search
            this.currentTypeNumber = this.minTypeNumber
            this.tryGenerateQRCode()
        },
        
        tryGenerateQRCode() {
            try {
                const options = this.getQROptions()
                // Override typeNumber with current attempt
                options.qrOptions.typeNumber = this.currentTypeNumber
                
                
                this.qrCode = new QRCodeStyling(options)
                this.qrCode.append(this.$refs.qrCode)
                
                
                // Apply scaling after QR code is generated
                this.$nextTick(() => {
                    this.scaleToFit()
                })
            } catch (error) {
                const errorString = error.toString()
                console.error(`Failed with typeNumber ${this.currentTypeNumber}:`, errorString)
                
                // If it's a capacity error and we haven't reached max, try next typeNumber
                if (errorString.includes('code length overflow') && this.currentTypeNumber < 40) {
                    this.currentTypeNumber++
                    this.$nextTick(() => {
                        this.tryGenerateQRCode()
                    })
                } else {
                    console.error('QR Code generation failed completely:', error)
                    console.error('Text length:', this.text.length)
                    console.error('Error level:', this.errorCorrectionLevel)
                    console.error('Final typeNumber attempted:', this.currentTypeNumber)
                }
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
        
        regenerateQRCode() {
            if (this.$refs.qrCode) {
                this.$refs.qrCode.innerHTML = ''
            }
            this.qrCode = null
            this.$nextTick(() => {
                this.generateQRCode()
            })
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