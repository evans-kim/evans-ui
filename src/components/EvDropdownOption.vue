<template>
    <li class="border-t border-gray-200 hover:bg-black first:border-t-0" >
        <span class="whitespace-no-wrap px-4 py-2 block text-gray-900 hover:bg-gray-600 no-underline hover:no-underline cursor-pointer"
              @click="clickHandle">{{ getLabel }}</span>
    </li>
</template>
<script>
    export default {
        name: 'EvDropdownOption',
        props: {
            labelKey : {
                default : 'label'
            },
            handler : {
                type :Function,
                default(){

                }
            },
            item : {
                type : Object,
                default(){
                    return {
                        type : 'text', // divider
                        label : null,
                        value : null,
                        handler : ()=>{}
                    }
                }
            }
        },
        computed: {
            getLabel(){
                return ( this.item[this.labelKey] ) ? this.item[this.labelKey] : this.item.value;
            },
        },
        methods: {
            clickHandle() {
                this.handler(this.item);
            }
        }
    }
</script>
