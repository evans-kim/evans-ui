<template>
    <div>
        <div class="flex flex-row w-full">
            <ev-datepicker ref="startPicker" :value="localValue.start" @input="updateStart"/>
            <div class="text-2xl"> ~ </div>
            <ev-datepicker ref="endPicker" :value="localValue.end" @input="updateEnd"/>
        </div>
        <ev-radio-group class="mt-2" v-if="selectGroup" name="groups"
            :value="selectedGroup" @input="changeDate" :options="[
            {label:'오늘', value:1},
            {label:'일주일', value:7},
            {label:'15일', value:15},
            {label:'한달', value:30},
            {label:'두달', value:60},
            {label:'1년', value:365},
        ]"></ev-radio-group>
    </div>
</template>

<script>
    import EvDatepicker from "./EvDatepicker";

    export default {
        name: "EvDateRange",
        components: {EvDatepicker},
        props:{
            beforeDays : {
                default : 30
            },
            selectGroup : {
                type:Boolean,
                default : false
            },
            value:null
        },
        watch:{
            value(obj, old){
                if(!obj){
                    return;
                }
                this.localValue = obj;
            }
        },
        methods: {
            updateStart(val) {
                this.localValue.start = val;
                this.$emit('input', this.localValue)
            },
            updateEnd(val) {
                this.localValue.end = val;
                this.$emit('input', this.localValue)
            },
            changeDate(val) {
                this.selectedGroup = val;
                let date = new Date();
                date.setDate( date.getDate() + parseInt(val) );

                let value = this.$refs.startPicker.utils.formatDate(date, this.format);

                this.updateStart(value);
            }
        },
        data() {
            return {
                localValue : {
                    start: '',
                    end : ''
                },
                selectedGroup: null
            }
        },
        mounted() {
            if(this.value){
                this.localValue = this.value
            }
        }
    }
</script>

<style scoped>

</style>
