<template>
    <div id="applications-table">
        <div class="text-right mb-2 pt-2 pr-5 actions">
            <el-tag
                effect="plain"
                size="mini"
                class="mr-2">{{ loading ? 'Cargando..' : `${total} resultados` }}</el-tag>
            
            <el-badge 
                v-if="selected_applications"
                :value="selected_applications.length"
                :hidden="selected_applications.length === 0"
                class="mr-2">
                <el-button-group>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="Seleccionar todas"
                        placement="top">
                        <el-button
                            size="mini"
                            type="default"
                            @click="selectApplications"
                            icon="las la-check-square" 
                            plain
                            circle></el-button>
                    </el-tooltip>
                    <el-tooltip
                        v-if="selected_applications"
                        effect="dark"
                        content="Deseleccionar todas"
                        placement="top">
                        <el-button
                            size="mini"
                            type="default"
                            @click="deselectApplications"
                            icon="las la-stop" 
                            plain
                            circle></el-button>
                    </el-tooltip>
                </el-button-group>
            </el-badge>

            <el-tooltip
                effect="dark"
                content="Asignar tareas"
                placement="top">
                <el-button
                    size="mini"
                    type="warning"
                    :disabled="true"
                    @click="openAssign('task')"
                    icon="las la-tasks" 
                    plain
                    circle></el-button>
            </el-tooltip>

            <el-tooltip
                effect="dark"
                content="Asignar jurados"
                placement="top">
                <el-button
                    size="mini"
                    type="warning"
                    icon="las la-gavel" 
                    v-if="selected_applications"
                    :disabled="selected_applications.length === 0 || !selected_applications"
                    @click="openAssignation('juries')"
                    plain
                    circle></el-button>
            </el-tooltip>
          
            <el-tooltip
                effect="dark"
                content="Abrir filtros"
                placement="top">
                <el-button
                    size="mini"
                    type="success"
                    icon="las la-filter" 
                    @click="edit.filters = true"
                    plain
                    circle></el-button>
            </el-tooltip>

            <el-tooltip
                effect="dark"
                content="Abrir orden"
                placement="top">
                <el-button
                    size="mini"
                    type="success"
                    icon="las la-sort-alpha-down" 
                    @click="edit.order = true"
                    plain
                    circle></el-button>
            </el-tooltip>

            <el-tooltip
                effect="dark"
                content="Abrir configuración de tabla"
                placement="top">
                <el-button
                    size="mini"
                    type="success"
                    icon="las la-cog" 
                    @click="edit.columns = true"
                    plain
                    circle></el-button>
            </el-tooltip>

            <el-tooltip
                effect="dark"
                content="Items por página"
                placement="top">
                <el-badge 
                    :value="items_per_page">
                    <el-dropdown 
                        size="mini"
                        class="ml-2" 
                        placement="bottom">
                        <el-button
                            size="mini"
                            type="primary"
                            icon="las la-list-ol"
                            class="el-dropdown-link"
                            plain
                            circle></el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="items_per_page = 10">10</el-dropdown-item>
                            <el-dropdown-item @click.native="items_per_page = 25">25</el-dropdown-item>
                            <el-dropdown-item @click.native="items_per_page = 50">50</el-dropdown-item>
                            <el-dropdown-item @click.native="items_per_page = 100">100</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                 </el-badge>
            </el-tooltip>
        </div>

        <assign-component
            :open="assignation.open"
            :announcement_uuid="announcement_uuid"
            :evaluation_tables="evaluation_tables"
            @close-dialog="closeAssignation"
            :selected_applications="selected_applications"
            :type="assignation.type">
        </assign-component>

        <el-dialog 
            title="Columnas visibles" 
            :visible.sync="edit.columns" 
            width="600px">
            <el-table
                row-key="column"
                size="mini"
                :data="columns_as_array">

                <el-table-column 
                    label="Columna" 
                    prop="title"></el-table-column>

                <el-table-column 
                    align="center"
                    label="Mostrar" 
                    width="70px">
                    <template slot-scope="{ row: column }">
                        <el-switch 
                            v-model="column.visible"
                            :disabled="column.disabled"
                        ></el-switch>
                    </template>
                </el-table-column>

                <el-table-column 
                    align="center"
                    label="Fijar" 
                    width="70px">
                    <template slot-scope="{ row: column }">
                        <el-switch 
                            v-model="column.fixed"
                            :disabled="!column.visible"></el-switch>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog 
            title="Filtros" 
            @close="retrieveApplications()"
            :visible.sync="edit.filters" 
            width="600px">
            <el-table
                row-key="column"
                size="mini"
                :data="filterable_columns">

                <el-table-column 
                    label="Columna" 
                    prop="title"></el-table-column>

                <el-table-column
                    align="right"
                    width="200"
                    label="">
                    <template slot="header">
                        <el-tooltip
                            effect="dark"
                            content="Limpiar filtros"
                            placement="top">
                            <el-button
                                type="danger"
                                size="mini"
                                icon="las la-broom"
                                @click="query = {}"
                                circle
                                plain/>
                        </el-tooltip>
                    </template>

                    <template slot-scope="{ row: column }">
                        
                        <el-input
                            v-if="column.name === 'idnumber'" 
                            width="200"
                            size="small"
                            :ref="`filter-${column.name}`"
                            v-model="query[column.name]"
                            @blur="({ target }) => changeFilterValue(column.name, target.value)" />

                        <el-select 
                            v-if="column.name === 'blocked'"
                            width="200"
                            size="small"
                            :ref="`filter-${column.name}`"
                            v-model="query[column.name]"
                            @change="value => changeFilterValue(column.name, value)"
                            :name="`filter-${column.name}`"
                            clearable>
                            <el-option
                                v-for="(value,label) in options.blocked"
                                :key="`option-${column.name}-${value}`"
                                :label="label"
                                :value="value">
                            </el-option>
                        </el-select>

                        <el-select 
                            v-if="column.name === 'evaluations'"
                            width="200"
                            size="small"
                            :ref="`filter-${column.name}`"
                            v-model="query[column.name]"
                            @change="values => changeFilterValue(column.name, values)"
                            :name="`filter-${column.name}`"
                            clearable>
                            <el-option
                                v-for="(value,label) in options.evaluations"
                                :key="`option-${column.name}-${value}`"
                                :label="label"
                                :value="value">
                            </el-option>
                        </el-select>

                        <el-select 
                            v-if="typeof column.filters === 'object'"
                            width="200"
                            size="small"
                            :ref="`filter-${column.name}`"
                            v-model="query[column.name]"
                            @change="values => changeFilterValue(column.name, values)"
                            :name="`filter-${column.name}`"
                            clearable
                            multiple>
                            <el-option
                                v-for="filter in column.filters"
                                :key="`option-${column.name}-${filter}`"
                                :label="filter"
                                :value="filter">
                            </el-option>
                        </el-select>

                        <el-select 
                            v-if="column.filters === 'provinces'"
                            width="200"
                            size="small"
                            :ref="`filter-${column.name}`"
                            v-model="query[column.name]"
                            @change="values => changeFilterValue(column.name, values)"
                            :name="`filter-${column.name}`"
                            clearable
                            multiple>
                            <el-option
                                v-for="province in provinces"
                                :key="`option-${column.name}-${province.id}`"
                                :label="province.name"
                                :value="province.name">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog 
            title="Orden" 
            @close="retrieveApplications()"
            :visible.sync="edit.order" 
            width="50%">
            <el-transfer
                target-order="push"
                :titles="['Columnas', 'Ordenar por']"
                :props="{
                    key: 'name',
                    label: 'title',
                    disabled: 'none'
                }"
                v-model="columns_to_order"
                :data="columns_as_array"
                @change="reloadOrderDirection">
            </el-transfer>
            <el-table
                row-key="column"
                size="mini"
                :data="Object.keys(order_directions)">

                <el-table-column 
                    label="Columna">
                    <template slot-scope="{ row: column }">
                        <span>{{ titles[column] }}</span>
                    </template>    
                </el-table-column>

                <el-table-column
                    align="right"
                    width="200"
                    label="">
                    <template slot-scope="{ row: column }">
                        <el-select
                            width="200"
                            size="small"
                            :ref="`direction-${column}`"
                            v-model="order_directions[column]"
                            :name="`filter-${column}`">
                            <el-option
                                label="Ascendente"
                                value="asc">
                            </el-option>
                            <el-option
                                label="Descendente"
                                value="desc">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <el-table
            size="mini"
            v-loading="loading"
            :data="applications"
            border
            fit
            highlight-current-row>
            <el-table-column 
                align="center"
                label="Estados"
                width="175" 
                :fixed="true" 
                :resizable="true">
                <template slot-scope="{ row: application}">
                    <div class="text-right">

                        <el-tooltip
                            v-if="tabs.find(item =>(item.name === `evaluations-${application.idnumber}`)) != undefined"
                            class="item"
                            effect="dark"
                            content="Evaluaciones abiertas"
                            placement="top">
                            <i class="las la-gavel color-success on-off-loop"></i>
                        </el-tooltip>

                        <el-tooltip
                            v-if="tabs.find(item =>(item.name === `tasks-${application.idnumber}`)) != undefined"
                            class="item"
                            effect="dark"
                            content="Tareas abiertas"
                            placement="top">
                            <i class="las la-tasks color-success on-off-loop"></i>
                        </el-tooltip>

                        <el-tooltip
                            v-if="tabs.find(item =>(item.name === `application-${application.idnumber}`)) != undefined"
                            class="item"
                            effect="dark"
                            content="Inscripción abierta"
                            placement="top">
                            <i class="las la-edit color-success on-off-loop"></i>
                        </el-tooltip>

                        <el-tooltip
                            v-if="application.rejected_at > 0"
                            class="item"
                            effect="dark"
                            placement="top">
                                <div slot="content">
                                    {{renderIconTooltip(application, 'rejected_at')}}
                                    <br/>{{application.meta.rejection_message}}
                                </div>
                            <i class="las la-times-circle"></i>
                        </el-tooltip>

                        <el-tooltip
                            v-if="application.winner === true"
                            class="item"
                            effect="dark"
                            content="Ganador"
                            placement="top">
                            <i class="las la-medal"></i>
                        </el-tooltip>

                        <el-tooltip
                            v-if="application.sent_at && tooltipUpdatedVisible(application.sent_at, application.updated_at)"
                            class="item"
                            effect="dark"
                            :content="renderIconTooltip(application, 'updated_at')"
                            placement="top">
                            <i class="las la-sync color-warning"></i>
                        </el-tooltip>

                        <el-tooltip
                            v-if="application.sent_at"
                            class="item"
                            effect="dark"
                            :content="renderIconTooltip(application, 'sent_at')"
                            placement="top">
                            <i class="las la-paper-plane color-success"></i>
                        </el-tooltip>

                        <el-tooltip
                            v-if="application.evaluations_count"
                            class="item"
                            effect="dark"
                            :content="`${application.evaluations_count} jurados asignadxs`"
                            placement="top">
                            <i class="las la-chalkboard-teacher color-primary"></i>
                        </el-tooltip>

                        <el-tooltip
                            class="item"
                            effect="dark"
                            :class="{
                                'color-primary': application.blocked,
                                'color-warning': !application.blocked
                            }"
                            :content="application.blocked ? 'Bloqueada' : 'Desbloqueada'"
                            placement="top">
                            <i
                                :class="{
                                    'la-lock' : application.blocked === true,
                                    'la-lock-open' : !application.blocked
                                }"
                                class="las cursor-pointer"
                                @click="toggleBlocked(application.uuid, application.blocked)"></i>
                        </el-tooltip>

                        <el-checkbox 
                            v-model="applications_index[application.uuid]"
                            class="ml-1"/>
                    </div>
                </template>
            </el-table-column>

            <el-table-column
                v-for="{ title, fixed, name, type } in this.visible_columns"
                :key="`table-column-${name}`"
                align="center"
                :label="title"
                :fixed="fixed"
                min-width="200">
                <template slot-scope="{ row: application }">
                    <div v-html="renderCell(application, { name, type})"></div>
                </template>
            </el-table-column>

            <el-table-column 
                align="center"
                label="Operaciones"
                width="170" 
                fixed="right">
                <template slot-scope="{ row: application }">
                    <el-button-group>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="Abrir inscripción"
                            placement="top">
                            <el-button
                                round
                                plain
                                size="mini"
                                icon="las la-edit"
                                @click="$emit('open-application', application.uuid)"></el-button>
                        </el-tooltip>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="Abrir tareas"
                            placement="top">
                            <el-button
                                round
                                plain
                                size="mini"
                                icon="las la-tasks"
                                @click="$emit('open-tasks', application.uuid, application.idnumber)"></el-button>
                        </el-tooltip>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="Abrir evaluaciones"
                            placement="top">
                            <el-button
                                round
                                plain
                                size="mini"
                                icon="las la-gavel"
                                @click="$emit('open-evaluations', application.uuid, application.idnumber)"></el-button>
                        </el-tooltip>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            align="center"
            @current-change="handlePageChange"
            :current-page="current_page"
            layout="prev, pager, next"
            :page-count="pages_count"
        ></el-pagination>
    </div>
