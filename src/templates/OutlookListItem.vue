<template>
    <li class="flex flex-no-wrap items-center hover:bg-blue-500 hover:text-whites border-b first:border-t cursor-pointer p-3"
        :class="activated ? ['bg-blue-500','text-white'] : ['text-gray-800']"
        @click="setActive()"
    >
        <div class="flex justify-center items-center flex-no-shrink w-12 h-12 bg-gray-400 rounded-full font-semibold text-xl text-white mr-3">
            {{ getItem.icon }}
        </div>
        <slot>
            <div class="flex-1 min-w-0">
                <div class="flex justify-between mb-1">
                    <h2 class="font-semibold text-lg">
                        {{ getItem.title }}
                    </h2>
                    <span class="text-sm">
                        <i class="fas fa-clock fa-fw"></i> {{ getItem.created_at }}
                    </span>
                </div>
                <div class="text-sm truncate">
                    <span>
                        {{ getItem.label }}
                    </span>
                </div>
            </div>
        </slot>
    </li>
</template>

<script>
    import ItemMapper from "../plugins/ItemMapper";

    export default {
        name: "OutlookListItem",
        mixins:[ItemMapper],
        props: {
            activated:{
                type: Boolean,
                default: false
            }
        },
        methods: {
            setActive() {
                this.$emit('selected', this.item);
            }
        }
    }
</script>

<style scoped>

</style>
