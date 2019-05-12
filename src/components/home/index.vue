<template>
    <div class="homePage">
        <div class="title">公司组织架构图</div>
        <div class="content">
            <div class="fnBtns">
                <a class="sin-btn" href="static/temp/组织架构图模版.xlsx" download="组织架构图模版">下载模版</a>
                <v-exportData @postData="getResult"></v-exportData>
            </div>
            <div class="resultData-box">
                成功导入 {{resultData.length}}个部门数据， 共计{{total}} 条数据
                <a class="sin-btn" @click="download(item)" v-for="(item, index) in $refs['organization-chart-body']">下载图片{{index+1}}</a>
            </div>
            <div class="organization-chart" v-for="item in resultData" >
                <v-chart :data="item" ref="organization-chart-body"></v-chart>
            </div>
        </div>
    </div>
</template>

<script>
import XLSX from "xlsx";
import vExportData from "./tools/exportData";
import vChart from "./tools/organizationChart";
export default {
    name: "homePage",
    data() {
        return {
            resultData: {}, // Excel导入结果
            total: 0 //成功导入多少条数据
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
        download(chart) {
            let svg = chart.$refs.organizationChart2.children[0];
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
                context.fillRect(0,0,canvas.width,canvas.height);

                context.drawImage(image, 0, 0);

                this.downloadCanvas(canvas);
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
            return new Blob([u8arr], { type: mime });
        },
        downloadCanvas(canvas) {
            var link = document.createElement("a");
            var imgData = canvas.toDataURL({ format: "png", multiplier: 4 });
            var strDataURI = imgData.substr(22, imgData.length);
            var blob = this.dataURLtoBlob(imgData);
            var objurl = URL.createObjectURL(blob);

            link.download = "组织架构图.png";

            link.href = objurl;

            link.click();
        }
    },
    computed: {},
    mounted() {},
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
