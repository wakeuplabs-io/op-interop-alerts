# OP Interop Alerts Example

Este ejemplo demuestra cómo usar el SDK de OP Interop Alerts con el nuevo sistema de alertas y notificaciones de Slack.

## Funcionalidades

- **Seguimiento de Interoperabilidad**: Monitorea mensajes entre cadenas usando el SDK
- **Generación de Métricas**: Calcula métricas de rendimiento, latencia, throughput y salud del sistema
- **Sistema de Alertas**: Evalúa reglas de alertas automáticamente basadas en las métricas
- **Notificaciones de Slack**: Envía alertas a Slack usando webhooks
- **Reportes de Estado**: Envía un mensaje "Status OK" cada 10 iteraciones cuando todo funciona correctamente

## Configuración

### 1. Variables de Entorno Requeridas

Copia `env.example` a `.env` y configura las siguientes variables:

```bash
# Claves privadas (Requeridas)
ORIGIN_PRIVATE_KEY=0x...
DESTINATION_PRIVATE_KEY=0x...

# Configuración de seguimiento (Opcional)
TRACKING_INTERVAL_MINUTES=10
```

### 2. Configuración de Slack (Opcional)

Para habilitar las notificaciones de Slack, configura un webhook:

#### Configuración de Webhook URL

1. Ve a tu workspace de Slack
2. Crea una nueva aplicación en [https://api.slack.com/apps](https://api.slack.com/apps)
3. Habilita "Incoming Webhooks"
4. Crea un webhook para el canal deseado
5. Agrega la URL a tu archivo `.env`:

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### 3. Configuración Adicional de Slack

```bash
# Canal donde enviar las alertas (por defecto: #alerts)
SLACK_CHANNEL=#alerts

# Nombre del bot (por defecto: OP Interop Alerts)
SLACK_USERNAME=OP Interop Alerts

# Emoji del bot (por defecto: :warning:)
SLACK_ICON_EMOJI=:warning:
```

## Tipos de Alertas

El sistema incluye las siguientes reglas de alertas predefinidas:

### Alertas de Latencia

- **High Latency**: Cuando la latencia promedio excede 30 segundos
- **Critical Latency**: Cuando la latencia promedio excede 2 minutos

### Alertas de Throughput

- **Low Success Rate**: Cuando la tasa de éxito baja del 95%
- **Critical Success Rate**: Cuando la tasa de éxito baja del 80%

### Alertas de Errores

- **High Error Rate**: Cuando la tasa de errores excede el 5%

### Alertas de Estado del Sistema

- **System Down**: Cuando el estado de interoperabilidad es "DOWN"
- **System Degraded**: Cuando el estado es "DEGRADED" por más de 5 minutos

### Alertas de Gas y Timing

- **High Gas Usage**: Cuando el uso de gas promedio es inusualmente alto
- **Severe Timing Delays**: Cuando hay retrasos severos en el timing de mensajes

## Uso

### Instalación

```bash
npm install
```

### Ejecutar el ejemplo

```bash
# Modo desarrollo (con recarga automática)
npm run dev

# Modo producción
npm run start
```

## Formato de Alertas en Slack

Las alertas en Slack incluyen:

- **Título y severidad** del alerta
- **Categoría** (Latency, Throughput, Error Rate, etc.)
- **Timestamp** de cuando ocurrió
- **Mensaje descriptivo** con detalles específicos
- **Métricas actuales** relevantes al alerta
- **Ventana de datos** utilizada para el análisis

### Ejemplo de Alerta en Slack

```bash
🚨 High Latency Alert
Severity: HIGH
Category: LATENCY
Time: 2024-01-15T14:30:00.000Z
Message: Triggers when average latency exceeds threshold. Current averageLatencyMs: 35.2s.

📊 Current Metrics:
• Status: OPERATIONAL
• Health: GOOD
• averageLatencyMs: 35.2s

⏱️ Data Window: 60 minutes
```

## Personalización

### Modificar Reglas de Alertas

Puedes personalizar las reglas de alertas modificando el array `DEFAULT_ALERT_RULES` o creando tus propias reglas usando `createAlertRule()`.

### Agregar Nuevos Canales de Notificación

El sistema soporta múltiples canales. Puedes extender `createSimpleNotificationCallback()` para agregar email, SMS, Discord, etc.

## Monitoreo y Logs

El ejemplo proporciona logs detallados incluyendo:

- Resultados de seguimiento de mensajes
- Métricas generadas
- Evaluación de reglas de alertas
- Estado de notificaciones de Slack
- Resumen de alertas disparadas

## Solución de Problemas

### Slack no recibe notificaciones

1. Verifica que `SLACK_WEBHOOK_URL` o `SLACK_BOT_TOKEN` esté configurado correctamente
2. Asegúrate de que el webhook/bot tenga permisos para el canal especificado
3. Revisa los logs para errores específicos de la API de Slack

### No se generan alertas

1. Verifica que `METRICS_THRESHOLD` esté configurado apropiadamente
2. Asegúrate de que las condiciones de las reglas se cumplan
3. Revisa los logs de "Alert Processing Summary" para detalles

### Errores de seguimiento

1. Verifica que las claves privadas sean válidas
2. Asegúrate de que las cadenas estén funcionando correctamente
3. Revisa la configuración de RPC endpoints en el SDK
