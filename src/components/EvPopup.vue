<template>
    <section>
        <div class="popup fixed max-w-full p-0" :class="bgWhite ? 'bg-white' : ''">
            <slot></slot>
        </div>
        <span class="bg-gray-400 opacity-75 inset-0 fixed z-20 close-popup" @click="$emit('close')"></span>
    </section>
</template>

<script>
    export default {
        name: "EvPopup",
        props: {
            width : {
                type:String,
                default:'100%'
            },
            bgWhite : Boolean,
        },
    }
</script>

<style scoped>
    .popup {
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 30;
    }
    .close-popup {
        backdrop-filter: blur(2px);
    }
</style>
