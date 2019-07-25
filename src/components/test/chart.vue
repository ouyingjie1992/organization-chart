<template>
    <div class="test-chart">
        <div class="org-container" v-for="item in dataList">
            <div class="orgchart">
                <v-orgchartTable :dataList="item" :showArr="showArr"></v-orgchartTable>
            </div>
        </div>
    </div>
</template>

<script>
import vOrgchartTable from "./tools/orgchartTable";
export default {
    name: "test",
    data() {
        return {
            dataList: [{"jobNumber":800005,"fullName":"吴七","firstLevelDepartment":"行业应用事业部","post":"行业应用事业部总经理","birthday":"1995/03/01","education":"硕士-985","graduationTime":"2003年","dateOfEntry":"2004/09/21","workingPlace":"深圳","currentMonthlySalary":10000,"abilityLevel":"四1","potentialRating":"B+","recentSalary":"2018年01月","performance":"0B1B2B3B4B","children":[{"jobNumber":800001,"fullName":"张三","firstLevelDepartment":"行业应用事业部","twoLevelDepartment":"Android开发部","post":"Android开发部经理","birthday":"1976/08/08","education":"本科-重点","graduationTime":"2003年","dateOfEntry":"2002/11/11","workingPlace":"深圳","directSuperior":"吴七","currentMonthlySalary":9000,"abilityLevel":"四1","potentialRating":"A","recentSalary":"2018年01月","performance":"0A1A2B3B4A","children":[{"jobNumber":800002,"fullName":"李四","firstLevelDepartment":"行业应用事业部","twoLevelDepartment":"Android开发部","post":"Android开发工程师","birthday":"1993/02/04","education":"硕士-985","graduationTime":"2003年","dateOfEntry":"2002/11/11","workingPlace":"深圳","directSuperior":"张三","currentMonthlySalary":6000,"abilityLevel":"二3","recentSalary":"2018年01月","performance":"0-1B2B3A4B","children":[]}]},{"jobNumber":800003,"fullName":"王五","firstLevelDepartment":"行业应用事业部","twoLevelDepartment":"JAVA开发部","post":"JAVA开发部经理","birthday":"1984/07/22","education":"大专-普通","graduationTime":"2003年","dateOfEntry":"2004/03/06","workingPlace":"深圳","directSuperior":"吴七","currentMonthlySalary":8000,"recentSalary":"2018年01月","performance":"0-1C2B3A4B","children":[{"jobNumber":800009,"fullName":"鸣人","firstLevelDepartment":"研发部","twoLevelDepartment":"成都研发部","threeLevelDepartment":"前端开发","post":"前端开发工程师","birthday":"1995/03/01","education":"大专-普通","graduationTime":"2003年","dateOfEntry":"2016/07/10","workingPlace":"成都","directSuperior":"王五","currentMonthlySalary":4000,"abilityLevel":"三2","potentialRating":"B+","recentSalary":"2018年01月","performance":"0-1-2-3B4B","children":[]}]},{"jobNumber":800004,"fullName":"赵六","education":"---","graduationTime":"-","dateOfEntry":"-","directSuperior":"吴七","recentSalary":"-","performance":"0-1-2-3-4-","children":[{"jobNumber":800007,"fullName":"佐助","firstLevelDepartment":"研发部","twoLevelDepartment":"成都研发部","post":"成都研发部经理","birthday":"1995/03/01","education":"大专-普通","graduationTime":"2003年","dateOfEntry":"2006/07/01","workingPlace":"成都","directSuperior":"赵六","currentMonthlySalary":6000,"abilityLevel":"三2","potentialRating":"B+","recentSalary":"2018年01月","performance":"0B1B2B3B4B","children":[]}]}]}],
            showArr: this.$store.state.tData.showList, //展示项
        };
    },
    components: {
        vOrgchartTable
    },
    watch: {
        // data:{
        //     immediate:true,
        //     handler:function(val){
        //         this.dataList = val;
        //         this.breadthArr = this.breadthTraversal([val]);
        //     }
        // },
    },
    filters: {},
    methods: {
    },
    computed: {
    },
    mounted() {
    },
    created() {}
};
</script>

<style scoped lang="less">
.test-chart {
}
</style>
