<template>
    <div class="banner pb-5">
        <div class="pt-5">
            <div class="container-fluid pl-5 pr-5">
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
        position: absolute;
        left: 0;
        top: 40%;
        width: 100%;
        transform: translateY(-40%);
        background: red;
        border-top: 5px solid white;
        border-bottom: 15px solid red;
        padding: 40px 30px;
    }

    .banner h1 {
        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
    }

    .banner .content {
        color: white ;
        font-size: 4.3rem;
    }

</style>
