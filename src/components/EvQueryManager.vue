<!--suppress ALL -->
<template>
    <div class="relative">
        <div ref="dropButton" class="relative flex flex-1 bg-white border border-main-200 ">
            <div class="flex items-center px-4 py-2 text-gray-800 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                     class="fill-current pointer-events-none text-gray-800 w-4 h-4">
                    <path
                        d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                </svg>
            </div>
            <div class="flex flex-wrap justify-start items-center pr-2 relative" >
                <span v-for="val in getValues"
                      @click="unselectQueryType(val)"
                      class=" my-1 rounded shadow bg-gray-100 cursor-pointer hover:text-white p-1 truncate ml-1">
                    <slot name="option" :item="val">{{ getTag(val) }}</slot>
                </span>
                <span v-if="selectedQueryType.field"
                      class=" my-1 rounded shadow bg-gray-100 cursor-pointer  p-1 truncate ml-1">
                    {{ selectedQueryType.label }} :
                    <input ref="queryValueInput"
                           class="bg-transparent outline-none"
                           type="text"
                           v-model="selectedQueryType.value"
                           @keydown.enter="updateQuery"
                           @blur="updateQuery"
                           @keydown.esc="cancelQuery"
                           @keyup.down="startNavigator"
                    ></input>
                </span>
                <input v-else ref="searchInput"
                       class=" ml-2 flex-auto focus:outline-none appearance-none bg-white self-stretch py-2"
                       @keyup.down="startNavigator"
                       @click="clickHandler"
                       :placeholder="placeholder"
                       style="max-height: 38px"
                />
                <div ref="dropMenu"
                     :style="dropMenuStyle"
                     class="bg-white border-t rounded shadow-md absolute top-0 min-w-full overflow-auto z-30 hidden"
                >
                    <ul class="list-reset m-1" ref="dropMenuItems">
                        <li v-for="item in queryTypes"
                            @click="selectQueryType(item)"
                            class="border-t border-gray-200 hover:bg-gray-100 first:border-t-0 flex flex-row flex-wrap active:bg-gray-200 "
                        >
                    <span
                            class="select-none cursor-pointer text-gray-800 m-1 ml-2 h-full py-1 px-1"
                            :class=" getOptionCssClasses(item) "
                    >
                        <slot name="query-option" :item="item">{{ item[labelKey] }}</slot>
                    </span>
                        </li>
                    </ul>
                </div>
            </div>

            <input ref="navigator" class="absolute" style="z-index: -1"
                   @keyup.esc="escHandler"
                   @keyup.down="downHandler"
                   @keyup.up="upHandler"
                   @keyup.enter="enterHandler">
        </div>

    </div>

</template>

<script>

    import DropDownHelper from "../plugins/DropDownHelper";

    export default {
        name: "EvQueryManager",
        mixins: [DropDownHelper],
        props: {
            value: null,
            placeholder: {
                type: String,
                default: 'Search...'
            },
            defaultedOption:{
                type: Object
            },
            labelKey: {
                default: 'label'
            },
            valueKey: {
                default : 'value'
            },
            fieldKey: {
                default : 'field'
            },
            queryOption: {
                type : Object,
                default(){
                    return {}
                },
            }
        },
        data() {
            return {
                keyword: '',
                traveler: {},
                travelerNo: 0,
                isSearching: false,
                mask: null,
                selectedQueryType: {
                    field : '',
                    label : '',
                    value : null
                },
                mutators: []
            }
        },
        computed: {
            queryTypes(){
                return Object.keys(this.queryOption).map(field=>{
                    return { field : field , label : this.queryOption[field]  };
                });
            },
            getMenu() {
                return this.$refs['dropMenu'];
            },
            getButton() {
                return this.$refs['dropButton'];
            },
            isActiveInput() {

                return true;
            },
            getValues() {
                if (!this.value) {
                    return [];
                }

                this.updateMutators();

                return this.mutators;
            },
            getDefaultQueryType(){
                if(!this.defaultedOption){
                    return null;
                }

                this.mutators.filter((m)=>{
                    return m.field === this.defaultedOption
                })
            }
        },
        methods: {
            updateMutators(){
                this.mutators = Object.keys(this.value).map(key=>{
                    if( !this.queryOption.hasOwnProperty(key) || !this.value[key] ){
                        return false;
                    }
                    if(this.selectedQueryType.field && this.selectedQueryType.field === key ){
                        this.setDefaultSelectedQuerytype();
                    }
                    let item = {};
                    item['field'] = key;
                    item['value'] = this.value[key];
                    item['label'] = this.queryOption[key];

                    return item;
                }).filter( it => {
                    return it;
                });
            },
            isTraveling(item) {
                if ( !this.traveler[this.fieldKey] || !item[this.fieldKey]) {
                    return false;
                }
                return this.traveler[this.fieldKey] === item[this.fieldKey];
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
                if (item && item[this.labelKey])
                    return item[this.labelKey]+":"+item[this.valueKey];
                else
                    return item;
            },
            downHandler(e) {
                if (!this.queryTypes.length) {
                    return;
                }

                if (this.travelerNo < this.queryTypes.length) {
                    this.travelerNo = this.travelerNo + 1;
                } else {
                    this.travelerNo = this.queryTypes.length
                }
                this.traveler = this.queryTypes[this.travelerNo - 1];
            },
            upHandler(e) {
                if (!this.queryTypes.length) {
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
                this.traveler = this.queryTypes[this.travelerNo - 1];
            },
            enterHandler(e) {
                if(!this.traveler){
                    return this.$refs['searchInput'].focus();
                }
                this.selectQueryType(this.traveler);
            },
            clickHandler(e) {

                if (this.queryTypes.length > 0) {

                    this.getDropMenuStyle();

                }

            },
            startNavigator(e) {
                if(this.queryTypes.length === 0){
                    return ;
                }
                e.target.blur();
                this.$refs['navigator'].focus();
                this.downHandler();

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
                return classes;
            },
            selectQueryType(item) {
                if( !item.value ){
                    item.value = '';
                }
                this.selectedQueryType = item ;

                this.travelerNo = 0;
                this.traveler = {};

                this.hiddenDropDownMenu();


                this.$nextTick(()=>{
                    if(this.selectedQueryType.field){
                        this.$refs['queryValueInput'].focus();
                    }
                });


            },
            updateQuery() {
                let value = this.value;

                if( value[this.selectedQueryType.field] ){
                    value[this.selectedQueryType.field] = this.selectedQueryType.value;
                }else{
                    this.$set(value, this.selectedQueryType.field, this.selectedQueryType.value);
                }

                this.$emit('input', value);

                this.cancelQuery();
                this.hiddenDropDownMenu();
            },
            setDefaultSelectedQuerytype(){
                this.selectedQueryType = {
                    field : '',
                    label : '',
                    value : null
                }
            },
            cancelQuery() {
                this.setDefaultSelectedQuerytype();
                this.showDropDownMenu();
            },
            unselectQueryType(val) {
                let value = this.value;
                if( value[val.field] ){
                    delete value[val.field];
                }
                this.$emit('input', value);

                this.$nextTick(()=>{
                    this.updateMutators();
                });
            }
        },
        mounted() {
            if(this.defaultedOption && this.getValues.length === 0){
                this.selectedQueryType = Object.keys(this.defaultedOption).map(key=>{
                    return {
                        field : key,
                        label : this.defaultedOption[key],
                        value : ''
                    }
                })[0];
            }
        }
    }
</script>

<style scoped>
    .traveling-outline{
        box-shadow: 0 0 0 3px #60606036
    }
</style>
