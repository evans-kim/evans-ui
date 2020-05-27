<template>
    <div v-if="isShow"
         class="fixed top-0 left-0 w-full h-full transition-all ease-in-out duration-1000 z-50 rounded overflow-auto"
    >
        <div class="flex relative justify-center items-center w-full h-full transition-all ease-in-out duration-1000 " v-on:click="closeModal">
            <div ref="alertBody">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    import ModalMask from "../plugins/ModalMask";

    export default {
        name: "EvModal",
        mixins:[
            ModalMask
        ],
        props:{
            value : {
                type : Boolean
            }
        },
        watch:{
            isShow(val, old){
                if(val === true){
                    this.addMask();
                }else{
                    this.removeMask();
                }
            }
        },
        computed:{
            isShow(){
                return this.value === true;
            }
        },
        methods:{
            hiddenStepFirst(){
                this.hide();
            },
            hiddenStepSecond(){

            },
            hide() {

                this.$emit('input', false);

            },
            closeModal(e) {
                let target =  e.target;
                let check = this.checkParent(target, this.$refs['alertBody']);
                if ( check ) {
                    // 메뉴 안에 있는 타켓은 아무 것도 하지 않습니다.
                    return ;
                }

                this.hide();
            },
            checkParent(t, elm) {
                while (t.parentNode) {
                    if (t === elm) {
                        return true;
                    }
                    t = t.parentNode;
                }
                return false;
            },
        }
    }
</script>

<style scoped>

</style>
