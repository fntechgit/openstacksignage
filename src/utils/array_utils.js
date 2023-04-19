export const intCheck = (a, b) => {
    if(a < b) return -1;
    if(a > b) return 1;
    return 0;
}

export const insertSorted = (arr, elem, fnCheck) =>
{
    let i;
    let n = arr.length;
    for (i = n - 1; (i >= 0 && fnCheck(arr[i], elem) > 0); i--)
        arr[i + 1] = arr[i];
    arr[i + 1] = elem;
    return i+1;
}