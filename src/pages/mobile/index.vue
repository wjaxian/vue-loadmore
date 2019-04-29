<template>
<section>
<loadmore :autoFill="true" :bottomMethod="bottomMethod" :topMethod="topMethod" :bottomAllLoaded="bottomAllLoaded" :topAllLoaded="false" ref="loadmore">
  <ul class="list">
    <li v-for="item in (pageSize * pageNumber)" :key="item">{{item}}</li>
  </ul>
  <p v-if="totalPage == pageNumber">到底啦～</p>
</loadmore>
</section>
</template>

<script>
import loadmore from '@/components/loadmore'
export default {
	name: 'mobile',
	data () {
    return {
      totalPage: 5,
      pageNumber: 0,
      pageSize: 12,
      bottomAllLoaded: false
    }
  },
  methods: {
    topMethod () {
      setTimeout(() => {
        this.pageNumber = 2
        //刷新后 可以触发bottomMethod函数了
        this.bottomAllLoaded = false
        //关闭加载中状态
        this.$refs.loadmore.onTopLoadedSuccess()
      }, 1000)
    },
    bottomMethod () {
	    setTimeout(() => {
        this.pageNumber += 1
        //关闭加载中状态
        this.$refs.loadmore.onBottomLoadedSuccess()
        //没有分页了 就不触发bottomMethod
        this.bottomAllLoaded = this.totalPage <= this.pageNumber
      }, 1000)
    }
  },
  created () {
    this.pageNumber += 1;
  },
  components: {
    loadmore
  }
}
</script>

<style lang="scss">
.list {
    background: #fff;
    li {
      line-height: 40px;
      margin-bottom: 1px;
      background: #f5f5f5;
      text-align: center;
    }
  } 
  p {
  	text-align: center;
  	background: #fff;
  	padding: 10px 0;
  }
 </style>