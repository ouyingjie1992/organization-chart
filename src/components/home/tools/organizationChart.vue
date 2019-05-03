<template>
    <div class="organizationChart" id="organizationChart" ref="organizationChart"></div>
</template>

<script>
import * as d3 from "d3";
export default {
    name: "organizationChart",
    props: ["data"],
    data() {
        return {
            dataList: {},
            height: 500,
            width: 800,
            boxHeight: 100,
            lineHeight: 20,
            // 单个节点的文字定宽
            fontWidth: 13,
            boxPadding: 10,
            textArr: [
                {
                    title: '工号',
                    value: 'jobNumber'
                },{
                    title: '一级部门',
                    value: 'firstLevelDepartment'
                },{
                    title: '二级部门',
                    value: 'twoLevelDepartment'
                },{
                    title: '三级部门',
                    value: 'threeLevelDepartment'
                },{
                    title: '四级部门',
                    value: 'fourLevelDepartment'
                },{
                    title: '入职日期',
                    value: 'dateOfEntry'
                },{
                    title: '工作地点',
                    value: 'workingPlace'
                },{
                    title: '直接上级',
                    value: 'directSuperior'
                },{
                    title: '目前月薪',
                    value: 'currentMonthlySalary'
                },{
                    title: '能力等级',
                    value: 'abilityLevel'
                },{
                    title: '上年度绩效',
                    value: 'lastYearPerformance'
                },{
                    title: 'Q1绩效',
                    value: 'Q1'
                },{
                    title: 'Q2绩效',
                    value: 'Q2'
                },{
                    title: 'Q3绩效',
                    value: 'Q3'
                },{
                    title: '年度绩效',
                    value: 'Annual'
                }
            ]
        };
    },
    watch: {
        data:{
            immediate:true,
            handler:function(val){
                this.dataList = val;
                this.height = this.calMaxHeight();
                this.width = this.calMaxWidth();
                this.initChart();
            }
        },
    },
    filters: {},
    methods: {
        initChart() {
            const _this = this;
            // 清空画布
            if(this.$refs.organizationChart != null) {
                this.$refs.organizationChart.innerHTML = '';
            }
            if(this.dataList==null || this.dataList.fullName==null) {
                return;
            }
            var tree = d3.layout
                .tree()
                .size([this.width, this.height - 200])
                .separation(function(a, b) {
                    return a.parent == b.parent ? 1 : 2;
                });

            var diagonal = d3.svg.diagonal().projection(function(d) {
                return [d.x, d.y]; // edited
            });

            // 用来拖拽图以及扩大缩放
            var zoom = d3.behavior
                .zoom()
                .scaleExtent([0.1, 1])
                .on("zoom", function() {
                    svg.attr(
                        "transform",
                        "translate(" +
                            d3.event.translate +
                            ") scale(" +
                            d3.event.scale +
                            ")"
                    );
                });
            var svg = d3
                .select("#organizationChart")
                .append("svg")
                .attr("width", this.width + 80) // 画布扩大，防止边缘文字被遮挡
                .attr("height", this.height + 200)
                .append("g")
                .call(zoom) // 相当于zoom（svg）
                .attr("transform", "translate(40,200)"); // 将图整体下移，以防止顶部节点被遮挡

            var nodes = tree.nodes(this.dataList);
            var links = tree.links(nodes);

            // var link = svg.selectAll(".link")
            //  .data(links)
            //  .enter()
            //  .append("path")
            //  .attr("class", "link")
            //  .attr("d", diagonal);

            drawLine();
            // 将曲线换为折线
            function drawLine() {
                var link = svg
                    .selectAll("path.link")

                    // The function we are passing provides d3 with an id
                    // so that it can track when data is being added and removed.
                    // This is not necessary if the tree will only be drawn once
                    // as in the basic example.
                    .data(links);

                // Add new links
                link.enter()
                    .append("path")
                    .attr("class", "link");

                // Remove any links we don't need anymore
                // if part of the tree was collapsed
                link.exit().remove();

                // Update the links positions (old and new)
                link.attr("d", elbow);

                function elbow(d) {
                    let sourceX = d.source.x,
                        sourceY = d.source.y,
                        targetX = d.target.x,
                        targetY = d.target.y;

                    return (
                        "M" +
                        sourceX +
                        "," +
                        sourceY +
                        "V" +
                        ((targetY - sourceY) / 2 + sourceY) +
                        "H" +
                        targetX +
                        "V" +
                        targetY
                    );
                }
            }
            var node = svg
                .selectAll(".node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + (d.y-200) + ")"; // edited
                });

            // 绘制矩形与文字
            this.drawRect(node);
        },
        // 计算画布宽度
        calMaxWidth() {
            const data = this.dataList;
            // 画布最小宽度
            const minWidth = 800;
            // 计算画布宽度=所有末节点的宽度相加
            let maxWidth = 0;
            // 节点间的预留间距
            const nodeMargin = 0;
            let number = 0;
            // 同级节点文案最大长度
            let itemLength = 0;
            const fn = (data) => {
                for(let i=0; i<data.children.length; i++) {
                    let item = data.children[i];
                    if(item.children==null || item.children.length===0) {
                        itemLength = Math.max(itemLength, this.calNodeWidth(item));
                        number++;
                    } else {
                        fn(item);
                    }
                }
            };

            if(data.children!=null && data.children.length>0) {
                fn(data);
            }
            maxWidth = maxWidth + number*itemLength;
            return Math.max(maxWidth, minWidth);
        },
        // 计算画布高度
        calMaxHeight() {
            const data = this.dataList;
            // 画布最小高度
            const minHeight = 800;
            // 计算画布高度=结构层级数*(单个宽高+预留连线距离)
            let maxHeight = 0;
            // 预留连线距离
            const nodeMargin = 200;
            let number = 0;

            var num = 0;


            // 结构层级数
            let LevelLength = 1;
            const recursion = (obj,k) => {
                LevelLength= Math.max(LevelLength,k);
                if (obj.children) {
                    obj.children.forEach(function(v, i){
                        recursion(v, k+1);
                    });
                }
            };
            recursion(data, 1);
            maxHeight = LevelLength * (nodeMargin + this.boxHeight);

            return Math.max(maxHeight, minHeight);
        },
        // 节点第一行展示信息
        getTitle(d) {
            return d.post + ' ' + d.fullName;
        },
        // 绘制矩形与文字
        drawRect(node) {
            const _this = this;
            node.append("rect")
                .attr("y", 0)
                .attr("x", function(d) {
                    return -(_this.calNodeWidth(d) / 2);
                })
                .attr("width", function(d) {
                    return _this.calNodeWidth(d);
                })
                .attr("height", function(d) {
                    return _this.boxHeight;
                })
                // 矩形背景色以及边框颜色宽度
                .attr("fill", "#fff")
                .attr("stroke", "steelblue")
                .attr("strokeWidth", "1px")
                .on("click", function(evt) {
                    console.log(evt); // 显示所点击节点数据
                });

            // 新增text
            node.append("text")
                .attr("y", function(d) {
                    return _this.lineHeight;
                })
                .attr("style", function(d) {
                    return "";
                })
                .attr("text-anchor", function(d) {
                    return "middle";
                })
                .text(function(d) {
                    return _this.getTitle(d);
                });
            const addText = (node, lineHeight, numberIndex) => {

                node.append("text")
                    .attr("y", function(d) {
                        return lineHeight;
                    })
                    .attr("x", function(d) {
                        return -(_this.calNodeWidth(d) / 2) + _this.boxPadding;
                    })
                    .attr("text-anchor", function(d) {
                        return "start";
                    })
                    .text(function(d) {
                        return _this.textArr[numberIndex].title + '：' + (d[_this.textArr[numberIndex].value]||'-');
                    });
            };
            for(let i=0; i<this.textArr.length; i++) {
                let lineHeight = this.lineHeight * (i+2);
                addText(node, lineHeight, i);
            }
        },
        // 计算单个矩形宽度
        calNodeWidth(d) {
            let maxWidth = 0;
            for(let i=0; i<this.textArr.length; i++) {
                let item = this.textArr[i];
                maxWidth = Math.max(maxWidth, (item.title + '：' + (d[item.value]||'-')).length);
            }
            maxWidth = Math.max(maxWidth, (d.post + ' ' + d.fullName).length);
            // 最大字数 * 单个字宽 + 内边距
            return maxWidth * this.fontWidth + this.boxPadding * 2;
        },
        // 计算单个矩形高度
        calNodeHeight() {
            // 信息行数 * 行高 + 内边距
            return (this.textArr.length+1) * this.lineHeight + 20;
        }
    },
    computed: {},
    mounted() {
        this.initChart();
        this.boxHeight = this.calNodeHeight();
    },
    created() {},
    destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.organizationChart {
    width: 1000px;
    height: 500px;
    .node circle {
        fill: #fff;
        stroke: steelblue;
        stroke-width: 1.5px;
    }

    .node {
        font: 12px sans-serif;
    }

    .link {
        fill: none;
        stroke: #ccc;
        stroke-width: 1.5px;
    }
}
</style>
