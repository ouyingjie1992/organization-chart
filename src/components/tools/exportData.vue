<template>
    <div class="exportData">
        <input ref="exportDataInput" type="file" @change="changeInput" class="exportDataInput" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
		<div ref="exportDataDashboard" class="dashboard" v-show="draggableStatus" @click="loadFileBtn">上传文件拖拽区域</div>
        <a class="sin-btn" @click="loadFileBtn" v-if="!draggableStatus">上传EXCEL文件</a>
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
            draggableStatus: true, //浏览器是否支持拖拽事件
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
        changeInput(event) {
            if(!event.currentTarget.files.length) { 
                return;
            }
            // 拿取文件对象
            var f = event.currentTarget.files;
            this.exportData(f);
        },
        // 解析上传文件
        exportData(files) {
            if(!files.length) { 
                return;
            }
            this.exportDataArr = [];
            this.usedArr = [];
            // 拿取文件对象
            let f = files[0];

            let fileName = '';
            let fileSize = '';
            let fileType = '';
            fileName = f.name;
            //kb
            if(f.size > 104857600) {
                this.$msg.error('上传文件不可大于100M，请重新选择');
                this.$refs.inputer.value = '';
                return false;
            } else if(f.size/1024 < 1000) {
                fileSize = (f.size/1024).toFixed(2) +"kb";
            } else if(f.size/1024 > 1000) {
                fileSize = ((f.size/1024)/1024).toFixed(2) +"MB";
            }
            let arr = fileName.split('.');
            fileType = arr[arr.length-1];
            if(fileType!='xlsx' && fileType!='xls') {
                this.$msg.error('请选择xls,xlsx格式的文件');
                this.$refs.exportDataInput.value = '';
                return false;
            }

            this.$loading.show();
            // 用FileReader来读取
            var reader = new FileReader();
            // 重写FileReader上的readAsBinaryString方法
            FileReader.prototype.readAsBinaryString = (f) => {
                var binary = "";
                var wb; // 读取完成的数据
                var outdata; // 你需要的数据
                var reader = new FileReader();
                reader.onload = (e) => {
                    // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
                    var bytes = new Uint8Array(reader.result);
                    var length = bytes.byteLength;
                    for (var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    // 接下来就是xlsx了，具体可看api
                    wb = XLSX.read(binary, {
                        type: "binary",
                        cellDates: true
                    });
                    outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                    // 自定义方法向父组件传递数据
                    let result = {
                        data: this.initData(outdata),
                        total: this.exportDataArr.length
                    };
                    this.$emit("postData", result);
                    this.$loading.hide();
                };
                reader.readAsArrayBuffer(f);
            };
            reader.readAsBinaryString(f);
        },
        // 格式化数据
        initData(data) {
            let result = [];
            let resultNameArr = [];
            // 根节点-最高领导 ： 没有上级领导的即为该部门的最高领导
            let leader = [];
            if(data != null) {
                for(let i=0; i<data.length; i++) {
                    let item = this.formatDataName(data[i]);
                    this.exportDataArr.push(item);
                    if(item.directSuperior==null || item.directSuperior==='') {
                        leader.push(item);
                    }
                }
                for(let i=0; i<leader.length; i++) {
                    let item = leader[i];
                    this.usedArr.push(item.fullName);
                    item.children = this.findChildren(item.fullName);
                    result.push(item);
                }
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
                'firstLevelDepartment': data['一级部门（D1）'],
                'twoLevelDepartment': data['二级部门（D2）'],
                'threeLevelDepartment': data['三级部门（D3）'],
                'fourLevelDepartment': data['四级部门（D4）'],
                'post': data['任职职位'],
                'birthday': data['出生日期（B）'],
                'education': this.initEducation(data),
                'graduationTime': data['毕业时间（G）'],
                'dateOfEntry': this.formatDate(data['入职日期（OD）'], 'yyyy/mm/dd'),
                'workingPlace': data['工作地点（L）'],
                'directSuperior': data['直接上级'],
                'currentMonthlySalary': data['目前月薪（P）'],
                'abilityLevel': data['能力评级（PJ）'],
                'potentialRating': data['潜力评级（QL）'],
                'recentSalary': this.formatDate(data['最近调薪时间（PT）'], 'yyyy年mm月'),
                'performance': this.initPerformance(data),
                'ps': data['备注（PS）'],
            };
            return resultData;
        },
        // 日期格式转化
        formatDate(data, format) {
            let result = '';
            if(data == null) {
                return '';
            }
            let time = new Date(data);
            let year = String(time.getFullYear());
            let month = String(time.getMonth() + 1);
            let date = String(time.getDate());
            if(format && format === 'yyyy') {
                result = year + '年';
            } else if(format && format === 'yyyy/mm/dd') {
                result = year + '/' + (month < 10 ? '0' + month : month) + '/' +(date < 10 ? '0' + date : date);
            } else if(format && format === 'yyyy年mm月') {
                result = year + '年' + (month < 10 ? '0' + month : month) + '月';
            } else {
                result = year+(month < 10 ? '0' + month : month)+(date < 10 ? '0' + date : date);
            }
            return result;
        },
        initDashboard() {
            let dashboard = this.$refs.exportDataDashboard;
            let support = ('draggable' in dashboard) || ('ondrapstart' in dashboard && 'ondrop' in dashboard);
            if(!support){
                //浏览器不支持HTML5拖放
                this.draggableStatus = false;
                return;
            } else {
                this.draggableStatus = true;
            }

            dashboard.addEventListener("dragover", function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
            dashboard.addEventListener("dragenter", function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
            dashboard.addEventListener("drop", (e) => {
                // 必须要禁用浏览器默认事件
                e.preventDefault();
                e.stopPropagation();
                var files = e.dataTransfer.files;
                this.exportData(files);
            });
        },
        // 学历格式化
        initEducation(data) {
            let result = '';
            let data1 = data['学历'];
            let data2 = data['学校层次'];
            if((data1!=null&&data1!=='') || (data2!=null&&data2!=='')) {
                result = (data1||'-') + '-' + (data2||'-');
            }
            return result;
        },
        // 绩效格式化
        initPerformance(data) {
            let result = '';
            let data1 = data['上年度绩效'];
            let data2 = data['Q1绩效'];
            let data3 = data['Q2绩效'];
            let data4 = data['Q3绩效'];
            let data5 = data['年度绩效'];
            if((data1!=null&&data1!=='') || (data2!=null&&data2!=='') || (data3!=null&&data3!=='') || (data4!=null&&data4!=='') || (data5!=null&&data5!=='')) {
                result = '0'+(data1||'-')+'1'+(data2||'-')+'2'+(data3||'-')+'3'+(data4||'-')+'4'+(data5||'-');
            }
            return result;
        }
    },
    computed: {
    },
    mounted() {
        this.initDashboard();
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
    
    .dashboard {
        width: 100%;
        height: 100px;
        margin-left: 20px;
        box-sizing: border-box;
        border: 3px dashed #F8BBD0;
        border-radius: 5px;
        font-size: 20px;
        color: #2c1612;
        cursor: pointer;
        user-select: none;
        text-align: center;
        padding: 39px 0;
        font-size: 16px;
        line-height: 1;
        color: rgb(148, 145, 145);

        &:hover {
            border-color: rgb(25, 159, 192);
        }
    }
}
</style>
