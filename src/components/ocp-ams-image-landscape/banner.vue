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
                    'height': '1080px',
                    'width' : '1920px', 
                    'background-size': 'cover',
                    'background': 'url('assets/images/1.png') center bottom',
                };
            }
        },
    }

</script>>
