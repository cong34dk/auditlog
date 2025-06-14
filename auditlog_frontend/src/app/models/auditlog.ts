export interface AuditLog {
    id: number;
    username: string;
    action: string;
    tableName: string;
    timestamp: Date;
    oldValues: string | null;
    newValues: string | null;

    parsedOldValues?: { [key: string]: any };
    parsedNewValues?: { [key: string]: any };
}