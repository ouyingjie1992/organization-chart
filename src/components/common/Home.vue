<template>
    <div style="width: 100%;height: 100%">
        <div class="mainWapper">
            <keep-alive>
                <router-view :key="key">  <!--key 这里有个问题，keep-alive 里面的组件保留在内存里的话，key必须不同才行-->
                </router-view>
            </keep-alive>
        </div>

        <div id="lh-loading-manual" class="lh-loading lh-loading-manual" v-show="loadingCount>0">
            <div class="lh-loading-background"></div>
            <div class="loading-gif">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {mapState} from 'vuex';
    export default {
        data(){
            return {
                bindKeys:{
                    d3Page:"1",
                    tablePage:"2",
                },
            }
        },
        components:{
        },
        beforeDestroy () {
        },
        watch:{
        },
        computed: {
            ...mapState(['loadingCount']),
            key() {
                return this.bindKeys[this.$route.name];
            },
        },
        methods: {
        },
        created(){
        },
        mounted() {
        }
    }
</script>
<style scoped lang="less">
</style>
