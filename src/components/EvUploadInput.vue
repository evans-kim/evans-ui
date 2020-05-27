<template>
    <label class="my-2 flex flex-row justify-center flex-wrap">
        <span class="text-white bg-gray-500 rounded py-2 px-1 w-full text-center">{{label}}</span>
        <input ref="input" type="file" value="" @change="handleChange" class="hidden">
        <ul>
            <li v-for="(file, idx ) in files" :key="idx">
                {{ file.name }}
            </li>
        </ul>
    </label>
</template>

<script>
    export default {
        name: "EvUploadInput",
        props:{
            label : null,
            value : null,
        },
        data(){
            return {
                files : []
            }
        },
        methods: {
            handleChange(e) {
                this.files = e.target.files;
                this.$emit('input', this.files);
            }
        }
    }
</script>

<style scoped>

</style>
