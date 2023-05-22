<template>
    <div class="banner">
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
        font-size: 35px;
        line-height: 41px;
        letter-spacing: 0.01em;
        width: 100%;
        position: fixed;
        bottom: 217px;
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
        width: 100%;
        overflow: hidden;
        height: 82px;
        background-color: #FFFFFF;
        padding-left: 100%;
        box-sizing: content-box;
    }

    .ticker-wrap .ticker {
        display: inline-block;
        height: 82px;
        line-height: 41px;
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
        display: inline-flex;
        align-items: center;
        padding: 0 2rem;
        height: 82px;
        font-size: 35px;
        line-height: 41px;
        text-transform: uppercase;
        color: #000000;
    }

</style>