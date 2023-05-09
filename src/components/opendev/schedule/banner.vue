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
        background: #D31366;
    }

    .banner h1 {
        font-weight: bold;
    }

    .banner .content {
        color: white ;
        font-size: 4.3rem;
    }

</style>
