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
                    'background': 'url(assets/images/MR1_G001_OCP19R_260919_0000-1230.png)',
                };
            }
        },
    }

</script>>
