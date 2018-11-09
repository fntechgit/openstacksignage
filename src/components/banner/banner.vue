<template>
    <div class="container-fluid p-5 banner">
        <div class="row align-items-center">
            <div class="col-2">
                <img src="assets/images/alert.svg" class="img-fluid" style="width: 80%;">
            </div>
            <div class="col-10">
                {{ banner.content }}
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
        background: #FF3333;
        font-weight: bold;
        font-size: 3rem;
        line-height: 1.2;
        letter-spacing: 1px;
        color: white;
    }

</style>
