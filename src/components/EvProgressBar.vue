<template>
    <div class="fixed inset-0 bg-gray-400 w-full h-full z-40 background">
        <div class="w-full bg-gray300 h-2">
            <div class="h-full bg-white rounded-r" :style="{width:percentage + '%'}"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "EvProgressBar",
        props: {
            percentage : {
                type:Number,
                required:true
            }
        }
    }
</script>

<style scoped>
 .background {
     background-color: rgba( 51, 51, 51, 0.75 );
 }
</style>
