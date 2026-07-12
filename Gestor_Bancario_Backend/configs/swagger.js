import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.3",
    info: {
        title: "Gestor Bancario API Completa",
        version: "1.1.0",
        description:
            "Documentación de la API principal para gestión de cuentas, transacciones, favoritos, servicios, promociones, divisas y asistente virtual.\n\n" +
            "**Autenticación:** todos los endpoints (salvo `/currencies` y `/health`) requieren un JWT emitido por el AuthService " +
            "(`POST /api/v1/auth/login` en el puerto 4000). Enviar como `Authorization: Bearer <token>` o header `x-token`.\n\n" +
            "**Límites de transferencia:** máximo Q2,000 por transacción y Q10,000 acumulados por día por usuario " +
            "(montos en otra moneda se convierten a GTQ para validar el límite).\n\n" +
            "**Depósitos:** solo administradores pueden crearlos, y son reversibles únicamente dentro de los primeros 60 segundos."
    },
    servers: [
        {
            url: "http://localhost:3006/gestionBancaria/api/v1",
            description: "Servidor Gestor Bancario local"
        }
    ],
    tags: [
        { name: "Accounts", description: "Gestión de cuentas bancarias y solicitudes de apertura" },
        { name: "Transactions", description: "Depósitos, retiros y transferencias (con límites y conversión de divisas)" },
        { name: "Favorites", description: "Cuentas favoritas con alias personalizado y transferencias rápidas" },
        { name: "Services", description: "Catálogo de productos y servicios exclusivos" },
        { name: "Promotions", description: "Promociones globales con condiciones de elegibilidad" },
        { name: "Currencies", description: "Tasas de cambio en tiempo real" },
        { name: "Chatbot", description: "Asistente virtual con IA (historial de conversaciones por usuario)" }
    ],
    paths: {
        // =====================================================
        // ACCOUNTS
        // =====================================================
        "/account/create": {
            post: {
                tags: ["Accounts"],
                summary: "Crea una nueva cuenta bancaria (Requiere Rol Admin)",
                description: "El número de cuenta se genera automáticamente (10 dígitos) si no se envía. La cuenta siempre se crea activa (`estado: true`).",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": { schema: { $ref: "#/components/schemas/AccountCreateRequest" } },
                        "application/json": { schema: { $ref: "#/components/schemas/AccountCreateRequest" } }
                    }
                },
                responses: {
                    "201": {
                        description: "Cuenta creada exitosamente",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Cuenta creada exitosamente" },
                                        data: { $ref: "#/components/schemas/Account" }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "Datos inválidos o número de cuenta duplicado", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    "401": { description: "Token no provisto, inválido o expirado" },
                    "403": { description: "No autorizado (Requiere Admin)" }
                }
            }
        },
        "/account/get": {
            get: {
                tags: ["Accounts"],
                summary: "Obtiene una lista de cuentas (Paginada)",
                description:
                    "Los usuarios no-admin **solo ven sus propias cuentas**. Los admins ven todas (pueden filtrar las suyas con `misCuentas=true`). " +
                    "Por defecto solo devuelve cuentas activas; usar `estado=all` para incluir inactivas. " +
                    "El saldo se oculta si la cuenta no pertenece al usuario autenticado (salvo admins).",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "page", in: "query", schema: { type: "integer", default: 1 } },
                    { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
                    { name: "estado", in: "query", description: "true (default), false, o all", schema: { type: "string", enum: ["true", "false", "all"] } },
                    { name: "misCuentas", in: "query", description: "Si es true, solo devuelve las cuentas del usuario logueado", schema: { type: "boolean" } }
                ],
                responses: {
                    "200": {
                        description: "Lista de cuentas obtenida exitosamente",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: { type: "array", items: { $ref: "#/components/schemas/Account" } },
                                        pagination: { $ref: "#/components/schemas/Pagination" }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "Token no provisto, inválido o expirado" }
                }
            }
        },
        "/account/request-create": {
            post: {
                tags: ["Accounts"],
                summary: "Solicitar apertura de cuenta (Deshabilitado)",
                description: "⚠️ Funcionalidad deshabilitada por decisión de negocio: los clientes no tienen permitido solicitar cuentas adicionales. El endpoint siempre responde 403.",
                security: [{ bearerAuth: [] }],
                responses: {
                    "403": {
                        description: "Los clientes no tienen permitido solicitar cuentas adicionales",
                        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
                    },
                    "401": { description: "Token no provisto, inválido o expirado" }
                }
            }
        },
        "/account/requests": {
            get: {
                tags: ["Accounts"],
                summary: "Listar solicitudes de apertura de cuenta (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "status", in: "query", description: "Estado de la solicitud (default PENDING)", schema: { type: "string", enum: ["PENDING", "APPROVED", "DENIED", "ALL"], default: "PENDING" } }
                ],
                responses: {
                    "200": {
                        description: "Lista de solicitudes",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: { type: "array", items: { $ref: "#/components/schemas/AccountRequest" } }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "Estado de filtro inválido" },
                    "403": { description: "No autorizado (Requiere Admin)" }
                }
            }
        },
        "/account/requests/{requestId}/approve": {
            patch: {
                tags: ["Accounts"],
                summary: "Aprobar solicitud de cuenta (Requiere Rol Admin)",
                description: "Crea la cuenta con saldo 0 y marca la solicitud como APPROVED, registrando quién y cuándo la revisó.",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "requestId", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Solicitud aprobada y cuenta creada exitosamente" },
                    "403": { description: "No autorizado (Requiere Admin)" },
                    "404": { description: "Solicitud no encontrada" },
                    "409": { description: "Solo se pueden aprobar solicitudes pendientes" }
                }
            }
        },
        "/account/requests/{requestId}/deny": {
            patch: {
                tags: ["Accounts"],
                summary: "Denegar solicitud de cuenta (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "requestId", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: false,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    comment: { type: "string", maxLength: 250, example: "Documentación incompleta" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Solicitud denegada correctamente" },
                    "403": { description: "No autorizado (Requiere Admin)" },
                    "404": { description: "Solicitud no encontrada" },
                    "409": { description: "Solo se pueden denegar solicitudes pendientes" }
                }
            }
        },
        "/account/{numeroCuenta}/status": {
            patch: {
                tags: ["Accounts"],
                summary: "Activar/desactivar una cuenta (Requiere Rol Admin)",
                description: "Si se envía `estado` (boolean) se asigna ese valor; si no se envía, el estado actual se invierte (toggle).",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "numeroCuenta", in: "path", required: true, schema: { type: "string" }, example: "1000000001" }
                ],
                requestBody: {
                    required: false,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    estado: { type: "boolean", example: false }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Estado de cuenta actualizado" },
                    "403": { description: "No autorizado (Requiere Admin)" },
                    "404": { description: "Cuenta no encontrada" }
                }
            }
        },
        // =====================================================
        // TRANSACTIONS
        // =====================================================
        "/transactions/create": {
            post: {
                tags: ["Transactions"],
                summary: "Realiza una nueva transacción",
                description:
                    "**Reglas de negocio (validadas en el servidor):**\n" +
                    "- `TRANSFERENCIA`: requiere `cuentaOrigen` (debe pertenecer al usuario autenticado), `cuentaDestino` y `descripcion`. " +
                    "Límites: **Q2,000 por transacción** y **Q10,000 acumulados por día** por usuario (convertidos a GTQ si la moneda es otra). Verifica saldo suficiente.\n" +
                    "- `DEPOSITO`: **solo administradores**. Requiere `cuentaDestino` y `descripcion`.\n" +
                    "- `RETIRO`: requiere `cuentaOrigen` (propia) con saldo suficiente. La descripción es opcional.\n" +
                    "- Si la moneda de la transacción difiere de la moneda de la cuenta, se aplica conversión automática y la respuesta incluye el objeto `applied` con los montos convertidos.",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": { schema: { $ref: "#/components/schemas/TransactionCreateRequest" } },
                        "application/json": { schema: { $ref: "#/components/schemas/TransactionCreateRequest" } }
                    }
                },
                responses: {
                    "201": {
                        description: "Transacción creada exitosamente",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Transacción creada exitosamente" },
                                        data: { $ref: "#/components/schemas/Transaction" },
                                        applied: {
                                            type: "object",
                                            description: "Presente solo si hubo conversión de moneda",
                                            properties: {
                                                montoDebitado: { type: "number", example: 100 },
                                                monedaDebitada: { type: "string", example: "GTQ" },
                                                montoAcreditado: { type: "number", example: 12.85 },
                                                monedaAcreditada: { type: "string", example: "USD" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "Fondos insuficientes, límite por transacción/diario excedido, descripción faltante o datos inválidos", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    "403": { description: "Depósito sin ser Admin, o cuenta origen que no pertenece al usuario" },
                    "404": { description: "Cuenta origen o destino no encontrada" }
                }
            }
        },
        "/transactions/get": {
            get: {
                tags: ["Transactions"],
                summary: "Listar transacciones",
                description: "Usuarios no-admin ven solo las transacciones donde alguna de sus cuentas es origen o destino. Los admins ven todas. Ordenadas de la más reciente a la más antigua.",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "page", in: "query", schema: { type: "integer", default: 1 } },
                    { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
                ],
                responses: {
                    "200": {
                        description: "Transacciones obtenidas",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: { type: "array", items: { $ref: "#/components/schemas/Transaction" } },
                                        pagination: { $ref: "#/components/schemas/Pagination" }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "Token no provisto, inválido o expirado" }
                }
            }
        },
        "/transactions/get/{id}": {
            get: {
                tags: ["Transactions"],
                summary: "Buscar transacción por ID (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Transacción obtenida" },
                    "403": { description: "Solo los administradores pueden buscar transacciones por ID" },
                    "404": { description: "Transacción no encontrada" }
                }
            }
        },
        "/transactions/update/{id}": {
            put: {
                tags: ["Transactions"],
                summary: "Actualizar o cancelar transacción (Requiere Rol Admin)",
                description:
                    "**Depósitos:**\n" +
                    "- Cancelar (`estado: CANCELADA`): solo dentro de los primeros **60 segundos**; revierte el saldo acreditado (con conversión de moneda si aplica).\n" +
                    "- Modificar `monto`: recalcula el saldo de la cuenta destino (revierte el monto anterior y aplica el nuevo). No permitido si ya está cancelado.\n\n" +
                    "**Transferencias y retiros:** solo se puede modificar `descripcion` y `estado` (el `monto` es inmutable).",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    content: {
                        "multipart/form-data": { schema: { $ref: "#/components/schemas/TransactionUpdateRequest" } },
                        "application/json": { schema: { $ref: "#/components/schemas/TransactionUpdateRequest" } }
                    }
                },
                responses: {
                    "200": { description: "Transacción actualizada correctamente" },
                    "400": { description: "Fuera del límite de 60 segundos para revertir, monto inválido, depósito ya cancelado, o intento de modificar monto en transferencia/retiro" },
                    "403": { description: "No tienes permisos para actualizar transacciones" },
                    "404": { description: "Transacción o cuenta destino no encontrada" }
                }
            }
        },
        "/transactions/delete/{id}": {
            delete: {
                tags: ["Transactions"],
                summary: "Eliminar transacción (Requiere Rol Admin)",
                description: "Los depósitos NO pueden eliminarse (responde 405).",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Transacción eliminada correctamente" },
                    "403": { description: "No tienes permisos para eliminar transacciones" },
                    "404": { description: "Transacción no encontrada" },
                    "405": { description: "Los depósitos no pueden eliminarse" }
                }
            }
        },
        // =====================================================
        // FAVORITES
        // =====================================================
        "/favorites": {
            post: {
                tags: ["Favorites"],
                summary: "Agregar una cuenta a favoritos (Requiere Rol Cliente)",
                description: "Guarda una cuenta de terceros con alias personalizado para transferencias rápidas. Un usuario no puede agregar la misma cuenta dos veces (índice único por usuario+cuenta).",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/FavoriteCreateRequest" } }
                    }
                },
                responses: {
                    "201": {
                        description: "Favorito agregado",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        favorite: { $ref: "#/components/schemas/Favorite" }
                                    }
                                }
                            }
                        }
                    },
                    "409": { description: "La cuenta ya está agregada en favoritos" },
                    "401": { description: "Token no provisto, inválido o expirado" }
                }
            },
            get: {
                tags: ["Favorites"],
                summary: "Obtener lista de favoritos del usuario",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Lista obtenida",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        favorites: { type: "array", items: { $ref: "#/components/schemas/Favorite" } }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "Token no provisto, inválido o expirado" }
                }
            }
        },
        "/favorites/{id}": {
            put: {
                tags: ["Favorites"],
                summary: "Actualizar el alias de un favorito",
                description: "Permite cambiar el alias personalizado de un favorito existente. Solo el dueño del favorito puede editarlo.",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/FavoriteUpdateRequest" } }
                    }
                },
                responses: {
                    "200": {
                        description: "Alias actualizado",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        favorite: { $ref: "#/components/schemas/Favorite" }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "El alias es requerido (no puede ir vacío)" },
                    "404": { description: "Favorito no encontrado (o no pertenece al usuario)" }
                }
            },
            delete: {
                tags: ["Favorites"],
                summary: "Eliminar una cuenta de favoritos",
                description: "Solo elimina favoritos del usuario autenticado.",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Eliminado correctamente" },
                    "401": { description: "Token no provisto, inválido o expirado" }
                }
            }
        },
        "/favorites/{id}/transfer": {
            post: {
                tags: ["Favorites"],
                summary: "Preparar transferencia rápida a un favorito",
                description: "Valida el favorito y devuelve los datos preparados para la transferencia. ⚠️ **No ejecuta la transferencia**: el movimiento real se realiza con `POST /transactions/create` usando la cuenta del favorito como `cuentaDestino` (así se aplican los límites y validaciones de saldo).",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/FavoriteTransferRequest" } }
                    }
                },
                responses: {
                    "200": { description: "Transferencia rápida preparada" },
                    "404": { description: "Favorito no encontrado" }
                }
            }
        },
        // =====================================================
        // SERVICES
        // =====================================================
        "/services": {
            post: {
                tags: ["Services"],
                summary: "Crea un producto o servicio (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": { schema: { $ref: "#/components/schemas/ServiceCreateRequest" } }
                    }
                },
                responses: {
                    "201": { description: "Servicio creado" },
                    "400": { description: "Datos inválidos" },
                    "403": { description: "No autorizado (Requiere Admin)" }
                }
            },
            get: {
                tags: ["Services"],
                summary: "Lista productos y servicios",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "type", in: "query", schema: { type: "string", enum: ["PRODUCT", "SERVICE"] } },
                    { name: "category", in: "query", schema: { type: "string" } },
                    { name: "active", in: "query", schema: { type: "boolean" } },
                    { name: "q", in: "query", schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Lista de servicios" }
                }
            }
        },
        "/services/{id}": {
            get: {
                tags: ["Services"],
                summary: "Obtiene un servicio por ID (valida elegibilidad)",
                description: "Antes de devolver el servicio se valida elegibilidad del usuario: servicio activo, dentro de fechas de vigencia, rol requerido, límite de usos no alcanzado y correo electrónico verificado.",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Servicio encontrado" },
                    "403": { description: "No elegible: servicio inactivo/expirado, rol insuficiente, límite de usos alcanzado o email sin verificar" },
                    "404": { description: "Servicio no encontrado" }
                }
            },
            put: {
                tags: ["Services"],
                summary: "Actualiza un producto o servicio (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": { schema: { $ref: "#/components/schemas/ServiceUpdateRequest" } }
                    }
                },
                responses: {
                    "200": { description: "Servicio actualizado" },
                    "400": { description: "Datos inválidos" },
                    "403": { description: "No autorizado (Requiere Admin)" }
                }
            },
            delete: {
                tags: ["Services"],
                summary: "Elimina un producto o servicio (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Servicio eliminado" },
                    "403": { description: "No autorizado (Requiere Admin)" },
                    "404": { description: "No encontrado" }
                }
            }
        },
        // =====================================================
        // PROMOTIONS
        // =====================================================
        "/promotions": {
            post: {
                tags: ["Promotions"],
                summary: "Crea una promoción global (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": { schema: { $ref: "#/components/schemas/PromotionCreateRequest" } }
                    }
                },
                responses: {
                    "201": { description: "Promoción creada" },
                    "400": { description: "Datos inválidos" },
                    "403": { description: "No autorizado (Requiere Admin)" }
                }
            },
            get: {
                tags: ["Promotions"],
                summary: "Lista promociones",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "active", in: "query", schema: { type: "boolean" } },
                    { name: "q", in: "query", schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Lista de promociones" }
                }
            }
        },
        "/promotions/{id}": {
            get: {
                tags: ["Promotions"],
                summary: "Obtiene una promoción por ID (valida elegibilidad)",
                description:
                    "Antes de devolver la promoción se valida elegibilidad del usuario: promoción activa, dentro de vigencia, rol requerido, límite global de usos, presupuesto disponible, " +
                    "límite de usos por usuario, y condiciones especiales (ej. exclusiva para usuarios nuevos < 30 días, o VIP con cuenta de saldo >= Q10,000). " +
                    "Si el usuario tiene una promoción no acumulable activa, no puede activar otra (409).",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Promoción encontrada" },
                    "403": { description: "No elegible (inactiva, expirada, rol/segmento no aplicable, límites o presupuesto agotado)" },
                    "404": { description: "Promoción no encontrada" },
                    "409": { description: "Ya tiene una promoción no acumulable activa" }
                }
            },
            put: {
                tags: ["Promotions"],
                summary: "Actualiza una promoción (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": { schema: { $ref: "#/components/schemas/PromotionUpdateRequest" } }
                    }
                },
                responses: {
                    "200": { description: "Promoción actualizada" },
                    "400": { description: "Datos inválidos" },
                    "403": { description: "No autorizado (Requiere Admin)" }
                }
            },
            delete: {
                tags: ["Promotions"],
                summary: "Elimina una promoción (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Promoción eliminada" },
                    "403": { description: "No autorizado (Requiere Admin)" },
                    "404": { description: "No encontrada" }
                }
            }
        },
        "/promotions/{id}/toggle": {
            patch: {
                tags: ["Promotions"],
                summary: "Activar, pausar o cancelar una promoción (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["action"],
                                properties: {
                                    action: { type: "string", enum: ["ACTIVATE", "PAUSE", "CANCEL"], example: "PAUSE" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Estado de la promoción actualizado" },
                    "400": { description: "Acción inválida" },
                    "403": { description: "No autorizado (Requiere Admin)" },
                    "404": { description: "Promoción no encontrada" }
                }
            }
        },
        "/promotions/{id}/stats": {
            get: {
                tags: ["Promotions"],
                summary: "Estadísticas de uso de una promoción (Requiere Rol Admin)",
                description: "Devuelve usos totales, usuarios únicos, presupuesto restante y días de vigencia restantes.",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Estadísticas obtenidas" },
                    "403": { description: "No autorizado (Requiere Admin)" },
                    "404": { description: "Promoción no encontrada" }
                }
            }
        },
        // =====================================================
        // CURRENCIES
        // =====================================================
        "/currencies": {
            get: {
                tags: ["Currencies"],
                summary: "Obtener tasas de cambio en tiempo real (Público)",
                description: "Único endpoint que NO requiere autenticación.",
                parameters: [
                    { name: "base", in: "query", description: "Moneda base para las tasas (default USD)", schema: { type: "string", enum: ["GTQ", "USD", "EUR", "MXN", "COP", "JPY"], default: "USD" } }
                ],
                responses: {
                    "200": {
                        description: "Tasas de cambio obtenidas correctamente",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Tasas de cambio obtenidas correctamente" },
                                        base: { type: "string", example: "USD" },
                                        rates: { type: "object", example: { GTQ: 7.78, EUR: 0.92, MXN: 17.1 } },
                                        lastUpdate: { type: "string", format: "date-time" }
                                    }
                                }
                            }
                        }
                    },
                    "500": { description: "Error al obtener divisas" }
                }
            }
        },
        // =====================================================
        // CHATBOT
        // =====================================================
        "/chatbot": {
            get: {
                tags: ["Chatbot"],
                summary: "Listar historial de conversaciones del usuario",
                description: "Devuelve solo título y fecha de actualización de cada chat, ordenados del más reciente al más antiguo.",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "Lista de chats del usuario" },
                    "401": { description: "Token no provisto, inválido o expirado" }
                }
            },
            post: {
                tags: ["Chatbot"],
                summary: "Enviar un mensaje al asistente virtual",
                description: "Si no se envía `chatId`, se crea una conversación nueva (el título se genera con los primeros 30 caracteres del mensaje). La respuesta incluye la contestación de la IA y el historial completo.",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/ChatMessageRequest" } }
                    }
                },
                responses: {
                    "200": {
                        description: "Respuesta del asistente",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        chatId: { type: "string", example: "665f1c2ab13c2a0012345678" },
                                        reply: { type: "string", example: "¡Hola! Puedo ayudarte con tus cuentas y transferencias." },
                                        messages: { type: "array", items: { type: "object", properties: { role: { type: "string", enum: ["user", "model"] }, content: { type: "string" } } } }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "El mensaje es requerido" },
                    "404": { description: "Chat no encontrado (chatId inválido para este usuario)" }
                }
            }
        },
        "/chatbot/{id}": {
            get: {
                tags: ["Chatbot"],
                summary: "Obtener una conversación específica con sus mensajes",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, description: "ID de Mongo del chat", schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Chat con historial de mensajes" },
                    "400": { description: "No es un ID de Mongo válido" },
                    "404": { description: "Chat no encontrado" }
                }
            }
        }
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "Token emitido por el AuthService (POST /api/v1/auth/login en el puerto 4000). También se acepta en el header x-token."
            }
        },
        schemas: {
            // ---------- Respuestas ----------
            ErrorResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: false },
                    message: { type: "string", example: "Descripción del error" },
                    error: { type: "string", example: "Detalle técnico (si aplica)" }
                }
            },
            Pagination: {
                type: "object",
                properties: {
                    currentPage: { type: "integer", example: 1 },
                    totalPages: { type: "integer", example: 3 },
                    totalRecords: { type: "integer", example: 25 },
                    limit: { type: "integer", example: 10 }
                }
            },
            Account: {
                type: "object",
                properties: {
                    userId: { type: "string", example: "user_premium_1" },
                    numeroCuenta: { type: "string", example: "1000000001", description: "10 dígitos, generado automáticamente si no se envía" },
                    tipoCuenta: { type: "string", enum: ["AHORRO", "MONETARIA"], example: "AHORRO" },
                    saldo: { type: "number", example: 5000.5, description: "Oculto para usuarios que no son dueños de la cuenta (salvo admins)" },
                    moneda: { type: "string", enum: ["GTQ", "USD", "EUR", "MXN", "COP", "JPY"], example: "GTQ" },
                    estado: { type: "boolean", example: true },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            AccountRequest: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    userId: { type: "string", example: "user_regular_5" },
                    tipoCuenta: { type: "string", enum: ["AHORRO", "MONETARIA"] },
                    moneda: { type: "string", enum: ["GTQ", "USD", "EUR", "MXN", "COP", "JPY"] },
                    status: { type: "string", enum: ["PENDING", "APPROVED", "DENIED"], example: "PENDING" },
                    reviewedBy: { type: "string", nullable: true, description: "ID del admin que revisó" },
                    reviewedAt: { type: "string", format: "date-time", nullable: true },
                    reviewComment: { type: "string", nullable: true, maxLength: 250 },
                    createdAt: { type: "string", format: "date-time" }
                }
            },
            Transaction: {
                type: "object",
                properties: {
                    id: { type: "string", example: "665f1c2ab13c2a0012345678" },
                    tipoTransaccion: { type: "string", enum: ["DEPOSITO", "TRANSFERENCIA", "RETIRO"] },
                    cuentaOrigen: { type: "string", nullable: true, example: "1000000001" },
                    cuentaDestino: { type: "string", nullable: true, example: "1000000003" },
                    monto: { type: "number", example: 250.5, description: "En la moneda original de la transacción" },
                    moneda: { type: "string", enum: ["GTQ", "USD", "EUR", "MXN", "COP", "JPY"] },
                    descripcion: { type: "string", nullable: true, maxLength: 100 },
                    estado: { type: "string", enum: ["COMPLETADA", "CANCELADA"], example: "COMPLETADA" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            Favorite: {
                type: "object",
                properties: {
                    _id: { type: "string", example: "665f1c2ab13c2a0012345678" },
                    userId: { type: "string", example: "user_premium_1" },
                    cuenta: { type: "string", example: "1000000003" },
                    tipo: { type: "string", enum: ["AHORRO", "MONETARIA"] },
                    alias: { type: "string", example: "Mamá" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            // ---------- Requests ----------
            AccountCreateRequest: {
                type: "object",
                required: ["userId", "tipoCuenta", "saldo", "moneda"],
                properties: {
                    userId: { type: "string", example: "user_premium_1" },
                    numeroCuenta: { type: "string", example: "1000000001", description: "Opcional: si no se envía, se genera automáticamente (10 dígitos únicos)" },
                    tipoCuenta: { type: "string", example: "AHORRO", enum: ["AHORRO", "MONETARIA"] },
                    saldo: { type: "number", example: 1500.75, minimum: 0 },
                    moneda: { type: "string", example: "GTQ", enum: ["GTQ", "USD", "EUR", "MXN", "COP", "JPY"] }
                }
            },
            TransactionCreateRequest: {
                type: "object",
                required: ["tipoTransaccion", "monto", "moneda"],
                properties: {
                    tipoTransaccion: { type: "string", example: "TRANSFERENCIA", enum: ["DEPOSITO", "TRANSFERENCIA", "RETIRO"] },
                    monto: { type: "number", example: 250.5, description: "Mayor a 0. Para transferencias: máx. Q2,000 (o equivalente) por transacción" },
                    moneda: { type: "string", example: "GTQ", enum: ["GTQ", "USD", "EUR", "MXN", "COP", "JPY"] },
                    cuentaOrigen: { type: "string", example: "1000000001", description: "Requerida para TRANSFERENCIA y RETIRO; debe pertenecer al usuario autenticado" },
                    cuentaDestino: { type: "string", example: "1000000003", description: "Requerida para TRANSFERENCIA y DEPOSITO" },
                    descripcion: { type: "string", example: "Pago de servicio", maxLength: 100, description: "Obligatoria para DEPOSITO y TRANSFERENCIA" }
                }
            },
            TransactionUpdateRequest: {
                type: "object",
                properties: {
                    estado: { type: "string", example: "CANCELADA", enum: ["CANCELADA", "COMPLETADA"] },
                    descripcion: { type: "string", example: "Cancelado por error", maxLength: 100 },
                    monto: { type: "number", example: 300, description: "Solo aplicable para modificar depósitos no cancelados" }
                }
            },
            FavoriteCreateRequest: {
                type: "object",
                required: ["cuenta", "tipo", "alias"],
                properties: {
                    cuenta: { type: "string", example: "1000000003", description: "Número de cuenta a guardar como favorita" },
                    tipo: { type: "string", example: "MONETARIA", enum: ["AHORRO", "MONETARIA"] },
                    alias: { type: "string", example: "Mamá", description: "Nombre personalizado para identificar la cuenta" }
                }
            },
            FavoriteUpdateRequest: {
                type: "object",
                required: ["alias"],
                properties: {
                    alias: { type: "string", example: "Mamá ❤️", description: "Nuevo alias personalizado (no puede ir vacío)" }
                }
            },
            FavoriteTransferRequest: {
                type: "object",
                required: ["monto", "moneda"],
                properties: {
                    monto: { type: "number", example: 500 },
                    moneda: { type: "string", example: "GTQ", enum: ["GTQ", "USD", "EUR", "MXN", "COP", "JPY"] },
                    descripcion: { type: "string", example: "Pago de cena" }
                }
            },
            ChatMessageRequest: {
                type: "object",
                required: ["message"],
                properties: {
                    message: { type: "string", example: "¿Cuál es el límite de transferencia diario?" },
                    chatId: { type: "string", description: "Opcional: ID de Mongo de una conversación existente. Si se omite, se crea un chat nuevo", example: "665f1c2ab13c2a0012345678" }
                }
            },
            Discount: {
                type: "object",
                properties: {
                    type: { type: "string", enum: ["PERCENT", "AMOUNT"], example: "PERCENT" },
                    value: { type: "number", example: 10 },
                    startAt: { type: "string", format: "date-time" },
                    endAt: { type: "string", format: "date-time" },
                    minAmount: { type: "number", example: 100 },
                    maxUses: { type: "number", example: 50 },
                    terms: { type: "string", example: "Valido en sucursales participantes" }
                }
            },
            ServiceCreateRequest: {
                type: "object",
                required: ["name", "description", "type", "price"],
                properties: {
                    name: { type: "string", example: "Seguro de vida premium" },
                    description: { type: "string", example: "Servicio exclusivo para clientes" },
                    category: { type: "string", example: "Seguros" },
                    type: { type: "string", enum: ["PRODUCT", "SERVICE"], example: "SERVICE" },
                    price: { type: "number", example: 150 },
                    active: { type: "boolean", example: true },
                    image: { type: "string", format: "binary" },
                    imageUrl: { type: "string", example: "https://example.com/servicio.jpg" },
                    terms: { type: "string", example: "Sujeto a disponibilidad" },
                    validFrom: { type: "string", format: "date-time" },
                    validTo: { type: "string", format: "date-time" },
                    discount: { $ref: "#/components/schemas/Discount" }
                }
            },
            ServiceUpdateRequest: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    category: { type: "string" },
                    type: { type: "string", enum: ["PRODUCT", "SERVICE"] },
                    price: { type: "number" },
                    active: { type: "boolean" },
                    image: { type: "string", format: "binary" },
                    imageUrl: { type: "string" },
                    terms: { type: "string" },
                    validFrom: { type: "string", format: "date-time" },
                    validTo: { type: "string", format: "date-time" },
                    discount: { $ref: "#/components/schemas/Discount" }
                }
            },
            PromotionCreateRequest: {
                type: "object",
                required: ["name"],
                properties: {
                    name: { type: "string", example: "Semana del cliente" },
                    description: { type: "string", example: "Beneficios exclusivos para clientes" },
                    terms: { type: "string", example: "Aplican restricciones" },
                    active: { type: "boolean", example: true },
                    image: { type: "string", format: "binary" },
                    validFrom: { type: "string", format: "date-time" },
                    validTo: { type: "string", format: "date-time" },
                    imageUrl: { type: "string", example: "https://example.com/promo.jpg" },
                    conditions: { type: "object", example: { segment: "VIP" }, description: "Condiciones de elegibilidad (ej. segment: VIP requiere cuenta con saldo >= Q10,000; NEW_USERS requiere registro < 30 días)" }
                }
            },
            PromotionUpdateRequest: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    terms: { type: "string" },
                    active: { type: "boolean" },
                    image: { type: "string", format: "binary" },
                    validFrom: { type: "string", format: "date-time" },
                    validTo: { type: "string", format: "date-time" },
                    imageUrl: { type: "string" },
                    conditions: { type: "object" }
                }
            }
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ]
};

const options = {
    definition: swaggerDefinition,
    apis: ["./src/**/*.routes.js"]
};

export default swaggerJSDoc(options);
