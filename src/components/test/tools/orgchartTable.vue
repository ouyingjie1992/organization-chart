<template>
    <div class="orgchartTable">
        <table>
            <tbody>
                <tr>
                    <td :colspan="calMaxLength(breadthArr) + 1">
                        <div class="node">
                            <div class="node-box">
                                <div class="node-name">{{tableList.fullName}}</div>
                                <div class="node-content" v-for="showArrItem in showArr" v-if="tableList[showArrItem.value]!=null && tableList[showArrItem.value]!==''">{{showArrItem.title + '：' + (tableList[showArrItem.value]||'-')}}</div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr class="lines" v-if="tableList.children.length>0">
                    <td :colspan="calMaxLength(breadthArr) + 1">
                        <div class="down">
                        </div>
                    </td>
                </tr>
                <tr class="lines" v-if="tableList.children.length>1">
                    <td class="right">
                        &nbsp;
                    </td>
                    <template v-for="(childrenItem, index) in tableList.children" v-key="childrenItem" v-if="index !== 0">
                        <td class="left top">
                            &nbsp;
                        </td>
                        <td class="right top">
                            &nbsp;
                        </td>
                    </template>
                    <td class="left">
                        &nbsp;
                    </td>
                </tr>
                <tr class="nodes">
                    <td v-for="tdItem in tableList.children" :colspan="2">
                        <orgchartTable :dataList="tdItem" :showArr="showArr"></orgchartTable>
                    </td>
                </tr>
            </tbody>
        </table>    
    </div>
</template>

<script>
export default {
    name: "orgchartTable",
    props: ["dataList", "showArr"],
    model: {
    },
    data() {
        return {
            tableList: {},
            breadthArr: [], // 树的分级数组
        };
    },
    watch:{
        dataList: {
            immediate:true,
            handler:function(val){
                this.tableList = val;
                this.breadthArr = this.breadthTraversal([val]);
            }
        },
    },
    filters:{
    },
    methods: {
        // 计算横向广度
        calMaxLength(list) {
            // 同级节点文案最大长度
            let maxLength = 0;
            for(let i=0; i<list.length; i++) {
                let item = list[i].arr;
                maxLength += item.length;
            }
            return maxLength;
        },
        // 广度遍历树，并分级。
        breadthTraversal(data) {
            if(data == null) {
                return [];
            }
            let result = [];
            let index = 0;
            // 深拷贝
            const resultParents = JSON.parse(JSON.stringify(data));

            const fn = (resultParents) => {
                if(resultParents.length > 0) {
                    result.push({
                        arr: resultParents,
                        index: index
                    });
                    index++;
                    let resultChildren = [];
                    for(let i=0; i<resultParents.length; i++) {
                        let item = resultParents[i];
                        if(item.children!=null && item.children.length>0) {
                            resultChildren.push(...item.children);
                        }
                    }
                    fn(resultChildren);
                }
            };
            
            fn(resultParents);

            return result;
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
}
</style>
