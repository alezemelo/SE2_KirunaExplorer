export default class KirunaDate {
    static normalizeToISOString(dateString: string): string {
        return dateString.replace('.000', '');
    }
}