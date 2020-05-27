<template>
    <div ref="alertBody"
         v-if="!isDone"
         class="ev-alert fixed top-0 right-0 w-5/6 md:w-full max-w-lg transition ease-in-out duration-500 z-1200"
         :class="customClass"
         v-on:mouseenter="()=>{isMouseOver = true}"
         v-on:mouseleave="()=>{isMouseOver = false}"
    >
        <div class="w-full p-2 h-auto rounded shadow-lg text-white opacity-75 hover:opacity-100" :class="getClassesByType" title="close">
            <h4>{{ getTitle }}</h4>
            <p>{{ message }}</p>
            <span @click="setHidden()" class="cursor-pointer absolute top-0 right-0 m-2 ">
                <svg class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                     viewBox="0 0 18 18">
                    <path
                        d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                </svg>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "EvAlert",
        props: {
            type: {
                type: String,
                default: 'success',
                validator: function (value) {
                    return ['success', 'warning', 'error','info'].includes(value);
                }
            },

            title: null,
            /**
             * 노출할 메시지 입니다.
             */
            message: null,
            /**
             * 토글모드는 타이머를 사용하지 않고 클릭해야만 사라집니다.
             */
            toggle: {
                type: Boolean,
                default: false
            },

            /**
             * 입력된 ms 만큼 노출되다가 사라집니다.
             */
            showTime: {
                type: Number,
                default: 3000
            },
            /**
             * 플로팅이 되면 함수가 호출되는 엘리먼트 바로 아래에 표시 됩니다.
             */
            floating: {
                type: Boolean,
                default : false
            }
        },
        data() {
            return {
                showAlert: true,
                customClass: ['invisible'],
                isMouseOver: false,
                timer: 0,
                timerFunction: null,
                isDone: false,
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
                        case 'error' :
                            return '주의';
                    }
                }
                return this.title;
            },
            getClassesByType() {
                if (this.type === 'success') {
                    return ["bg-gray-600"];
                }
                if (this.type === 'warning') {
                    return ["bg-orange-600"]
                }
                if (this.type === 'info') {
                    return ["bg-gray-400"]
                }
                if (this.type === 'error') {
                    return ["bg-red-600"]
                }
            }
        },
        watch: {
            timer(val) {
                if (val >= this.showTime) {
                    if (!this.isMouseOver) {
                        this.setHidden();
                    }
                }
            }
        },
        mounted() {
            this.init();
        },
        destroyed() {
            clearInterval(this.timerFunction);
        },
        methods: {
            init() {
                // 토글모드가 아니라면 타이머를 켭니다.
                if (!this.toggle) {
                    this.timerFunction = setInterval(() => {
                        this.timer = this.timer + 1000;
                    }, 1000);
                }
                // 애니메이션 작동을 위해 시간차를 두고 클래스를 추가합니다.
                setTimeout(() => {
                    this.customClass = ['visible'];
                    if(!this.floating){
                        this.customClass.push('m-8')
                    }else{
                        this.customClass.push('mt-1');
                    }
                }, 100);
            },
            setHidden() {
                this.customClass = this.customClass.filter(item =>{
                    return item !== 'visible';
                });
                this.customClass.push('invisible');

                setTimeout(() => {
                    this.customClass.push('hidden');
                    setTimeout(() => {
                        this.isDone = true;
                        this.closer();
                    }, 1000)
                }, 1000);
                clearInterval(this.timerFunction);
            },
            closer(){
                this.$destroy();
                this.$el.parentNode.removeChild(this.$el);
            }
        }
    }
</script>

<style scoped>
    .visible {
        opacity: 1;
    }

    .invisible {
        opacity: 0;
    }
</style>
