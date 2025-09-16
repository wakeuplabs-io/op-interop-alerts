import { HealthAlert, HealthLevel } from "./generateHealthAlerts";

export function determineHealthLevel(alerts: HealthAlert[]): HealthLevel {
    if (alerts.some(a => a.level === HealthLevel.EMERGENCY)) {
        return HealthLevel.EMERGENCY;
    }
    if (alerts.some(a => a.level === HealthLevel.CRITICAL)) {
        return HealthLevel.CRITICAL;
    }
    if (alerts.some(a => a.level === HealthLevel.WARNING)) {
        return HealthLevel.WARNING;
    }
    return HealthLevel.HEALTHY;
}
