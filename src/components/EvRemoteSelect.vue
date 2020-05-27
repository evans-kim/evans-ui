<template>
    <div class="relative">
        <div ref="dropButton" class="min-h-40 relative flex flex-1 border border-main-200 bg-white h-full">
            <div class="flex items-center px-4 py-2 text-gray-800 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                     class="fill-current pointer-events-none text-gray-800 w-4 h-4">
                    <path
                        d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                </svg>
            </div>
            <div class="flex flex-wrap justify-start items-center pr-2" >
                <input v-show="isActiveInput" ref="searchInput" v-model="keyword"
                       class="flex-auto focus:outline-none appearance-none self-stretch py-2 w-full text-xs"
                       v-on:input="inputHandler"
                       @keyup.down="startNavigator"
                       @click="clickHandler"
                       :placeholder="placeholder"/>
                <span v-for="val in getValues"
                      @click="toggleItem(val)"
                      class=" my-1 cursor-pointer text-main-300 hover:text-main-200 p-1 truncate ml-1 first:ml-0 text-xs">
                    <slot name="option" :item="val">{{ getTag(val) }}</slot>
                </span>
            </div>

            <input ref="navigator" class="absolute" style="z-index: -1"
                   @keyup.esc="escHandler"
                   @keyup.down="downHandler"
                   @keyup.up="upHandler"
                   @keyup.enter="enterHandler">
        </div>
        <div ref="dropMenu"
             :style="dropMenuStyle"
             class="bg-white border-t rounded shadow-md absolute top-0 min-w-full overflow-auto z-30 hidden text-xs"
        >
            <ul class="list-reset m-1" ref="dropMenuItems">
                <li v-if="remoteOptions.length === 0"
                    class="p-2 border-t border-main-200 hover:bg-mian-100 first:border-t-0 flex flex-row flex-wrap active:bg-gray-200 ">
                    검색어를 입력하세요.
                </li>
                <li v-else v-for="item in remoteOptions"
                    @click="toggleItem(item)"
                    class="border-t border-main-200 hover:bg-gray-100 first:border-t-0 flex flex-row flex-wrap active:bg-gray-200 "
                >
                    <span
                        class="select-none cursor-pointer text-gray-800 m-1 ml-2 h-full py-1 px-1"
                        :class=" getOptionCssClasses(item) "
                    >
                        <slot name="option" :item="item">{{ getTag(item) }}</slot>
                    </span>
                </li>
            </ul>
        </div>
    </div>

</template>

