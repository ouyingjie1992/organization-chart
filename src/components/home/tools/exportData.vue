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
        event: 'postData'
    },
    data() {
        return {
            exportDataArr: [], //Excel文件解析数据
            usedArr: [], //已经被使用过的数据
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
            this.exportDataArr = [];
            this.usedArr = [];
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
                    let result = {
                        data: that.initData(outdata),
                        total: that.exportDataArr.length
                    };
                    that.$emit("postData", result);
                };
                reader.readAsArrayBuffer(f);
            };
            reader.readAsBinaryString(f);
        },
        // 格式化数据
        initData(data) {
            let result = {};
            let resultNameArr = [];
            // 根节点-最高领导
            let leader = null;
            if(data != null) {
                for(let i=0; i<data.length; i++) {
                    let item = this.formatDataName(data[i]);
                    this.exportDataArr.push(item);
                    if(item.directSuperior==null || item.directSuperior==='') {
                        leader = item;
                    }
                }
                this.usedArr.push(leader.fullName);
                leader.children = this.findChildren(leader.fullName);
                result = leader;
            }
            return result;
        },
        // 寻找子节点
        findChildren(name) {
            let children = [];
            for(let i=0; i<this.exportDataArr.length; i++) {
                let item = this.exportDataArr[i];
                // 使用过的数据无需再检测
                if(this.usedArr.indexOf(item.fullName) != -1) {
                    continue;
                }
                // 判断是否为子节点
                if(item.directSuperior === name) {
                    let thisName = item.fullName;
                    item.children = this.findChildren(thisName);
                    children.push(item);
                    this.usedArr.push(thisName);
                }
            }
            return children;
        },
        // 格式化字段名称
        formatDataName(data) {
            let resultData = {
                'jobNumber': data['工号'],
                'fullName': data['姓名'],
                'firstLevelDepartment': data['一级部门'],
                'twoLevelDepartment': data['二级部门'],
                'threeLevelDepartment': data['三级部门'],
                'fourLevelDepartment': data['四级部门'],
                'post': data['任职职位'],
                'birthday': this.formatDate(data['出生日期']),
                'education': (data['学历']||'-')+(data['院校层级']||'-')+(data['毕业时间']||'-'),
                'dateOfEntry': this.formatDate(data['入职日期']),
                'workingPlace': data['工作地点'],
                'directSuperior': data['直接上级'],
                'currentMonthlySalary': data['目前月薪'],
                'abilityLevel': data['能力等级'],
                'performance': '0'+(data['上年度绩效']||'-')+'1'+(data['Q1绩效']||'-')+'2'+(data['Q2绩效']||'-')+'3'+(data['Q3绩效']||'-')+'4'+(data['年度绩效']||'-'),
            };
            return resultData;
        },
        // 日期格式转化
        formatDate(numb, format) {
            if(numb == null) {
                return '-';
            }
            let time = new Date(1900, 0, numb);
            time.setDate(time.getDate() - 1);
            let year = time.getFullYear() + '';
            let month = time.getMonth() + 1 + '';
            let date = time.getDate() + '';
            if(format && format.length === 1) {
                return year + format + month + format + date;
            }
            return year+(month < 10 ? '0' + month : month)+(date < 10 ? '0' + date : date);
        }
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
    display: inline-block;
    .exportDataInput {
        display: none;
    }
}
</style>
