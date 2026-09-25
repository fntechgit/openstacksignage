<template>
    <div class="stream-qr">
        <qr-code
            :size="150"
            color="#ffffff"
            bg-color="transparent"
            error-level="M"
            :text="url"
        ></qr-code>
        <div class="stream-qr-copy">
            <div class="scan-to">Scan to</div>
            <div class="action">Watch session stream now</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        url: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>
.stream-qr {
    display: flex;
    align-items: flex-start;
}

.stream-qr-copy {
    width: 159px;
    margin-left: 19px;
    color: #F5F5F5;
    letter-spacing: 0.28px;
}

.stream-qr-copy .scan-to {
    font-size: 24px;
    font-weight: 400;
    line-height: 1.15;
    color: #FFFFFF;
}

.stream-qr-copy .action {
    font-size: 27px;
    font-weight: 700;
    line-height: 1.22;
    text-transform: uppercase;
}
</style>
