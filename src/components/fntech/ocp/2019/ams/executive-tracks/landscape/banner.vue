<template>
    <div class="container-fluid">
        <div class="row p-7 banner">
            <div class="col-12 text-left" v-html="banner.content">
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['banner'],
    }

</script>

<style>

    .banner {
        font-size: 3.5rem;
        line-height: 1.18;
        letter-spacing: 1px;
        padding-bottom: 6.5rem !important;
    }

    .banner p {
        padding-bottom: 1.2rem;
    }

</style>