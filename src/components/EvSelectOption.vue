<template>
    <li @click="toggleItem"
        class="border-t border-gray-200 hover:bg-gray-100 first:border-t-0 flex flex-row flex-wrap active:bg-gray-200 "
    >
        <span class="select-none cursor-pointer text-gray-800 m-1 ml-2 h-full py-1 px-1"
              :class=" isSelected ? selectedItemCSS : [] "
        >
            <slot name="option" :item="item">{{ label }}</slot>
        </span>
    </li>
</template>
<script>
    export default {
        name: 'EvSelectOption',
        props: {
            label: null,
            value : null,
            item: null,
        },
        computed:{
            isSelected(){
                return this.$parent.isSelected(this.getItem);
            },
            selectedItemCSS() {
                return ['rounded', 'bg-gray-200', 'text-bold']
            },
            getItem(){
                if(this.item){
                    return this.item;
                }
                return { value: this.value, label : this.label }
            }
        },
        methods: {
            toggleItem() {
                if(!this.item){
                    this.$parent.toggleItem({ label:this.label, value:this.value});
                    return;
                }
                this.$parent.toggleItem(this.item);
            }
        }
    }
</script>
