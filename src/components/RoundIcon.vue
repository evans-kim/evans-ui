<template>
    <div class="flex justify-center items-center flex-no-shrink w-12 h-12 bg-gray-400 rounded-full font-semibold text-xl text-white mr-3">
        <slot>{{ title }}</slot>
    </div>
</template>

<script>
    export default {
        name: "RoundIcon",
        props:{
            title:null
        }
    }
</script>

<style scoped>

</style>
