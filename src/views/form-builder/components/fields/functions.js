export default {
    methods: {
        $richTextProcessing(text) {
            const result = text
                .replace(/\[href="([^"]+)"\]([^\[]+)\[\/href\]/g, '<a target="_blank" href="$1">$2</a>')
                .replace(/\[b\]([^\[]+)\[\/b\]/g, '<strong>$1</strong>')
                .replace(/\[br\/\]/g, '<br/>');

            return  result; 
        }
    }
}