</template>

<script>
import axios from '@/utils/request';
import AssignComponent from '@/views/revision/components/AssignComponent';
import moment from 'moment';

export default {
    data: () => ({
        provinces: [],
        evaluation_tables: [],
        applications: [],
        columns_as_array: [],
        applications_index: {},
        current_page: null,
        pages_count: null,
        total: null,

        query: {},
        columns_to_order: [],
        order_directions: {},
        items_per_page: 25,
        
        edit: {
            columns: false,
            filters: false,
            order: false
        },

        options: {
            blocked: {
                "Bloqueadas": 1, 
                "Desbloqueadas": 0 
            },

            evaluations:{
                "Asignadas": 'assigned',
                "Evaluadas": 'evaluated',
                "No evaluadas": 'not_evaluated',
                "No asignadas": 'not_assigned'
            },

        },

        loading: true,

        assignation: {
            type: '',
            open: false
        }
    }),

    props: {
        titles: Object,
        filters: Object,
        types: Object,
        tabs: Array,
        announcement_uuid: String,
        update: Boolean
    },

    asyncComputed: {
        async visible_columns() {
            const there_are_columns = this.columns_as_array !== null;

            return there_are_columns
                ? this.columns_as_array.filter(column => (column && column.visible))
                : [];
        },

        async filterable_columns() {
            const there_are_columns = this.columns_as_array !== null;

            if (!there_are_columns)
                return [];

            const columns = this.columns_as_array.filter(column => (column && column.filters && column.type !== 'district'));

            return ([ 
                { name: 'idnumber', title: 'Filtrar por documento' },
                { name: 'blocked', title: 'Filtrar por bloqueadas/desbloqueadas' },
                { name: 'evaluations', title: 'Filtrar respecto a las evaluaciones' } 
            ]).concat(columns);
        },

        async selected_applications() {
            const uuids = Object.keys(this.applications_index);
            const selected_applications = [];

            await Promise.all(uuids.map(uuid => {
                if (this.applications_index[uuid])
                    selected_applications.push(uuid);
            }));

            return selected_applications;
        }
    },

    watch: {
        items_per_page: function() {
            this.retrieveApplications();
        },

        update: function() {
            if (this.update) {
                this.retrieveApplications(this.current_page);
                this.update = false;
            }
        }
    },

    async mounted() {
        try {
            const { data: provinces } = await axios.get('/places/provinces', {   api: "revision",
                oauth: true });
            const { data: evaluation_tables } = await axios.get(`/clients/announcements/${this.announcement_uuid}/evaluation-tables`, {
                  api: "revision",
                oauth: true
            });

            this.provinces = provinces.resources;
            this.evaluation_tables = evaluation_tables.resources;

            await this.retrieveApplications();
            await this.initColumnsAsArray();

            this.titles['idnumber'] = 'Documento';
            this.titles['email'] = 'Email';
        } 
        catch (error) {
            console.error(error);
        } 
        finally {
            this.loading = false;
        }
    },

    methods: {
        async getQueryParams() {
            const where_in = [];
            const where = [];

            await Promise.all(Object.keys(this.query).map(column => {
                const array_field_types = [ 'radio', 'checkbox', 'province' ];
                const values = this.query[column];
                const needs_to_be_array = array_field_types.indexOf(this.types[column]) > -1;
                const is_array_value = typeof values === 'object';
                const there_are_values = !needs_to_be_array || (is_array_value && values.length > 0);
               
                if (!there_are_values)
                    return;

                if (column === 'idnumber' && values)
                    where.push({
                        field: 'idnumber',
                        value: values
                    });

                else if (column === 'blocked' && (Object.values(this.options.blocked)).indexOf(values) > -1)
                    where.push({
                        field: 'blocked',
                        value: values
                    });
                
                else if(column === 'evaluations'  && (Object.values(this.options.evaluations)).indexOf(values) > -1) {
                    if (values === 'evaluated')
                        where.push({
                            field: 'evaluations.evaluated',
                            operator: '>',
                            value: 0,
                        });
                    else if (values === 'not_evaluated')
                        where.push({
                            field: 'evaluations.not_evaluated',
                            operator: '>',
                            value: 0,
                        });
                    else
                        where.push({
                            field: 'evaluations.assigned',
                            value: values === 'assigned' ? 1 : 0,
                        });

                }

                else if (is_array_value)
                    where_in.push({
                        field: column,
                        values
                    });
            }));

            const query_params = {
                per_page: this.items_per_page
            };

            await Promise.all(where.map((condition,index) => {
                query_params[`where[${index}][field]`] = condition.field;
                query_params[`where[${index}][value]`] = condition.value;

                if (condition.operator)
                    query_params[`where[${index}][operator]`] = condition.operator;
            }));

            await Promise.all(where_in.map((condition,index) => {
                query_params[`where_in[${index}][field]`] = condition.field;
                query_params[`where_in[${index}][values]`] = condition.values;
            }));

            await Promise.all(this.columns_to_order.map((column,index) => {
                const method = this.order_directions[column];

                query_params[`order[${index}][field]`] = column;
                query_params[`order[${index}][method]`] = method;
            }));

            return query_params;
        },

        async retrieveApplications(page) {
            try {
                this.loading = true;
                this.$forceUpdate();
            
                const endpoint = `/clients/announcements/${this.announcement_uuid}/applications${ page ? `?page=${page}` : '' }`;
                const { data } = await axios.get(endpoint, { 
                    params: await this.getQueryParams(),
                      api: "revision",
                oauth: true 
                });

                this.applications = data.resources;
                this.current_page = data.current_page;
                this.pages_count = data.last_page;
                this.total = data.total;
                
                await this.initApplicationIndex(data.resources);
            }
            finally {
                this.loading = false;
            }
        },

        async handlePageChange(page) {
            this.retrieveApplications(page);
        },

        async initApplicationIndex(applications) {
            const uuids = Object.keys(this.applications_index);

            const applications_index = {};
            
            await Promise.all(uuids.map(uuid => { 
                if (this.applications_index[uuid])
                    applications_index[uuid] = true;
            }));

            await Promise.all(applications.map(application => {
                if (!applications_index[application.uuid])
                    applications_index[application.uuid] = false;
            }));

            this.applications_index = applications_index;
        },

        async toggleBlocked(application_uuid, blocked) {
            try {
                const confirmation = await this.$confirm(
                    `¿Está segurx que desea ${blocked ? 'desbloquear' : 'bloquear'} esta inscripción?`,
                    'Por favor, confirmar', {
                        distinguishCancelAndClose: true,
                        confirmButtonText: 'Confirmar',
                        cancelButtonText: 'Cancelar',
                    });

                if (confirmation != 'confirm') 
                    return;

                this.loading = true;

                const endpoint = `/clients/announcements/${this.announcement_uuid}/applications/${application_uuid}`;
                const { data } = await axios.put(endpoint, { blocked: blocked ? 0 : 1 }, {   api: "revision",
                oauth: true });

                this.applications = await Promise.all(this.applications.map((application) => {
                    if (application.uuid === application_uuid)
                        application.blocked = !blocked;
                    
                    return application;
                }));
            } 
            catch (error) {
                console.error(error);
            } 
            finally {
                this.loading = false;
            }
        },

        async initColumnsAsArray() {
            const forbiddenTypes = [ 'file', 'textarea' ];
            const columns = Object.keys(this.types);
            const columns_as_array = [{  
                name: 'idnumber',
                title: 'Documento',
                type: 'input',
                filters: undefined,
                visible: true,
                fixed: false,
                disabled: true
            },
            {  
                name: "email",
                title: 'Email',
                type: 'input',
                filters: undefined,
                visible: true,
                fixed: false,
                disabled: true
            }];

            await Promise.all(columns.map(column => {
                const type = this.types[column];

                if (forbiddenTypes.indexOf(type) > -1)
                    return null;
                
                const title = this.titles[column];
                const filters = this.filters[column];
                
                columns_as_array.push({
                    name: column,
                    title,
                    type,
                    filters,
                    visible: false,
                    fixed: false
                });
            }));

            this.columns_as_array = columns_as_array;
        },

        renderCell(application, { name, type }) {
            const name_parts = name.split('.');
            const step = name_parts[0];
            const field = name_parts[1];

            if (!field) {
                let value = application[step]
                return value
            }
            else if (type === 'date') {
                let value = application[step][field];
                return moment(value).format('D ? MMMM ? YYYY').replace(/\?/g, 'de');
            }
            else {
                let value = application[step][field];
                return value;
            }
            
        },

        renderIconTooltip(application, field) {
            let state;

            switch(field) {
                case 'rejected_at': state = 'Rechazado'; break;
                case 'sent_at':     state = 'Enviado'; break;
                case 'updated_at':  state = 'Actualizado'; break;
            }
            
            return `${state} el ${moment.unix(application[field]).format('DD ? MMMM ? YYYY HH:MM').replace(/\?/g, 'de')}`
            
        },

        tooltipUpdatedVisible(sent_at, updated_at) {
            return moment.unix(sent_at).format('YYYYMMDDHHMM') !== moment.unix(updated_at).format('YYYYMMDDHHMM') 
        },

        changeFilterValue(column, values) {
            const element = this.$refs[`filter-${column}`];
            element.$forceUpdate();
            this.query[column] = values;
        },

        openAssignation(type){
            this.assignation.open = true;
            this.assignation.type = type;
        },

        async closeAssignation(reset) {
            this.assignation.open = false;

            if (reset) {
                await this.resetSelectedApplications();
                await this.retrieveApplications(this.current_page);
            }
        },

        async deselectApplications() {
            const count = this.selected_applications.length;

            if (count < 2)
                return await this.resetSelectedApplications();

            try {
                await this.$confirm(`¿Está segurx que desea deseleccionar las ${count} inscripciones?`, 'Espere..', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: 'Confirmar',
                    cancelButtonText: 'Cancelar',
                    type: 'warning'
                });
                
                await this.resetSelectedApplications();
            }
            catch(error) {}
        },
        
        async selectApplications() {
            try {
               this.loading = true;

                const uuids = Object.keys(this.applications_index);

                await Promise.all(uuids.map(uuid => {
                    this.applications_index[uuid] = true;
                }));

                this.loading = false; 
            }
            catch(error) {}
        },

        async resetSelectedApplications() {
            this.loading = true;

            const uuids = Object.keys(this.applications_index);

            await Promise.all(uuids.map(uuid => {
                this.applications_index[uuid] = false;
            }));

            this.loading = false;
        },

        async reloadOrderDirection() {
            const order_directions = {};

            await Promise.all(this.columns_to_order.map(column => {
                const value = this.order_directions[column];

                order_directions[column] = value
                    ? value
                    : 'asc';
            }));

            this.order_directions = order_directions;
        }
    },

    components:{
        AssignComponent
    }
};
</script>

<style lang="scss">
    #applications-table {
        .actions {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            // .el-badge {
            //     margin-top: -5px;
            // }

            // .el-badge + .el-button, 
            // .el-badge + .el-badge {
            //     margin-left: 10px;
            // }

            // .el-badge__content {
            //     top: 3px;
            //     right: 13px;
            //     z-index: 1;
            // }

            .el-button {
                width: 34px;
                height: 34px;
                display: inline-flex;
                justify-content: center;
                align-items: center;
            }

            // .el-dropdown {
            //     float: right;
            // }
        }
    }
</style>