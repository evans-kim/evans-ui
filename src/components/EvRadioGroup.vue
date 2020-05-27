<template>
    <div class="flex items-center flex-wrap">
        <label class="py-2 px-4 first:ml-0 ml-1 text-xs cursor-pointer" :class="getActiveClass(option)" v-for="option in options">
            <input type="radio" :name="name" :value="getValue(option)" @input="inputHandler" class="hidden"> {{getLabel(option)}}
        </label>
    </div>
</template>

<script>
    export default {
        name: "EvRadioGroup",
        props: {
            name: {required:true},
            value : null,
            options: {
                required:true,
                default(){ return [] }
            },
            valueKey: {
                default : 'value'
            },
            labelKey: {
                default : 'label'
            }
        },
        methods: {
            getValue(option) {
                if (typeof option === 'object') {
                    return option[this.valueKey];
                }
                return option;
            },
            getActiveClass(option){
                if( this.isActive(option) ){
                    return ['bg-gray-600' ,'text-white']
                }else{
                    return ['bg-white','border', 'text-black','border-main-200']
                }
            },
            isActive(option) {
                if (typeof option === 'object') {
                    return option[this.valueKey] == this.value;
                }
                return option == this.value;
            },
            getLabel(option) {
                if (typeof option === 'object') {
                    return option[this.labelKey];
                }
                return option;
            },
            inputHandler(e) {

                this.$emit('input', e.target.value);
            }
        }
    }
</script>

<style scoped>

</style>
