<template>
    <div v-bind:style="style">
    </div>
</template>

<script>

    export default {
        props: ['banner'],
        computed: {
            style: function() {
                return {
                    'min-height': '100vh',
                    'height': '1920px',
                    'width' : '1080px', 
                    'background-size': 'cover',
                    'background': 'url(assets/images/MR4_G101_OCP19R_250919_0000-270919_2400.png) center bottom',
                };
            }
        },
    }

</script>>
