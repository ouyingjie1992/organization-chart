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
            dataList: {}
        };
    },
    watch: {
        data:{
            immediate:true,
            handler:function(val){
                this.dataList = val;
                this.initChart();
            }
        },
    },
    filters: {},
    methods: {
        initChart() {
            const width = 1000;
            const height = 500;
            const boxWidth = 100,
                boxHeight = 40;
            // 清空画布
            if(this.$refs.organizationChart != null) {
                this.$refs.organizationChart.innerHTML = '';
            }

            var tree = d3.layout
                .tree()
                .size([width, height - 200])
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
                .attr("width", width + 80) // 画布扩大，防止边缘文字被遮挡
                .attr("height", height)
                .append("g")
                .call(zoom) // 相当于zoom（svg）
                .attr("transform", "translate(40,40)"); // 将图整体下移，以防止顶部节点被遮挡

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
                        sourceY = d.source.y + boxHeight,
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
                    return "translate(" + d.x + "," + d.y + ")"; // edited
                });

            // 圆形节点与对应文字
            // node.append("circle")
            //  .attr("r", 4.5);

            // node.append("text")
            //  .attr("dx", function (d) {
            //      return d.children ? -8 : 8;
            //  })
            //  .attr("dy", 3)
            //  .style("text-anchor", function (d) {
            //      return d.children ? "end" : "start";
            //  })
            //  .text(function (d) {
            //      return d.name;
            //  });
            // 绘制矩形与文字
            drawRect();
            function drawRect() {
                node.append("rect")
                    .attr("y", 0)
                    .attr("x", function(d) {
                        return d.depth !== 2
                            ? -(boxWidth / 2)
                            : -(boxHeight / 2);
                    })
                    .attr("width", function(d) {
                        console.log(d)
                        return d.depth !== 2 ? boxWidth : boxHeight;
                    })
                    .attr("height", function(d) {
                        return d.depth !== 2 ? boxHeight : boxWidth;
                    })
                    // 矩形背景色以及边框颜色宽度
                    .attr("fill", "#fff")
                    .attr("stroke", "steelblue")
                    .attr("strokeWidth", "1px")
                    .on("click", function(evt) {
                        console.log(evt); // 显示所点击节点数据
                    });

                // Draw the person's name and position it inside the box
                node.append("text")
                    .attr("y", function(d) {
                        return d.depth !== 2 ? boxHeight / 2 + 5 : 0;
                    })
                    // .attr('rotate', function (d) { //显示竖直显示中文时rotate为0，英文-90
                    //     return 0;
                    // })
                    .attr("style", function(d) {
                        return d.depth !== 2
                            ? ""
                            : "writing-mode: tb;letter-spacing:0px";
                    })
                    .attr("text-anchor", function(d) {
                        return d.depth !== 2 ? "middle" : "start";
                    })
                    .text(function(d) {
                        return d.post + ' ' + d.fullName;
                    });
            }
        }
    },
    computed: {},
    mounted() {
        this.initChart();
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
