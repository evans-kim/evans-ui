<template>
    <div class="relative">
        <div class="opacity-50 bg-black absolute w-full h-full z-20" v-if="loading">
            <ev-spinner/>
        </div>
        <ev-input v-on:click="show" placeholder="클릭하세요" class="w-full" :value="value"></ev-input>
        <div ref="finderWrap" class="absolute border border-main-300 shadow-lg hidden z-10" style="min-width: 500px">
            <div class="w-full h-full relative" ref="finder">
                <span class="absolute bg-white border-main-300 border z-20 cursor-pointer" style="
                width: 30px;
                height: 30px;
                text-align: center;
                top: -30px;
                line-height: 28px;
                right: -1px;" @click="hiddenFinder">
                    X
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import EvSpinner from "./EvSpinner";
    import EvInput from "./EvInput";
    export default {
        name: "DaumZipFinder",
        components: {EvSpinner,EvInput},
        props:{
            value:null
        },
        data(){
            return {
                loading : false,
                instance : null
            }
        },
        methods:{
            open(){
                const _this = this;

                this.instance = new daum.Postcode({
                    oncomplete(data){
                        _this.$emit('input', data.zonecode);
                        _this.$emit('selected', data);
                        _this.$refs.finderWrap.classList.add('hidden');
                    }
                });
                daum.postcode.load(()=>{
                    this.instance.embed( this.$refs.finder );
                    this.$refs.finderWrap.classList.remove('hidden');
                });
            },
            show(){
                console.log('dddd');
                if(typeof daum === 'undefined' && !this.loading ) {
                    this.loadScript();
                    return;
                }

                if( !this.instance ){
                    this.open();
                    return;
                }

                this.$refs.finderWrap.classList.remove('hidden');
            },
            hiddenFinder(e)
            {
                this.$refs.finderWrap.classList.add('hidden');
            },
            loadScript(){

                this.loading = true;
                let script = document.createElement('script');
                script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
                script.onload = ()=>{
                    this.open();
                    this.loading = false;
                };
                document.body.appendChild( script );
            }
        }
    }
</script>
