<template>
    <div class="bg-white shadow">
        <div class="flex content-between h-full">
            <div ref="aside" v-show="visibleAside" class="transition-ease flex flex-wrap items-start content-start w-1/3 h-full">
                <div class="flex flex-shrink justify-between self-start items-center w-full px-2 py-4">
                    <input ref="searchInput" v-model="keyword"
                           class="flex-auto appearance-none bg-gray-200 text-sm rounded px-4 py-2"
                           placeholder="Search"/>
                </div>
                <slot name="button-group"></slot>
                <ul class="flex flex-col w-full list-reset select-none relative">
                    <li v-if="getItemList.length === 0">
                        <div class="text-center font-bold text-lg ">
                            데이터가 없습니다.
                        </div>
                    </li>
                    <li v-for="item in getItemList"
                        class="flex flex-no-wrap items-center hover:bg-blue-500 hover:text-whites border-b first:border-t cursor-pointer p-3"
                        :class="isActive(item) ? ['bg-blue-500','text-white'] : ['text-gray-800']"
                        @click="setActiveData(item)"
                    >
                        <div
                            class="flex justify-center items-center flex-no-shrink w-12 h-12 bg-gray-400 rounded-full font-semibold text-xl text-white mr-3">
                            {{ getItem(item).icon }}
                        </div>

                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between mb-1">
                                <h2 class="font-semibold text-lg">
                                    {{ getItem(item).title }}
                                </h2>
                                <span class="text-sm">
                                    <i class="fas fa-clock fa-fw"></i> {{ getItem(item).created_at }}
                                </span>
                            </div>
                            <div class="text-sm truncate">
                                {{ getItem(item).label }}
                            </div>
                        </div>
                    </li>
                </ul>
                <ev-pagination :total="getTotal" :value="getPage" @input="setPage" :per-page="getPerPage" ></ev-pagination>
            </div>
            <div ref="main" class="content-start flex flex-col flex-wrap items-start w-2/3 border-l relative">
                <span
                    @click="()=>{ (visibleAside) ? hideAside() : showAside() }"
                    style="left: 0px; top: 4px"
                    class="absolute w-5 h-5 rounded-r-full bg-gray-600 text-white cursor-pointer text-center flex items-center justify-center ">
                    <i v-if="visibleAside" class="fa fa-angle-left"></i>
                    <i v-else class="fa fa-angle-right"></i>
                </span>
                <div class="flex justify-between items-center w-full border-b"
                     style="min-height: 69px">

                    <slot name="header-active">
                        <div class="flex-auto py-2 px-6">
                            <h2 class="font-bold" style="font-size: 1.2rem">
                                {{ selectedItem.title }}
                            </h2>
                            <span class="text-grey-dark text-sm">
                            {{ selectedItem.label }}
                        </span>
                        </div>
                    </slot>

                    <ul class="flex py-2 px-4">
                        <li class="pl-4">
                            <slot name="header-menu">
                                <ev-button @click="addBlankRow" class="w-12 h-12 rounded-full">
                                    <i class="fa fa-plus "></i>
                                </ev-button>
                            </slot>
                        </li>
                    </ul>
                </div>
                <div class="w-full md:py-2 md:px-4">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import EvInput from "../components/EvInput";
    import OutlookListItem from "./OutlookListItem";
    import ItemMapper from "../plugins/ItemMapper";
    import EvPagination from "../components/EvPagination";
    import EvButton from "../components/EvButton";

    export default {
        name: "OutlookTemplate",
        components: {EvButton, EvPagination, OutlookListItem, EvInput},
        mixins: [ItemMapper],
        props: {
            items: {
                type: Array
            },
            selectedItem : {
                type:Object,
                default(){
                    return {};
                }
            }
        },
        data() {
            return {
                keyword: null,
                visibleAside: true
            }
        },
        computed: {
            getItemList() {
                if (this.keyword) {
                    return this.items.filter((item) => {
                        let tester = new RegExp(this.keyword, "i");
                        return tester.test([item.title, item.label].join(','));
                    })
                }
                return this.items;
            },
            getTotal() {

                return this.$parent.$data.total
            },
            getPage() {
                return this.$parent.$data.page;
            },
            getPerPage() {
                return this.$parent.$data.perPage;
            }
        },
        methods: {
            isActive(item) {
                return this.selectedItem.title === item.title;
            },
            setActiveData(item) {

                this.$emit('selected', item);
            },
            setPage(page) {
                this.$parent.$data.page = page;
                this.$parent.setPage(page);
            },
            hideAside() {
                this.$refs['aside'].classList.add('aside-hide');
                this.$refs['main'].classList.add('full-main');
                setTimeout(()=>{
                    this.visibleAside = false;
                }, 500);
            },
            showAside(){
                this.visibleAside = true;
                this.$refs['aside'].classList.remove('aside-hide');
                this.$refs['main'].classList.remove('full-main');
            },
            addBlankRow() {
                if( this.items[0] ){
                    let temp = {};
                    let keys = Object.keys(this.items[0]);
                    for (let i = 0; i < keys; i++) {
                        if(Array.isArray(keys[i])){
                            temp[keys[i]] = [];
                            continue;
                        }
                        if(typeof keys === 'object'){
                            temp[keys[i]] = {};
                            continue;
                        }
                        temp[keys[i]] = '';
                    }
                    this.items.unshift(temp);
                    this.setActiveData(temp);
                    this.$emit('update:items', this.items);
                }
            }
        }
    }
</script>
<style scoped>
    .aside-hide{
        width: 0 !important;
        border: none !important;
        overflow: hidden !important;
    }
    .full-main{
        width: 100% !important;
        border-left: none;
    }
</style>
