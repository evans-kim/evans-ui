<template>
    <span class="ev-tooltip">
        <span class="ev-tooltip-body">
            <slot></slot>
        </span>
    </span>
</template>

<script>
    export default {
        name: "EvTooltip",
        props:{

        }
    }
</script>

<style scoped>
    .ev-tooltip {
        position: relative;
        display: inline-block;
        border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
    }

    .ev-tooltip .ev-tooltip-body {
        visibility: hidden;
        width: 120px;
        background-color: black;
        color: #fff;
        text-align: center;
        padding: 5px 0;
        border-radius: 6px;
        position: absolute;
        z-index: 1;
    }

    .ev-tooltip:hover > .ev-tooltip-body {
        visibility: visible;
    }

    .ev-tooltip .ev-tooltip-body::after {
        content: " ";
        position: absolute;
        top: 100%; /* At the bottom of the tooltip */
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: black transparent transparent transparent;
    }
</style>
