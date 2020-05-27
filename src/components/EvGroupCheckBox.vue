<template>
    <div class="flex">
        <label class="flex py-1 first:ml-0 ml-2" v-for="option in options">
            <div class="bg-white border w-6 h-6 p-1 flex justify-center items-center mr-2">
                <input ref="input" type="checkbox" class="hidden" :value="option" :checked="isChecked(option)" @input="checkHandler">
                <svg v-show="isChecked(option)" class="w-4 h-4 text-gray-800 pointer-events-none" viewBox="0 0 172 172">
                    <g fill="none" stroke-width="none" stroke-miterlimit="10" font-family="none" font-weight="none"
                       font-size="none" text-anchor="none" style="mix-blend-mode:normal">
                        <path d="M0 172V0h172v172z"/>
                        <path d="M145.433 37.933L64.5 118.8658 33.7337 88.0996l-10.134 10.1341L64.5 139.1341l91.067-91.067z"
                              fill="currentColor" stroke-width="1"/>
                    </g>
                </svg>
            </div>
            <span class="select-none mr-2 ">
                <slot name="default">{{option}}</slot>
            </span>
        </label>
    </div>
</template>

<script>
    import EvCheckBox from "./EvCheckBox";

    export default {
        name: "EvGroupCheckBox",
        components: {EvCheckBox},
        props: {
            value: {
                required : true
            },
            options: {
                default() {
                    return [];
                }
            }
        },
        computed : {
            serialized(){
                return typeof this.value === 'string';
            },
            selections(){
                if( !this.value ){
                    return [];
                }

                if( Array.isArray(this.value )){
                    return this.value;
                }

                return this.value.split(',');
            }
        },
        data() {
            return {
                mutates : {}
            }
        },
        methods: {
            checkHandler(e) {
                let selections = [];
                let checkValue = e.target.value;

                if(!this.selections.includes(checkValue)){
                    this.selections.push(e.target.value);
                    selections = this.selections;
                }else{
                    selections = this.selections.filter( (value, index)=>{
                        return checkValue !== value;
                    });
                }
                if(this.serialized){
                    this.$emit('input', selections.join(','));
                }else{
                    this.$emit('input', selections);
                }
            },
            isChecked(option) {
                return this.selections.includes(option);
            }
        }
    }
</script>

<style scoped>
    .custom-label input:checked + svg {
        display: block !important;
    }
</style>
