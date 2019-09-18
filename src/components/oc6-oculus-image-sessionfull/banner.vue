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
                    'background': 'url(assets/images/oc6-oculus/OC6_FNSIGN_Bkgd-sessionfull.png) center bottom',
                };
            }
        },
    }

</script>>
