export interface PageReview {
    id: number;
    puntuacion: number;
    comentario: string;
    user?: {
        id: number;
        name: string;
    };
    created_at: string;
}
