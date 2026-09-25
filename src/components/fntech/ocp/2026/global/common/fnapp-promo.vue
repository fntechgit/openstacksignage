<template>
    <div class="fnapp-promo">
        <img class="fnapp-card" :src="appleCard" alt="Download FNattendee on the Apple App Store">
        <img class="fnapp-card" :src="googleCard" alt="Download FNattendee on Google Play">
        <div class="fnapp-copy">
            <span class="light">Download the</span>
            <span class="heavy">NEW EVENT APP</span>
            <span class="heavy">FNattendee</span>
            <span class="heavy accent">TODAY!</span>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        // The store cards ship as flat artwork: each one already carries the white
        // panel, the QR and the store wordmark, so the QR stays byte-identical to
        // what design tested. Only the copy beside them is live text.
        appleCard() {
            return 'assets/images/ocp-2026/fnapp/app-store-card.png';
        },
        googleCard() {
            return 'assets/images/ocp-2026/fnapp/google-play-card.png';
        }
    }
}
</script>

<style scoped>
.fnapp-promo {
    position: fixed;
    left: 91px;
    bottom: 177px;
    display: flex;
    align-items: flex-start;
}

.fnapp-card {
    /* Design draws these 130x174 against a 184px track icon. Matched to the
       icon so the two sit on the same row; the artwork is a 4x export, so it
       carries the extra height. */
    width: 137px;
    height: 184px;
    /* The exported artwork is a square white panel; design rounds it. */
    border-radius: 15px;
}

.fnapp-card + .fnapp-card {
    margin-left: 24px;
}

.fnapp-copy {
    display: flex;
    flex-direction: column;
    margin-left: 24px;
    padding-top: 20px;
    font-size: 28px;
    line-height: 1.35;
    letter-spacing: 0.28px;
    color: #FFFFFF;
}

.fnapp-copy .light {
    font-weight: 400;
}

.fnapp-copy .heavy {
    font-weight: 800;
}

.fnapp-copy .accent {
    color: #8DC63F;
}
</style>
