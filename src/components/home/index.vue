<template>
    <div class="homePage">
        <div>公司组织架构图</div>
        <div>
            <v-exportData @exportData="getResult"></v-exportData>
        </div>
        <div>

        </div>
    </div>
</template>

<script>
import XLSX from 'xlsx';
import vExportData from './tools/exportData';
export default {
    name: "homePage",
    data() {
        return {
            msg: "Welcome to Your Vue.js App"
        };
    },
    components: {
        vExportData
    },
    watch:{
        // dataList:{
        //     immediate:true,
        //     handler:function(val){
        //         this.list = val;
        //     }
        // },
    },
    filters:{
    },
    methods: {
        getResult(data) {
            console.log(data);
        },
    },
    computed: {
    },
    mounted() {
    },
    created() {
    },
    destroyed() {
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
