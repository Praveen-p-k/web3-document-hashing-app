export const truncateWordAtIndex = (word: string, index: number) => {
    return `${word.slice(0, index)}....${word.slice(index * -1)}`
}