<template>
    <div ref="fieldWrap" class="flex items-start transition-ease" :class="getWrapClass">
        <div v-if="isShowLabel" :style="getLabelStyle" class="flex justify-center items-start h-full">
            <el-tooltip v-if="hasComment" placement="top" :content="comment">
                <label ref="formFieldLabel" :class="getLabelClass" v-html="label"></label>
            </el-tooltip>
            <label v-else ref="formFieldLabel" :class="getLabelClass" v-html="label"></label>
        </div>
        <div class="relative flex flex-col" :class="getFieldWrapClass">
            <slot :value="getParentValue" :handler="handleInput">
                <div v-if="isValue" class="py-1 px-2 text-right">{{ getParentValue }}</div>
                <component v-else :is="getInputComponent"
                           :name="field"
                           :auto-max="autoMax" :type="getInputType"
                           :value="getParentValue"
                           @input="handleInput"
                           @change="handleChange"
                           @keypress.enter="handleEnterKey"
                           :options="(options) ? options : null"
                           single
                           :before-days="(options && options.beforeDays) ? options.beforeDays : 1"
                           :select-group="options && options.selectGroup"
                           class="w-full"
                           style="min-height: 40px;"
                ></component>
            </slot>
            <div v-for="msg in getErrorMessage" class="p-2 right-0 text-red-600 transition-ease"
                 :class="getErrorMessageCSS">
                {{msg}}
            </div>
        </div>
    </div>
</template>
<script>
    import EvDatepicker from "./EvDatepicker";
    import EvInput from "./EvInput";
    import EvCheckBox from "./EvCheckBox";

    export default {
        name: 'EvFormField',
        components: {EvCheckBox, EvInput, EvDatepicker},
        props: {
            value: null,
            label: null,
            field: null,
            comment: null,
            /**
             * input
             textarea
             checkbox
             radio-group
             select
             datepicker
             date-range
             */
            type: {
                type: String,
                default: 'text'
            },
            labelPosition: {
                default: 'left'
            },
            // 텍스트의 길이에 따라 인풋의 크기가 가변합니다.
            autoMax: {
                default: null
            },
            options: null
        },
        data() {
            return {
                errorMessage: null,
                labelWidth: null,
                animated: null
            }
        },
        computed: {
            isNoLabel() {
                return this.$parent.noLabel;
            },
            getParentValue() {
                if (typeof this.value !== 'undefined') {
                    return this.value;
                }
                if(!this.field){
                    return;
                }
                return this.$parent.getFieldValue(this.field);
            },
            hasSlot() {
                return !!this.$slots.default;
            },
            hasError() {
                return !!this.getErrorMessage;
            },
            getErrorMessage() {

                return this.$parent.getErrors(this.field);
            },
            hasComment() {
                return !!this.getCommentMessage && !this.hasError;
            },
            getCommentMessage() {
                return this.comment;
            },
            getInputType() {
                return this.type ? this.type : 'text';
            },
            isInput() {
                return ['text', 'password', 'number'].includes(this.type);
            },
            isCheckbox() {
                return this.type === 'checkbox'
            },
            getLabelStyle() {
                if (this.isLabelTop) {
                    return {
                        width: '100%',
                        justifyContent : 'start'
                    }
                }
                if (!this.labelWidth) {
                    return {};
                }
                return {width: this.labelWidth, 'flex-shrink': 0}
            },
            getFieldWrapClass() {
                return {'has-error': this.hasError, 'w-full': this.labelWidth}
            },
            getParentWrapClass() {
                if (this.hasError) {
                    return ['items-start']
                } else {
                    return ['items-center']
                }
            },
            getErrorMessageCSS() {
                if (this.hasError) {
                    setTimeout(() => {
                        this.animated = true;
                    }, 10);
                    return (this.animated) ? ['opacity-100'] : ['opacity-0']
                } else {
                    this.animated = false;
                    return ['hidden']
                }
            },
            isValue() {
                return this.type === 'value';
            },
            isDatePicker() {
                return this.type === 'datepicker';
            },
            getWrapClass() {

                if (this.isLabelTop) {
                    return ['flex-col']
                }
                return ['mb-1']
            },
            getLabelClass() {
                let classes = ['text-center', 'block', 'text-main-400','text-sm', 'px-2', 'py-1', 'form-field-label'];
                if (this.isLabelTop) {
                    classes[0] = 'text-left';
                    return classes;
                }
                return classes;
            },
            /**
             *
             * @return boolean
             */
            isLabelTop() {
                return this.$parent.isLabelTop();
            },
            isDateRangePicker() {
                return this.type === 'daterange'
            },
            isShowLabel() {
                if (this.isNoLabel) {
                    return false;
                }
                return typeof this.label !== 'undefined';
            },
            getInputComponent() {

                switch (this.type) {
                    case 'input':
                        return 'ev-input';
                    case 'textarea':
                        return 'ev-textarea';
                    case 'checkbox':
                        return 'ev-check-box';
                    case 'radio-group':
                        return 'ev-radio-group';
                    case 'select':
                        return 'ev-tag-select';
                    case 'datepicker':
                        return 'ev-datepicker';
                    case 'date-range':
                        return 'ev-date-range';
                    default:
                        return 'ev-input';
                }
            }
        },
        methods: {
            clearErrorMessage() {
                this.$parent.clearError(this.field);
            },
            handleInput(v) {
                if(typeof this.field === 'undefined'){
                    return;
                }
                if (typeof this.value !== 'undefined') {
                    this.$emit('input', v);
                }

                this.$parent.setFieldValue(this.field, v);
            },
            setLabelWidth(width) {
                this.labelWidth = (width + 5) + 'px';
            },
            handleChange(v) {
                this.clearErrorMessage();
            },
            handleEnterKey() {

                if(this.$parent.submitHandler && typeof this.$parent.submitHandler === 'function'){
                    this.$parent.submitHandler();
                }
            }
        },
        mounted() {
            this.$parent.alignLabels();
        }
    }
</script>
