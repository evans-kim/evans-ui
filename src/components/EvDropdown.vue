<template>
    <div class="relative text-sm">
        <button ref="dropButton" class="flex items-center focus:outline-none mx-auto">
            <img v-if="hasIcon" class="w-8 h-8 rounded-full mr-4" :src="iconUrl" alt="Avatar of User">
            <span class="hidden md:inline-block">
            <slot name="default"></slot>
        </span>
            <svg class="pl-2 h-2" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 129 129"
                 enable-background="new 0 0 129 129">
                <g>
                    <path
                        d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z"/>
                </g>
            </svg>
        </button>
        <div ref="dropMenu"
             class="bg-white rounded shadow-md mt-2 absolute mt-12 top-0 right-0 min-w-full overflow-auto z-30 invisible">
            <ul class="list-reset m-1">
                <slot name="drop-option" :menu="this">
                    <EvDropdownOption v-for="(item, index) in getOptions" :key="index" :item="item"/>
                </slot>
            </ul>
        </div>
    </div>
</template>
<script>
    import EvDropdownOption from "./EvDropdownOption";

    export default {
        name: 'EvDropdown',
        components: {EvDropdownOption},
        props: {
            iconUrl: null,
            options:{
                type : Array,
                default(){
                    return [];
                }
            }
        },
        computed: {
            hasIcon() {
                return !!this.iconUrl;
            },
            getOptions() {
                return this.options;
            }
        },
        methods: {
            checkParent(t, elm) {
                while (t.parentNode) {
                    if (t === elm) {
                        return true;
                    }
                    t = t.parentNode;
                }
                return false;
            },
            hideOptions(){
                this.$refs['dropMenu'].classList.add("invisible");
            },
            documentClickEventHandler(e) {
                var target = (e && e.target) || (event && event.srcElement);
                let dropButton = this.$refs['dropButton'];
                let dropMenu = this.$refs['dropMenu'];
                //User Menu
                if (!this.checkParent(target, dropMenu)) {
                    // click NOT on the menu
                    if (this.checkParent(target, dropButton)) {
                        // click on the link
                        if (dropMenu.classList.contains("invisible")) {
                            dropMenu.classList.remove("invisible");
                        } else {
                            dropMenu.classList.add("invisible");
                        }
                    } else {
                        // click both outside link and outside menu, hide menu
                        dropMenu.classList.add("invisible");
                    }
                }

            }

        },
        mounted() {
            document.addEventListener('click', this.documentClickEventHandler);
        },
        destroyed() {
            document.removeEventListener('click', this.documentClickEventHandler);
        }
    }
</script>
