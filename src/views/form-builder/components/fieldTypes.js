export default [
    {     
        text: 'Texto simple',
        name: '',
        type: 'input',
        label: '',
        hint: '',
        rules: {
            required: false,
            email: false,
            integer: false,
            min: {
                enabled: false,
                value: 0
            },
            max: {
                enabled: false,
                value: 0
            },
            digits_between: {
                enabled: false,
                min: 1,
                max: 8
            }
        }
    },
    {     
        text:'Texto informativo',
        type: 'text', 
        view: 'label',
        title: 'Título',
        description:'Cuerpo del texto',
    },
    {
        text:'Texto multi-línea',
        name: '',
        type: 'textarea',
        hint: '',
        label: '',
        rules: {
            required: false,
            min: {
                enabled: false,
                value: 0
            },
            max: {
                enabled: false,
                value: 0
            },
        }
    },
    {
        text: 'Subida de archivo',
        name: '',
        type: 'file', 
        label: '',
        hint: '',
        accept: '',
        rules: {
            required: false,
            uploads: {
                limit: false,
                min: 0,
                max: 1
            }
        }
    },
    {
        text:'Selección',
        name: '',
        type: 'radio',
        label: '',
        hint: '',
        options: [
            {
                value: 'valor_1',
                label: 'Valor 1',
                hint: ''
            },
            {
                value: 'valor_2',
                label: 'Valor 2',
                hint: ''
            },
            {
                value: 'valor_3',
                label: 'Valor 3',
                hint: ''
            }
        ],
        rules: {
            required: false
        }
    },
    {
        text:'Selección múltiple',
        name: '',
        type: 'checkbox',
        label: '',
        hint: '',
        options: [
            {
                value: 'valor_1',
                label: 'Valor 1',
                hint: ''
            },
            {
                value: 'valor_2',
                label: 'Valor 2',
                hint: ''
            },
            {
                value: 'valor_3',
                label: 'Valor 3',
                hint: ''
            }
        ],
        rules: {
            required: false,
            min: {
                enabled: false,
                value: 0
            },
            max: {
                enabled: false,
                value: 0
            }
        }
    },
    {
        text:'Fecha',
        name: '',
        type: 'date',
        label: '',
        hint: '',
        rules: {
            required: false,
            adult: false,
            date: true
        }
    },
    {
        text:'Localidad',
        name: '',
        type: 'district',
        rules: {
            required: false,
            district: true
        }
    },
]