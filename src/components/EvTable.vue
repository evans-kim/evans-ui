<template>
    <div class="flex flex-col ev-table-wrap border">
        <ev-form
            v-for="(row, idx) in value"
            :key="idx + _uid"
            class="w-full"
            :value="row" @input="(val)=>{updateRow(val, idx)}" :no-label="idx !== 0" label-top gridable >
            <slot></slot>
        </ev-form>
    </div>
</template>

<script>
    import EvForm from "./EvForm";
    export default {
        name: "EvTable",
        components: {EvForm},
        props: {
            value: {
                default() {
                    return []
                }
            },
            errors: {
                default() {
                    return []
                }
            },
            prefix:null,
            hook: null,
            horizontal: {type: Boolean, default: false},
            labelTop: {type: Boolean, default: false}
        },
        computed: {
            getHeaders() {
                // 슬랏의 수 만큼 컬럼이 있는 것으로 판단
                return this.$slots.default.filter((slot)=>{
                    return slot.tag !== undefined;
                }).map(slot=>{
                    return slot.componentOptions.propsData.label;
                });
            },
            getItems() {
                return this.value;
            }
        },
        methods:{
            alignLabels(){

            },
            setFieldValue(field, value){

            },
            getFieldValue(field){

            },
            getErrors(field){

            },
            clearError(field){

            },
            isLabelTop(){

            },
            updateRow(row, idx) {
                let values = this.value;
                values[idx] = row;
            }
        },
        mounted() {

        }
    }
</script>

<style lang="scss">

    .ev-table-wrap > form > div > div > .form-field-label{
        border-bottom: 1px solid;
    }
    .ev-table-wrap > form > div {
        box-sizing: border-box;
        border-right: 1px solid;
        border-bottom: 1px solid;
        padding:1px;
    }
    .ev-table-wrap > form:first-child{
        border-top: 1px solid;
        border-bottom: none;
    }
    .ev-table-wrap > form{
        border-left: 1px solid;
    }

</style>
