# STORAGE.md — Política de Datos: PactTrail
*Lab 15 — IPFS + Pinata: CID + pin + resolve | Sesión 18*
*Fecha: 2026-10-13*

---

## 1. Artefacto del lab

| Campo        | Valor                                           |
|--------------|-------------------------------------------------|
| Archivo      | `venture-hello.json`                            |
| Provider     | Pinata (IPFS pinning service)                   |
| CID          | `bafkreiggwzqcnu2ovnboop6zdv7ctimj2p2gvr3kjzxfp7k65ztllknhyq`   |
| Gateway HTTP | `https://gateway.pinata.cloud/ipfs/bafkreiggwzqcnu2ovnboop6zdv7ctimj2p2gvr3kjzxfp7k65ztllknhyq` |
| Gateway público | `https://ipfs.io/ipfs/bafkreiggwzqcnu2ovnboop6zdv7ctimj2p2gvr3kjzxfp7k65ztllknhyq` |
| Fecha pin    | 2026-10-13                                      |
| Estado pin   | ✅ PINNED — HTTP 200 confirmado                 |

> Ver `lab15-log.md` para evidencia del comando curl y respuesta HTTP 200 OK.

---

## 2. Clasificación de datos de PactTrail

PactTrail es un protocolo de escrow ERC-20 para redes EVM públicas. Los datos del venture se clasifican según **sensibilidad** y **durabilidad**, y se asigna un destino de almacenamiento por clase.

| Tipo de dato | Sensibilidad | Durabilidad requerida | Destino | Decisión |
|---|---|---|---|---|
| Código fuente de contratos | Pública | Permanente | Git + IPFS + pin | **IPFS + pin** (raro permanence candidate) |
| ABI compilada del contrato | Pública | Media-alta | Git / CDN | Location-addressed (GitHub) |
| Artefacto de prueba (venture-hello.json) | Pública, sin PII | Temporal/demo | IPFS + pin Pinata | **IPFS + pin** |
| Dirección de fábrica desplegada | Pública (on-chain) | Permanente | On-chain + README | On-chain (permanencia nativa) |
| Hash de evidencia de requisito | Pública (on-chain) | Permanente | On-chain | On-chain |
| JWT / API keys | **Crítica** | N/A | Solo `.env` local | **never-permanent / never-upload** |
| Clave privada del deployer | **Crítica** | N/A | Solo `.env` local | **never-permanent / never-upload** |
| KYC / identidad de partes | **Privada** | N/A | Off-chain / nunca IPFS | **never-permanent en IPFS público** |
| Datos de wallets de usuarios | Semi-pública (on-chain) | Permanente | On-chain únicamente | On-chain; no redundar en IPFS |
| Documentación del lab (STORAGE.md) | Pública | Media | Git + opcionalmente IPFS | Location-addressed (Git) |

### Aclaración explícita
PII, KYC, secretos, claves privadas, JWT y cualquier dato confidencial de las partes **no se suben ni se subirán jamás a IPFS público**. El único archivo subido en este lab es `venture-hello.json`, que no contiene ningún dato personal ni secreto.

---

## 3. Availability vs Deletion Policy

**Disponibilidad (Availability):** IPFS es una red de distribución *content-addressed*. Un nodo que tiene el contenido puede servirlo. Pinata actúa como *pinning service*: mientras el pin esté activo, Pinata garantiza que al menos un nodo almacena y sirve el CID. Cualquier gateway público (`ipfs.io`, `cloudflare-ipfs.com`, `gateway.pinata.cloud`) puede resolver el CID siempre que exista al menos un nodo que lo tenga.

**Deletion Policy:** IPFS no tiene borrado garantizado por diseño. Si **unpinneamos** el archivo de Pinata, Pinata dejará de servir ese CID. Sin embargo, si otros nodos o gateways cachearon el contenido, podría seguir siendo accesible por tiempo indeterminado. **Si unpinneamos, esperamos que el CID deje de resolverse desde el gateway de Pinata en horas o días, pero no podemos garantizar que desaparezca de toda la red IPFS**. Esto es fundamental: en IPFS la "eliminación" es un retiro de pin, no una garantía de borrado. Por esta razón PactTrail no sube PII: una vez publicada en IPFS, su retiro es best-effort, no garantizado.

---

## 4. Gateway HTTP vs Protocolo IPFS

**Protocolo IPFS:** Es una red peer-to-peer donde los nodos se identifican con su contenido (CID = hash del contenido). Para acceder nativamente se requiere un cliente IPFS (Kubo, Brave, etc.) o la librería `ipfs-http-client`.

**Gateway HTTP:** Es un servidor centralizado que actúa como puente entre HTTP y la red IPFS. Permite resolver `https://gateway.pinata.cloud/ipfs/<CID>` sin ningún cliente IPFS. Es conveniente pero introduce un punto centralizado de fallo: si el gateway cae, la URL falla aunque el contenido esté en la red. El contenido sigue siendo content-addressed (el CID no cambia), pero el acceso pasa a depender del servidor del gateway.

---

## 5. Marco PSAV / 15-2026

Esta política se documenta teniendo presente el marco PSAV / 15-2026.

---

## 6. Tres promesas que PactTrail NO hará

1. **No subirá PII ni KYC a IPFS público.** Nombres, correos, documentos de identidad, wallets vinculadas a personas físicas o cualquier dato personal de las partes contractuales nunca se almacenarán en una red de distribución pública e inmutable.
2. **No commiteará JWT, API keys ni claves privadas en ningún repositorio.** Ningún secreto de autenticación aparecerá en el historial de Git, en artefactos de CI/CD ni en logs públicos.
3. **No ofrecerá garantía de borrado de contenido pinneado en IPFS.** Si en algún momento es necesario retirar datos, PactTrail retirará el pin de Pinata, pero no hará promesas de desaparición total de la red IPFS, dado que el protocolo no lo garantiza por diseño.

## 7. Una promesa que PactTrail SÍ hará

**PactTrail sí mantendrá un pin activo y verificable para cualquier artefacto de referencia técnica (código de contrato, ABI, documentación de versiones) que sea anunciado públicamente**, de modo que los usuarios puedan verificar la integridad del contenido mediante su CID sin depender exclusivamente de un servidor centralizado.

---

## 8. Nota opcional: Arweave (contraste, no utilizado)

Arweave es una red de almacenamiento permanente con modelo de pago único (*endowment*): al subir un archivo se paga una tarifa que financia su almacenamiento indefinido. A diferencia de IPFS con pinning activo, Arweave no requiere renovación de pin. Para PactTrail esto podría ser relevante para versiones auditadas de contratos que se quieran preservar sin mantenimiento operativo. **No se utilizó Arweave en este lab**: el requisito del curso es demostrar el ciclo IPFS + pin, y Arweave aparece aquí solo como nota de contraste.

---

## 9. Evidencia y referencias

- Log de upload: [`lab15-log.md`](./lab15-log.md)
- Script de upload: [`upload-to-pinata.js`](./upload-to-pinata.js)
- Artefacto subido: [`venture-hello.json`](./venture-hello.json)
- Dashboard Pinata: https://app.pinata.cloud/pinmanager
