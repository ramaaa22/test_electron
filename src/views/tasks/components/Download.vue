<template>
<div> 

	<el-button 
		:loading="downloadLoading" 
		style="margin:0 0 20px 0" 
		type="success"
        plain 
		icon="el-icon-document" 
		@click="handleDownload">
		Exportar a Excel
	</el-button>

</div>
</template>

<script>

export default{
	props: {  
		list: Array, 
	},

	data: () => ({
        downloadLoading: false,
        columns:{
            firstname:'Nombre',
            lastname: 'Apellido',
        },
        fileName: ''
	}),
    mounted() {
        const name = this.$route.params.task.title;
        this.fileName = name;
    },
    methods:{
      	handleDownload() {
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then(excel => {
                const headers = Object.values(this.columns)
                const filter = Object.keys(this.columns)
                const list = this.list

                const tHeader = headers
                const filterVal = filter
                const data = this.formatJson(filterVal, list)
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: this.fileName
                })
                this.downloadLoading = false
        })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                if (j === 'timestamp') {
                return parseTime(v.user[j])
                } else {
                return v.user[j]
                }
            }))
        }
}
}
</script>