<script>
    import axios from "../plugins/axios"
    import DropDownHelper from "../plugins/DropDownHelper";

    export default {
        name: "EvRemoteSelect",
        mixins: [DropDownHelper],
        props: {
            /**
             * @var value <Object>
             */
            value: null,
            placeholder: {
                type: String,
                default: '검색'
            },
            labelKey: {
                default: 'label'
            },
            valueKey: {
                default: null
            },
            single: {
                type: Boolean,
            },
            focused: {
                type: Boolean,
                default: false
            },
            apiUrl: String,
            minKeyword: {
                default: 3
            },
            defaultOptions:{
                type :Array,
                default(){
                    return [];
                }
            }
        },
        data() {
            return {
                keyword: '',
                remoteOptions: [],
                traveler: {},
                travelerNo: 0,
                isSearching: false,
                mask: null,
                isAdded : false,
            }
        },
        computed: {
            getMenu() {
                return this.$refs['dropMenu'];
            },
            getButton() {
                return this.$refs['dropButton'];
            },
            isActiveInput() {
                if( this.valueKey ){
                    return !this.value;
                }
                if ( this.single ) {
                    return !this.value || !this.hasValue;
                }
                return true;
            },
            hasValue(){
                console.log(this.value);
                if(this.value === null || this.value === ''){
                    return false;
                }

                if( typeof this.value === 'object' && Object.keys(this.value).length === 0 ){
                    return false;
                }

                if( Array.isArray(this.value) && this.value.length === 0 ){
                    return false;
                }

                return true;

            },
            getValues() {

                if(this.valueKey){
                    return this.remoteOptions.filter(item=>{
                        return item[this.valueKey] === this.value
                    })
                }

                if (!this.value) {
                    return [];
                }
                if (this.single && !this.hasValue) {
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
            pushRemoteOption(item){
                if(!this.isAdded){
                    this.remoteOptions.push(item);
                    this.isAdded = true;
                }
            },
            inputHandler(e) {
                this.keyword = e.target.value;
                if(this.minKeyword > this.keyword.length){
                    return;
                }
                this.getRemoteData();
                this.showDropDownMenu();
            },
            isTraveling(item) {
                if(!this.valueKey){
                    return Object.is(this.traveler, item);
                }
                if ( !Object.keys(this.traveler).includes(this.valueKey) || !item[this.valueKey]) {
                    return false;
                }
                return this.traveler[this.valueKey] === item[this.valueKey];
            },
            isSelected(item) {
                if(!this.valueKey){
                    return Object.is(this.value, item);
                }
                return this.getValues.filter((i) => {

                    return i[this.valueKey] === item[this.valueKey];

                }).length > 0;
            },

            unselectItem(item) {
                let items = this.getValues.filter((i) => {
                    return i !== item;
                });
                this.getDropMenuStyle();
                if (this.single) {

                    this.$emit('input', null);
                    setTimeout(()=>{
                        this.showDropDownMenu();
                    },100);
                    return;
                }
                this.$emit('input', items);
            },
            selectItem(item) {

                if (this.single) {
                    this.hiddenDropDownMenu();
                    if( this.valueKey && item && item[this.valueKey]){
                        this.$emit('input', item[this.valueKey])
                    }else{
                        this.$emit('input', item);
                    }
                    this.keyword = '';
                    this.$refs['searchInput'].focus();

                    return;
                }
                this.getDropMenuStyle();
                let args = this.getValues.concat([item]);

                this.$emit('input', args);
            },
            hiddenDropDownMenu() {
                if (!this.getMenu.classList.contains('hidden')) {
                    this.getMenu.classList.add('hidden');
                    if (this.focused) {
                        this.unMask();
                    }
                }
            },
            getTag(item) {

                if (item && typeof this.labelKey === 'string' && item[this.labelKey]){
                    return item[this.labelKey];
                }

                return item;
            },

            async getRemoteData() {
                if (this.isSearching) {

                    return;
                }
                this.isSearching = true;
                this.remoteOptions = [];
                let res = await axios.get(this.apiUrl + this.keyword);
                this.remoteOptions = res.data.data;
                this.isSearching = false;
            },
            clickHandler(e) {

                if (this.focused) {
                    this.makeMask();
                }
                if (this.remoteOptions.length > 0) {

                    this.getDropMenuStyle();

                }

            },
            unMask() {
                this.$refs['input-wrap'].style.zIndex = '';
                this.$refs['input-wrap'].position = 'auto';
                if (this.mask) {
                    this.mask.remove();
                }
                this.mask = null;
            },
            makeMask() {
                if (this.mask) {
                    return;
                }
                this.$refs['input-wrap'].style.zIndex = 10;
                this.$refs['input-wrap'].position = 'relative';

                const div = document.createElement('div');
                div.style.transition = 'all cubic-bezier(0.66, 0.02, 0.12, 1.00) 200ms';
                div.style.backgroundColor = 'black';
                div.style.opacity = 0.5;
                div.style.position = 'fixed';
                div.style.top = 0;
                div.style.left = 0;
                div.style.width = '100vw';
                div.style.height = '100vh';
                div.id = 'temp-mask';
                div.style.zIndex = 5;
                div.addEventListener('click', (e) => {
                    this.unMask();
                });
                document.body.appendChild(div);

                this.mask = div;
            },
            startNavigator(e) {
                if(this.remoteOptions.length === 0){
                    return ;
                }
                e.target.blur();
                this.$refs['navigator'].focus();
                this.downHandler();

            },
            downHandler(e) {
                if (!this.remoteOptions.length) {
                    return;
                }

                if (this.travelerNo < this.remoteOptions.length) {
                    this.travelerNo = this.travelerNo + 1;
                } else {
                    this.travelerNo = this.remoteOptions.length
                }
                this.traveler = this.remoteOptions[this.travelerNo - 1];
            },
            upHandler(e) {
                if (!this.remoteOptions.length) {
                    return;
                }
                if (this.travelerNo === 1) {
                    this.escHandler(e);
                }
                if (this.travelerNo > 1) {
                    this.travelerNo = this.travelerNo - 1;
                } else {
                    this.travelerNo = 1;
                }
                this.traveler = this.remoteOptions[this.travelerNo - 1];
            },
            enterHandler(e) {
                if(!this.traveler){
                    return this.$refs['searchInput'].focus();
                }
                this.selectItem(this.traveler);
                if(this.single){
                    this.traveler = {};
                    this.travelerNo = 0;
                }
            },
            escHandler(e) {
                e.target.blur();
                this.$refs['searchInput'].focus();
                this.travelerNo = 0;
                this.traveler = {};
            },
            getOptionCssClasses(item) {
                let classes = [];
                if( this.isTraveling(item) ){
                    classes.push(['outline-none', 'traveling-outline']);
                }
                if( this.isSelected(item) ){
                   classes.push(['rounded', 'bg-gray-200', 'text-bold']) ;
                }
                return classes;
            }
        },
        mounted() {
            if(this.defaultOptions.length){
                this.remoteOptions = this.defaultOptions;
            }
        }
    }
</script>

<style scoped>
    .traveling-outline{
        box-shadow: 0 0 0 3px #60606036
    }
</style>
