<template>
    <textarea
        class="py-2 px-4 border border-main-200 focus:outline-none w-full"
        @input="inputHandler"
        @change="changeHandler"
        v-bind="$attrs"
        :value="value"
    ></textarea>
</template>

<script>
    import EvInput from "./EvInput";

    export default {
        name: "EvTextarea",
        extends: EvInput,
        props:{
            value : null
        },
        methods :{
            inputHandler (e) {
                this.$emit('input', e.target.value);
            }
        }
    }
</script>

<style scoped>

</style>
