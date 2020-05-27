<template>
    <div ref="alertBody"
         v-if="show"
         class="fixed w-5/6 md:w-full max-w-sm transition-ease z-50 rounded"
         style=" top:25%; left: 50%"
    >
        <div class="w-full h-auto bg-white rounded shadow-lg" title="close" style="margin-left: -50%">
            <div class="overflow-hidden border-t border-b transition-all ease-linear duration-500 flex items-center justify-center h-12 bg-gray-600 text-white relative text-center " :style="{width : process.percent +'%'}">
                <span> {{ process.percent }} %</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "EvProgressDialog",

        data() {
            return {
                display : 0,
                end : false,
                process : {
                    total : 0,
                    done : 0,
                    percent : 0,
                },
                show : false,
                stop : false,
                mask : null
            }
        },
        props: {
            // 순차적 실행 Sequential execution
            items:{
                type: Array
            },
            method:{
                type: Function
            }
        },
        methods: {
            addMask(){
                this.mask = document.createElement('div');

                this.mask.style.backgroundColor = 'black';
                this.mask.style.opacity = 0.5;
                this.mask.style.width = '100vw';
                this.mask.style.height = '100vh';
                this.mask.style.zIndex = 10;
                this.mask.style.position = 'fixed';
                this.mask.style.top = 0;
                this.mask.style.left = 0;
                this.mask.classList.add('transition-ease');
                this.mask.addEventListener('click', ()=>{
                    this.cancel();
                });
                document.body.appendChild(this.mask);
            },
            cancel(){
                this.stop = true;
                this.show = false;
                this.mask.remove();
            },
            /**
             * 프로그래스 바를 표기하면서 데이터를 처리 후 결과를 보냅니다.
             * 반드시 async - await 으로 해야 결과를 받습니다.
             *
             * @returns {Promise<[]>}
             */
            async run(){
                this.addMask();
                this.show = true;

                this.process.done = 0;
                this.process.total = this.items.length;
                this.process.percent = 0;

                let results = [];

                for (let i in this.items){
                    if(this.stop){
                        this.$message.error('취소되었습니다.');
                        this.$emit('done', results);
                        return results;
                    }
                    results[i] = await this.method(this.items[i]);
                    this.process.done = this.process.done + 1;
                    this.process.percent = parseInt(this.process.done / this.process.total * 100);

                }
                await setTimeout(()=>{
                    this.$emit('done', results);
                    this.mask.remove();
                    this.show = false;
                    setTimeout(()=>{
                        this.$destroy();
                    },1000);
                }, 1000);

                return results;
            }
        }
    }
</script>
