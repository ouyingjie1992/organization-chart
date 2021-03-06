<template>
    <div class="homePage">
        <div class="title">公司组织架构图</div>
        <div class="content">
            <div class="fnBtns">
                <a class="sin-btn" href="static/temp/组织架构图模版.xlsx" download="组织架构图模版">下载模版</a>
                <v-exportData @postData="getResult" style="width: 70%;"></v-exportData>
            </div>
            <div class="fnBtns">
                <span>选择展示项：</span>
                <el-select v-model="showValue" multiple placeholder="请选择" style="width: 70%;">
                    <el-option v-for="item in options" :key="item.value" :label="item.title" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="resultData-box">
                成功导入 {{resultData.length}}个部门数据， 共计{{total}} 条数据
                <a class="sin-btn" @click="downloadZip">打包下载</a>
            </div>
            <div class="organization-chart" v-for="item in resultData">
                <v-chart :data="item" :showList="showValue" ref="organization-chart-body"></v-chart>
            </div>
            <el-table :data="resultData" border style="width: 100%">
                <el-table-column prop="firstLevelDepartment" label="部门名" header-align="center"></el-table-column>
                <el-table-column label="操作" width="100" align="center" header-align="center">
                    <template slot-scope="scope">
                        <el-button @click="download(scope.$index, scope.row.firstLevelDepartment)" size="small">下载图片</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import JSZip from "jszip";
import FileSaver from 'file-saver';
import {mapState} from 'vuex';
import vExportData from "../tools/exportData";
import vChart from "./chart";
import html2canvas from 'html2canvas';
export default {
    name: "tablePage",
    data() {
        return {
            resultData: [], // Excel导入结果
            total: 0, // 成功导入多少条数据
            options: this.$store.state.tData.showList, // 显示项
            showValue: [], // 显示项
        };
    },
    components: {
        vExportData,
        vChart
    },
    watch: {
        // dataList:{
        //     immediate:true,
        //     handler:function(val){
        //         this.list = val;
        //     }
        // },
    },
    filters: {},
    methods: {
        getResult(result) {
            this.resultData = result.data || [];
            this.total = result.total;
        },
        // 下载图片
        download(index, department) {
            let ele = this.$refs["organization-chart-body"][index].$el;
            if (ele == null) {
                this.$msg.error("请先上传文件");
                return false;
            }
            this.$loading.show();
            setTimeout(() => {
                html2canvas(ele).then((canvas) => {
                    this.downloadCanvas(canvas, department);
                    this.$loading.hide();
                });
            }, 0);
        },
        dataURLtoBlob(dataurl) {
            var arr = dataurl.split(","),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type: mime});
        },
        downloadCanvas(canvas, name='组织架构图') {
            var link = document.createElement("a");
            var imgData = canvas.toDataURL({format: "png", multiplier: 4});
            var strDataURI = imgData.substr(22, imgData.length);
            var blob = this.dataURLtoBlob(imgData);
            var objurl = URL.createObjectURL(blob);

            link.download = name + this.initTimeStr() + '.png';

            link.href = objurl;

            link.click();
        },
        // 生成时间戳
        initTimeStr() {
            var pad2 = function(n) {
                return n < 10 ? '0' + n : n;
            };
            var date = new Date();
            return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
        },
        // 打包下载
        downloadZip() {
            let charts = this.$refs["organization-chart-body"];
            if (charts==null || charts.length===0) {
                this.$msg.error("请先上传文件");
                return false;
            }
            this.$loading.show();
            let zip = new JSZip();
            let zipName = '组织架构图' + this.initTimeStr();
            let imgs = zip.folder(zipName);
            let baseList = [];
            for(let i=0; i<charts.length; i++) {
                let ele = charts[i].$el;
                let department = this.resultData[i].firstLevelDepartment;
                setTimeout(() => {
                    html2canvas(ele).then((canvas) => {
                        let url = canvas.toDataURL() // 得到图片的base64编码数据
                        // canvas.toDataURL('image/png')
                        baseList.push({
                            file: url.substring(22),
                            name: department
                        });
                        if(baseList.length === charts.length) {
                            if(baseList.length > 0) {
                                this.$notify({
                                    title: '打包成功',
                                    message: '即将下载',
                                    type: 'success'
                                });
                                for (let k = 0; k < baseList.length; k++) {
                                    imgs.file(baseList[k].name + '.png', baseList[k].file, {base64: true});
                                }
                                zip.generateAsync({type: 'blob'}).then( (content) => {
                                    // see FileSaver.js
                                    FileSaver.saveAs(content, zipName + '.zip');
                                    this.$loading.hide();
                                });
                            } else {
                                this.$notify.error({
                                    title: '错误',
                                    message: '暂无图片可下载'
                                });
                            }
                        }
                    });
                }, 0);
            }
        },
        // 全选展示项
        selectAll() {
            let result = [];
            for(let i=0; i<this.$store.state.tData.showList.length; i++) {
                result.push(this.$store.state.tData.showList[i].value);
            }
            this.showValue = result;
            
        }
    },
    computed: {
        ...mapState(['tData'])
    },
    mounted() {
        this.selectAll();
    },
    created() {},
    destroyed() {}
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
            padding-bottom: 20px;
        }
        .organization-chart {
            overflow: auto;
            display: inline-block;
            width: 0;
            height: 0;
        }
    }
    .resultData-box {
        padding: 20px 0;
    }
}
</style>
