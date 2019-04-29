<template>
<section>
<loadmore :autoFill="true" :earlyTrigger="100" :bottomAllLoaded="true"  :bottomMethod="bottomMethod" @bottomStatusChange="bootomStatusChange" ref="loadmore">
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
	    pageSize: 12
	  }
	},
	methods: {
		bootomStatusChange (v) {
			if (this.totalPage > this.pageNumber) {
				setTimeout(() => {
		  		this.pageNumber += 1
		  		this.$refs.loadmore.scrollOn = true
	  		}, 2000)
			}
		},
		bottomMethod () {
			this.pageNumber += 1
		}
	},
	created () {
	  this.pageNumber += 1
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