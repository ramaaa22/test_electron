<template>
	<el-main>
		<div class="app-container">
			<el-row type="flex" justify="center">
				<el-col :span="22">
					<el-table
						class="pointer"
						v-loading="listLoading"
						:data="list"
						element-loading-text="Loading"
						border
						fit
						:stripe="true"
						highlight-current-row
						@row-click="row">
							<el-table-column label="Nombre"  align="center">
								<template slot-scope="scope">
									{{ scope.row.name }}
								</template>
							</el-table-column>
							<el-table-column label="Tipo" align="center">
								<template slot-scope="scope">
									<span>{{ scope.row.type | capitalize }}</span>
								</template>
							</el-table-column>
							<el-table-column label="Titulo" align="center">
								<template slot-scope="scope">
									{{ scope.row.title }}
								</template>
							</el-table-column>
					</el-table>
				</el-col>
			</el-row>
		</div>
	</el-main>
</template>

<script>
import axios from "@/utils/request";

export default {  
	filters:{
		capitalize(value){            
            return value.toLowerCase()
            .trim()
            .split(' ')
            .map( v => v[0].toUpperCase() + v.substr(1) )
            .join(' '); 
		}
	},
  	data: () => ({
      	list: [],
      	listLoading: false
	  }),

	async mounted(){
		this.listLoading = true;
		try {
			const res  = await axios.get("/clients/tasks", {
				api: "revision",
				oauth: true
			});
			this.list = res.data.resources	
		} catch (error) {
			console.log(error)
		}
		finally{
			this.listLoading = false;
		}
	},
	methods:{
		row(row){
			this.$emit('row', row)
		}
	}
}
</script>
