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
                    'background': 'url(assets/images/G-01_DAY1_1130-0130.png) center bottom',
                };
            }
        },
    }

</script>>
