<template>
    <div class="exportData">
        <input ref="exportDataInput" type="file" @change="exportData" class="exportDataInput" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
        <a class="sin-btn" @click="loadFileBtn">上传EXCEL文件</a>
    </div>
</template>

<script>
import XLSX from 'xlsx';
export default {
    name: "exportData",
    model: {
        event: 'exportData'
    },
    data() {
        return {
            msg: "Welcome to Your Vue.js App"
        };
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
        // 上传文件按钮
        loadFileBtn() {
            this.$refs.exportDataInput.value = '';
            this.$refs.exportDataInput.click();
        },
        // 解析上传文件
        exportData(event) {
            if(!event.currentTarget.files.length) { 
                return;
            }
            const that = this;
            // 拿取文件对象
            var f = event.currentTarget.files[0];
            // 用FileReader来读取
            var reader = new FileReader();
            // 重写FileReader上的readAsBinaryString方法
            FileReader.prototype.readAsBinaryString = function(f) {
                var binary = "";
                var wb; // 读取完成的数据
                var outdata; // 你需要的数据
                var reader = new FileReader();
                reader.onload = function(e) {
                    // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
                    var bytes = new Uint8Array(reader.result);
                    var length = bytes.byteLength;
                    for (var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    // 接下来就是xlsx了，具体可看api
                    wb = XLSX.read(binary, {
                        type: "binary"
                    });
                    outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                    // 自定义方法向父组件传递数据
                    that.$emit("exportData", outdata);
                };
                reader.readAsArrayBuffer(f);
            };
            reader.readAsBinaryString(f);
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
.exportData {
    .exportDataInput {
        display: none;
    }
}
.sin-btn {
    border: 1px solid #ccc;
    padding: 5px 10px;
    border-radius: 3px;
    background-color: #fff;
    cursor: pointer;
}
</style>
