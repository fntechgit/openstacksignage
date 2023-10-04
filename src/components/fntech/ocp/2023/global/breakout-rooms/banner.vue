<template>
    <div class="container-fluid banner">
        <div class="row align-items-center">
            <div class="col-12">
                <div class="ticker-wrap">
                    <div class="ticker">
                      <div class="ticker__item">{{ banner.content }}</div>
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
        font-size: 4rem;
        line-height: 1.2;
        letter-spacing: 1px;
    }

    @-webkit-keyframes ticker {
        0% {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
            visibility: visible;
        }
        100% {
            -webkit-transform: translate3d(-100%, 0, 0);
            transform: translate3d(-100%, 0, 0);
        }
    }

    @keyframes ticker {
        0% {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
            visibility: visible;
        }
        100% {
            -webkit-transform: translate3d(-100%, 0, 0);
            transform: translate3d(-100%, 0, 0);
        }
    }

    .ticker-wrap {
        position: fixed;
        bottom: 3px;
        width: 100%;
        overflow: hidden;
        height: 6rem;
        padding-left: 100%;
        box-sizing: content-box;
    }

    .ticker-wrap .ticker {
        display: inline-block;
        height: 6rem;
        line-height: 6rem;
        white-space: nowrap;
        padding-right: 100%;
        box-sizing: content-box;
        -webkit-animation-iteration-count: infinite;
        animation-iteration-count: infinite;
        -webkit-animation-timing-function: linear;
        animation-timing-function: linear;
        -webkit-animation-name: ticker;
        animation-name: ticker;
        -webkit-animation-duration: 30s;
        
        animation-duration: 30s;
    }
    .ticker-wrap .ticker__item {
        display: inline-block;
        padding: 0 2rem;
        font-size: 4rem;
        color: #8DC63F;
    }

</style>