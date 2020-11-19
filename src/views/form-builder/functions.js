export default {
    methods: {
        satinizeTitle(text) {
            return text
                .replace(/[^a-zA-Zá-úÁ-Ú0-9 üÜñÑ?¿]+/g, '');
        },

        satinizeSlug(text) {
            return text
                .toLowerCase()
                .replace(/ /g, '_')
                .replace(/á/g, 'a')
                .replace(/é/g, 'e')
                .replace(/í/g, 'i')
                .replace(/ó/g, 'o')
                .replace(/ú/g, 'u')
                .replace(/ü/g, 'u')
                .replace(/ñ/g, 'n')
                .replace(/[^a-z0-9_]+/g, '');
        }
    },
};