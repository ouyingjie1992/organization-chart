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
            <div class="organization-chart" v-for="item in resultData" v-show="false">
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
import vChart from "./organizationChart";
export default {
    name: "d3Page",
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
        // 下载svg
        download(index, department) {
            let svg = this.$refs["organization-chart-body"][index].$refs
                .organizationChart2.children[0];
            if (svg == null) {
                this.$msg.error("请先上传文件");
                return false;
            }
            let svgXml = svg.outerHTML;
            let image = new Image();
            let canvas = null;
            let context = null;
            let a = null;
            canvas = document.createElement("canvas");
            context = canvas.getContext("2d"); //取得画布的2d绘图上下文

            //给图片对象写入base64编码的svg流
            image.src =
                "data:image/svg+xml;base64," +
                window.btoa(unescape(encodeURIComponent(svgXml)));
            image.onload = () => {
                //准备空画布
                canvas.width = svg.width.animVal.value; //svg宽度
                canvas.height = svg.height.animVal.value; //svg高度

                //设置图片颜色，避免下载图片为透明的背景
                context.fillStyle = "#fff";
                context.fillOpacity = "0";
                context.fillRect(0, 0, canvas.width, canvas.height);

                context.drawImage(image, 0, 0);

                this.downloadCanvas(canvas, department);
                // a = document.createElement("a");
                // a.href = canvas.toDataURL("image/png"); //将画布内的信息导出为png图片数据
                // a.download = "组织架构图.png"; //设定下载名称
                // a.click(); //点击触发下载
            };
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
            let zip = new JSZip();
            let zipName = '组织架构图' + this.initTimeStr();
            let imgs = zip.folder(zipName);
            let baseList = [];

            let charts = this.$refs["organization-chart-body"];
            if (charts==null || charts.length===0) {
                this.$msg.error("请先上传文件");
                return false;
            }
            for(let i=0; i<charts.length; i++) {
                let svg = charts[i].$refs
                .organizationChart2.children[0];
                let department = this.resultData[i].firstLevelDepartment;
                if(svg == null) {
                    // 图片绘制失败
                    continue;
                }
                let svgXml = svg.outerHTML;
                let image = new Image();
                let canvas = null;
                let context = null;
                let a = null;
                canvas = document.createElement("canvas");
                context = canvas.getContext("2d"); //取得画布的2d绘图上下文

                //给图片对象写入base64编码的svg流
                image.src =
                    "data:image/svg+xml;base64," +
                    window.btoa(unescape(encodeURIComponent(svgXml)));
                image.onload = () => {
                    //准备空画布
                    canvas.width = svg.width.animVal.value; //svg宽度
                    canvas.height = svg.height.animVal.value; //svg高度

                    //设置图片颜色，避免下载图片为透明的背景
                    context.fillStyle = "#fff";
                    context.fillOpacity = "0";
                    context.fillRect(0, 0, canvas.width, canvas.height);

                    context.drawImage(image, 0, 0);

                    let url = canvas.toDataURL() // 得到图片的base64编码数据 let url =                 
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
                            });
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: '暂无图片可下载'
                            });
                        }
                    }
                };
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
        }
    }
    .resultData-box {
        padding: 20px 0;
    }
}
</style>
