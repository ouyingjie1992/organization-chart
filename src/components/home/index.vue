<template>
    <div class="homePage">
        <div class="title">公司组织架构图</div>
        <div class="content">
            <div class="fnBtns">
                <a class="sin-btn" href="static/temp/组织架构图模版.xlsx" download="组织架构图模版">下载模版</a>
                <v-exportData @postData="getResult"></v-exportData>
            </div>
            <div>成功导入 {{total}} 条数据</div>
            <div class="organization-chart">
                <v-chart :data="resultData"></v-chart>
            </div>
        </div>
    </div>
</template>

<script>
import XLSX from 'xlsx';
import vExportData from './tools/exportData';
import vChart from './tools/organizationChart';
export default {
    name: "homePage",
    data() {
        return {
            resultData: {}, // Excel导入结果
            total: 0, //成功导入多少条数据
        };
    },
    components: {
        vExportData, vChart
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
        getResult(result) {
            this.resultData = result.data||[];
            this.total = result.total;
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
<style scoped lang="less">
.homePage {
    .title {
        text-align: center;
        padding: 20px;
        font-size: 20px;
    }
    .content {
        .fnBtns {

        }
        .organization-chart {
            
        }
    }
}
</style>
