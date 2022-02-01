export interface QueryI {
    field: string;
    condition: '==' | '!=' | '>' |'>=' | '<' | '<=' | 'in' | 'not-in' | 'array-contains' | 'array-contains-any';
    value: string | number | boolean;
}
