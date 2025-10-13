export function makePlaceholder(rowCount: number, columnCount: number) {
    const start = (rowCount * columnCount) + 1
    return `(${Array.from({length: columnCount}, (_, i) => `$${start + i}`).join(",")})`
}
