# Lab 15 — Log de IPFS Upload
*Venture: PactTrail | Sesión 18 | Fecha: 2026-10-13*

---

## Artefacto

**Archivo:** `venture-hello.json`
**Contenido:** Metadatos públicos del venture, sin PII.

---

## Comando de upload

```bash
# En Lab15/
cp .env.example .env          # rellenar PINATA_JWT y PINATA_GATEWAY
node upload-to-pinata.js
```

Salida esperada del script:
```
──────────────────────────────────────────
 PactTrail — Lab 15 IPFS Upload
──────────────────────────────────────────
Archivo : venture-hello.json
Tamaño  : <N> bytes
Gateway : <GATEWAY>
Subiendo a Pinata...

✅ Upload exitoso
──────────────────────────────────────────
Archivo    : venture-hello.json
CID        : bafkreiggwzqcnu2ovnboop6zdv7ctimj2p2gvr3kjzxfp7k65ztllknhyq
Tamaño pin : 557 bytes
Timestamp  : 2026-10-13T06:39:17.940Z
Estado     : PINNED
──────────────────────────────────────────
Resolve URL:
  https://gateway.pinata.cloud/ipfs/bafkreiggwzqcnu2ovnboop6zdv7ctimj2p2gvr3kjzxfp7k65ztllknhyq
  https://ipfs.io/ipfs/bafkreiggwzqcnu2ovnboop6zdv7ctimj2p2gvr3kjzxfp7k65ztllknhyq
```

---

## CID y Gateway

| Campo   | Valor                                         |
|---------|-----------------------------------------------|
| CID     | `bafkreiggwzqcnu2ovnboop6zdv7ctimj2p2gvr3kjzxfp7k65ztllknhyq`        |
| Gateway | `https://gateway.pinata.cloud/ipfs/bafkreiggwzqcnu2ovnboop6zdv7ctimj2p2gvr3kjzxfp7k65ztllknhyq`                |
| Gateway público | `https://ipfs.io/ipfs/bafkreiggwzqcnu2ovnboop6zdv7ctimj2p2gvr3kjzxfp7k65ztllknhyq`        |
| Proveedor | Pinata                                      |
| Fecha   | 2026-10-13                                    |

---

## Verificación con curl

```bash
# Reemplaza <CID> y <GATEWAY> con los valores reales obtenidos del script
curl -s https://gateway.pinata.cloud/ipfs/bafkreiggwzqcnu2ovnboop6zdv7ctimj2p2gvr3kjzxfp7k65ztllknhyq
```

Respuesta esperada (HTTP 200):
```json
{
  "venture": "PactTrail",
  "lab": "Lab 15 — IPFS + Pinata: CID + pin + resolve",
  "session": "Sesión 18",
  "description": "Escrow ERC-20 para redes EVM públicas...",
  "message": "Artefacto de prueba sin PII — usado para demostrar el ciclo content-addressed completo.",
  "version": "1.0.0",
  "date": "2026-10-13",
  "tags": ["ipfs", "pinata", "content-addressed", "escrow", "evm"]
}
```

**Código HTTP obtenido:** 200 OK

**Respuesta curl real:**
```
StatusCode        : 200
StatusDescription : OK
RawContentLength  : 557
CF-Ray            : a49c5f73be71b0bc-GUA
Content           : {
                      "venture": "PactTrail",
                      "lab": "Lab 15 — IPFS + Pinata: CID + pin + resolve",
                      "session": "Sesión 18",
                      "message": "Artefacto de prueba sin PII...",
                      "version": "1.0.0",
                      "date": "2026-10-13"
                    }
```

---

## Evidencia de pin activo

Verificar en:
- **Dashboard Pinata:** https://app.pinata.cloud/pinmanager → el archivo `pacttrail-lab15-venture-hello` debe aparecer como "Pinned".
- **API list pins:**
  ```bash
  # Sin revelar el JWT en logs — esto es solo referencia de endpoint
  # GET https://api.pinata.cloud/data/pinList?status=pinned
  # Authorization: Bearer $PINATA_JWT
  ```

---

## Resultado del pin

```
resolve: sí
CID: bafkreiggwzqcnu2ovnboop6zdv7ctimj2p2gvr3kjzxfp7k65ztllknhyq
HTTP: 200 OK
Provider: Pinata
Timestamp pin: 2026-10-13T06:39:17.940Z
RawContentLength: 557 bytes
```

> ⚠️ Este log no contiene JWT, API keys ni PII.
> El JWT se almacena únicamente en `.env` (gitignored).
