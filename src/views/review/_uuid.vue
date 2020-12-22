<template>
<el-main>
    <div 
        id="tabs-container"
        class="app-container">
        <el-tabs 
            type="border-card" 
            v-model="tabs.active"
            @tab-remove="removeTab">
            <el-tab-pane 
     
                name="applications"
                label="Inscripciones"
                :closable="false">
                <applications-table
                    @open-application="openApplication"
                    @open-evaluations="openEvaluations"
                    @open-tasks="openTasks"
                    :titles="announcement.columns"
                    :filters="announcement.filters"
                    :types="announcement.types"
                    :tabs="tabs.items"
                    :announcement_uuid="announcement_uuid"
                    :update="update_applications" />
            </el-tab-pane>
            
            <el-tab-pane
                v-for="item in tabs.items"
                :key="`tab-${item.name}`"
                :label="item.title"
                :name="item.name"
                :closable="true">
                <component 
                    :is="item.component"
                    v-bind="item.props"
                    :name="announcement.name"
                    @update-applications="update_applications = true"
                    @open-tasks="openSubmit" />
            </el-tab-pane>
        </el-tabs>
    </div>
</el-main>
</template>
<script>
import app from '@/store/modules/app'
import ApplicationsTable from '@/views/review/components/ApplicationsTable'
import ApplicationRender from '@/views/review/components/ApplicationRender'
import EvaluationTable from '@/views/review/components/EvaluationTable'
import TasksTable from '@/views/review/components/TasksTable'
//import Download from '@/views/tasks/components/Download'
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

    computed: {
        announcement_uuid () {
            return this.$route.params.uuid;
        },
       
    },
   
    async created(){
        try {
            //const endpoint = `/clients/announcements/${this.announcement_uuid}`;
            
            //API SEBA
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
                //const endpoint = `/clients/announcements/${this.announcement_uuid}/applications/${application_uuid}`;
                
                //API SEBA
                const endpoint= `/revisions/${this.announcement_uuid}/applications/${application_uuid}`;
                
                const { data } = await axios.get(endpoint, {   api: "revision",
                    oauth: true });
                const steps = data.resource.form
                const idnumber = data.resource.idnumber
                const name =  `application-${idnumber}`;

                this.$router.push({
                    name: 'form-viewer-index',
                    params: {
                        id: application_uuid,
                        application: steps,
                        title: idnumber,
                        type: 'review',
                        uuid: this.announcement_uuid,
                        parent: {
                            name: 'Revision',
                            path: '/revision',
                            redirect: true,
                            child:{
                                name: this.announcement_name,
                                route_name: 'revision.announcements.single',
                                path: `/revision/${this.announcement_uuid}`,
                                uuid: this.announcement_uuid
                            }
                        },
                    }
                })
                /*const tab = this.tabs.items.find(tab => (tab.name === name));

                if (!tab)
                    this.tabs.items.push({
                        name,
                        title: `Inscripción de ${idnumber}`,
                        component: 'application-render',
                        props: { steps, idnumber }
                    });

                this.tabs.active = name*/
            } 
            catch (error) {
                console.log(error)
            }      
        },

        async openEvaluations(application_uuid, idnumber){
            try {
                const name = `evaluation-${idnumber}`
                const tab = this.tabs.items.find(tab => (tab.name === name));
           
                if (!tab)
                    this.tabs.items.push({
                        name,
                        title: `Evaluación de ${idnumber}`,
                        component: 'evaluation-table',
                        props: { application_uuid }
                    });

                this.tabs.active = name
            } 
            catch (error) {
                console.log(error)
            }      
        },

        async openTasks(application_uuid, idnumber){
            try {
                const name = `tasks-${idnumber}`
                const tab = this.tabs.items.find(tab => (tab.name === name));
           
                if (!tab)
                    this.tabs.items.push({
                        name,
                        title: `Tareas de ${idnumber}`,
                        component: 'tasks-table',
                        props: {
                            application_uuid, 
                            idnumber
                        }
                    });

                this.tabs.active = name
            } 
            catch (error) {
                console.log(error)
            }      
        },

        async openSubmit(submit, idnumber){
            try {
                //const endpoint = `/clients/tasks/${submit.task.uuid}/submits/${submit.uuid}`;
                
                //API SEBA
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
        ApplicationsTable,
        ApplicationRender,
        EvaluationTable,
        TasksTable
    }
}
</script>

<style lang="scss">
    #tabs-container {
        .el-tabs__content {
            padding: 0;
        }
    }
</style>