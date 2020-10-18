

export interface Audio {
    title: string,
    artist: string,
}

export interface Picture {
    title: string,
    note: string,
    meta: any,
}

export interface Video {
    title: string,
    note: string,
    meta: any
}

export interface Item {
    type: "audio"|"picture"|"video"|"collection",
    id: string,
    a: any
    containedIn: Array<string>,
    file?: string
}

export interface Collection {
    title: string,
    artist: string,
    note: string,
    content: Array<string>,
}