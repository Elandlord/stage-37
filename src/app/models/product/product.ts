export class Product {
    id: number;
    name: string;
    code: string;
    description: string;
    product_line_id: number;
    insulating_factor_with_gown: number;
    insulating_factor_without_gown: number;
    fluid_type: number;
    alpha: number;
    alpha_white: number;
    alpha_reflective: number;
    heat_type: number;
    country_id: any[];
    combine_with: any[];
}
