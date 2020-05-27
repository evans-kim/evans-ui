<template>
    <div @click="toggle"
         class="relative transition-all ease-in-out duration-300 border rounded-full border-gray-200 cursor-pointer w-12 h-6" :class="getStatusClass">
        <span class="absolute left-0 transition-all ease-in-out duration-300 rounded-full border w-4 h-4 border-gray-300 shadow-inner bg-white shadow" :class="getStatusPosition"></span>
    </div>
</template>

<script>
    export default {
        name: "EvSwitch",
        props:{
            value : null
        },
        computed: {
            getStatusClass() {
                if( this.value ){
                    return ['bg-gray-600']
                }else{
                    return ['bg-gray-200']
                }
            },
            getStatusPosition(){
                if( this.value ){
                    return ['switch-on']
                }else{
                    return ['switch-off']
                }
            }
        },
        methods: {
            toggle() {
                if(this.value){
                    this.$emit('input', false);
                }else{
                    this.$emit('input', true);
                }
            }
        }
    }
</script>

<style scoped>
    .switch-on{
        top: 50%;
        transform: translateY(-50%) translateX(150%);

    }
    .switch-off{
        top: 50%;
        transform: translateY(-50%) translateX(20%);
    }
</style>
