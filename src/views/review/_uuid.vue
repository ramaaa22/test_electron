<template>
<el-main>
    <div 
        id="tabs-container"
        class="app-container">
                <applications-table
                    @open-application="openApplication"
                    @open-evaluations="openEvaluations"
                    @open-tasks="openTasks"
                    :titles="announcement.columns"
                    :filters="announcement.filters"
                    :types="announcement.types"
                    :tabs="tabs.items"
                    :announcement_uuid="prop"
                    :update="update_applications" />
    </div>
</el-main>
</template>
<script>
import ApplicationsTable from '@/views/review/components/ApplicationsTable'
import axios from '@/utils/request';

export default {
    data: () => ({
        tabs: {
            active: 'applications',
            items: []
        },
       
        announcement: false,
        update_applications: false
    }),

    props: ['prop'],

    computed: {
          announcement_uuid(){
              return this.prop;
          },
        announcement_name () {
            return this.$route.params.title;
        }
    },
   
    async created(){
        try {
            const endpoint = `/revisions/${this.announcement_uuid}`;
            const { data } = await axios.get(endpoint, {   api: "revision",
            oauth: true });
            const { name, columns, filters, types } = data.resource.announcement;
            
            this.announcement = { name, columns, filters, types };
        } 
        catch (error) {
            console.log(error)
        }
         
    },

    methods:{
        async openApplication(application_uuid){
            try {
                const endpoint= `/revisions/${this.announcement_uuid}/applications/${application_uuid}`;
                
                const { data } = await axios.get(endpoint, {   api: "revision",
                    oauth: true });
                const steps = data.resource.form
                const idnumber = data.resource.idnumber
                const name =  `application-${idnumber}`;

                const props = {
                    name:`application-${idnumber}`,
                    title:`Inscripción de ${idnumber}`,
                    component:'form_viewer',
                    prop: {steps, idnumber, name}
                };
                this.$emit('open-tab',props);

            } 
            catch (error) {
                console.log(error)
            }      
        },

        async openEvaluations(application_uuid, idnumber){
            try {
                const props = {
                    name:`evaluation-${idnumber}`,
                    title:`Evaluación de ${idnumber}`,
                    component:'evaluation_table',
                    prop: {application_uuid}
                }
                this.$emit('open-tab',props);

            } 
            catch (error) {
                console.log(error)
            }      
        },

        async openTasks(application_uuid, idnumber){
            try {
                const props = {
                    name: `tasks-${idnumber}`,
                    title: `Tareas de ${idnumber}`,
                    component: 'tasks_table',
                    prop: { application_uuid, idnumber}
                }
                this.$emit('open-tab', props);

            } 
            catch (error) {
                console.log(error)
            }      
        },

        async openSubmit(submit, idnumber){
            try {
                const endpoint= `/tasks/${submit.task.uuid}/submits/${submit.uuid}`;
                
                
                const  {data}  = await axios.get(endpoint, {   api: "revision",
                oauth: true });
                
                const name = `submit-${submit.task.title}-${idnumber}`;
                const tab = this.tabs.items.find(tab => (tab.name === name));
                const steps = data.resource.submit;

                if (!tab)
                    this.tabs.items.push({
                        name,
                        title: `${submit.task.title} de ${idnumber}`,
                        component: 'application-render',
                        props: { steps },
                        idnumber
                    });

                this.tabs.active = name;
            } 
            catch (error) {
                console.log(error)
            }
        },

        removeTab(targetName) {
            const tabs = this.tabs.items;
            const activeName = this.tabs.active;

            if (activeName === targetName) 
                this.tabs.active = 'applications';
            
            this.tabs.items = tabs.filter(tab => tab.name !== targetName);
        }

    },

    components:{
        ApplicationsTable
    }
}
</script>

<style scoped lang="scss">
    #tabs-container {
        .el-tabs__content {
            padding: 0;
        }
    }
</style>