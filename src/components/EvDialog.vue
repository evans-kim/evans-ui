<template>
    <div ref="alertBody"
         v-if="show"
         class="fixed w-5/6 md:w-full max-w-sm transition-ease z-50 rounded"
         style=" top:25%; left: 50%"
         :class="customClass"
    >
        <div class="w-full p-2 h-auto bg-white rounded shadow-lg" title="close" style="margin-left: -50%">
            <h4 class="text-lg" :class="getClassesByType">{{ getTitle }}</h4>
            <slot>
                <p class="py-4">{{content}}</p>
            </slot>
            <div class="flex flex-row justify-end" v-if="!noButtons">
                <ev-button type="plain" @click="setHidden()">Cancel</ev-button>
                <ev-button @click="successEventHandler">OK</ev-button>
            </div>
        </div>
    </div>
</template>

<script>
    import EvButton from "./EvButton";
    export default {
        name: "EvDialog",
        components: {EvButton},
        props: {
            type: {
                type: String,
                default: 'success',
                validator: function (value) {
                    return ['success', 'warning', 'alert','info'].includes(value);
                }
            },
            show : {
                type : Boolean,
                default : false
            },
            title: null,
            content: null,
            noButtons:{
                type : Boolean,
                default : false
            }
        },
        watch:{
            show(val){
                if(val){
                    this.addMask();
                    this.init();
                }else{

                }
            }
        },
        data() {
            return {
                customClass: ['unvisible'],
                successFunction : null,
                isDone: false,
                confirmed: null,
                mask : null
            }
        },
        computed: {
            getTitle() {
                if (!this.title) {
                    switch (this.type) {
                        case 'success':
                            return '성공';
                        case 'warning' :
                            return '주의';
                        case 'info' :
                            return '안내';
                    }
                }
                return this.title;
            },
            getClassesByType() {
                if (this.type === 'success') {
                    return ["text-green-600"];
                }
                if (this.type === 'warning') {
                    return ["text-orange-600"]
                }
                if (this.type === 'info') {
                    return ["text-blue-600"]
                }
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
                    this.setHidden();
                });
                document.body.appendChild(this.mask);
            },
            success(func){
                this.successFunction = func;
            },
            init() {
                // 애니메이션 작동을 위해 시간차를 두고 클래스를 추가합니다.
                setTimeout(() => {
                    this.customClass = ['visible'];
                }, 200);
            },
            setHidden() {
                this.$emit('update:show', false);
                this.mask.style.opacity = 0;
                setTimeout(()=>{
                    this.mask.style.display = 'none';
                    this.mask.remove();
                },500);
                this.customClass = ['unvisible', 'mt-4'];
                setTimeout(() => {
                    this.customClass.push('hidden');
                    setTimeout(() => {

                    }, 1000)
                }, 1000);

            },
            successEventHandler() {
                this.successFunction();
                this.setHidden();
            }
        }
    }
</script>

<style scoped>
    .visible {
        opacity: 1;
    }

    .unvisible {
        opacity: 0;
    }
</style>
