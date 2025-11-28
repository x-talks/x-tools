// Export utilities for visualizations
export async function exportToPNG(elementId: string, filename: string = 'team-visualization.png') {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const { toPng } = await import('html-to-image');
        const dataUrl = await toPng(element, {
            quality: 1.0,
            pixelRatio: 2,
        });

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Failed to export PNG:', error);
    }
}

export async function exportToSVG(elementId: string, filename: string = 'team-visualization.svg') {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const { toSvg } = await import('html-to-image');
        const dataUrl = await toSvg(element);

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Failed to export SVG:', error);
    }
}

export function exportToJSON(data: any, filename: string = 'team-data.json') {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

export async function copyToClipboard(data: any) {
    try {
        await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}
