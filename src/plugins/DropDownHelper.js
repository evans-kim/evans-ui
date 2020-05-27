export default {
    data(){
        return{
            dropMenuStyle : {}
        }
    },
    computed:{
        getMenu(){
            return this.$refs['dropMenu'];
        },
        getButton(){
            return this.$refs['dropButton'];
        },
        selectedItemCSS() {
            return ['rounded', 'bg-gray-200', 'text-bold']
        }
    },
    methods:{

        isSelected(item) {

            return this.value.filter((i) => {

                return i[this.valueKey] === item[this.valueKey];
            }).length > 0;
        },
        selectItem(item) {

            if(this.single){
                this.hiddenDropDownMenu();
                this.$emit('input', [item]);
            }
            this.getDropMenuStyle();
            this.$emit('input', this.value.concat([item]));
        },
        toggleItem(item) {
            if (this.isSelected(item)) {

                this.unselectItem(item);

            } else {
                this.selectItem(item);
            }
        },
        unselectItem(item) {

            let items = this.value.filter((i) => {
                return i !== item;
            });
            this.$emit('input', items);

            if( this.single ){
                this.showDropDownMenu();
                this.getDropMenuStyle();
            }
        },
        getDropMenuStyle() {

            if(this.getButton){
                setTimeout(()=>{
                    let height = this.getButton.clientHeight;
                    if(!this.getButton.clientHeight){
                        height = 46;
                    }
                    this.dropMenuStyle = {'margin-top': height + "px"};
                },10);
            }
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
        showDropDownMenu(){
            if(this.getMenu.classList.contains('hidden')){
                this.getMenu.classList.remove('hidden')
            }
        },
        hiddenDropDownMenu(){
            if(!this.getMenu.classList.contains('hidden')){
                this.getMenu.classList.add('hidden')
            }
        },
        documentClickEventHandler(e) {

            var target = (e && e.target);
            if ( this.checkParent(target, this.getMenu) ) {
                // 메뉴 안에 있는 타켓은 아무 것도 하지 않습니다.
                return ;
            }
            // 메뉴 밖에 있는 요소 중 버튼이라면 ?!
            if (this.checkParent(target, this.getButton)) {
                // 토글합니다.
                if (this.getMenu.classList.contains("hidden")) {
                    this.getMenu.classList.remove("hidden");
                } else {
                    this.getMenu.classList.add("hidden");
                }

                return ;
            }
            // 버튼외에 다른 요소라면 팝업을 가립니다.
            this.getMenu.classList.add("hidden");

        }
    },
    mounted() {
        this.getDropMenuStyle();
        document.addEventListener('click', this.documentClickEventHandler);
    },
    destroyed() {
        document.removeEventListener('click', this.documentClickEventHandler);
    }
}
