<template>
    <div class="bg-white flex flex-1 justify-center my-2">
        <span v-show="isRemainLeftPager"
            class="bg-white bg-gray-100 py-2 px-4 cursor-pointer border-l-0 hover:bg-gray-200" @click="goBefore">이전</span>

        <span v-show="isRemainLeftPager"
            class="bg-white bg-gray-100 py-2 px-4 cursor-pointer border-l-0 hover:bg-gray-200">...</span>

        <span v-for="num in getScopedPager"
            class="bg-white bg-gray-100 py-2 px-4 cursor-pointer border-l-0 hover:bg-gray-200"
              :class="getActiveClass(num)"
              @click="setPage(num)">{{num}}</span>

        <span v-show="isRemainRightPager"
              class="bg-white bg-gray-100 py-2 px-4 cursor-pointer border-l-0 hover:bg-gray-200">...</span>

        <span v-show="isRemainRightPager"
              class="bg-white bg-gray-100 py-2 px-4 cursor-pointer hover:bg-gray-200"  @click="goAfter">다음</span>
    </div>
</template>
<script>
    export default {
        name: 'EvPagination',
        props:{
            total : {
                type : Number,
                default : 0
            },
            perPage : {
                type : Number,
                default: 15
            },
            scope:{
                type:Number,
                default : 3
            },
            value:{
                type:Number,
                default : 1
            }
        },
        computed:{
            isRemainLeftPager(){
                return this.getStartPager > 1;
            },
            isRemainRightPager() {
                return this.getLastPager < this.getPageCount;
            },
            getStartPager(){
                return this.value - (this.scope - 1) / 2;
            },
            getLastPager(){
                return this.value + (this.scope - 1) / 2;
            },
            getPageCount(){
                return Math.ceil(this.total / this.perPage)
            },
            getScopedPager(){
                let cnt = 0;
                let pagers = [];
                if(this.getStartPager < 1){
                    while (cnt < this.scope){
                        pagers.push(1 + cnt);
                        cnt++;
                    }
                }else if(this.getLastPager > this.getPageCount){
                    while (cnt < this.scope){
                        pagers.push(this.getPageCount - cnt);
                        cnt++;
                    }
                }else{
                    while (cnt < this.scope){
                        pagers.push(this.getStartPager + cnt);
                        cnt++;
                    }
                }

                return pagers.filter(i=>{
                    return i <= this.getPageCount && i > 0;
                }).sort((a,b)=>{
                    return a - b;
                });
            }
        },
        methods: {
            goBefore() {
                this.$emit('input', this.value - 1);
            },
            goAfter() {
                this.$emit('input', this.value + 1);
            },
            setPage(num) {
                this.$emit('input', num);
            },
            getActiveClass(num) {
                return this.value === num ? ['text-bold', 'bg-gray-600', 'text-white'] : [];
            }
        }
    }
</script>
