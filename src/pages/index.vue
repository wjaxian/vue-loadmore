<template>
<section class="index">
	<img src="../assets/logo.png"/>
	<h3>loadmore demo</h3>
	<router-link to="/mobile">Mobile</router-link>
	<router-link to="/pc">PC</router-link>
</section>
</template>

<script>
export default {
	name: 'index'
}
</script>

<style lang="scss">
.index {
	text-align: center;
	a {
		margin-top: 10px;
		display: block;
	}
}
</style>