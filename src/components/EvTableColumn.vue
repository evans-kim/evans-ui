<template>
    <div ref="fieldWrap" class="flex transition-ease" :class="getWrapClass">
        <div v-if="isShowLabel" :style="getLabelStyle">
            <label ref="formFieldLabel" :class="getLabelClass">
                {{label}}
            </label>
        </div>
        <div class="relative flex flex-col whitespace-no-wrap" :class="getFieldWrapClass">
            <slot :value="getParentValue" :handler="handleInput">
                <div v-if="isValue" class="py-1 px-2 text-right">{{ getParentValue }}</div>
                <ev-input v-if="isInput" :auto-max="autoMax" :type="getInputType" :value="getParentValue" @input="handleInput"
                          @change="handleChange" class="w-full" :class="getTypeClasses"/>
                <ev-check-box v-if="isCheckbox" :value="getParentValue" @input="handleInput"/>
                <ev-datepicker v-if="isDatePicker" :value="getParentValue" @input="handleInput"
                               class="w-full"></ev-datepicker>
            </slot>
            <div v-for="msg in getErrorMessage" class="p-2 right-0 text-red-600 transition-ease"
                 :class="getErrorMessageCSS">
                {{msg}}
            </div>
            <div v-show="hasComment" class="p-2 right-0 text-gray-600 ">{{getCommentMessage}}</div>

        </div>
    </div>
</template>

<script>
    import EvFormField from "./EvFormField";

    export default {
        name: "EvTableColumn",
        extends: EvFormField
    }
</script>

<style scoped>

</style>
