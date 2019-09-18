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
                    'background': 'url(assets/images/FN-All_DAY-1_end-of-session.png) center bottom',
                };
            }
        },
    }

</script>>
