<template>
    <div class="relative">
        <ul ref="dropButton" class="bg-gray-200 border-0 flex flex-row flex-wrap h-full w-full select-none cursor-pointer">
            <li v-if="!hasValue"
                class="select-none cursor-pointer text-gray-500 m-1 ml-2 h-full py-1 px-2">
                {{ placeholder }}
            </li>
            <li v-else
                class="text-sm shadow select-none hover:bg-gray-200 active:bg-gray-600 text-gray-800 border-gray-400 m-1 rounded ml-1 first:ml-2 border bg-gray-100 py-1 px-2">
                <slot name="result" :item="value">{{ getSelectedTag(value) }}</slot>
            </li>
        </ul>
        <div ref="dropMenu"
             :style="dropMenuStyle"
             class="bg-white border-t rounded shadow-md absolute top-0 right-0 min-w-full overflow-auto z-30 hidden max-h-screen"
        >
            <ul class="list-reset m-1">
                <template v-for="item in options">
                    <ev-select-option :item="item"></ev-select-option>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>
    import EvSelect from "./EvSelect";
    import EvSelectOption from "../controls/EvSelectOption";

    export default {
        name: "TreeSelector",
        components: {EvSelectOption},
        extends : EvSelect
    }
</script>

<style scoped>

</style>
