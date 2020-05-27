<template>
    <ul class="list-reset m-1" ref="dropMenuItems">
        <li v-if="remoteOptions.length === 0"
            class="p-2 border-t border-gray-200 hover:bg-gray-100 first:border-t-0 flex flex-row flex-wrap active:bg-gray-200 ">
            검색어를 입력하세요.
        </li>
        <li v-else v-for="item in remoteOptions"
            @click="toggleItem(item)"
            class="border-t border-gray-200 hover:bg-gray-100 first:border-t-0 flex flex-row flex-wrap active:bg-gray-200 "
        >
            <span
                    class="select-none cursor-pointer text-gray-800 m-1 ml-2 h-full py-1 px-1"
                    :class=" isSelected(item) ? selectedItemCSS : [] "
            >
                <slot name="option" :item="item">{{ getTag(item) }}</slot>
            </span>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "EvRemoteSelectOptions",
        props: {
            uri: {
                type: String,
                required: true
            },
            labelKey : {
                default : 'name'
            },
            keyword : null
        },
        computed: {
            remoteOptions() {
                return []
            }
        },
        methods: {
            async getRemoteOptions(){
                let res = await axios.get(this.uri + this.keyword);
                this.remoteOptions = res.data.data;
            },
            toggleItem(item) {
                this.$emit('toggle', item);
            },
            getTag(item) {
                if (item && item[this.labelKey])
                    return item[this.labelKey];
                else
                    return item;
            },
            isSelected(item) {

                return this.getValues.filter((i) => {

                    return i[this.$parent.valueKey] === item[this.valueKey];
                }).length > 0 || this.isTraveling(item);
            },
        }
    }
</script>

<style scoped>

</style>
