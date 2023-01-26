export const roundDecimal = (numPlaces: number, number: number) => {
    return Math.round(number * 10 ** numPlaces) / 10 ** numPlaces;
}

export const roundDecimal10 = roundDecimal.bind(null, 10);