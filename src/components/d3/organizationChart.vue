<template>
    <div class="organizationChart">
        <!-- <div class="organizationChart-canvas" :id="'organizationChart' + uuid" ref="organizationChart"></div> -->
        <div class="organizationChart-canvas2" :id="'organizationChart2' + uuid" ref="organizationChart2"></div>
    </div>
</template>

<script>
import * as d3 from "d3";
import {mapState} from 'vuex';
export default {
    name: "organizationChart",
    props: ["data", "showList"],
    data() {
        return {
            dataList: {},
            breadthArr: [], // 树的分级数组
            height: 500,
            width: 800,
            // 单个节点的文字定宽
            fontSize: 26,
            boxPadding: 20,
            boxMagin: 20,
            bordeWidth: 3,
            uuid: this.$generateUUID(),
            textArr: this.$store.state.tData.showList, //展示项
            showArr: [],//
        };
    },
    computed: {
        ...mapState(['tData'])
    },
    watch: {
        data:{
            immediate:true,
            handler:function(val){
                this.dataList = val;
                // console.log(JSON.stringify(val))
                this.breadthArr = this.$breadthTraversal([val]);
                this.loadChart();
            }
        },
        showList:{
            immediate:true,
            handler:function(val){
                this.showArr = val||[];
                this.loadChart();
            }
        },
    },
    filters: {},
    methods: {
        loadChart() {
            this.fontSize = 26;
            this.initChart('organizationChart2');
        },
        initChart(ele) {
            this.height = this.calMaxHeight();
            this.width = this.calMaxWidth();
            // 清空画布
            if(this.$refs[ele] != null) {
                this.$refs[ele].innerHTML = '';
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
                .scaleExtent([0.1, 10])
                .on("zoom", function() {
                    svg.attr(
                        "transform",
                        "translate(" +
                            d3.event.translate +")"
                            +" scale(" +
                            d3.event.scale +
                            ")"
                    );
                });
            var svg = d3
                .select("#"+ele+this.uuid)
                .append("svg")
                .attr("width", this.width + 80) // 画布扩大，防止边缘文字被遮挡
                .attr("height", this.height + this.calNodeHeight()*2)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("version", 1.1)  
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

            // 将曲线换为折线
            const drawLine = () => {
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
                    .attr("style", "fill: none;stroke: #ccc;stroke-width: " + this.bordeWidth + "px;");

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

            drawLine();

            var node = svg
                .selectAll(".node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("style", "font: " + this.fontSize + "px sans-serif;")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + (d.y-100) + ")"; // edited
                });

            // 绘制矩形与文字
            this.drawRect(node);
        },
        // 计算画布宽度
        calMaxWidth() {
            // 画布最小宽度
            const minWidth = 800;
            // 计算画布宽度=所有末节点的宽度相加
            let maxWidth = 0;
            // 节点间的预留间距
            const nodeMargin = 10;

            // 同级节点文案最大长度
            let itemLength = 0;
            for(let i=0; i<this.breadthArr.length; i++) {
                let width = 0;
                let item = this.breadthArr[i].arr;
                for(let j=0; j<item.length; j++) {
                    itemLength = Math.max(itemLength, this.calNodeWidth(item[j]));
                }
                width = (itemLength + this.boxMagin) * item.length;
                maxWidth = Math.max(maxWidth, width);
            }
            
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
            let nodeMargin = 200;
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
            // nodeMargin = this.boxHeight * 2;
            maxHeight = LevelLength * (nodeMargin + this.calNodeHeight());

            return Math.max(maxHeight, minHeight);
        },
        // 节点第一行展示信息
        getTitle(d) {
            return d.fullName;
        },
        // 绘制矩形与文字
        drawRect(node) {
            node.append("rect")
                .attr("y", 0)
                .attr("x", (d) => {
                    return -(this.calNodeWidth(d) / 2);
                })
                .attr("width", (d) => {
                    return this.calNodeWidth(d);
                })
                .attr("height", (d) => {
                    return this.calNodeHeight();
                })
                // 矩形背景色以及边框颜色宽度
                .attr("fill", "#fff")
                .attr("stroke", "steelblue")
                .attr("stroke-width", "2")
                .on("click", function(evt) {
                    // console.log(evt); // 显示所点击节点数据
                });

            // 新增text
            node.append("text")
                .attr("y", (d) => {
                    return (this.fontSize*1.4 + 4);
                })
                .attr("style", (d) => {
                    return "font-weight: bold; font-size: " + this.fontSize*1.4 + "px";
                })
                .attr("text-anchor", (d) => {
                    return "middle";
                })
                .text((d) => {
                    return this.getTitle(d);
                });
            const addText = (node, lineHeight, numberIndex) => {

                node.append("text")
                    .attr("y", (d) => {
                        return lineHeight;
                    })
                    .attr("x", (d) => {
                        return -(this.calNodeWidth(d) / 2) + this.boxPadding;
                    })
                    .attr("text-anchor", (d) => {
                        return "start";
                    })
                    .text((d) => {
                        return (this.textArr[numberIndex].title=='绩效'?'':this.textArr[numberIndex].title + '：') + (d[this.textArr[numberIndex].value]||'-');
                    });
            };
            let lineHeight = this.fontSize+4;
            for(let i=0; i<this.textArr.length; i++) {
                if(this.showArr.indexOf(this.textArr[i].value) === -1) {
                    // 此项不展示
                    continue;
                }
                if(i === 0) {
                    lineHeight += this.fontSize*1.4 + 4 + 10;
                } else {
                    lineHeight += this.fontSize + 4;
                }
                addText(node, lineHeight, i);
            }
        },
        // 计算单个矩形宽度
        calNodeWidth(d) {
            // 计算宽度
            const calWidth = (word) => {
                let result = 0;
                // 用font-size=26px算，英文字符宽是中文的0.5
                let english = this.getLength(word);
                // 宽度 = 字数 * 单个中文字符宽 - 英文字符的差宽
                result = (word.length - english * 0.5) * (this.fontSize + 1);
                return result;
            }; 
            let maxWidth = 0;
            for(let i=0; i<this.textArr.length; i++) {
                let item = this.textArr[i];
                if(this.showArr.indexOf(item.value) === -1) {
                    continue;
                }
                maxWidth = Math.max(maxWidth, calWidth(item.title + '：' + (d[item.value]||'-')));
            }
            maxWidth = Math.max(maxWidth, calWidth(this.getTitle(d))*1.4);
            // 最大文案宽 + 内边距 + 边框宽度
            return maxWidth + (this.boxPadding + this.bordeWidth) * 2;
        },
        // 计算单个矩形高度
        calNodeHeight() {
            // 信息行数 * 行高 + 内边距  +  首行高度
            return (this.showArr.length) * (this.fontSize+4) + 20 + (this.fontSize*1.4+4);
        },

        // 计算字符串的英文数
        getLength(str) {
            if(/[a-z]/i.test(str)){
                return str.match(/[a-z0-9]/ig).length;
            } else {
                return 0;
            }
        }
    },
    mounted() {
        this.loadChart();
    },
    created() {},
    destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scope>
.organizationChart {
    position: relative;

    .organizationChart-canvas {
        width: 1000px;
        height: 500px;
        position: relative;
        // .node circle {
        //     fill: #fff;
        //     stroke: steelblue;
        //     stroke-width: 3px;
        // }
    }
    .organizationChart-canvas2 {
        width: 0;
        height: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
        background-color: #333;
    }
}
</style>
