<template>
    <div class="org-chart-table" ref="organizationChart">
        <div class="org-container">
            <div class="orgchart">
                <v-orgchartTable :dataList="dataList" :showArr="showArr" :levelMaxHeight="levelMaxHeight"></v-orgchartTable>
            </div>
        </div>
    </div>
</template>

<script>
import vOrgchartTable from "../tools/orgchartTable";
export default {
    name: "test",
    props: ["data", "showList"],
    data() {
        return {
            dataList: [],
            showArr: [], //展示项
            levelMaxHeight: {}, //每个层级最大高度(行数)
        };
    },
    components: {
        vOrgchartTable
    },
    watch: {
        data:{
            immediate:true,
            handler:function(val){
                this.dataList = this.setLevel([val])[0];
                this.calLevelMaxHeight(val);
            }
        },
        showList:{
            immediate:true,
            handler:function(val){
                let result = [];
                for(let i=0; i<this.$store.state.tData.showList.length; i++) {
                    let item = this.$store.state.tData.showList[i];
                    if(val.indexOf(item.value) !== -1) {
                        result.push(item);
                    }
                }
                this.showArr = result;
            }
        },
    },
    filters: {},
    methods: {
        // 设置分级
        setLevel(data) {
            if(data == null) {
                return [];
            }
            let index = -1;
            // 深拷贝
            let resultParents = JSON.parse(JSON.stringify(data));

            const fn = (resultParents) => {
                if(resultParents.length > 0) {
                    index++;
                    let resultChildren = [];
                    for(let i=0; i<resultParents.length; i++) {
                        let item = resultParents[i];
                        item['level'] = index;
                        if(item.children!=null && item.children.length>0) {
                            resultChildren.push(...item.children);
                        }
                    }
                    fn(resultChildren);
                }
            };
            
            fn(resultParents);

            return resultParents;
        },
        // 计算每个层级的最大高度(行数)
        calLevelMaxHeight(val) {
            let list = this.$breadthTraversal([val]);
            let result = {};
            for(let i=0; i<list.length; i++) {
                let item = list[i];
                let length = 0;
                for(let k=0; k<item.arr.length; k++) {
                    let item2 = item.arr[k];
                    let number = 0;
                    for(let x=0; x<this.showList.length; x++) {
                        let item3 = this.showList[x];
                        if(item2[item3]!=null && item2[item3]!=='') {
                            number++;
                        }
                    }
                    length = Math.max(length, number);
                }
                result[item.index] = length;
            }
            this.levelMaxHeight = result;
        },
    },
    computed: {
    },
    mounted() {
    },
    created() {}
};
</script>

<style scoped lang="less">
.org-chart-table {
    display: inline-block;
    padding: 200px;
}
</style>
