<template>
    <div class="relative">
        <div ref="dropButton" class="relative flex flex-1 bg-gray-200 ">
            <div class="flex items-center px-4 py-2 text-gray-800 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                     class="fill-current pointer-events-none text-gray-800 w-4 h-4">
                    <path
                            d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                </svg>
            </div>
            <div class="flex flex-wrap justify-start items-center pr-2" >
                <input ref="searchInput" v-model="keyword"
                       class="flex-auto focus:outline-none appearance-none bg-gray-200 self-stretch py-2 w-full"
                       v-on:input="inputHandler"
                       :placeholder="placeholder"/>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "EvSearchInput",
        props:{
            value : null,
            placeholder: {type: String, default: '검색하기', required: false}
        },
        data(){
            return {keyword: null}
        },
        computed: {
            getValues() {
                if (!this.value) {
                    return [];
                }
                if (this.single && !this.value.hasOwnProperty(this.valueKey)) {
                    return [];
                }
                if (Array.isArray(this.value)) {
                    return this.value;
                } else {
                    return [this.value];
                }

            }
        },
        methods: {
            selectItem(item) {
                this.$emit('input', item);
            },
            toggleItem(item) {
                if (this.isSelected(item)) {

                    this.unselectItem(item);

                } else {
                    this.selectItem(item);
                }
            },
            unselectItem(item) {
                this.$emit('input', null);
            },
            isSelected(item) {
                return this.value == item;
            },
            inputHandler(val) {
                this.$emit('input', val);
            }
        }
    }
</script>

<style scoped>

</style>
