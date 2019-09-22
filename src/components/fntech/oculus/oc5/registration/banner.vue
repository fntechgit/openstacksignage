<template>
    <div class="banner pb-5">
        <div class="pt-5">
            <div class="container-fluid pl-5 pr-5 text-center">
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="content">
                            {{ banner.content }}
                        </h1>
                    </div>
                </div>
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
        height: 1030px;
        position: relative;
        top: 550px;
    }
    .banner h1 {
        font-weight: bold;
        padding: 6rem 0;
        color: #fff;
        font-size: 119px !important;
        font-family: Graphik Semibold;
        font-weight: 700;
    }
    .banner .content {
        font-size: 4.3rem;
    }
    .room-210E .banner .content {
        color: #8ACFE6 ;
    }
    .room-210G .banner .content {
        color: #5E4D80 ;
    }
</style>
