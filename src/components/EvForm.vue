<template>
    <form v-bind="$attrs" :class="getClass">
        <ev-form-field v-for="(error, index) in getParentErrors" :key="index + _uid" label="" class="w-full text-red-600 ">
            {{ error }}
        </ev-form-field>
        <slot></slot>
    </form>
</template>
<script>
    /**
     * 폼의 value 값 중에 단일값이 아니라 object 값이라면 사전에 반드시 정의되어 있어야 합니다.
     *
     */
    import EvFormField from "./EvFormField";
    export default {
        name: 'EvForm',
        components: {EvFormField},
        props: {

            value: {
                default() {
                    return {}
                }
            },
            errors: {
                default() {
                    return {}
                }
            },
            submitHandler:null,
            prefix:null,
            hook: null,
            horizontal: {type: Boolean, default: false},
            labelTop: {type: Boolean, default: false},
            gridable:{type:Boolean, default : false},
            noLabel:{type:Boolean, default:false}
        },
        methods: {
            isLabelTop() {
                return this.labelTop;
            },
            setFieldValue(field, value) {
                if (!this.value || typeof this.value !== 'object') {
                    console.log('undefined model');
                    return null;
                }
                let source = {};
                source[field] = value;
                if (this.value[field] === 'undefined') {
                    this.$set(this.value, field, value);
                }
                this.$emit('input', Object.assign(this.value, source));
                this.clearError(field);
                if (this.hook) {
                    this.hook(field, value, this.value);
                }
            },
            getFieldValue(field) {
                if(typeof field === 'undefined'){
                    return;
                }

                if (typeof this.value[field] === "undefined") {
                    this.$set(this.value, field, '');
                }
                return this.value[field];
            },
            getErrors(field) {

                if (!this.errors || typeof this.errors !== 'object') {
                    return null;
                }
                let fieldName = field;
                if(this.prefix){
                    fieldName = [this.prefix ,fieldName].join('.');
                }

                if (!this.errors[fieldName]) {
                    return null;
                }

                return this.errors[fieldName];
            },
            clearError(field) {
                if (!this.errors || typeof this.errors !== 'object') {
                    return null;
                }
                let fieldName = field;
                if(this.prefix){
                    if (this.errors[this.prefix]) {
                        this.errors[this.prefix] = null;
                    }
                    fieldName = [this.prefix ,fieldName].join('.');

                }
                if (typeof this.errors[fieldName] === 'undefined') {
                    return null;
                }

                this.errors[fieldName] = null;
            },
            /**
             * 폼 안에 폼필드 레이블에 길이값 중에 가장 긴 레이블에 맞춰 width 를 정렬합니다.
             */
            alignLabels() {
                setTimeout(() => {
                    this.$children.map((child) => {
                        if (typeof child.setLabelWidth !== 'function') {
                            return;
                        }
                        child.setLabelWidth(this.getLargestLabelWidth);
                    });
                }, 200);

            }
        },
        computed: {
            getClass() {
                let classes = ['flex', 'flex-row'];

                if (!this.horizontal) {
                    classes.push('content-start');
                }
                if(this.gridable){
                    classes.push('flex-no-wrap');
                }else{
                    classes.push('flex-wrap');
                }
                if(this.getParentErrors){
                    classes.push('bg-red-100');
                }
                return classes;
            },
            getLargestLabelWidth() {
                return Math.max(...this.$children.map((child) => {
                    if (!child.$refs['formFieldLabel']) {
                        return 0;
                    }
                    return child.$refs['formFieldLabel'].clientWidth;
                }));
            },
            getParentErrors() {
                if(!this.prefix){
                    return '';
                }
                if( this.errors[this.prefix] ){
                    return this.errors[this.prefix];
                }
            }
        },
        mounted() {
            this.alignLabels();
        }
    }
</script>
<style scoped lang="scss">
    .full-form-field > div {
        width: 100%;

        > label {
            width: 25% !important;
        }
    }
</style>
