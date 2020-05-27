<template>
    <label class="custom-label flex py-1 justify-center items-center">
        <div class="bg-white border border-main-200 w-5 h-5 p-1 flex justify-center items-center">
            <input ref="input" type="checkbox" class="hidden" :value="value" :checked="value" @input="handleChange">
            <svg class="hidden w-4 h-4 text-gray-800 pointer-events-none" viewBox="0 0 172 172">
                <g fill="none" stroke-width="none" stroke-miterlimit="10" font-family="none" font-weight="none"
                   font-size="none" text-anchor="none" style="mix-blend-mode:normal">
                    <path d="M0 172V0h172v172z"/>
                    <path d="M145.433 37.933L64.5 118.8658 33.7337 88.0996l-10.134 10.1341L64.5 139.1341l91.067-91.067z"
                          fill="currentColor" stroke-width="1"/>
                </g>
            </svg>
        </div>
        <span class="select-none">
            <slot name="default"></slot>
        </span>
    </label>
</template>

<script>
    export default {
        name: "EvCheckBox",
        data(){
            return {
                mutate : null
            }
        },
        props:{
            value: null
        },
        mounted(){
            this.$refs['input'].checked = this.value;
        },
        methods: {
            handleChange(e) {
                this.$emit('input', e.target.checked);
            }
        }
    }
</script>

<style scoped>
    .custom-label input:checked + svg {
        display: block !important;
    }
</style>
