<template>
    <div class="bg-white border rounded shadow mt-2 first:mt-0">
        <div class="border-b p-2" v-if="title">
            <slot name="title">
                <h6 class="font-bold uppercase">{{title}}</h6>
            </slot>
        </div>
        <div :class="bodyClasses">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'EvCard',
        props:{
            title : String,
            bodyClasses : null
        }
    }
</script>
