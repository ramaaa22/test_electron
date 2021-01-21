export default {
    methods: {
        satinizeTitle(text) {
            text= text.charAt(0).toUpperCase() + text.slice(1);
            text=text.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, ' ');
            return text
                .replace(/[^a-zA-Zá-úÁ-Ú0-9 üÜñÑ?¿()"-/]+/g, '');
        },

        satinizeSlug(text) {
            text=text.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
            text=text.trim();
            return text
                .toLowerCase()
                .replace(/ /g, '_')
                .replace(/-/g, '_')
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