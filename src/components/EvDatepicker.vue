<!--suppress HtmlFormInputWithoutLabel -->
<template>
    <datepicker ref="picker"
                :input-class="getClasses"
                :value="value"
                :format="format"
                :language="ko"
                :highlighted="getFocusedDates"
                @input="inputHandler"
    ></datepicker>
</template>

<script>
    import Datepicker from 'vuejs-datepicker';
    import {ko} from 'vuejs-datepicker/dist/locale'

    export default {
        name: "EvDatepicker",
        components: {
            Datepicker
        },
        props:{
            value: null,
            format:{
                default:'yyyy-MM-dd'
            },
            timeable : {
                default : false
            }
        },
        data() {
            return {
                /**
                 * moment
                 */
                date:null,
                hour:'',
                min:'',
                calendar : {},
                isChanged: false,
                invalid: false,
                focused : false,
                ko : ko,
            }
        },
        computed: {
            getInputType() {
                return (this.$attrs['type']) ? this.$attrs['type'] : 'text';
            },
            hasErrorField() {
                return this.$parent.hasError;
            },
            getClasses() {
                let mode = 'default';
                if (this.hasErrorField) {
                    mode = 'error';
                }
                let typeClasses = [];
                switch (mode) {
                    case 'default':
                        typeClasses = [
                            "w-full",
                            "border",
                            "border-main-200",
                            "appearance-none",
                            "py-2",
                            "px-4",
                            "leading-tight",
                            "focus:outline-none",
                            "transition-ease",
                            "text-xs",
                            "h-full"
                        ];
                        break;
                    case 'error' :
                        typeClasses = [
                            "bg-red-200",
                            "text-red-700",
                            "focus:bg-red-100",
                            "focus:border-red-300",
                        ];
                        break;
                }
                if (this.$attrs['type'] === 'password') {
                    typeClasses.push('ime-inactive');
                }

                return typeClasses.concat(this.classes);
            },
            picker(){
                return this.$refs['picker']
            },
            getFocusedDates() {
                return { dates: [ (this.value) ? new Date(this.value) : new Date() ]}
            }
        },
        methods: {
            inputHandler(e) {
                this.$emit('input', this.picker.utils.formatDate(e, this.format));
            }
        }
    }
</script>
