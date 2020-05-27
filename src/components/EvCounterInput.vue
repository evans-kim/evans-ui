<template>
    <div class="flex flex-row justify-between">
        <ev-button
            class="w-1/4"
            style="border-radius: 50% 10% 10% 50%; max-width: 40px;min-width: 36px"
            @click="count(-1)"> -
        </ev-button>
        <input
            ref="evInput"
            :class="getClasses"
            class="w-full px-1"
            v-bind="$attrs"
            v-on:input="inputHandler"
            v-on:change="changeHandler"
        >
        <ev-button
            class="w-1/4"
            style="border-radius: 10% 50% 50% 10%; max-width: 40px; min-width: 36px"
            @click="count(1)"> +
        </ev-button>
    </div>

</template>

<script>
    import EvInput from "./EvInput";
    import EvButton from "./EvButton";

    export default {
        name: "EvCounterInput",
        components: {EvButton},
        extends: EvInput,
        props: {
            min: {
                default: 1
            }
        },
        data(){
            return {
                classes: [
                    "border-gray-200",
                    "appearance-none",
                    "border-1",
                    "h-10",
                    "py-2",
                    "px-1",
                    "text-center",
                    "leading-tight",
                    "focus:outline-none",
                    'transition-ease'
                ],
            }
        },
        methods: {
            count(n) {
                let num = parseInt(this.$refs['evInput'].value);
                num = num + n;
                if (num < this.min) {
                    num = this.min;
                }
                this.$emit('input', num);
            }
        }
    }
</script>

<style scoped>

</style>
