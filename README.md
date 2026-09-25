# WebSocket Client

Cliente web pequeno para conectarse a un servidor Socket.IO, consultar los clientes conectados y enviar o recibir mensajes en tiempo real.

La aplicacion esta construida con Vite y TypeScript. El cliente se conecta actualmente al servidor remoto:

```text
https://craft-shoppify.onrender.com/socket.io/socket.io.js
```

## Requisitos

- Node.js compatible con las versiones actuales de Vite y TypeScript.
- pnpm instalado.
- Un token JWT valido emitido por el servidor WebSocket.

## Instalacion

Desde la raiz del proyecto:

```bash
pnpm install
```

## Desarrollo

Inicia el servidor de desarrollo de Vite:

```bash
pnpm dev
```

Vite mostrara en la terminal la URL local, normalmente `http://localhost:5173`.

Para generar una compilacion de produccion:

```bash
pnpm build
```

Para servir localmente el contenido generado:

```bash
pnpm preview
```

## Uso

1. Abre la aplicacion en el navegador.
2. Introduce un JWT en el campo `Json Web Token`.
3. Pulsa **Connect**.
4. Comprueba el estado de conexion y la lista de clientes conectados.
5. Escribe un mensaje y envialo pulsando Enter.
6. Los mensajes recibidos aparecen en la lista **Messages** junto al nombre del remitente.

El boton de conexion no inicia una conexion si el token esta vacio. La aplicacion muestra los estados `CONNECTED`, `DISCONNECTED` y `OFFLINE` en la interfaz.

## Protocolo Socket.IO

El cliente crea un `Manager` con transporte y opciones por defecto de `socket.io-client`, y abre el socket de la ruta `/`.

### Autenticacion

El token se envia en las cabeceras adicionales de la conexion:

```text
authorization: <JWT>
hola: mundo
```

El servidor debe aceptar la cabecera `authorization` y validar el JWT. El valor `hola: mundo` forma parte de la implementacion actual del cliente y no representa una credencial.

### Eventos consumidos

| Evento | Payload | Comportamiento |
| --- | --- | --- |
| `connect` | Ninguno | Cambia el estado visual a `CONNECTED`. |
| `disconnect` | Ninguno | Cambia el estado visual a `DISCONNECTED`. |
| `clients-updated` | `string[]` | Reemplaza la lista de IDs de clientes conectados. |
| `message-from-server` | `{ fullName: string, message: string }` | Agrega el mensaje recibido al historial. |

### Eventos emitidos

| Evento | Payload | Comportamiento |
| --- | --- | --- |
| `message-from-client` | `{ id: string, message: string }` | Envia el mensaje escrito al servidor. El `id` enviado actualmente es `yo?`. |

## Estructura del proyecto

```text
.
├── index.html              # Documento HTML de entrada
├── package.json            # Dependencias y scripts
├── pnpm-lock.yaml          # Versiones bloqueadas de dependencias
├── tsconfig.json           # Configuracion de TypeScript
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.ts             # Construye la interfaz y conecta el boton
    ├── socket-client.ts    # Gestiona Socket.IO y los eventos
    ├── style.css           # Estilos globales y de la plantilla inicial
    ├── counter.ts          # Utilidad de contador sin uso en la entrada actual
    └── assets/             # Recursos estaticos de la plantilla
```

## Scripts disponibles

| Comando | Descripcion |
| --- | --- |
| `pnpm dev` | Inicia Vite en modo desarrollo. |
| `pnpm build` | Ejecuta TypeScript y genera la compilacion de produccion con Vite. |
| `pnpm preview` | Sirve localmente la compilacion generada. |

## Dependencias principales

- `socket.io-client`: conexion y comunicacion en tiempo real con el servidor.
- `vite`: servidor de desarrollo y empaquetado.
- `typescript`: comprobacion y compilacion del codigo TypeScript.

## Configuracion actual y limitaciones

- La URL del servidor esta escrita directamente en `src/socket-client.ts`; no existe configuracion mediante variables de entorno.
- Para cambiar de servidor hay que modificar la URL del `Manager` y volver a compilar.
- Cada pulsacion de **Connect** crea un nuevo `Manager`; se eliminan los listeners del socket anterior antes de asignar el nuevo socket.
- La aplicacion no persiste el token ni el historial de mensajes.
- Los mensajes y los IDs recibidos se insertan directamente en el DOM; el servidor debe enviar valores confiables o el cliente deberia sanitizarlos antes de usarlos en produccion.

## Solucion de problemas

### El estado no cambia a `CONNECTED`

Verifica que el token sea valido, que el servidor remoto este disponible y que permita conexiones desde el origen local mediante CORS.

### La lista de clientes esta vacia

La lista solo se actualiza cuando el servidor emite `clients-updated` con un arreglo de IDs.

### Los mensajes no aparecen

Comprueba que el servidor emita `message-from-server` con las propiedades `fullName` y `message`, y que acepte el evento `message-from-client`.