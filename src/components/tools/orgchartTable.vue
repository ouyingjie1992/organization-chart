<template>
    <div class="orgchartTable">
        <table>
            <tbody>
                <tr>
                    <td :colspan="calMaxLength(breadthArr)*2">
                        <div class="node">
                            <div class="node-box">
                                <div class="node-name">{{tableList.fullName}}</div>
                                <div class="node-content" v-for="showArrItem in showArr" v-if="tableList[showArrItem.value]!=null && tableList[showArrItem.value]!==''">{{showArrItem.title + '：' + (tableList[showArrItem.value]||'-')}}</div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr class="lines" v-if="tableList.children.length>0">
                    <td :colspan="calMaxLength(breadthArr)*2">
                        <div class="down" :style="'height: ' + calBorderHeight(tableList) + 'px;'">
                        </div>
                    </td>
                </tr>
                <tr class="lines" v-if="tableList.children.length>1">
                    <td class="right" style="border-top: 1px solid #fff;">
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
                        <orgchartTable :dataList="tdItem" :showArr="showArr" :levelMaxHeight="levelMaxHeight"></orgchartTable>
                    </td>
                </tr>
            </tbody>
        </table>    
    </div>
</template>

<script>
export default {
    name: "orgchartTable",
    props: ["dataList", "showArr", "levelMaxHeight"],
    model: {
    },
    data() {
        return {
            tableList: {},
            breadthArr: [], // 树的分级数组
            boxInitHeight: 40, // 数据框原始高度-只留标题名称
            boxItemHeight: 16, // 单行数据高度
            maxHeight: 0, // 默认单行内容区域高
        };
    },
    watch:{
        dataList: {
            immediate:true,
            handler:function(val){
                this.tableList = val;
                this.breadthArr = this.$breadthTraversal([val]);
                this.maxHeight = this.calMaxHeight();
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
        // 计算连线长度
        calBorderHeight(data) {
            let valueLength = 1;
            let borderHeight = 0;
            for(let i=0; i<this.showArr.length; i++) {
                if(data[this.showArr[i].value]!=='' && data[this.showArr[i].value]!=null) {
                    valueLength++;
                }
            }
            borderHeight = this.maxHeight - (this.boxInitHeight + this.boxItemHeight * valueLength);
            
            return borderHeight;
        },
        // 计算最长框高
        calMaxHeight() {
            let maxHeight = 311;
            let length = this.levelMaxHeight[this.tableList.level];
            if(length != null) {
                maxHeight = this.boxInitHeight + this.boxItemHeight * length + 63;
            }
            return maxHeight;
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
}
</style>
